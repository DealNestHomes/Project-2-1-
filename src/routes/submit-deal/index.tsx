import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useTRPC } from "~/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { Building2, CheckCircle, Mail, Phone } from "lucide-react";
import { AddressAutocomplete } from "~/components/AddressAutocomplete";
import { FormProgressIndicator } from "~/components/FormProgressIndicator";
import { FormNavigationButtons } from "~/components/FormNavigationButtons";
import { ContactInformationStep } from "~/components/deal-form-steps/ContactInformationStep";
import { SellerInformationStep } from "~/components/deal-form-steps/SellerInformationStep";
import { PropertyLocationStep } from "~/components/deal-form-steps/PropertyLocationStep";
import { PropertyDetailsStep } from "~/components/deal-form-steps/PropertyDetailsStep";
import { DealTimelineStep } from "~/components/deal-form-steps/DealTimelineStep";
import { PropertyConditionStep } from "~/components/deal-form-steps/PropertyConditionStep";
import { FinancialDetailsStep } from "~/components/deal-form-steps/FinancialDetailsStep";
import { AdditionalInformationStep } from "~/components/deal-form-steps/AdditionalInformationStep";
import { ReviewSummaryStep } from "~/components/deal-form-steps/ReviewSummaryStep";

export const Route = createFileRoute("/submit-deal/")({
  component: SubmitDeal,
});

// Helper schemas for fields that can be a value OR "Unknown"
const numberOrUnknown = z.preprocess(
  (val) => {
    // Handle empty string, null, undefined
    if (val === "" || val === null || val === undefined) {
      return undefined;
    }
    // If explicitly "Unknown", pass it through
    if (val === "Unknown") {
      return "Unknown";
    }
    // Try to convert to number
    const num = Number(val);
    return Number.isNaN(num) ? val : num;
  },
  z.union([
    z.number().min(0, "Must be a non-negative number"),
    z.literal("Unknown"),
  ], {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_union) {
        return { message: "Required field: enter a value or select Unknown" };
      }
      return { message: ctx.defaultError };
    }
  })
);

const integerOrUnknown = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) {
      return undefined;
    }
    if (val === "Unknown") {
      return "Unknown";
    }
    const num = Number(val);
    return Number.isNaN(num) ? val : num;
  },
  z.union([
    z.number().int("Must be a whole number").min(0, "Must be a non-negative number"),
    z.literal("Unknown"),
  ], {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_union) {
        return { message: "Required field: enter a value or select Unknown" };
      }
      return { message: ctx.defaultError };
    }
  })
);

const yearOrUnknown = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) {
      return undefined;
    }
    if (val === "Unknown") {
      return "Unknown";
    }
    const num = Number(val);
    return Number.isNaN(num) ? val : num;
  },
  z.union([
    z.number()
      .int("Year must be a whole number")
      .min(1800, "Year built must be 1800 or later")
      .max(new Date().getFullYear() + 1, `Year built cannot be later than ${new Date().getFullYear() + 1}`),
    z.literal("Unknown"),
  ], {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_union) {
        return { message: "Required field: enter a value or select Unknown" };
      }
      return { message: ctx.defaultError };
    }
  })
);

const stringOrUnknown = z.union([
  z.string().min(1, "Required field: enter a value or select Unknown"),
  z.literal("Unknown"),
]);

const ageRangeOrUnknown = z.union([
  z.enum(["0-5", "6-10", "11-20", "20+"]),
  z.literal("Unknown"),
], {
  errorMap: (issue, ctx) => {
    if (issue.code === z.ZodIssueCode.invalid_union) {
      return { message: "Required field: select an age range or Unknown" };
    }
    return { message: ctx.defaultError };
  }
});

