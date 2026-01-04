import { UseFormRegister, FieldErrors } from "react-hook-form";
import { DollarSign } from "lucide-react";
import { FormStepContainer } from "~/components/FormStepContainer";

interface FinancialDetailsStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function FinancialDetailsStep({
  register,
  errors,
}: FinancialDetailsStepProps) {
  return (
    <FormStepContainer
      title="Financial Details"
      description="Provide the key financial numbers for this deal. These are critical for buyers to evaluate the investment opportunity."
      icon={<DollarSign className="h-6 w-6 text-white" />}
      colorScheme="accent"
    >
      <div className="grid md:grid-cols-3 gap-4 md:gap-5">
        <div>
          <label
            htmlFor="arv"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            ARV (After Repair Value) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg pointer-events-none">
              $
            </span>
            <input
              id="arv"
              type="text"
              inputMode="numeric"
              placeholder="300,000"
              {...register("arv")}
              className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 pl-9 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400 font-semibold"
            />
          </div>
          {errors.arv && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.arv.message as string}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-600 flex items-start gap-1.5">
            <span className="text-accent-600 font-bold mt-0.5">→</span>
            <span>The property's value after repairs</span>
          </p>
        </div>

        <div>
          <label
            htmlFor="estimatedRepairs"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Estimated Repairs <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg pointer-events-none">
              $
            </span>
            <input
              id="estimatedRepairs"
              type="text"
              inputMode="numeric"
              placeholder="50,000"
              {...register("estimatedRepairs")}
              className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 pl-9 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400 font-semibold"
            />
          </div>
          {errors.estimatedRepairs && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.estimatedRepairs.message as string}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-600 flex items-start gap-1.5">
            <span className="text-accent-600 font-bold mt-0.5">→</span>
            <span>Total cost to repair the property</span>
          </p>
        </div>

        <div>
          <label
            htmlFor="contractPrice"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Contract Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg pointer-events-none">
              $
            </span>
            <input
              id="contractPrice"
              type="text"
              inputMode="numeric"
              placeholder="180,000"
              {...register("contractPrice")}
              className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 pl-9 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400 font-semibold"
            />
          </div>
          {errors.contractPrice && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.contractPrice.message as string}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-600 flex items-start gap-1.5">
            <span className="text-accent-600 font-bold mt-0.5">→</span>
            <span>Your purchase contract price</span>
          </p>
        </div>
      </div>
    </FormStepContainer>
  );
}
