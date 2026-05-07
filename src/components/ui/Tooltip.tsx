import { useState } from "react";
import {
  positionVariants,
  type PositionVariant,
} from "../../styles/variants/positionVariants";

export interface TooltipProps {
  content: string;
  position?: PositionVariant;
  children: React.ReactNode;
}

export default function Tooltip({
  content,
  position = "top",
  children,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`bg-background text-foreground pointer-events-none absolute z-50 rounded px-2 py-1 text-xs whitespace-nowrap ${positionVariants[position]}`}
          style={{ boxShadow: "var(--shadow-md)" }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
