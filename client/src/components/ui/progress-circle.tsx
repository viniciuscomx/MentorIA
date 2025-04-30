import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: React.ReactNode;
  color?: string;
  bgColor?: string;
}

export const ProgressCircle = ({
  value,
  max = 100,
  size = 40,
  strokeWidth = 3,
  className,
  label,
  color = "hsl(var(--primary))",
  bgColor = "hsl(var(--muted))",
}: ProgressCircleProps) => {
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), max) / max;
  const offset = circumference - progress * circumference;

  return (
    <div className={cn("relative inline-flex", className)}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={bgColor}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          {label}
        </div>
      )}
    </div>
  );
};
