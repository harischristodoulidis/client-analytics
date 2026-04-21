import { useState } from "react";
import { format } from "date-fns";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../../ui/Select";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "../../ui/Popover";
import cn from "../../../shared/utils/cn";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../../ui/Calendar";

const periods = [
  {
    name: "1m",
    value: "Last Month",
  },
  {
    name: "3m",
    value: "Last 3 Months",
  },
  {
    name: "6m",
    value: "Last 6 Months",
  },
  {
    name: "1y",
    value: "Last 1 Year",
  },
  {
    name: "2y",
    value: "Last 2 Years",
  },
  {
    name: "custom",
    value: "Custom Period",
  },
];

export type PeriodOption = (typeof periods)[number]["name"];

interface PeriodSelectorProps {
  selectedPeriod: PeriodOption;
  onChange: (value: PeriodOption) => void;
  customDateRange?: { from: Date; to: Date };
  onCustomDateChange?: (range: { from: Date; to: Date }) => void;
  minDate?: Date;
  maxDate?: Date;
}

export default function PeriodSelector({
  selectedPeriod,
  onChange,
  customDateRange,
  onCustomDateChange,
  minDate,
  maxDate,
}: PeriodSelectorProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: customDateRange?.from,
    to: customDateRange?.to,
  });

  const handleSelectChange = (newValue: string) => {
    onChange(newValue as PeriodOption);
    if (newValue !== "custom") {
      setIsCalendarOpen(false);
    }
  };
  const getDisplayValue = () => {
    if (selectedPeriod === "custom" && customDateRange) {
      return `${format(customDateRange.from, "MMM dd, yyyy")} - ${format(customDateRange.to, "MMM dd, yyyy")}`;
    }

    const period = periods.find((period) => period.name === selectedPeriod);
    const displayValue = period?.value;
    return displayValue;
  };

  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      setDateRange(range);
      onCustomDateChange?.({ from: range.from, to: range.to });
      setIsCalendarOpen(false);
      onChange("custom");
    } else if (range) {
      setDateRange(range);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedPeriod} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-45 md:w-50">
          <SelectValue>{getDisplayValue()}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {periods.map((period) => (
            <SelectItem value={period.name}>{period.value}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedPeriod === "custom" && (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex h-9 items-center gap-2 rounded-md border border-input bg-input-background px-3 text-sm transition-colors hover:bg-accent",
                !customDateRange && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {customDateRange ? (
                <span className="hidden sm:inline">Edit dates</span>
              ) : (
                <span>Select dates</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              defaultMonth={dateRange.from}
            ></Calendar>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
