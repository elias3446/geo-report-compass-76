
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Download } from "lucide-react";
import ReportsChart from "./charts/ReportsChart";
import TimePeriodSelector from "./TimePeriodSelector";

interface ReportTimeData {
  name: string;
  open: number;
  closed: number;
  inProgress: number;
}

interface ReportsOverviewProps {
  reportsByTimeFrame: ReportTimeData[];
  showOpenReports: boolean;
  showInProgressReports: boolean;
  showClosedReports: boolean;
  setShowOpenReports: (show: boolean) => void;
  setShowInProgressReports: (show: boolean) => void;
  setShowClosedReports: (show: boolean) => void;
  timeFrame: "day" | "week" | "month" | "year";
  selectedYear?: number;
  selectedMonth?: number;
  selectedDay?: number;
  availableYears: number[];
  daysInMonth: number[];
  months: string[];
  handleTimeFrameChange: (value: string) => void;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  setSelectedDay: (day: number) => void;
  handleExportReportsData: () => void;
}

const ReportsOverview = ({
  reportsByTimeFrame,
  showOpenReports,
  showInProgressReports,
  showClosedReports,
  setShowOpenReports,
  setShowInProgressReports,
  setShowClosedReports,
  timeFrame,
  selectedYear,
  selectedMonth,
  selectedDay,
  availableYears,
  daysInMonth,
  months,
  handleTimeFrameChange,
  setSelectedYear,
  setSelectedMonth,
  setSelectedDay,
  handleExportReportsData
}: ReportsOverviewProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle>Reports Activity</CardTitle>
            <CardDescription>
              Number of opened and resolved reports over time
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Toggle
              pressed={showOpenReports}
              onPressedChange={setShowOpenReports}
              variant="outline"
              className="border-blue-300 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
            >
              Open
            </Toggle>
            <Toggle
              pressed={showInProgressReports}
              onPressedChange={setShowInProgressReports}
              variant="outline"
              className="border-yellow-300 data-[state=on]:bg-yellow-100 data-[state=on]:text-yellow-700"
            >
              In Progress
            </Toggle>
            <Toggle
              pressed={showClosedReports}
              onPressedChange={setShowClosedReports}
              variant="outline"
              className="border-green-300 data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
            >
              Closed
            </Toggle>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleExportReportsData}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <TimePeriodSelector
          timeFrame={timeFrame}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
          availableYears={availableYears}
          daysInMonth={daysInMonth}
          months={months}
          onTimeFrameChange={handleTimeFrameChange}
          setSelectedYear={setSelectedYear}
          setSelectedMonth={setSelectedMonth}
          setSelectedDay={setSelectedDay}
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <ReportsChart
          reportsByTimeFrame={reportsByTimeFrame}
          showOpenReports={showOpenReports}
          showInProgressReports={showInProgressReports}
          showClosedReports={showClosedReports}
        />
      </CardContent>
    </Card>
  );
};

export default ReportsOverview;
