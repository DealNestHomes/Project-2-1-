import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { Calendar } from "lucide-react";
import { FormStepContainer } from "~/components/FormStepContainer";
import { DatePicker } from "~/components/DatePicker";

interface DealTimelineStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control<any>;
}

export function DealTimelineStep({
  register,
  errors,
  control,
}: DealTimelineStepProps) {
  return (
    <FormStepContainer
      title="Deal Timeline"
      description="Provide the important dates for this deal. All fields are required - select 'Unknown' if information is not available."
      icon={<Calendar className="h-6 w-6 text-white" />}
      colorScheme="accent"
    >
      <div className="grid md:grid-cols-3 gap-4 md:gap-5">
        <DatePicker
          name="closingDate"
          control={control}
          label="Closing Date"
          required
          error={errors.closingDate}
          placeholder="Select closing date"
          colorScheme="accent"
          disableUnknown={true}
        />

        <DatePicker
          name="inspectionPeriodExpiration"
          control={control}
          label="Inspection Period Expiration"
          required
          error={errors.inspectionPeriodExpiration}
          placeholder="Select expiration date"
          colorScheme="accent"
        />

        <div>
          <label
            htmlFor="occupancy"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Occupancy Status <span className="text-red-500">*</span>
          </label>
          <select
            id="occupancy"
            {...register("occupancy")}
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation bg-white cursor-pointer"
          >
            <option value="">Select Occupancy</option>
            <option value="Vacant">Vacant</option>
            <option value="Owner Occupied">Owner Occupied</option>
            <option value="Tenant Occupied">Tenant Occupied</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.occupancy && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.occupancy.message as string}
            </p>
          )}
        </div>
      </div>
    </FormStepContainer>
  );
}
