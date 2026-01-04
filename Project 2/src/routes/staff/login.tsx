import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { useAuthStore } from "~/stores/useAuthStore";
import toast from "react-hot-toast";
import { Lock, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/staff/login")({
  component: StaffLoginPage,
});

function StaffLoginPage() {
  const navigate = useNavigate();
  const trpc = useTRPC();
  const setToken = useAuthStore((state) => state.setToken);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>();

  const loginMutation = useMutation(
    trpc.adminLogin.mutationOptions({
      onSuccess: (data) => {
        console.log("[Staff Login] Login successful");
        setToken(data.token);
        toast.success("Login successful!");
        navigate({ to: "/staff" });
      },
      onError: (error) => {
        console.error("[Staff Login] Login failed:", error);
        
        // Provide specific error messages based on error type
        let errorMessage = "Login failed. Please try again.";
        
        if (error.message?.includes("Invalid password")) {
          errorMessage = "Invalid password. Please check your credentials and try again.";
        } else if (error.message?.includes("UNAUTHORIZED")) {
          errorMessage = "Authentication failed. Please verify your password.";
        } else if (error.message?.includes("Network") || error.message?.includes("fetch")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage, {
          duration: 5000,
        });
      },
    }),
  );

  const onSubmit = (data: { password: string }) => {
    loginMutation.mutate({ password: data.password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Login</h1>
            <p className="text-gray-600 mt-2">
              Enter your password to access the staff dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter admin password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {loginMutation.isError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-900 mb-1">
                    Login Failed
                  </h4>
                  <p className="text-sm text-red-700">
                    {loginMutation.error?.message?.includes("Invalid password")
                      ? "The password you entered is incorrect. Please try again."
                      : loginMutation.error?.message || "An unexpected error occurred. Please try again."}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>

            {loginMutation.isError && (
              <button
                type="button"
                onClick={() => loginMutation.reset()}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all border border-gray-300"
              >
                Clear Error and Retry
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
