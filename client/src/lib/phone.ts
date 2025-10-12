export function extractDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function formatPhoneNumber(value: string) {
  const digits = extractDigits(value);
  if (!digits) return '';

  const localNumber = digits.slice(-10);
  const countryCode = digits.length > 10 ? `+${digits.slice(0, digits.length - 10)} ` : '';

  const area = localNumber.slice(0, 3);
  const mid = localNumber.slice(3, 6);
  const last = localNumber.slice(6, 10);

  let formatted = countryCode;

  if (area) {
    formatted += area.length === 3 ? `(${area})` : `(${area}`;
  }

  if (mid) {
    formatted += area.length === 3 ? ` ${mid}` : '';
  }

  if (last) {
    formatted += `-${last}`;
  }

  if (digits.length <= 3) {
    formatted = digits;
  }

  return formatted.trim();
}

export function normalizePhoneNumber(value: string) {
  const digits = extractDigits(value);
  if (!digits) return '';
  if (digits.length === 10) return `+1${digits}`;
  return `+${digits}`;
}
