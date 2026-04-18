import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={`border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full ${className}`}
      {...props}
    />
  );
}
