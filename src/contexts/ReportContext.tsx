
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface GeoReport {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  date: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  category: string;
  tags: string[];
}

interface ReportContextType {
  reports: GeoReport[];
  addReport: (report: Omit<GeoReport, 'id'>) => void;
  updateReport: (id: string, report: Partial<GeoReport>) => void;
  deleteReport: (id: string) => void;
  getReportById: (id: string) => GeoReport | undefined;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

// Sample data
const initialReports: GeoReport[] = [
  {
    id: '1',
    title: 'Coastal Erosion Assessment',
    description: 'Annual assessment of coastline changes in the Pacific Northwest region.',
    location: {
      lat: 47.6062,
      lng: -122.3321,
      name: 'Seattle, WA'
    },
    date: '2025-03-15',
    status: 'approved',
    category: 'Environmental',
    tags: ['coastal', 'erosion', 'annual']
  },
  {
    id: '2',
    title: 'Urban Development Impact',
    description: 'Analysis of urban sprawl and its environmental impact on local watersheds.',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      name: 'San Francisco, CA'
    },
    date: '2025-02-28',
    status: 'submitted',
    category: 'Urban Planning',
    tags: ['urban', 'development', 'watershed']
  },
  {
    id: '3',
    title: 'Forest Fire Risk Assessment',
    description: 'Quarterly evaluation of forest fire risks based on climate and vegetation data.',
    location: {
      lat: 39.5501,
      lng: -105.7821,
      name: 'Colorado Mountains'
    },
    date: '2025-04-01',
    status: 'draft',
    category: 'Disaster Management',
    tags: ['forest', 'fire', 'risk', 'climate']
  },
  {
    id: '4',
    title: 'Agricultural Soil Quality',
    description: 'Biannual analysis of soil quality and contamination levels in agricultural areas.',
    location: {
      lat: 41.8781,
      lng: -93.0977,
      name: 'Central Iowa'
    },
    date: '2025-01-15',
    status: 'approved',
    category: 'Agriculture',
    tags: ['soil', 'agriculture', 'contamination']
  }
];

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<GeoReport[]>(initialReports);

  const addReport = (reportData: Omit<GeoReport, 'id'>) => {
    const newReport: GeoReport = {
      ...reportData,
      id: Date.now().toString(),
    };
    
    setReports(prev => [...prev, newReport]);
  };

  const updateReport = (id: string, reportData: Partial<GeoReport>) => {
    setReports(prev => 
      prev.map(report => 
        report.id === id ? { ...report, ...reportData } : report
      )
    );
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  const getReportById = (id: string) => {
    return reports.find(report => report.id === id);
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        addReport,
        updateReport,
        deleteReport,
        getReportById
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
