import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { Users, User, Mail } from "lucide-react";
import { FormStepContainer } from "~/components/FormStepContainer";
import { PhoneInput } from "~/components/PhoneInput";

interface SellerInformationStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control<any>;
}

export function SellerInformationStep({
  register,
  errors,
  control,
}: SellerInformationStepProps) {
  return (
    <FormStepContainer
      title="Seller Information"
      description="We need the seller's contact information for title company coordination and transaction processing."
      icon={<Users className="h-6 w-6 text-white" />}
      colorScheme="accent"
    >
      <div className="grid md:grid-cols-3 gap-4 md:gap-5">
        <div>
          <label
            htmlFor="sellerName"
            className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
          >
            <User className="h-4 w-4 text-accent-600" />
            Seller Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="sellerName"
            type="text"
            {...register("sellerName")}
            placeholder="Jane Doe"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400"
          />
          {errors.sellerName && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.sellerName.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="sellerEmail"
            className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
          >
            <Mail className="h-4 w-4 text-accent-600" />
            Seller Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="sellerEmail"
            type="email"
            inputMode="email"
            {...register("sellerEmail")}
            placeholder="jane@example.com"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400"
          />
          {errors.sellerEmail && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.sellerEmail.message as string}
            </p>
          )}
        </div>

        <PhoneInput
          name="sellerPhone"
          control={control}
          error={errors.sellerPhone}
          label="Seller Phone Number"
          placeholder="(555) 987-6543"
          required
          colorScheme="accent"
        />
      </div>
    </FormStepContainer>
  );
}
