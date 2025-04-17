
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  lastLogin: Date | null;
  avatar?: string;
  mobileUserType?: MobileUserType;
  password?: string; // Optional for updates
}

export type UserRole = 'admin' | 'supervisor' | 'mobile' | 'viewer';
export type MobileUserType = 'citizen' | 'technician';

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  active: boolean;
  createdAt: Date;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  group: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  category: string;
  location: Location;
  date: Date;
  assignedTo?: string;
  tags: string[];
  priority?: 'low' | 'medium' | 'high';
  updatedAt?: Date;
}

export type ReportStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'pending' | 'in-progress' | 'resolved';

export interface Location {
  name: string;
  lat: number;
  lng: number;
}
