
import React, { createContext, useContext, useState, ReactNode } from "react";

interface TimeFilterContextType {
  timeFrame: "month" | "week" | "day";
  setTimeFrame: (timeFrame: "month" | "week" | "day") => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedDay: number | undefined;
  setSelectedDay: (day: number | undefined) => void;
  showOpenReports: boolean;
  setShowOpenReports: (show: boolean) => void;
  showInProgressReports: boolean;
  setShowInProgressReports: (show: boolean) => void;
  showClosedReports: boolean;
  setShowClosedReports: (show: boolean) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  toggleCategory: (category: string) => void;
}

const TimeFilterContext = createContext<TimeFilterContextType | undefined>(undefined);

export const TimeFilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const currentDate = new Date();
  const [timeFrame, setTimeFrame] = useState<"month" | "week" | "day">("month");
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | undefined>(undefined);
  const [showOpenReports, setShowOpenReports] = useState(true);
  const [showInProgressReports, setShowInProgressReports] = useState(true);
  const [showClosedReports, setShowClosedReports] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prevCategories => {
      // If the category is already selected, remove it
      if (prevCategories.includes(category)) {
        return prevCategories.filter(c => c !== category);
      } 
      // If not selected, add it
      else {
        return [...prevCategories, category];
      }
    });
    
    // Update selectedCategory for backward compatibility
    setSelectedCategory(prev => {
      if (prev === category) {
        return null;
      } else {
        return category;
      }
    });
  };

  return (
    <TimeFilterContext.Provider
      value={{
        timeFrame,
        setTimeFrame,
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        selectedDay,
        setSelectedDay,
        showOpenReports,
        setShowOpenReports,
        showInProgressReports,
        setShowInProgressReports,
        showClosedReports,
        setShowClosedReports,
        selectedCategory,
        setSelectedCategory,
        selectedCategories,
        setSelectedCategories,
        toggleCategory,
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
