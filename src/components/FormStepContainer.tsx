import { ReactNode } from "react";

interface FormStepContainerProps {
  children: ReactNode;
  title: string;
  description?: string;
  icon: ReactNode;
  colorScheme?: "primary" | "accent";
}

export function FormStepContainer({
  children,
  title,
  description,
  icon,
  colorScheme = "primary",
}: FormStepContainerProps) {
  const gradientClass =
    colorScheme === "primary"
      ? "from-primary-50/50 to-transparent"
      : "from-accent-50/50 to-transparent";

  const borderClass =
    colorScheme === "primary" ? "border-primary-200" : "border-accent-200";

  const iconBgClass =
    colorScheme === "primary"
      ? "from-primary-600 to-primary-700"
      : "from-accent-600 to-accent-700";

  return (
    <div
      className={`bg-gradient-to-br ${gradientClass} rounded-xl p-5 md:p-6 border-2 ${borderClass} shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300`}
    >
      <div className="mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`bg-gradient-to-br ${iconBgClass} p-3 rounded-xl shadow-md flex-shrink-0`}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              {title}
            </h2>
            {description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
