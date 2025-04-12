
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/ui/StatCard";
import { FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useTimeFilter } from "@/context/TimeFilterContext";
import { useReports } from "@/contexts/ReportContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import ReportsOverview from "./ReportsOverview";
import CategoryDistribution from "./CategoryDistribution";
import MapSection from "./MapSection";
import ActivityList from "./ActivityList";
import LocationList from "./LocationList";
import { getAllActivities } from "@/services/reportService";

const DashboardContent = () => {
  const { 
    timeFrame, 
    selectedYear, 
    selectedMonth, 
    selectedDay,
    showOpenReports,
    showClosedReports,
    showInProgressReports,
    selectedCategories,
    setTimeFrame,
    setSelectedYear,
    setSelectedMonth,
    setSelectedDay,
    setShowOpenReports,
    setShowClosedReports,
    setShowInProgressReports
  } = useTimeFilter();
  
  const navigate = useNavigate();
  
  const {
    stats,
    reportsByCategory,
    reportsByTimeFrame,
    allReports,
    availableYears,
    daysInMonth,
    months,
    activeIndex,
    activeReportTab,
    setActiveReportTab,
    onPieEnter,
    onPieLeave,
    onPieClick,
    handleExportReportsData,
    handleExportCategoryData,
    handleExportLocationData,
    clearAllSelectedCategories,
    handleTimeFrameChange
  } = useDashboardData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => navigate('/reports')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatCard 
            title="Total Reports"
            value={stats.totalReports.toString()}
            description="All time submitted reports"
            icon={FileText}
            change={{ value: "12%", positive: true }}
          />
        </div>
        <div onClick={() => navigate('/reports?status=Open')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatCard 
            title="Open Issues"
            value={stats.openIssues.toString()}
            description="Pending resolution"
            icon={AlertCircle}
            iconColor="text-yellow-500"
            change={{ value: "5%", positive: false }}
          />
        </div>
        <div onClick={() => navigate('/reports?status=Resolved')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatCard 
            title="Resolved Issues"
            value={stats.resolvedIssues.toString()}
            description="Successfully addressed"
            icon={CheckCircle2}
            iconColor="text-green-500"
            change={{ value: "18%", positive: true }}
          />
        </div>
        <StatCard 
          title="Average Response"
          value={stats.averageResponse}
          description="Time to first action"
          icon={Clock}
          iconColor="text-blue-500"
          change={{ value: "0.5 days", positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Tabs 
          defaultValue="reports" 
          onValueChange={setActiveReportTab}
          className="flex flex-col h-full"
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="reports">Reports Overview</TabsTrigger>
            <TabsTrigger value="categories">Category Distribution</TabsTrigger>
          </TabsList>
          <TabsContent value="reports" className="p-0 mt-4 flex-grow">
            <ReportsOverview
              reportsByTimeFrame={reportsByTimeFrame}
              showOpenReports={showOpenReports}
              showInProgressReports={showInProgressReports}
              showClosedReports={showClosedReports}
              setShowOpenReports={setShowOpenReports}
              setShowInProgressReports={setShowInProgressReports}
              setShowClosedReports={setShowClosedReports}
              timeFrame={timeFrame}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedDay={selectedDay}
              availableYears={availableYears}
              daysInMonth={daysInMonth}
              months={months}
              handleTimeFrameChange={handleTimeFrameChange}
              setSelectedYear={setSelectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedDay={setSelectedDay}
              handleExportReportsData={handleExportReportsData}
            />
          </TabsContent>
          <TabsContent value="categories" className="p-0 mt-4 flex-grow">
            <CategoryDistribution
              reportsByCategory={reportsByCategory}
              selectedCategories={selectedCategories}
              activeIndex={activeIndex}
              onPieEnter={onPieEnter}
              onPieLeave={onPieLeave}
              onPieClick={onPieClick}
              clearAllSelectedCategories={clearAllSelectedCategories}
              handleExportCategoryData={handleExportCategoryData}
            />
          </TabsContent>
        </Tabs>

        <MapSection
          selectedCategories={selectedCategories}
          activeReportTab={activeReportTab}
          handleExportLocationData={handleExportLocationData}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityList activities={getAllActivities()} />
        <LocationList reports={allReports} />
      </div>
    </div>
  );
};

const DashboardView = () => {
  return <DashboardContent />;
};

export default DashboardView;
