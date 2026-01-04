import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface FormNavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isSubmitting: boolean;
  isLastStep: boolean;
}

export function FormNavigationButtons({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isSubmitting,
  isLastStep,
}: FormNavigationButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 mt-6 border-t-2 border-gray-200">
      {/* Back Button */}
      {currentStep > 0 && (
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>
      )}

      {/* Spacer when no back button on desktop */}
      {currentStep === 0 && <div className="hidden sm:block" />}

      {/* Next/Submit Button */}
      <button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className="group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 active:from-primary-800 active:to-primary-900 transition-all shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 sm:ml-auto min-h-[48px] overflow-hidden"
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Button content */}
        <span className="relative flex items-center gap-2">
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Submitting...</span>
            </>
          ) : isLastStep ? (
            <>
              <CheckCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>Submit Deal</span>
            </>
          ) : (
            <>
              <span>Next</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </span>
      </button>
    </div>
  );
}
