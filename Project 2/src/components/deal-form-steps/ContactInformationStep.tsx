import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { User, Mail, Phone } from "lucide-react";
import { FormStepContainer } from "~/components/FormStepContainer";
import { PhoneInput } from "~/components/PhoneInput";

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
};

interface ContactInformationStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control<any>;
}

export function ContactInformationStep({
  register,
  errors,
  control,
}: ContactInformationStepProps) {
  return (
    <FormStepContainer
      title="Contact Information"
      description="We need your contact information to coordinate with our title company and keep you updated on your deal."
      icon={<User className="h-6 w-6 text-white" />}
      colorScheme="primary"
    >
      <div className="grid md:grid-cols-3 gap-4 md:gap-5">
        {/* Name Field */}
        <div className="group">
          <label
            htmlFor="name"
            className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
          >
            <User className="h-4 w-4 text-primary-600" />
            Your Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            placeholder="John Smith"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400"
          />
          {errors.name && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.name.message as string}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="group">
          <label
            htmlFor="email"
            className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
          >
            <Mail className="h-4 w-4 text-primary-600" />
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            {...register("email")}
            placeholder="john@example.com"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400"
          />
          {errors.email && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.email.message as string}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <PhoneInput
          name="phone"
          control={control}
          error={errors.phone}
          label="Phone Number"
          placeholder="(555) 123-4567"
          required
        />
      </div>
    </FormStepContainer>
  );
}
