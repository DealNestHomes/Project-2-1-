import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Building2 } from "lucide-react";
import { FormStepContainer } from "~/components/FormStepContainer";

interface PropertyDetailsStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function PropertyDetailsStep({
  register,
  errors,
}: PropertyDetailsStepProps) {
  return (
    <FormStepContainer
      title="Property Details"
      description="Provide details about the property's features and specifications. All fields are required - select 'Unknown' if information is not available."
      icon={<Building2 className="h-6 w-6 text-white" />}
      colorScheme="primary"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
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
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation bg-white cursor-pointer"
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

        <div>
          <label
            htmlFor="bedrooms"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Bedrooms <span className="text-red-500">*</span>
          </label>
          <input
            id="bedrooms"
            type="number"
            inputMode="numeric"
            min="0"
            {...register("bedrooms")}
            placeholder="3"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400"
          />
          {errors.bedrooms && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.bedrooms.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="baths"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Full Bathrooms <span className="text-red-500">*</span>
          </label>
          <input
            id="baths"
            type="number"
            inputMode="numeric"
            min="0"
            {...register("baths")}
            placeholder="2"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400"
          />
          {errors.baths && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.baths.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="halfBaths"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Half Bathrooms <span className="text-red-500">*</span>
          </label>
          <input
            id="halfBaths"
            type="number"
            inputMode="numeric"
            min="0"
            {...register("halfBaths")}
            placeholder="1"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400"
          />
          {errors.halfBaths && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.halfBaths.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="squareFootage"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Square Footage <span className="text-red-500">*</span>
          </label>
          <input
            id="squareFootage"
            type="number"
            inputMode="numeric"
            min="0"
            {...register("squareFootage")}
            placeholder="1500"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400"
          />
          {errors.squareFootage && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.squareFootage.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="yearBuilt"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Year Built <span className="text-red-500">*</span>
          </label>
          <input
            id="yearBuilt"
            type="number"
            inputMode="numeric"
            min="1800"
            max={new Date().getFullYear() + 1}
            {...register("yearBuilt")}
            placeholder="2005"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400"
          />
          {errors.yearBuilt && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.yearBuilt.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="parkingType"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Parking Type <span className="text-red-500">*</span>
          </label>
          <select
            id="parkingType"
            {...register("parkingType")}
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation bg-white cursor-pointer"
          >
            <option value="">Select Parking Type</option>
            <option value="Attached Garage">Attached Garage</option>
            <option value="Detached Garage">Detached Garage</option>
            <option value="Driveway">Driveway</option>
            <option value="Carport">Carport</option>
            <option value="Street">Street</option>
            <option value="Unassigned">Unassigned</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.parkingType && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.parkingType.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lotSize"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Lot Size <span className="text-red-500">*</span>
          </label>
          <input
            id="lotSize"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            {...register("lotSize")}
            placeholder="0.25"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400"
          />
          {errors.lotSize && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.lotSize.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lotSizeUnit"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Lot Size Unit <span className="text-red-500">*</span>
          </label>
          <select
            id="lotSizeUnit"
            {...register("lotSizeUnit")}
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation bg-white cursor-pointer"
          >
            <option value="">Select Unit</option>
            <option value="acres">Acres</option>
            <option value="sqft">Square Feet</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.lotSizeUnit && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.lotSizeUnit.message as string}
            </p>
          )}
        </div>
      </div>
    </FormStepContainer>
  );
}
