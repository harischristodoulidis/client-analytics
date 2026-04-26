import {
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from "../../styles/variants/buttonVariants";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export default function Button({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${buttonVariants({ variant, size })} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