const formSchema = z.object({
  // Contact Information - STRICTLY REQUIRED (no Unknown allowed)
  name: z.string().min(1, "Please enter your full name"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string()
    .min(1, "Your Phone is required")
    .transform((val) => val.replace(/\D/g, ""))
    .refine(
      (val) => val.length === 10,
      "Phone number must be exactly 10 digits"
    ),

  // Seller Information - STRICTLY REQUIRED (no Unknown allowed)
  sellerName: z.string().min(1, "Please enter the seller's full name"),
  sellerEmail: z.string().min(1, "Seller email is required").email("Please enter a valid email address"),
  sellerPhone: z.string()
    .min(1, "Seller phone is required")
    .transform((val) => val.replace(/\D/g, ""))
    .refine(
      (val) => val.length === 10,
      "Phone number must be exactly 10 digits"
    ),

  // Basic Property Information - STRICTLY REQUIRED (no Unknown allowed)
  propertyAddress: z.string().min(1, "Please enter the property street address"),
  zipCode: z.string()
    .min(1, "Please enter the ZIP code")
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)"),
  propertyType: stringOrUnknown,

  // Property Specifications - MANDATORY but allow Unknown
  bedrooms: integerOrUnknown,
  baths: integerOrUnknown,
  halfBaths: integerOrUnknown,
  squareFootage: integerOrUnknown,
  lotSize: numberOrUnknown,
  lotSizeUnit: stringOrUnknown,
  yearBuilt: yearOrUnknown,

  // Deal Details - MANDATORY but allow Unknown for descriptive fields
  closingDate: z.string().min(1, "Please select a closing date").date("Please enter a valid date"),
  inspectionPeriodExpiration: stringOrUnknown,
  occupancy: stringOrUnknown,
  propertyCondition: z.union([
    z.enum(["Full Rehab", "Major Repairs", "Light Rehab", "Turnkey"]),
    z.literal("Unknown"),
  ], {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_union) {
        return { message: "Required field: select a condition level or Unknown" };
      }
      return { message: ctx.defaultError };
    }
  }),

  // Repair & System Details - MANDATORY but allow Unknown
  repairEstimateMin: stringOrUnknown,
  repairEstimateMax: stringOrUnknown,
  roofAge: ageRangeOrUnknown,
  acType: stringOrUnknown,
  heatingSystemType: z.union([
    z.enum(["Furnace", "Boiler", "Heat Pump", "Baseboard"]),
    z.literal("Unknown"),
  ], {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_union) {
        return { message: "Required field: select a heating system type or Unknown" };
      }
      return { message: ctx.defaultError };
    }
  }),
  heatingSystemAge: ageRangeOrUnknown,
  foundationType: stringOrUnknown,
  foundationCondition: z.union([
    z.enum(["Excellent", "Good", "Fair", "Poor"]),
    z.literal("Unknown"),
  ], {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_union) {
        return { message: "Required field: select a condition or Unknown" };
      }
      return { message: ctx.defaultError };
    }
  }),
  parkingType: z.union([
    z.enum(["Attached Garage", "Detached Garage", "Driveway", "Carport", "Street", "Unassigned"]),
    z.literal("Unknown"),
  ]),

  // Financial Details - STRICTLY REQUIRED (no Unknown allowed)
  arv: z.string()
    .min(1, "Please enter the After Repair Value (ARV)")
    .regex(/^[\d,\.]+$/, "Please enter numbers only (commas and decimals allowed)"),
  estimatedRepairs: z.string()
    .min(1, "Please enter the Estimated Repairs")
    .regex(/^[\d,\.]+$/, "Please enter numbers only (commas and decimals allowed)"),
  contractPrice: z.string()
    .min(1, "Please enter the contract price")
    .regex(/^[\d,\.]+$/, "Please enter numbers only (commas and decimals allowed)"),

  // Additional Information - MANDATORY but allow Unknown
  additionalInfo: stringOrUnknown,
  propertyAccess: stringOrUnknown,
  photoLink: z.union([
    z.string().min(1).refine(
      (val) => val === "Unknown" || /^https?:\/\/.+/.test(val),
      "Please enter a valid URL starting with http:// or https://"
    ),
    z.literal("Unknown"),
    z.literal(""),
  ]),
  purchaseAgreementKey: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function SubmitDeal() {
  const [currentStep, setCurrentStep] = useState(0);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const steps = [
    "Contact",
    "Location",
    "Details",
    "Timeline",
    "Condition",
    "Financials",
    "Seller Info",
    "Additional",
    "Review",
  ];

  const trpc = useTRPC();
  const submitDealMutation = useMutation(
    trpc.submitDeal.mutationOptions()
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    trigger,
    control,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      sellerName: "",
      sellerEmail: "",
      sellerPhone: "",
      propertyAddress: "",
      zipCode: "",
      propertyType: "" as string | "Unknown",
      bedrooms: undefined as number | "Unknown" | undefined,
      baths: undefined as number | "Unknown" | undefined,
      halfBaths: undefined as number | "Unknown" | undefined,
      squareFootage: undefined as number | "Unknown" | undefined,
      lotSize: undefined as number | "Unknown" | undefined,
      lotSizeUnit: "" as string | "Unknown",
      yearBuilt: undefined as number | "Unknown" | undefined,
      closingDate: "",
      inspectionPeriodExpiration: "" as string | "Unknown",
      occupancy: "" as string | "Unknown",
      propertyCondition: undefined as "Full Rehab" | "Major Repairs" | "Light Rehab" | "Turnkey" | "Unknown" | undefined,
      repairEstimateMin: "" as string | "Unknown",
      repairEstimateMax: "" as string | "Unknown",
      roofAge: undefined as "0-5" | "6-10" | "11-20" | "20+" | "Unknown" | undefined,
      acType: "" as string | "Unknown",
      heatingSystemType: undefined as "Furnace" | "Boiler" | "Heat Pump" | "Baseboard" | "Unknown" | undefined,
      heatingSystemAge: undefined as "0-5" | "6-10" | "11-20" | "20+" | "Unknown" | undefined,
      foundationType: "" as string | "Unknown",
      foundationCondition: undefined as "Excellent" | "Good" | "Fair" | "Poor" | "Unknown" | undefined,
      parkingType: undefined as "Attached Garage" | "Detached Garage" | "Driveway" | "Carport" | "Street" | "Unassigned" | "Unknown" | undefined,
      arv: "",
      estimatedRepairs: "",
      contractPrice: "",
      additionalInfo: "" as string | "Unknown",
      propertyAccess: "" as string | "Unknown",
      photoLink: "" as string | "Unknown" | "",
      purchaseAgreementKey: undefined as string | undefined,
    },
  });

  // Define which fields are required for each step
  const stepFields: Record<number, (keyof FormData)[]> = {
    0: ["name", "email", "phone"],
    1: ["propertyAddress", "zipCode", "propertyType"],
    2: ["bedrooms", "baths", "halfBaths", "squareFootage", "lotSize", "lotSizeUnit", "yearBuilt", "parkingType"],
    3: ["closingDate", "inspectionPeriodExpiration", "occupancy"],
    4: ["propertyCondition", "repairEstimateMin", "repairEstimateMax", "roofAge", "acType", "heatingSystemType", "heatingSystemAge", "foundationType", "foundationCondition"],
    5: ["arv", "estimatedRepairs", "contractPrice"],
    6: ["sellerName", "sellerEmail", "sellerPhone"],
    7: ["additionalInfo", "propertyAccess", "photoLink"],
    8: [], // Review step - no validation needed
  };

  // Helper function to scroll to form container if it's not in view
  const scrollToFormIfNeeded = () => {
    if (!formContainerRef.current) return;

    const formRect = formContainerRef.current.getBoundingClientRect();
    const isFormVisible = formRect.top >= 0 && formRect.top < window.innerHeight;

    // Only scroll if the form top is not visible in the viewport
    if (!isFormVisible) {
      formContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  const handleNext = async () => {
    // If we're on the last step (review), trigger form submission
    if (currentStep === steps.length - 1) {
      await handleSubmit(onSubmit)();
      return;
    }

    // Validate current step fields before proceeding
    const fieldsToValidate = stepFields[currentStep];
    if (fieldsToValidate && fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) {
        return; // Don't proceed if validation fails
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    // Scroll to form only if it's not currently visible
    scrollToFormIfNeeded();
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    scrollToFormIfNeeded();
  };

  const handleStepJump = (stepIndex: number) => {
    // Only allow jumping to completed steps (steps before the current step)
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
      scrollToFormIfNeeded();
    }
  };

  const onSubmit = async (data: FormData) => {
    // Convert dates appropriately for backend:
    // - closingDate: date string in YYYY-MM-DD format (required)
    // - inspectionPeriodExpiration: date string in YYYY-MM-DD format (required)
    const submissionData = {
      ...data,
      closingDate: data.closingDate, // Already in YYYY-MM-DD format from date input
      inspectionPeriodExpiration: data.inspectionPeriodExpiration, // Already in YYYY-MM-DD format from date input
    };

    const submitPromise = submitDealMutation.mutateAsync(submissionData);

    await toast.promise(submitPromise, {
      loading: "Submitting your deal...",
      success: "Deal submitted successfully! We'll be in touch soon.",
      error: "Failed to submit deal. Please try again.",
    });

    reset();
    setCurrentStep(0);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-10 md:py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-300 rounded-full blur-3xl opacity-15"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mb-6 md:mb-8 shadow-xl">
              <Building2 className="h-8 w-8 md:h-10 md:w-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              Submit Your Deal
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Fill out the form below and we'll connect you with qualified
              buyers within 24-48 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-6 md:py-10 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={formContainerRef} className="bg-white rounded-xl md:rounded-2xl shadow-xl border-2 border-gray-100 p-5 md:p-6">
            {/* Progress Indicator */}
            <FormProgressIndicator
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepJump}
            />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
              {/* Step Content */}
              <div className="min-h-[400px]">
                {currentStep === 0 && (
                  <ContactInformationStep register={register} errors={errors} control={control} />
                )}
                {currentStep === 1 && (
                  <PropertyLocationStep
                    register={register}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                  />
                )}
                {currentStep === 2 && (
                  <PropertyDetailsStep register={register} errors={errors} />
                )}
                {currentStep === 3 && (
                  <DealTimelineStep register={register} errors={errors} control={control} />
                )}
                {currentStep === 4 && (
                  <PropertyConditionStep register={register} errors={errors} />
                )}
                {currentStep === 5 && (
                  <FinancialDetailsStep register={register} errors={errors} />
                )}
                {currentStep === 6 && (
                  <SellerInformationStep register={register} errors={errors} control={control} />
                )}
                {currentStep === 7 && (
                  <AdditionalInformationStep
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                  />
                )}
                {currentStep === 8 && (
                  <ReviewSummaryStep watch={watch} />
                )}
              </div>

              {/* Navigation Buttons */}
              <FormNavigationButtons
                currentStep={currentStep}
                totalSteps={steps.length}
                onBack={handleBack}
                onNext={handleNext}
                isSubmitting={submitDealMutation.isPending}
                isLastStep={currentStep === steps.length - 1}
              />

              {/* Footer Note */}
              <p className="mt-6 text-sm text-gray-500 text-center leading-relaxed px-2">
                By submitting, you agree to be contacted about your deal. Fields marked with <span className="text-red-500">*</span> are required.
              </p>
            </form>
          </div>

          {/* Benefits Section */}
          <div className="mt-12 md:mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <CheckCircle className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-base">
                Quick Response
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Hear back within 24-48 hours
              </p>
            </div>
            <div className="text-center bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="bg-gradient-to-br from-accent-600 to-accent-700 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Mail className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-base">
                No Spam
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We respect your privacy
              </p>
            </div>
            <div className="text-center bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all sm:col-span-2 md:col-span-1">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Phone className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-base">
                Direct Contact
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Connect with serious buyers
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
