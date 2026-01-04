import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Wrench } from "lucide-react";
import { FormStepContainer } from "~/components/FormStepContainer";

interface PropertyConditionStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function PropertyConditionStep({
  register,
  errors,
}: PropertyConditionStepProps) {
  return (
    <FormStepContainer
      title="Property Condition & Systems"
      description="Tell us about the property's condition and major systems. All fields are required - select 'Unknown' if information is not available."
      icon={<Wrench className="h-6 w-6 text-white" />}
      colorScheme="primary"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        <div>
          <label
            htmlFor="propertyCondition"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Property Condition <span className="text-red-500">*</span>
          </label>
          <select
            id="propertyCondition"
            {...register("propertyCondition")}
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation bg-white cursor-pointer"
          >
            <option value="">Select Condition</option>
            <option value="Full Rehab">Full Rehab</option>
            <option value="Major Repairs">Major Repairs</option>
            <option value="Light Rehab">Light Rehab</option>
            <option value="Turnkey">Turnkey</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.propertyCondition && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.propertyCondition.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="repairEstimateMin"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Repair Estimate (Min) <span className="text-red-500">*</span>
          </label>
          <input
            id="repairEstimateMin"
            type="text"
            inputMode="numeric"
            {...register("repairEstimateMin")}
            placeholder="10000"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400"
          />
          {errors.repairEstimateMin && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.repairEstimateMin.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="repairEstimateMax"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Repair Estimate (Max) <span className="text-red-500">*</span>
          </label>
          <input
            id="repairEstimateMax"
            type="text"
            inputMode="numeric"
            {...register("repairEstimateMax")}
            placeholder="15000"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400"
          />
          {errors.repairEstimateMax && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.repairEstimateMax.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="roofAge"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Roof Age <span className="text-red-500">*</span>
          </label>
          <select
            id="roofAge"
            {...register("roofAge")}
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation bg-white cursor-pointer"
          >
            <option value="">Select Age Range</option>
            <option value="0-5">0–5 years</option>
            <option value="6-10">6–10 years</option>
            <option value="11-20">11–20 years</option>
            <option value="20+">20+ years</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.roofAge && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.roofAge.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="acType"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Air Conditioning Type <span className="text-red-500">*</span>
          </label>
          <select
            id="acType"
            {...register("acType")}
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation bg-white cursor-pointer"
          >
            <option value="">Select AC Type</option>
            <option value="Central">Central</option>
            <option value="Window Units">Window Units</option>
            <option value="Mini Split">Mini Split</option>
            <option value="None">None</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.acType && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.acType.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="heatingSystemType"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Heating System Type <span className="text-red-500">*</span>
          </label>
          <select
            id="heatingSystemType"
            {...register("heatingSystemType")}
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation bg-white cursor-pointer"
          >
            <option value="">Select Heating Type</option>
            <option value="Furnace">Furnace</option>
            <option value="Boiler">Boiler</option>
            <option value="Heat Pump">Heat Pump</option>
            <option value="Baseboard">Baseboard</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.heatingSystemType && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.heatingSystemType.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="heatingSystemAge"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Heating System Age <span className="text-red-500">*</span>
          </label>
          <select
            id="heatingSystemAge"
            {...register("heatingSystemAge")}
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation bg-white cursor-pointer"
          >
            <option value="">Select Age Range</option>
            <option value="0-5">0–5 years</option>
            <option value="6-10">6–10 years</option>
            <option value="11-20">11–20 years</option>
            <option value="20+">20+ years</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.heatingSystemAge && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.heatingSystemAge.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="foundationType"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Foundation Type <span className="text-red-500">*</span>
          </label>
          <select
            id="foundationType"
            {...register("foundationType")}
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation bg-white cursor-pointer"
          >
            <option value="">Select Foundation Type</option>
            <option value="Slab">Slab</option>
            <option value="Crawl Space">Crawl Space</option>
            <option value="Basement">Basement</option>
            <option value="Pier and Beam">Pier and Beam</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.foundationType && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.foundationType.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="foundationCondition"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Foundation Condition <span className="text-red-500">*</span>
          </label>
          <select
            id="foundationCondition"
            {...register("foundationCondition")}
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation bg-white cursor-pointer"
          >
            <option value="">Select Condition</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.foundationCondition && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.foundationCondition.message as string}
            </p>
          )}
        </div>
      </div>
    </FormStepContainer>
  );
}
