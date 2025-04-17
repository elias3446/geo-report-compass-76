import { User, Category, SystemSetting, Report, UserRole, MobileUserType } from '../types/admin';
import { mockUsers, mockCategories, mockSettings, mockReports } from './mockData';

// User management functions
export const getUsers = (): User[] => {
  return [...mockUsers];
};

export const getUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter(user => user.role === role);
};

export const searchUsers = (query: string): User[] => {
  const lowerQuery = query.toLowerCase();
  return mockUsers.filter(
    user => 
      user.name.toLowerCase().includes(lowerQuery) || 
      user.email.toLowerCase().includes(lowerQuery)
  );
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// This would communicate with a backend in a real implementation
export const createUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
  // In a real implementation, the password would be hashed before storing
  const newUser: User = {
    id: `user-${mockUsers.length + 1}`,
    ...userData,
    createdAt: new Date()
  };
  
  // Remove password from the stored user object for security
  // In a real implementation, the password would be stored hashed in a secure way
  const { password, ...userWithoutPassword } = newUser;
  const userToStore = { ...userWithoutPassword } as User;
  
  mockUsers.push(userToStore);
  return userToStore;
};

export const updateUser = (id: string, userData: Partial<User>): User | null => {
  const index = mockUsers.findIndex(user => user.id === id);
  if (index === -1) return null;
  
  // If password is empty, don't update it
  if (userData.password === '') {
    const { password, ...dataWithoutPassword } = userData;
    mockUsers[index] = { ...mockUsers[index], ...dataWithoutPassword };
  } else {
    // In a real implementation, the password would be hashed before storing
    mockUsers[index] = { ...mockUsers[index], ...userData };
  }
  
  return mockUsers[index];
};

// Categories management functions
export const getCategories = (): Category[] => {
  return [...mockCategories];
};

export const getCategoryById = (id: string): Category | undefined => {
  return mockCategories.find(category => category.id === id);
};

export const createCategory = (categoryData: Omit<Category, 'id' | 'createdAt'>): Category => {
  const newCategory: Category = {
    id: `category-${mockCategories.length + 1}`,
    ...categoryData,
    createdAt: new Date()
  };
  mockCategories.push(newCategory);
  return newCategory;
};

export const updateCategory = (id: string, categoryData: Partial<Category>): Category | null => {
  const index = mockCategories.findIndex(category => category.id === id);
  if (index === -1) return null;
  
  mockCategories[index] = { ...mockCategories[index], ...categoryData };
  return mockCategories[index];
};

// Settings management functions
export const getSettings = (): SystemSetting[] => {
  return [...mockSettings];
};

export const getSettingsByGroup = (group: string): SystemSetting[] => {
  return mockSettings.filter(setting => setting.group === group);
};

export const updateSetting = (id: string, value: string): SystemSetting | null => {
  const index = mockSettings.findIndex(setting => setting.id === id);
  if (index === -1) return null;
  
  mockSettings[index] = { ...mockSettings[index], value };
  return mockSettings[index];
};

// Reports management functions
export const getReports = (): Report[] => {
  return [...mockReports];
};

export const getReportById = (id: string): Report | undefined => {
  return mockReports.find(report => report.id === id);
};

export const updateReportStatus = (
  id: string, 
  status: Report['status'], 
  assignedTo?: string
): Report | null => {
  const index = mockReports.findIndex(report => report.id === id);
  if (index === -1) return null;
  
  mockReports[index] = { 
    ...mockReports[index], 
    status,
    assignedTo: assignedTo || mockReports[index].assignedTo,
    updatedAt: new Date()
  };
  return mockReports[index];
};

// Helper functions for dashboard statistics
export const getUsersStats = () => {
  return {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.active).length,
    admins: mockUsers.filter(u => u.role === 'admin').length,
    supervisors: mockUsers.filter(u => u.role === 'supervisor').length,
    mobile: mockUsers.filter(u => u.role === 'mobile').length,
    inactive: mockUsers.filter(u => !u.active).length
  };
};

export const getReportsStats = () => {
  return {
    total: mockReports.length,
    pending: mockReports.filter(r => r.status === 'pending').length,
    inProgress: mockReports.filter(r => r.status === 'in-progress').length,
    resolved: mockReports.filter(r => r.status === 'resolved').length,
    highPriority: mockReports.filter(r => r.priority === 'high').length
  };
};

// Añadimos la función para obtener reportes por categoría
export const getReportsByCategoryId = (categoryId: string): Report[] => {
  return mockReports.filter(report => report.categoryId === categoryId);
};
