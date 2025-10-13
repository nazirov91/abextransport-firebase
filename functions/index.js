const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');

const QUOTE_WEBHOOK_URL =
  'https://app.berocker.com/api/v1/auto-logistics/client/webhooks/lead/68ebc2deb296d/save';

const VEHICLE_TYPE_CANONICAL = new Map([
  ['car', 'Car'],
  ['sedan', 'sedan'],
  ['boat', 'Boat'],
  ['motorcycle', 'Motorcycle'],
  ['pickup', 'Pickup'],
  ['pickup_2_doors', 'pickup_2_doors'],
  ['pickup2doors', 'pickup_2_doors'],
  ['suv', 'SUV'],
  ['van', 'Van'],
  ['rv', 'RV'],
  ['travel_trailer', 'Travel Trailer'],
  ['traveltrailer', 'Travel Trailer'],
  ['atv', 'ATV'],
  ['convertible', 'Convertible'],
  ['coupe', 'Coupe'],
  ['other', 'Other'],
]);

const ALLOWED_TRANSPORT_TYPES = new Set(['open', 'enclosed']);

exports.submitQuoteRequest = onRequest({ cors: true, region: 'us-central1' }, async (req, res) => {
  if (prepareResponse(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};

  const firstName = readString(body.firstName ?? body.first_name);
  if (!firstName) {
    res.status(400).json({ error: 'First name is required.' });
    return;
  }

  const lastName = readString(body.lastName ?? body.last_name);
  const email = readString(body.email ?? body.emailAddress ?? body.email_address);
  if (!email) {
    res.status(400).json({ error: 'Email address is required.' });
    return;
  }

  const phoneRaw = readString(body.phone ?? body.phoneNumber ?? body.phone_number);
  const phoneDigits = extractDigits(phoneRaw);
  if (phoneDigits.length < 10) {
    res.status(400).json({ error: 'Please provide a valid phone number.' });
    return;
  }

  const origin = normalizeLocation(body.origin, {
    city: body.originCity ?? body.origin_city,
    state: body.originState ?? body.origin_state,
    postalCode: body.originPostalCode ?? body.origin_postal_code,
  });

  if (!origin) {
    res.status(400).json({ error: 'Origin city and state are required.' });
    return;
  }

  const destination = normalizeLocation(body.destination, {
    city: body.destinationCity ?? body.destination_city,
    state: body.destinationState ?? body.destination_state,
    postalCode: body.destinationPostalCode ?? body.destination_postal_code,
  });

  if (!destination) {
    res.status(400).json({ error: 'Destination city and state are required.' });
    return;
  }

  const transportTypeRaw =
    readString(
      body.transportType ?? body.trailerType ?? body.transport_type ?? body.trailer_type
    ) || 'open';
  const transportType = normalizeTransportType(transportTypeRaw);
  if (!transportType) {
    res
      .status(400)
      .json({ error: "Transport type is invalid. Accepted values are 'open' or 'enclosed'." });
    return;
  }

  const shipDate = normalizeShipDate(
    body.shipDate ?? body.pickupDate ?? body.ship_date ?? body.pickup_date
  );

  const comment = readString(
    body.comments ?? body.comment ?? body.notes ?? body.comment_from_shipper
  );

  const vehiclesInput = Array.isArray(body.vehicles)
    ? body.vehicles
    : body.vehicle
    ? [body.vehicle]
    : [];

  if (!vehiclesInput.length) {
    const fallbackVehicle = {
      year: body.vehicleYear ?? body.vehicle_year,
      make: body.vehicleMake ?? body.vehicle_make,
      model: body.vehicleModel ?? body.vehicle_model,
      isOperable: body.vehicleIsOperable ?? body.vehicle_operable ?? body.isOperable,
      vehicleType: body.vehicleType ?? body.vehicle_type ?? body.type,
      vehicle_inop: body.vehicle_inop,
    };

    if (fallbackVehicle.year || fallbackVehicle.make || fallbackVehicle.model) {
      vehiclesInput.push(fallbackVehicle);
    }
  }

  if (!vehiclesInput.length) {
    res.status(400).json({ error: 'At least one vehicle is required.' });
    return;
  }

  const normalizedVehicles = [];

  for (const rawVehicle of vehiclesInput) {
    const normalized = normalizeVehicle(rawVehicle);
    if (!normalized.ok) {
      res.status(400).json({ error: normalized.error });
      return;
    }
    normalizedVehicles.push(normalized.value);
  }

  const leadPayload = {
    first_name: firstName,
    last_name: lastName,
    email,
    phone: phoneDigits,
    origin_city: origin.city,
    origin_state: origin.state,
    origin_postal_code: origin.postalCode ?? '',
    destination_city: destination.city,
    destination_state: destination.state,
    destination_postal_code: destination.postalCode ?? '',
    vehicles: normalizedVehicles.map((vehicle) => ({
      vehicle_model_year: vehicle.year,
      vehicle_make: vehicle.make,
      vehicle_model: vehicle.model,
      vehicle_inop: vehicle.inop,
      vehicle_type: vehicle.type,
    })),
    ship_date: shipDate,
    transport_type: transportType,
    comment_from_shipper: comment,
  };

  if (!leadPayload.ship_date) {
    delete leadPayload.ship_date;
  }
  if (!leadPayload.comment_from_shipper) {
    delete leadPayload.comment_from_shipper;
  }

  try {
    const upstreamResponse = await fetch(QUOTE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadPayload),
    });

    const contentType = upstreamResponse.headers.get('content-type') || '';
    let responseBody;
    if (contentType.includes('application/json')) {
      responseBody = await upstreamResponse.json();
    } else {
      responseBody = await upstreamResponse.text();
    }

    if (!upstreamResponse.ok) {
      logger.error('Quote webhook responded with an error', {
        status: upstreamResponse.status,
        body: responseBody,
      });
      const message =
        (responseBody && responseBody.error) ||
        (typeof responseBody === 'string' ? responseBody : null) ||
        'Failed to submit quote request.';
      res.status(upstreamResponse.status).json({ error: message });
      return;
    }

    res.status(200).json({ success: true, data: responseBody });
  } catch (error) {
    logger.error('Failed to forward quote request to BeRocker webhook', error);
    res.status(502).json({ error: 'Failed to submit quote request.' });
  }
});

