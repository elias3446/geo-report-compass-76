export type UserRole = 'admin' | 'supervisor' | 'mobile' | 'viewer';

export type MobileUserType = 'citizen' | 'technician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  lastLogin?: Date;
  createdAt: Date;
  avatar?: string;
  mobileUserType?: MobileUserType;
  password?: string;
}

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
  categoryId: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  comments?: ReportComment[];
  attachments?: Attachment[];
}

export interface ReportComment {
  id: string;
  reportId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  reportId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  createdAt: Date;
}
