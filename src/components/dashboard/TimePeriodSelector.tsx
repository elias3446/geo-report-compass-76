
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimePeriodSelectorProps {
  timeFrame: "day" | "week" | "month" | "year";
  selectedYear?: number;
  selectedMonth?: number;
  selectedDay?: number;
  availableYears: number[];
  daysInMonth: number[];
  months: string[];
  onTimeFrameChange: (value: string) => void;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  setSelectedDay: (day: number) => void;
}

const TimePeriodSelector = ({
  timeFrame,
  selectedYear,
  selectedMonth,
  selectedDay,
  availableYears,
  daysInMonth,
  months,
  onTimeFrameChange,
  setSelectedYear,
  setSelectedMonth,
  setSelectedDay
}: TimePeriodSelectorProps) => {
  const renderTimePeriodSelectors = () => {
    if (timeFrame === "year") {
      return (
        <div className="flex space-x-2 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Year:</span>
            <Select
              value={selectedYear?.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    } 
    
    if (timeFrame === "month" || timeFrame === "week") {
      return (
        <div className="flex flex-wrap space-x-2 items-center">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <span className="text-sm font-medium">Year:</span>
            <Select
              value={selectedYear?.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Month:</span>
            <Select
              value={selectedMonth?.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
    
    if (timeFrame === "day") {
      return (
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Year:</span>
            <Select
              value={selectedYear?.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Month:</span>
            <Select
              value={selectedMonth?.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Day:</span>
            <Select
              value={selectedDay?.toString()}
              onValueChange={(value) => setSelectedDay(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {daysInMonth.map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-2">
      <Tabs defaultValue={timeFrame} onValueChange={onTimeFrameChange}>
        <TabsList>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {renderTimePeriodSelectors()}
    </div>
  );
};

export default TimePeriodSelector;