function prepareResponse(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return true;
  }

  return false;
}

function readString(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value).trim();
  return '';
}

function extractDigits(value) {
  return value.replace(/\D/g, '');
}

function normalizeTransportType(value) {
  const normalized = readString(value).toLowerCase();
  if (!normalized) return null;
  return ALLOWED_TRANSPORT_TYPES.has(normalized) ? normalized : null;
}

function normalizeShipDate(value) {
  const trimmed = readString(value);
  if (!trimmed) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
}

function normalizeVehicle(raw) {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Vehicle details are required.' };
  }

  const yearRaw =
    raw.vehicle_model_year ?? raw.year ?? raw.vehicleYear ?? raw.vehicle_year ?? raw.vehicleYear;
  const year = Number(yearRaw);
  if (!Number.isFinite(year)) {
    return { ok: false, error: 'Vehicle year is required.' };
  }

  const make = readString(raw.vehicle_make ?? raw.make ?? raw.vehicleMake);
  if (!make) {
    return { ok: false, error: 'Vehicle make is required.' };
  }

  const model = readString(raw.vehicle_model ?? raw.model ?? raw.vehicleModel);
  if (!model) {
    return { ok: false, error: 'Vehicle model is required.' };
  }

  const vehicleTypeRaw = readString(raw.vehicle_type ?? raw.type ?? raw.vehicleType);
  const vehicleType = normalizeVehicleType(vehicleTypeRaw);
  if (!vehicleType) {
    return {
      ok: false,
      error:
        'Vehicle type is invalid. Accepted values: Car, sedan, Boat, Motorcycle, Pickup, pickup_2_doors, SUV, Van, RV, Travel Trailer, ATV, Convertible, Coupe, Other.',
    };
  }

  let vehicleInop = raw.vehicle_inop;
  if (typeof vehicleInop !== 'boolean') {
    if (typeof raw.isOperable === 'boolean') {
      vehicleInop = !raw.isOperable;
    } else if (typeof raw.operable === 'boolean') {
      vehicleInop = !raw.operable;
    } else if (typeof raw.inoperable === 'boolean') {
      vehicleInop = Boolean(raw.inoperable);
    }
  }

  if (typeof vehicleInop !== 'boolean') {
    vehicleInop = false;
  }

  return {
    ok: true,
    value: {
      year,
      make,
      model,
      type: vehicleType,
      inop: vehicleInop,
    },
  };
}

