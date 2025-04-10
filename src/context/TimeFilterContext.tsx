
import React, { createContext, useState, useContext } from "react";

interface TimeFilterContextType {
  timeFrame: "day" | "week" | "month" | "year";
  selectedYear?: number;
  selectedMonth?: number;
  selectedDay?: number;
  showOpenReports: boolean;
  showClosedReports: boolean;
  showInProgressReports: boolean;
  selectedCategory?: string | null;
  setTimeFrame: (timeFrame: "day" | "week" | "month" | "year") => void;
  setSelectedYear: (year?: number) => void;
  setSelectedMonth: (month?: number) => void;
  setSelectedDay: (day?: number) => void;
  setShowOpenReports: (show: boolean) => void;
  setShowClosedReports: (show: boolean) => void;
  setShowInProgressReports: (show: boolean) => void;
  setSelectedCategory: (category: string | null) => void;
}

const TimeFilterContext = createContext<TimeFilterContextType | undefined>(undefined);

export const TimeFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeFrame, setTimeFrame] = useState<"day" | "week" | "month" | "year">("month");
  const [selectedYear, setSelectedYear] = useState<number | undefined>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<number | undefined>(undefined);
  const [showOpenReports, setShowOpenReports] = useState(true);
  const [showClosedReports, setShowClosedReports] = useState(true);
  const [showInProgressReports, setShowInProgressReports] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <TimeFilterContext.Provider
      value={{
        timeFrame,
        selectedYear,
        selectedMonth,
        selectedDay,
        showOpenReports,
        showClosedReports,
        showInProgressReports,
        selectedCategory,
        setTimeFrame,
        setSelectedYear,
        setSelectedMonth,
        setSelectedDay,
        setShowOpenReports,
        setShowClosedReports,
        setShowInProgressReports,
        setSelectedCategory,
      }}
    >
      {children}
    </TimeFilterContext.Provider>
  );
};

export const useTimeFilter = () => {
  const context = useContext(TimeFilterContext);
  if (context === undefined) {
    throw new Error("useTimeFilter must be used within a TimeFilterProvider");
  }
  return context;
};
