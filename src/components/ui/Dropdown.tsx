import cn from "../../shared/utils/cn";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps
  extends Omit<React.ComponentProps<"select">, "onChange"> {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder,
  className,
  disabled,
  ...props
}: DropdownProps) {
  return (
    <select
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cn(
        "h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground transition-colors focus:border-ring focus:outline-none focus:ring-[3px] focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