function normalizeVehicleType(value) {
  if (!value) return null;
  const normalized = readString(value).toLowerCase();
  if (!normalized) return null;

  const underscored = normalized
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  const candidates = [normalized, underscored, underscored.replace(/_/g, '')];

  for (const candidate of candidates) {
    const canonical = VEHICLE_TYPE_CANONICAL.get(candidate);
    if (canonical) {
      return canonical;
    }
  }

  return null;
}

function normalizeLocation(input, fallback = {}) {
  const result = {
    city: '',
    state: '',
    postalCode: '',
  };

  if (input && typeof input === 'object' && !Array.isArray(input)) {
    result.city = readString(input.city ?? input.origin_city ?? input.destination_city);
    result.state = readString(
      input.state ?? input.origin_state ?? input.destination_state
    ).toUpperCase();
    result.postalCode = readString(
      input.postalCode ?? input.postal_code ?? input.zip ?? input.postal
    );
  } else if (typeof input === 'string') {
    Object.assign(result, parseLocationString(input));
  }

  if (!result.city || !result.state) {
    const fallbackString = [fallback.city, fallback.state, fallback.postalCode]
      .filter(Boolean)
      .join(' ');
    const parsedFallback = parseLocationString(fallbackString);
    result.city = result.city || readString(fallback.city) || parsedFallback.city;
    result.state = result.state || readString(fallback.state).toUpperCase() || parsedFallback.state;
    result.postalCode =
      result.postalCode || readString(fallback.postalCode) || parsedFallback.postalCode;
  }

  result.city = readString(result.city);
  result.state = readString(result.state).toUpperCase();
  result.postalCode = readString(result.postalCode);

  if (!result.city || !result.state) {
    return null;
  }

  return result;
}

function parseLocationString(value) {
  const trimmed = readString(value);
  if (!trimmed) {
    return {
      city: '',
      state: '',
      postalCode: '',
    };
  }

  const directMatch = trimmed.match(
    /^([A-Za-z0-9 .'-]+)[,\s]+([A-Za-z]{2})(?:[,\s]+(\d{5}(?:-\d{4})?))?$/
  );

  if (directMatch) {
    return {
      city: readString(directMatch[1]),
      state: readString(directMatch[2]).toUpperCase(),
      postalCode: readString(directMatch[3]),
    };
  }

  const segments = trimmed
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean);

  const postalMatch = trimmed.match(/\b\d{5}(?:-\d{4})?\b/);
  const postalCode = postalMatch ? postalMatch[0] : '';

  let state = '';
  let citySegments = [...segments];

  for (let i = segments.length - 1; i >= 0; i -= 1) {
    const segment = segments[i];
    const stateMatch = segment.match(/\b([A-Za-z]{2})\b/);
    if (stateMatch) {
      state = stateMatch[1].toUpperCase();
      citySegments = segments.slice(0, i);
      break;
    }
  }

  if (!state) {
    const fallbackStateMatch = trimmed.match(/\b([A-Za-z]{2})\b/);
    if (fallbackStateMatch) {
      state = fallbackStateMatch[1].toUpperCase();
    }
  }

  const city =
    citySegments.join(', ').trim() ||
    trimmed.replace(state, '').replace(postalCode, '').replace(/[,]/g, ' ').trim();

  return {
    city,
    state,
    postalCode,
  };
}
