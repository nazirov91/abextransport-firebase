import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Car,
  User,
  Calendar,
  Truck,
  CheckCircle,
} from "lucide-react";

declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_PLACES_API_KEY =
  import.meta.env.VITE_GOOGLE_PLACES_API_KEY ?? import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_PLACES_SCRIPT_ID = "google-places-sdk";

let googlePlacesScriptPromise: Promise<typeof window.google | null> | null = null;

function loadGooglePlacesSdk(): Promise<typeof window.google | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }
  if (!GOOGLE_PLACES_API_KEY) {
    const error = new Error("Google Places API key is not configured.");
    console.error(error.message);
    return Promise.reject(error);
  }
  if (!googlePlacesScriptPromise) {
    googlePlacesScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById(
        GOOGLE_PLACES_SCRIPT_ID,
      ) as HTMLScriptElement | null;
      if (existingScript) {
        existingScript.addEventListener(
          "load",
          () => resolve(window.google),
          { once: true },
        );
        existingScript.addEventListener(
          "error",
          () => {
            googlePlacesScriptPromise = null;
            reject(new Error("Failed to load Google Places SDK."));
          },
          { once: true },
        );
        return;
      }
      const script = document.createElement("script");
      script.id = GOOGLE_PLACES_SCRIPT_ID;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places&v=beta`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google);
      script.onerror = () => {
        googlePlacesScriptPromise = null;
        reject(new Error("Failed to load Google Places SDK."));
      };
      document.head.appendChild(script);
    });
  }
  return googlePlacesScriptPromise;
}

function toCityStateZip(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const zipMatch = trimmed.match(/\b\d{5}(?:-\d{4})?\b/);
  const zip = zipMatch ? zipMatch[0] : "";

  const stateZipMatch = trimmed.match(/\b([A-Z]{2})\s+(\d{5}(?:-\d{4})?)\b/);
  let state = stateZipMatch ? stateZipMatch[1].toUpperCase() : "";
  if (!state) {
    const genericStateMatch = trimmed.match(/\b[A-Z]{2}\b/);
    state = genericStateMatch
      ? genericStateMatch[genericStateMatch.length - 1].toUpperCase()
      : "";
  }

  const segments = trimmed
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);

  let city = "";
  for (let i = segments.length - 1; i >= 0; i--) {
    const segment = segments[i];
    if (!segment) continue;
    if (zip && segment.includes(zip)) continue;
    if (state && segment.toUpperCase().includes(state)) continue;
    if (!/\d/.test(segment)) {
      city = segment;
      break;
    }
  }

  if (!city) {
    const tokens = trimmed.split(/\s+/).filter(Boolean);
    for (const token of tokens) {
      if (!/^\d+/.test(token) && token.length > 2) {
        city = token;
        break;
      }
    }
  }

  city = city.replace(/[^\w\s.'-]/g, "").trim();

  const parts = [city, state, zip].filter(Boolean);
  const formatted = parts.join(" ").replace(/\s+/g, " ").trim();

  return formatted || trimmed;
}

interface PlaceAddressComponent {
  long_name?: string;
  short_name?: string;
  types?: string[];
}

interface PlaceResultLike {
  address_components?: PlaceAddressComponent[];
  formatted_address?: string;
  name?: string;
  place_id?: string;
}

interface PlaceSuggestion {
  placeId: string;
  description: string;
}

function formatGooglePlace(place: PlaceResultLike | null | undefined) {
  if (!place) return "";
  const components = place.address_components ?? [];
  const findComponent = (orderedTypes: string[]) => {
    for (const type of orderedTypes) {
      const match = components.find((component) =>
        component.types?.includes(type),
      );
      if (match) return match;
    }
    return undefined;
  };

  const cityComponent =
    findComponent([
      "sublocality_level_1",
      "sublocality",
      "locality",
      "sublocality_level_2",
      "postal_town",
      "administrative_area_level_3",
      "administrative_area_level_4",
      "neighborhood",
    ]) ?? null;

  const fallbackCountyComponent =
    findComponent(["administrative_area_level_2"]) ?? null;

  const stateComponent = findComponent(["administrative_area_level_1"]) ?? null;
  const postalComponent = findComponent(["postal_code"]) ?? null;

  const primaryCity =
    cityComponent?.long_name ??
    cityComponent?.short_name ??
    fallbackCountyComponent?.long_name ??
    fallbackCountyComponent?.short_name ??
    place.name?.trim() ??
    "";

  const state =
    stateComponent?.short_name?.toUpperCase() ??
    stateComponent?.long_name?.toUpperCase() ??
    "";
  const postalCode = postalComponent?.long_name ?? "";

  const formatted = [primaryCity, state, postalCode]
    .filter((part) => typeof part === "string" && part.trim())
    .map((part) => (part as string).trim())
    .join(" ")
    .trim();
  if (formatted) {
    return formatted.replace(/\s+/g, " ").trim();
  }

  if (place.formatted_address) {
    return toCityStateZip(place.formatted_address);
  }

  return primaryCity;
}

function normalizePlaceResult(place: unknown): PlaceResultLike {
  if (!place || typeof place !== "object") return {};
  const result = place as {
    address_components?: PlaceAddressComponent[];
    formatted_address?: string;
    name?: string;
    place_id?: string;
  };
  return {
    address_components: result.address_components,
    formatted_address: result.formatted_address,
    name: result.name,
    place_id: result.place_id,
  };
}

function fetchPlaceDetailsWithService(
  placesService: any,
  placeId: string,
  sessionToken: any,
  fields: Array<
    | "address_components"
    | "formatted_address"
    | "name"
    | "geometry"
    | "place_id"
    | string
  > = ["address_components", "formatted_address", "name", "place_id"],
): Promise<PlaceResultLike> {
  return new Promise((resolve, reject) => {
    if (!placesService) {
      reject(new Error("PlacesService is not available."));
      return;
    }
    placesService.getDetails(
      {
        placeId,
        fields,
        sessionToken,
      },
      (result: unknown, status: string) => {
        const google = window.google;
        const okStatus =
          google?.maps?.places?.PlacesServiceStatus?.OK ?? "OK";
        if (status === okStatus && result) {
          resolve(normalizePlaceResult(result));
        } else {
          reject(
            new Error(
              `Failed to retrieve place details (status: ${status ?? "UNKNOWN"})`,
            ),
          );
        }
      },
    );
  });
}
// Common vehicle makes for the quote form
const vehicleMakes = [
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Ford",
  "Genesis",
  "GMC",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Maserati",
  "Mazda",
  "Mercedes-Benz",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Porsche",
  "Ram",
  "Rolls-Royce",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

interface StepOneData {
  origin: string;
  destination: string;
  pickupDate: string;
  trailerType: "open" | "enclosed";
}

interface StepTwoData {
  year: string;
  make: string;
  model: string;
  isOperable: boolean;
}

interface StepThreeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface VehicleModel {
  Model_ID: number;
  Model_Name: string;
}

interface NHTSAResponse {
  Results: VehicleModel[];
}

export default function MultiStepQuoteForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepOneData, setStepOneData] = useState<StepOneData>({
    origin: "",
    destination: "",
    pickupDate: "",
    trailerType: "open",
  });
  const [stepTwoData, setStepTwoData] = useState<StepTwoData>({
    year: "",
    make: "",
    model: "",
    isOperable: true,
  });
  const [stepThreeData, setStepThreeData] = useState<StepThreeData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [availableModels, setAvailableModels] = useState<VehicleModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    stepTwo: StepTwoData;
    stepThree: StepThreeData;
  } | null>(null);
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState<PlaceSuggestion[]>(
    [],
  );
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    PlaceSuggestion[]
  >([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);
  const [originSuggestionsLoading, setOriginSuggestionsLoading] =
    useState(false);
  const [destinationSuggestionsLoading, setDestinationSuggestionsLoading] =
    useState(false);
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const placesServiceElementRef = useRef<HTMLDivElement | null>(null);
  const originBlurTimeout = useRef<number | null>(null);
  const destinationBlurTimeout = useRef<number | null>(null);
  const originSessionTokenRef = useRef<any>(null);
  const destinationSessionTokenRef = useRef<any>(null);

  const clearOriginBlurTimeout = () => {
    if (originBlurTimeout.current !== null) {
      window.clearTimeout(originBlurTimeout.current);
      originBlurTimeout.current = null;
    }
  };

  const clearDestinationBlurTimeout = () => {
    if (destinationBlurTimeout.current !== null) {
      window.clearTimeout(destinationBlurTimeout.current);
      destinationBlurTimeout.current = null;
    }
  };

  const ensureOriginSessionToken = () => {
    if (!originSessionTokenRef.current && window.google?.maps?.places) {
      originSessionTokenRef.current =
        new window.google.maps.places.AutocompleteSessionToken();
    }
    return originSessionTokenRef.current;
  };

  const resetOriginSessionToken = () => {
    originSessionTokenRef.current = null;
  };

  const ensureDestinationSessionToken = () => {
    if (
      !destinationSessionTokenRef.current &&
      window.google?.maps?.places
    ) {
      destinationSessionTokenRef.current =
        new window.google.maps.places.AutocompleteSessionToken();
    }
    return destinationSessionTokenRef.current;
  };

  const resetDestinationSessionToken = () => {
    destinationSessionTokenRef.current = null;
  };

  const normalizeLocationValue = (value: string) =>
    toCityStateZip(value).trim();

  useEffect(() => {
    let isMounted = true;
    let serviceElement: HTMLDivElement | null = null;

    loadGooglePlacesSdk()
      .then((googleObj) => {
        if (!isMounted) return;
        const places = googleObj?.maps?.places;
        if (!places) {
          console.error("Google Places SDK did not load the places library.");
          return;
        }
        autocompleteServiceRef.current = new places.AutocompleteService();
        serviceElement = document.createElement("div");
        serviceElement.style.display = "none";
        document.body.appendChild(serviceElement);
        placesServiceElementRef.current = serviceElement;
        placesServiceRef.current = new places.PlacesService(serviceElement);
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.error("Failed to initialize Google Places SDK:", error);
        }
      });

    return () => {
      isMounted = false;
      autocompleteServiceRef.current = null;
      placesServiceRef.current = null;
      if (serviceElement && serviceElement.parentNode) {
        serviceElement.parentNode.removeChild(serviceElement);
      }
      placesServiceElementRef.current = null;
    };
  }, []);

  const handleOriginInputChange = (value: string) => {
    setStepOneData((prev) => ({
      ...prev,
      origin: value,
    }));
    setOriginQuery(value);
    setShowOriginSuggestions(true);
  };

  const handleDestinationInputChange = (value: string) => {
    setStepOneData((prev) => ({
      ...prev,
      destination: value,
    }));
    setDestinationQuery(value);
    setShowDestinationSuggestions(true);
  };

  const selectOriginSuggestion = async (suggestion: PlaceSuggestion) => {
    clearOriginBlurTimeout();
    try {
      setOriginSuggestionsLoading(true);
      const sessionToken = ensureOriginSessionToken();
      const placesService = placesServiceRef.current;
      let formatted = "";
      try {
        const placeDetails = await fetchPlaceDetailsWithService(
          placesService,
          suggestion.placeId,
          sessionToken,
        );
        formatted = formatGooglePlace(placeDetails);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Failed to resolve origin place details", error);
        }
      }
      const normalized = normalizeLocationValue(
        formatted || suggestion.description,
      );
      setStepOneData((prev) => ({
        ...prev,
        origin: normalized,
      }));
      setOriginQuery(normalized);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Failed to resolve origin place details", error);
      }
    } finally {
      setOriginSuggestionsLoading(false);
      setOriginSuggestions([]);
      setShowOriginSuggestions(false);
      resetOriginSessionToken();
    }
  };

  const selectDestinationSuggestion = async (suggestion: PlaceSuggestion) => {
    clearDestinationBlurTimeout();
    try {
      setDestinationSuggestionsLoading(true);
      const sessionToken = ensureDestinationSessionToken();
      const placesService = placesServiceRef.current;
      let formatted = "";
      try {
        const placeDetails = await fetchPlaceDetailsWithService(
          placesService,
          suggestion.placeId,
          sessionToken,
        );
        formatted = formatGooglePlace(placeDetails);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Failed to resolve destination place details", error);
        }
      }
      const normalized = normalizeLocationValue(
        formatted || suggestion.description,
      );
      setStepOneData((prev) => ({
        ...prev,
        destination: normalized,
      }));
      setDestinationQuery(normalized);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Failed to resolve destination place details", error);
      }
    } finally {
      setDestinationSuggestionsLoading(false);
      setDestinationSuggestions([]);
      setShowDestinationSuggestions(false);
      resetDestinationSessionToken();
    }
  };

  const handleOriginFocus = () => {
    clearOriginBlurTimeout();
    if (originSuggestions.length > 0 || originQuery.trim().length >= 3) {
      setShowOriginSuggestions(true);
    }
  };

  const handleDestinationFocus = () => {
    clearDestinationBlurTimeout();
    if (
      destinationSuggestions.length > 0 ||
      destinationQuery.trim().length >= 3
    ) {
      setShowDestinationSuggestions(true);
    }
  };

  const handleOriginBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    clearOriginBlurTimeout();
    originBlurTimeout.current = window.setTimeout(() => {
      const normalized = normalizeLocationValue(value);
      setStepOneData((prev) =>
        prev.origin === normalized
          ? prev
          : {
              ...prev,
              origin: normalized,
            },
      );
      setOriginQuery(normalized);
      setShowOriginSuggestions(false);
      resetOriginSessionToken();
    }, 150);
  };

  const handleDestinationBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    clearDestinationBlurTimeout();
    destinationBlurTimeout.current = window.setTimeout(() => {
      const normalized = normalizeLocationValue(value);
      setStepOneData((prev) =>
        prev.destination === normalized
          ? prev
          : {
              ...prev,
              destination: normalized,
            },
      );
      setDestinationQuery(normalized);
      setShowDestinationSuggestions(false);
      resetDestinationSessionToken();
    }, 150);
  };

  useEffect(() => {
    if (!showOriginSuggestions) {
      setOriginSuggestions([]);
      setOriginSuggestionsLoading(false);
      return;
    }

    const autocompleteService = autocompleteServiceRef.current;
    if (!autocompleteService) return;

    if (!originQuery || originQuery.trim().length < 3) {
      setOriginSuggestions([]);
      setOriginSuggestionsLoading(false);
      return;
    }

    const sessionToken = ensureOriginSessionToken();
    if (!sessionToken) {
      setOriginSuggestions([]);
      return;
    }

    const trimmedQuery = originQuery.trim();
    setOriginSuggestionsLoading(true);
    let isActive = true;
    const debounceId = window.setTimeout(() => {
      autocompleteService.getPlacePredictions(
        {
          input: trimmedQuery,
          sessionToken,
          componentRestrictions: { country: ["us"] },
        },
        (predictions: any, status: string) => {
          if (!isActive) return;
          const googleStatus =
            window.google?.maps?.places?.PlacesServiceStatus?.OK ?? "OK";
          if (status === googleStatus && Array.isArray(predictions)) {
            const mapped =
              predictions
                .map((prediction: any) => {
                  if (!prediction?.place_id) return null;
                  const mainText =
                    prediction.structured_formatting?.main_text ??
                    prediction.description ??
                    "";
                  const secondaryText =
                    prediction.structured_formatting?.secondary_text ?? "";
                  const description = [mainText, secondaryText]
                    .filter(Boolean)
                    .join(", ")
                    .trim();
                  return {
                    placeId: prediction.place_id as string,
                    description: description || prediction.description || mainText,
                  };
                })
                .filter((value: PlaceSuggestion | null): value is PlaceSuggestion =>
                  Boolean(value?.placeId),
                ) ?? [];
            setOriginSuggestions(mapped);
          } else {
            setOriginSuggestions([]);
            if (status !== googleStatus && import.meta.env.DEV) {
              console.error("Origin predictions request failed:", status);
            }
          }
          setOriginSuggestionsLoading(false);
        },
      );
    }, 200);

    return () => {
      isActive = false;
      window.clearTimeout(debounceId);
    };
  }, [originQuery, showOriginSuggestions]);

  useEffect(() => {
    if (!showDestinationSuggestions) {
      setDestinationSuggestions([]);
      setDestinationSuggestionsLoading(false);
      return;
    }

    const autocompleteService = autocompleteServiceRef.current;
    if (!autocompleteService) return;

    if (!destinationQuery || destinationQuery.trim().length < 3) {
      setDestinationSuggestions([]);
      setDestinationSuggestionsLoading(false);
      return;
    }

    const sessionToken = ensureDestinationSessionToken();
    if (!sessionToken) {
      setDestinationSuggestions([]);
      return;
    }

    const trimmedQuery = destinationQuery.trim();
    setDestinationSuggestionsLoading(true);
    let isActive = true;
    const debounceId = window.setTimeout(() => {
      autocompleteService.getPlacePredictions(
        {
          input: trimmedQuery,
          sessionToken,
          componentRestrictions: { country: ["us"] },
        },
        (predictions: any, status: string) => {
          if (!isActive) return;
          const googleStatus =
            window.google?.maps?.places?.PlacesServiceStatus?.OK ?? "OK";
          if (status === googleStatus && Array.isArray(predictions)) {
            const mapped =
              predictions
                .map((prediction: any) => {
                  if (!prediction?.place_id) return null;
                  const mainText =
                    prediction.structured_formatting?.main_text ??
                    prediction.description ??
                    "";
                  const secondaryText =
                    prediction.structured_formatting?.secondary_text ?? "";
                  const description = [mainText, secondaryText]
                    .filter(Boolean)
                    .join(", ")
                    .trim();
                  return {
                    placeId: prediction.place_id as string,
                    description: description || prediction.description || mainText,
                  };
                })
                .filter((value: PlaceSuggestion | null): value is PlaceSuggestion =>
                  Boolean(value?.placeId),
                ) ?? [];
            setDestinationSuggestions(mapped);
          } else {
            setDestinationSuggestions([]);
            if (status !== googleStatus && import.meta.env.DEV) {
              console.error("Destination predictions request failed:", status);
            }
          }
          setDestinationSuggestionsLoading(false);
        },
      );
    }, 200);

    return () => {
      isActive = false;
      window.clearTimeout(debounceId);
    };
  }, [destinationQuery, showDestinationSuggestions]);

  useEffect(() => {
    return () => {
      clearOriginBlurTimeout();
      clearDestinationBlurTimeout();
      resetOriginSessionToken();
      resetDestinationSessionToken();
    };
  }, []);

  // Generate years from current year to 1981
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1980 },
    (_, i) => currentYear - i,
  );

  // Fetch models when make and year change
  useEffect(() => {
    const fetchModels = async () => {
      if (stepTwoData.make && stepTwoData.year) {
        setLoadingModels(true);
        try {
          const response = await fetch(
            `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${stepTwoData.make}/modelyear/${stepTwoData.year}?format=json`,
          );
          const data: NHTSAResponse = await response.json();
          setAvailableModels(data.Results || []);
        } catch (error) {
          console.error("Error fetching vehicle models:", error);
          setAvailableModels([]);
        } finally {
          setLoadingModels(false);
        }
      } else {
        setAvailableModels([]);
      }
    };

    fetchModels();
  }, [stepTwoData.make, stepTwoData.year]);

  // Reset model when make or year changes
  useEffect(() => {
    setStepTwoData((prev) => ({ ...prev, model: "" }));
  }, [stepTwoData.make, stepTwoData.year]);

  const canProceedFromStep1 =
    stepOneData.origin &&
    stepOneData.destination &&
    stepOneData.pickupDate &&
    stepOneData.trailerType;
  const canProceedFromStep2 =
    stepTwoData.year && stepTwoData.make && stepTwoData.model;
  const canSubmitForm =
    stepThreeData.firstName &&
    stepThreeData.lastName &&
    stepThreeData.email &&
    stepThreeData.phone;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quote form submitted:", {
      stepOneData,
      stepTwoData,
      stepThreeData,
    });

    // Save submitted data for dialog before resetting
    setSubmittedData({ stepTwo: stepTwoData, stepThree: stepThreeData });

    // Show success dialog
    setShowSuccessDialog(true);

    // Reset form
    setCurrentStep(1);
    setStepOneData({
      origin: "",
      destination: "",
      pickupDate: "",
      trailerType: "open",
    });
    setOriginQuery("");
    setDestinationQuery("");
    setOriginSuggestions([]);
    setDestinationSuggestions([]);
    setShowOriginSuggestions(false);
    setShowDestinationSuggestions(false);
    resetOriginSessionToken();
    resetDestinationSessionToken();
    setStepTwoData({ year: "", make: "", model: "", isOperable: true });
    setStepThreeData({ firstName: "", lastName: "", email: "", phone: "" });
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return MapPin;
      case 2:
        return Car;
      case 3:
        return User;
      default:
        return MapPin;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Destination";
      case 2:
        return "Vehicle";
      case 3:
        return "Contact";
      default:
        return "Destination";
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-primary">
          Get Your Free Quote
        </CardTitle>
        <CardDescription>
          Step {currentStep} of 3 - {getStepTitle(currentStep)}
        </CardDescription>
      </CardHeader>

      {/* Step Indicators */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => {
            const StepIcon = getStepIcon(step);
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;
            const isClickable =
              step <= currentStep ||
              (step === 2 && canProceedFromStep1) ||
              (step === 3 && canProceedFromStep2);

            return (
              <div key={step} className="flex flex-col items-center">
                <button
                  onClick={() => isClickable && setCurrentStep(step)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : isCompleted
                        ? "bg-chart-2 text-white"
                        : "bg-muted text-muted-foreground"
                  } ${isClickable ? "hover-elevate cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                  disabled={!isClickable}
                  data-testid={`step-indicator-${step}`}
                >
                  <StepIcon className="h-4 w-4" />
                </button>
                <span
                  className={`text-xs font-medium ${
                    isActive
                      ? "text-primary"
                      : isCompleted
                        ? "text-chart-2"
                        : "text-muted-foreground"
                  }`}
                >
                  {getStepTitle(step)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-1">
          <div
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Step 1: Location */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="origin">* Origin Address</Label>
                <div className="relative">
                  <Input
                    id="origin"
                    placeholder="Enter origin address"
                    autoComplete="off"
                    value={stepOneData.origin}
                    onChange={(e) => handleOriginInputChange(e.target.value)}
                    onFocus={handleOriginFocus}
                    onBlur={handleOriginBlur}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        showOriginSuggestions &&
                        originSuggestions.length > 0
                      ) {
                        e.preventDefault();
                        selectOriginSuggestion(originSuggestions[0]);
                      }
                    }}
                    data-testid="input-origin"
                    required
                  />
                  {showOriginSuggestions && (
                    <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-border bg-popover text-sm shadow-lg">
                      {originSuggestionsLoading ? (
                        <div className="px-3 py-2 text-muted-foreground">
                          Searching…
                        </div>
                      ) : originSuggestions.length > 0 ? (
                        originSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.placeId}
                            type="button"
                            className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted focus:bg-muted"
                            onMouseDown={(event) => {
                              event.preventDefault();
                              selectOriginSuggestion(suggestion);
                            }}
                          >
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{suggestion.description}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-muted-foreground">
                          No matches found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">* Destination Address</Label>
                <div className="relative">
                  <Input
                    id="destination"
                    placeholder="Enter destination address"
                    autoComplete="off"
                    value={stepOneData.destination}
                    onChange={(e) =>
                      handleDestinationInputChange(e.target.value)
                    }
                    onFocus={handleDestinationFocus}
                    onBlur={handleDestinationBlur}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        showDestinationSuggestions &&
                        destinationSuggestions.length > 0
                      ) {
                        e.preventDefault();
                        selectDestinationSuggestion(
                          destinationSuggestions[0],
                        );
                      }
                    }}
                    data-testid="input-destination"
                    required
                  />
                  {showDestinationSuggestions && (
                    <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-border bg-popover text-sm shadow-lg">
                      {destinationSuggestionsLoading ? (
                        <div className="px-3 py-2 text-muted-foreground">
                          Searching…
                        </div>
                      ) : destinationSuggestions.length > 0 ? (
                        destinationSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.placeId}
                            type="button"
                            className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted focus:bg-muted"
                            onMouseDown={(event) => {
                              event.preventDefault();
                              selectDestinationSuggestion(suggestion);
                            }}
                          >
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{suggestion.description}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-muted-foreground">
                          No matches found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupDate">* Pick up Date</Label>
                <div className="relative">
                  <Input
                    id="pickupDate"
                    type="date"
                    placeholder="Enter pick up date"
                    value={stepOneData.pickupDate}
                    onChange={(e) =>
                      setStepOneData((prev) => ({
                        ...prev,
                        pickupDate: e.target.value,
                      }))
                    }
                    data-testid="input-pickup-date"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>* Trailer type</Label>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="open"
                      name="trailerType"
                      value="open"
                      checked={stepOneData.trailerType === "open"}
                      onChange={(e) =>
                        setStepOneData((prev) => ({
                          ...prev,
                          trailerType: e.target.value as "open" | "enclosed",
                        }))
                      }
                      className="w-4 h-4 text-primary"
                      data-testid="radio-open"
                    />
                    <Label htmlFor="open" className="cursor-pointer">
                      Open
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="enclosed"
                      name="trailerType"
                      value="enclosed"
                      checked={stepOneData.trailerType === "enclosed"}
                      onChange={(e) =>
                        setStepOneData((prev) => ({
                          ...prev,
                          trailerType: e.target.value as "open" | "enclosed",
                        }))
                      }
                      className="w-4 h-4 text-primary"
                      data-testid="radio-enclosed"
                    />
                    <Label htmlFor="enclosed" className="cursor-pointer">
                      Enclosed
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <div /> {/* Empty div for spacing */}
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceedFromStep1}
                  className="bg-primary hover:bg-primary/90 text-white"
                  data-testid="button-next-step1"
                >
                  Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>* Year</Label>
                <Select
                  value={stepTwoData.year}
                  onValueChange={(value) =>
                    setStepTwoData((prev) => ({ ...prev, year: value }))
                  }
                >
                  <SelectTrigger data-testid="select-year">
                    <SelectValue placeholder="Choose vehicle year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>* Vehicle Make</Label>
                <Select
                  value={stepTwoData.make}
                  onValueChange={(value) =>
                    setStepTwoData((prev) => ({ ...prev, make: value }))
                  }
                >
                  <SelectTrigger data-testid="select-make">
                    <SelectValue placeholder="Choose vehicle make" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleMakes.map((make: string) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>* Vehicle Model</Label>
                <Select
                  value={stepTwoData.model}
                  onValueChange={(value) =>
                    setStepTwoData((prev) => ({ ...prev, model: value }))
                  }
                  disabled={
                    !stepTwoData.make || !stepTwoData.year || loadingModels
                  }
                >
                  <SelectTrigger data-testid="select-model">
                    <SelectValue
                      placeholder={
                        loadingModels
                          ? "Loading models..."
                          : !stepTwoData.make || !stepTwoData.year
                            ? "Choose year and make first"
                            : "Choose vehicle model"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.Model_ID} value={model.Model_Name}>
                        {model.Model_Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="operable">Is it operable?</Label>
                  <Switch
                    id="operable"
                    checked={stepTwoData.isOperable}
                    onCheckedChange={(checked) =>
                      setStepTwoData((prev) => ({
                        ...prev,
                        isOperable: checked,
                      }))
                    }
                    data-testid="switch-operable"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {stepTwoData.isOperable ? "Yes" : "No"}
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  data-testid="button-previous-step2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceedFromStep2}
                  className="bg-primary hover:bg-primary/90 text-white"
                  data-testid="button-next-step2"
                >
                  Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Contact */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">* First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="First name"
                    value={stepThreeData.firstName}
                    onChange={(e) =>
                      setStepThreeData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    data-testid="input-first-name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">* Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last name"
                    value={stepThreeData.lastName}
                    onChange={(e) =>
                      setStepThreeData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    data-testid="input-last-name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">* Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@abextransport.com"
                  value={stepThreeData.email}
                  onChange={(e) =>
                    setStepThreeData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  data-testid="input-email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">* Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="281-220-1799"
                  value={stepThreeData.phone}
                  onChange={(e) =>
                    setStepThreeData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  data-testid="input-phone"
                  required
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  data-testid="button-previous-step3"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <Button
                  type="submit"
                  disabled={!canSubmitForm}
                  className="bg-chart-1 hover:bg-chart-1/90 text-white"
                  data-testid="button-submit-quote"
                >
                  Get My Quote
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>

      {/* Success Alert Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="sm:max-w-lg">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <AlertDialogTitle className="text-emerald-800">
                Quote Request Completed!
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-black-700">
              Hi {submittedData?.stepThree.firstName}! Your personalized quote
              for the {submittedData?.stepTwo.year}{" "}
              {submittedData?.stepTwo.make} {submittedData?.stepTwo.model} will
              be sent to {submittedData?.stepThree.email} within seconds! Our
              auto transport specialists are already working on your competitive
              rate!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowSuccessDialog(false);
                setSubmittedData(null);
              }}
              className="bg-black-600 hover:bg-black-700 text-black"
              data-testid="button-close-multistep-success-dialog"
            >
              Awesome!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
