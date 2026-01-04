import { Check } from "lucide-react";

interface FormProgressIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export function FormProgressIndicator({
  steps,
  currentStep,
  onStepClick,
}: FormProgressIndicatorProps) {
  return (
    <div className="w-full py-6">
      {/* Mobile: Clean progress bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-900">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-200">
            {steps[currentStep]}
          </span>
        </div>
        <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: Clean connected stepper */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connector line background (full width) */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-300" style={{ 
            marginLeft: 'calc(1.5rem)', 
            marginRight: 'calc(1.5rem)' 
          }} />
          
          {/* Steps container */}
          <div className="relative flex items-start justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <div key={step} className="flex flex-col items-center" style={{ flex: '0 0 auto' }}>
                  {/* Step circle */}
                  <button
                    type="button"
                    className={`
                      relative flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm
                      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${
                        isCompleted
                          ? "bg-primary-600 text-white shadow-md hover:bg-primary-700 hover:shadow-lg cursor-pointer focus:ring-primary-500"
                          : isCurrent
                          ? "bg-primary-600 text-white shadow-lg ring-2 ring-primary-300 focus:ring-primary-500"
                          : "bg-white text-gray-400 border-2 border-gray-300 shadow-sm cursor-default"
                      }
                    `}
                    onClick={() => {
                      if (isCompleted && onStepClick) {
                        onStepClick(index);
                      }
                    }}
                    disabled={!isCompleted}
                    aria-label={`${step} - Step ${index + 1}`}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" strokeWidth={3} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </button>

                  {/* Step label */}
                  <div
                    className={`
                      mt-3 text-center text-xs font-semibold px-2 max-w-[90px]
                      transition-colors duration-200
                      ${
                        isCompleted
                          ? "text-gray-700 cursor-pointer hover:text-primary-700"
                          : isCurrent
                          ? "text-gray-900"
                          : "text-gray-500"
                      }
                    `}
                    onClick={() => {
                      if (isCompleted && onStepClick) {
                        onStepClick(index);
                      }
                    }}
                    role={isCompleted ? "button" : undefined}
                  >
                    {step}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Active progress line (overlays background line) */}
          <div 
            className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-700 transition-all duration-300 ease-out"
            style={{ 
              marginLeft: 'calc(1.5rem)',
              width: currentStep === 0 
                ? '0%' 
                : `calc(${(currentStep / (steps.length - 1)) * 100}% - 3rem)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
