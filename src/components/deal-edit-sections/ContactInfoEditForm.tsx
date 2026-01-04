import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { useAuthStore } from "~/stores/useAuthStore";
import toast from "react-hot-toast";
import { Save, X, Mail, User } from "lucide-react";
import { PhoneInput } from "~/components/PhoneInput";

interface ContactInfoEditFormProps {
  dealId: number;
  initialData: {
    name: string;
    email: string;
    phone: string;
  };
  onCancel: () => void;
  onSuccess: () => void;
}

export function ContactInfoEditForm({
  dealId,
  initialData,
  onCancel,
  onSuccess,
}: ContactInfoEditFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const updateMutation = useMutation(
    trpc.updateDealDetails.mutationOptions({
      onSuccess: () => {
        toast.success("Contact information updated successfully!");
        queryClient.invalidateQueries({
          queryKey: trpc.getDealSubmission.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.listDealSubmissions.queryKey(),
        });
        onSuccess();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update contact information");
      },
    }),
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    name: string;
    email: string;
    phone: string;
  }>({
    defaultValues: initialData,
  });

  const onSubmit = (data: { name: string; email: string; phone: string }) => {
    updateMutation.mutate({
      authToken: token!,
      dealId,
      name: data.name,
      email: data.email,
      phone: data.phone,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
          >
            <User className="h-4 w-4 text-primary-600" />
            Full Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name", { required: "Name is required" })}
            placeholder="John Smith"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
          {errors.name && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
          >
            <Mail className="h-4 w-4 text-primary-600" />
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            placeholder="john@example.com"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
          {errors.email && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="sm:col-span-2">
          <PhoneInput
            name="phone"
            control={control}
            label="Phone Number"
            required={true}
            error={errors.phone}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t-2 border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all border-2 border-gray-200 hover:border-gray-300 min-h-[48px]"
        >
          <X className="w-5 h-5" />
          <span>Cancel</span>
        </button>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[48px]"
        >
          {updateMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
