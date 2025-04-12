
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface ReportTimeData {
  name: string;
  open: number;
  closed: number;
  inProgress: number;
}

interface ReportsChartProps {
  reportsByTimeFrame: ReportTimeData[];
  showOpenReports: boolean;
  showInProgressReports: boolean;
  showClosedReports: boolean;
}

const ReportsChart = ({ 
  reportsByTimeFrame, 
  showOpenReports, 
  showInProgressReports, 
  showClosedReports 
}: ReportsChartProps) => {
  return (
    <div className="h-[330px] md:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={reportsByTimeFrame}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {showOpenReports && (
            <Line
              type="monotone"
              dataKey="open"
              name="Open Reports"
              stroke="#0EA5E9"
              activeDot={{ r: 8 }}
            />
          )}
          {showInProgressReports && (
            <Line
              type="monotone"
              dataKey="inProgress"
              name="In Progress Reports"
              stroke="#FFBB28"
              activeDot={{ r: 8 }}
            />
          )}
          {showClosedReports && (
            <Line 
              type="monotone" 
              dataKey="closed" 
              name="Closed Reports"
              stroke="#10B981" 
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportsChart;
