import { useState } from "react";
import type { DateRange } from "react-day-picker";
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
}

export default function PeriodSelector({
  selectedPeriod,
  onChange,
  customDateRange,
  onCustomDateChange,
}: PeriodSelectorProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    customDateRange,
  );

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

  const handleDateSelect = (range: DateRange | undefined) => {
    if (
      range?.from &&
      range?.to &&
      range.from.getTime() !== range.to.getTime()
    ) {
      setDateRange(range);
      onCustomDateChange?.({ from: range.from, to: range.to });
      setIsCalendarOpen(false);
      onChange("custom");
    } else {
      setDateRange(range);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedPeriod} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-auto min-w-45 md:min-w-50">
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
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date > today;
              }}
              defaultMonth={dateRange?.from}
            ></Calendar>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
