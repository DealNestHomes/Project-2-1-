import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Home } from "lucide-react";
import { FormStepContainer } from "~/components/FormStepContainer";
import { AddressAutocomplete } from "~/components/AddressAutocomplete";

interface PropertyLocationStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

export function PropertyLocationStep({
  register,
  errors,
  watch,
  setValue,
}: PropertyLocationStepProps) {
  const propertyAddress = watch("propertyAddress");

  const handleAddressSelect = (address: {
    streetAddress: string;
    zipCode: string;
  }) => {
    const options = { shouldValidate: true, shouldDirty: true };
    setValue("propertyAddress", address.streetAddress, options);
    setValue("zipCode", address.zipCode, options);
  };

  return (
    <FormStepContainer
      title="Property Location"
      description="Tell us where the property is located. Start typing the address and we'll help you fill in the details."
      icon={<Home className="h-6 w-6 text-white" />}
      colorScheme="accent"
    >
      <div className="space-y-4 md:space-y-5">
        <div>
          <label
            htmlFor="propertyAddress"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Street Address <span className="text-red-500">*</span>
          </label>
          <AddressAutocomplete
            id="propertyAddress"
            value={propertyAddress || ""}
            onChange={(value) => setValue("propertyAddress", value)}
            onSelectAddress={handleAddressSelect}
            error={errors.propertyAddress?.message as string}
            placeholder="Start typing the property address..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-bold text-gray-800 mb-2.5"
            >
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              id="zipCode"
              type="text"
              inputMode="numeric"
              {...register("zipCode")}
              placeholder="75201"
              className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400"
            />
            {errors.zipCode && (
              <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
                {errors.zipCode.message as string}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="propertyType"
              className="block text-sm font-bold text-gray-800 mb-2.5"
            >
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              id="propertyType"
              {...register("propertyType")}
              className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation bg-white cursor-pointer"
            >
              <option value="">Select Property Type</option>
              <option value="Single Family">Single Family</option>
              <option value="Multi-Family">Multi-Family</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Land">Land</option>
              <option value="Commercial">Commercial</option>
              <option value="Mobile Home">Mobile Home</option>
              <option value="Other">Other</option>
              <option value="Unknown">Unknown</option>
            </select>
            {errors.propertyType && (
              <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
                {errors.propertyType.message as string}
              </p>
            )}
          </div>
        </div>
      </div>
    </FormStepContainer>
  );
}
