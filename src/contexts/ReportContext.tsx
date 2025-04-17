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
  createdAt: string;
  assignedTo?: string;
}

interface ReportContextType {
  reports: GeoReport[];
  addReport: (report: Omit<GeoReport, 'id' | 'createdAt'>) => void;
  updateReport: (id: string, report: Partial<GeoReport>) => void;
  deleteReport: (id: string) => void;
  getReportById: (id: string) => GeoReport | undefined;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

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
    date: '2025-03-15T10:30:00Z',
    createdAt: '2025-03-15T10:30:00Z',
    status: 'approved',
    category: 'Environmental',
    tags: ['coastal', 'erosion', 'annual'],
    assignedTo: 'John Doe'
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
    date: '2025-02-28T15:45:00Z',
    createdAt: '2025-02-28T15:45:00Z',
    status: 'submitted',
    category: 'Urban Planning',
    tags: ['urban', 'development', 'watershed'],
    assignedTo: 'Jane Smith'
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
    date: '2025-04-01T08:20:00Z',
    createdAt: '2025-04-01T08:20:00Z',
    status: 'draft',
    category: 'Disaster Management',
    tags: ['forest', 'fire', 'risk', 'climate'],
    assignedTo: 'Alice Johnson'
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
    date: '2025-01-15T12:15:00Z',
    createdAt: '2025-01-15T12:15:00Z',
    status: 'approved',
    category: 'Agriculture',
    tags: ['soil', 'agriculture', 'contamination'],
    assignedTo: 'Bob Brown'
  },
  {
    id: '5',
    title: 'Mountain Glacier Retreat',
    description: 'Documentation of rapid glacial retreat in alpine regions due to climate change.',
    location: {
      lat: 46.8652,
      lng: -121.7604,
      name: 'Mount Rainier, WA'
    },
    date: '2025-03-10T09:15:00Z',
    createdAt: '2025-03-10T09:15:00Z',
    status: 'submitted',
    category: 'Climate Research',
    tags: ['glacier', 'climate-change', 'mountains'],
    assignedTo: 'Charlie Davis'
  },
  {
    id: '6',
    title: 'River Pollution Analysis',
    description: 'Chemical analysis of river water showing increased industrial contaminants.',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      name: 'Hudson River, NY'
    },
    date: '2025-02-05T14:20:00Z',
    createdAt: '2025-02-05T14:20:00Z',
    status: 'approved',
    category: 'Water Quality',
    tags: ['pollution', 'river', 'industrial', 'contaminants'],
    assignedTo: 'David Wilson'
  },
  {
    id: '7',
    title: 'Coral Reef Bleaching',
    description: 'Monitoring of coral reef health showing extensive bleaching due to ocean temperature rise.',
    location: {
      lat: 24.5551,
      lng: -81.7800,
      name: 'Florida Keys'
    },
    date: '2025-03-25T11:00:00Z',
    createdAt: '2025-03-25T11:00:00Z',
    status: 'submitted',
    category: 'Marine Biology',
    tags: ['coral', 'ocean', 'temperature', 'climate'],
    assignedTo: 'Eve Brown'
  },
  {
    id: '8',
    title: 'Deforestation Rate Assessment',
    description: 'Satellite imagery analysis of tropical forest loss over the past year.',
    location: {
      lat: -3.4653,
      lng: -62.2159,
      name: 'Amazon Rainforest, Brazil'
    },
    date: '2025-01-30T10:45:00Z',
    createdAt: '2025-01-30T10:45:00Z',
    status: 'rejected',
    category: 'Forest Conservation',
    tags: ['deforestation', 'satellite', 'tropical', 'amazon'],
    assignedTo: 'Frank Smith'
  },
  {
    id: '9',
    title: 'Urban Air Quality Monitoring',
    description: 'Analysis of particulate matter and pollutant levels in major metropolitan areas.',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      name: 'Los Angeles, CA'
    },
    date: '2025-04-05T16:30:00Z',
    createdAt: '2025-04-05T16:30:00Z',
    status: 'approved',
    category: 'Air Quality',
    tags: ['pollution', 'urban', 'particulate', 'smog'],
    assignedTo: 'Grace Johnson'
  },
  {
    id: '10',
    title: 'Wetland Habitat Conservation',
    description: 'Assessment of wetland ecosystem health and biodiversity in protected areas.',
    location: {
      lat: 29.9499,
      lng: -90.0701,
      name: 'Louisiana Bayou'
    },
    date: '2025-02-20T13:15:00Z',
    createdAt: '2025-02-20T13:15:00Z',
    status: 'draft',
    category: 'Ecosystem Conservation',
    tags: ['wetland', 'biodiversity', 'habitat', 'conservation'],
    assignedTo: 'Hannah Davis'
  },
  {
    id: '11',
    title: 'Groundwater Depletion Study',
    description: 'Long-term monitoring of aquifer levels showing critical depletion in agricultural regions.',
    location: {
      lat: 36.7783,
      lng: -119.4179,
      name: 'Central Valley, CA'
    },
    date: '2025-03-05T11:20:00Z',
    createdAt: '2025-03-05T11:20:00Z',
    status: 'submitted',
    category: 'Water Resources',
    tags: ['groundwater', 'aquifer', 'agriculture', 'drought'],
    assignedTo: 'Ivy Brown'
  },
  {
    id: '12',
    title: 'Wind Farm Environmental Impact',
    description: 'Study of bird migration patterns and collision risks at new offshore wind farm.',
    location: {
      lat: 41.3804,
      lng: -70.7214,
      name: 'Cape Cod, MA'
    },
    date: '2025-01-25T09:45:00Z',
    createdAt: '2025-01-25T09:45:00Z',
    status: 'approved',
    category: 'Renewable Energy',
    tags: ['wind', 'birds', 'migration', 'offshore'],
    assignedTo: 'Jack Wilson'
  },
  {
    id: '13',
    title: 'Soil Erosion in Agricultural Lands',
    description: 'Quantitative assessment of topsoil loss in intensive farming areas after heavy rainfall events.',
    location: {
      lat: 41.5868,
      lng: -93.6250,
      name: 'Iowa Farmlands'
    },
    date: '2025-04-10T14:50:00Z',
    createdAt: '2025-04-10T14:50:00Z',
    status: 'draft',
    category: 'Soil Conservation',
    tags: ['erosion', 'agriculture', 'rainfall', 'topsoil'],
    assignedTo: 'Olivia Davis'
  },
  {
    id: '14',
    title: 'Invasive Species Spread',
    description: 'Tracking the rapid spread of invasive aquatic plants in freshwater lakes.',
    location: {
      lat: 44.5133,
      lng: -89.5744,
      name: 'Wisconsin Lakes'
    },
    date: '2025-02-12T10:30:00Z',
    createdAt: '2025-02-12T10:30:00Z',
    status: 'submitted',
    category: 'Invasive Species',
    tags: ['invasive', 'aquatic', 'lakes', 'ecosystem'],
    assignedTo: 'Paul Brown'
  },
  {
    id: '15',
    title: 'Mountain Snow Pack Analysis',
    description: 'Winter snow accumulation measurements showing decline compared to historical averages.',
    location: {
      lat: 39.1911,
      lng: -106.8175,
      name: 'Rocky Mountains, CO'
    },
    date: '2025-03-20T09:40:00Z',
    createdAt: '2025-03-20T09:40:00Z',
    status: 'approved',
    category: 'Hydrology',
    tags: ['snowpack', 'mountains', 'water-supply', 'climate'],
    assignedTo: 'Quinn Davis'
  }
];

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<GeoReport[]>(initialReports);

  const addReport = (reportData: Omit<GeoReport, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newReport: GeoReport = {
      ...reportData,
      id: Date.now().toString(),
      createdAt: now,
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
