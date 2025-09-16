import { useState, useEffect } from "react";
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
                <Input
                  id="origin"
                  placeholder="Enter origin address"
                  value={stepOneData.origin}
                  onChange={(e) =>
                    setStepOneData((prev) => ({
                      ...prev,
                      origin: e.target.value,
                    }))
                  }
                  data-testid="input-origin"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">* Destination Address</Label>
                <Input
                  id="destination"
                  placeholder="Enter destination address"
                  value={stepOneData.destination}
                  onChange={(e) =>
                    setStepOneData((prev) => ({
                      ...prev,
                      destination: e.target.value,
                    }))
                  }
                  data-testid="input-destination"
                  required
                />
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
                  placeholder="Bon999@yahoo.com"
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
                  placeholder="+1 (713) 344-4668"
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
