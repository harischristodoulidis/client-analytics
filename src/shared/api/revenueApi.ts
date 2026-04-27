import { supabase } from "../utils/supabase";
import type { ChartDataPoint } from "./types/ChartDataPoint";
import type { KPIData } from "./types/kpisApi";
import {
  subDays,
  subMonths,
  subYears,
  isWithinInterval,
  eachMonthOfInterval,
  eachDayOfInterval,
  format,
} from "date-fns";

export interface PeriodFilter {
  startDate: Date;
  endDate: Date;
}

const getPeriodFilter = (
  period: string | { from: Date; to: Date },
): PeriodFilter => {
  const endDate = new Date();
  let startDate: Date;

  if (typeof period === "object") {
    return { startDate: period.from, endDate: period.to };
  }

  switch (period) {
    case "1m":
      startDate = subDays(endDate, 30);
      break;
    case "3m":
      startDate = subMonths(endDate, 3);
      break;
    case "6m":
      startDate = subMonths(endDate, 6);
      break;
    case "1y":
      startDate = subYears(endDate, 1);
      break;
    case "2y":
      startDate = subYears(endDate, 2);
      break;
    default:
      startDate = subYears(endDate, 1);
      break;
  }

  return { startDate, endDate };
};

const filterRevenueByPeriod = (
  data: Array<{ date: Date; revenue: number }>,
  filter: PeriodFilter,
) => {
  return data.filter((item) =>
    isWithinInterval(item.date, {
      start: filter.startDate,
      end: filter.endDate,
    }),
  );
};

// Generate comprehensive revenue data for the last 2 years
const generateRevenueData = (): Array<{ date: Date; revenue: number }> => {
  const data: Array<{ date: Date; revenue: number }> = [];
  const endDate = new Date();
  const startDate = subYears(endDate, 2);

  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  months.forEach((month, index) => {
    const baseRevenue = 3000;
    const trend = index * 50;
    const variance = Math.random() * 1000;
    data.push({
      date: month,
      revenue: Math.round(baseRevenue + trend + variance),
    });
  });

  return data;
};

const allRevenueData = generateRevenueData();

const generateDailyRevenueData = (): Array<{ date: Date; revenue: number }> => {
  const endDate = new Date();
  const startDate = subYears(endDate, 2);
  return eachDayOfInterval({ start: startDate, end: endDate }).map((day) => ({
    date: day,
    revenue: Math.round(100 + Math.random() * 200),
  }));
};

const allDailyRevenueData = generateDailyRevenueData();

// Mock KPI data
export const fetchMockKPIs = (
  period: string | { from: Date; to: Date } = "1y",
): Promise<KPIData[]> => {
  const filter = getPeriodFilter(period);
  const sourceData =
    typeof period === "object" ? allDailyRevenueData : allRevenueData;
  const periodData = filterRevenueByPeriod(sourceData, filter);

  const totalRevenue = periodData.reduce((sum, item) => sum + item.revenue, 0);
  const salesCount = periodData.length * 340;
  const clientsCount = Math.round(salesCount / 2);
  const growth =
    periodData.length > 1
      ? ((periodData[periodData.length - 1].revenue - periodData[0].revenue) /
          periodData[0].revenue) *
        100
      : 0;

  return [
    {
      label: "Revenue",
      value: `$${Math.round(totalRevenue).toLocaleString()}`,
      change: 12.5,
      isPositive: true,
    },
    {
      label: "Sales",
      value: salesCount.toLocaleString(),
      change: 8.2,
      isPositive: true,
    },
    {
      label: "Clients",
      value: clientsCount.toLocaleString(),
      change: -3.1,
      isPositive: false,
    },
    {
      label: "Growth",
      value: `${Math.abs(growth).toFixed(1)}%`,
      change: 5.4,
      isPositive: growth >= 0,
    },
  ];
};

// Mock chart data
export const fetchRevenueData = async (
  period: string | { from: Date; to: Date } = "1y",
): Promise<ChartDataPoint[]> => {
  if (period === "1m") {
    const filter = getPeriodFilter(period);
    return filterRevenueByPeriod(allDailyRevenueData, filter).map((item) => ({
      month: format(item.date, "MMM dd"),
      revenue: item.revenue,
    }));
  }

  if (typeof period === "object") {
    const filter: PeriodFilter = { startDate: period.from, endDate: period.to };
    return filterRevenueByPeriod(allDailyRevenueData, filter).map((item) => ({
      month: format(item.date, "MMM dd"),
      revenue: item.revenue,
    }));
  }

  const filter = getPeriodFilter(period);
  return filterRevenueByPeriod(allRevenueData, filter).map((item) => ({
    month: format(item.date, "MMM yyyy"),
    revenue: item.revenue,
  }));
};

// Get the date range for all available data
export const getDataDateRange = () => {
  return {
    minDate: allRevenueData[0].date,
    maxDate: allRevenueData[allRevenueData.length - 1].date,
  };
};
