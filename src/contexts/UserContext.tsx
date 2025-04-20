import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { User } from '@/types/admin';
import { toast } from 'sonner';
import { getUsers as fetchUsers } from '@/services/adminService';
import { getReports, updateReport } from '@/services/reportService';

interface UserContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  deleteUser: (userId: string) => void;
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  supervisorUsers: number;
  mobileUsers: number;
  getFilteredUsers: (role: string | null) => User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  
  // Cargar los usuarios de mockData al iniciar
  useEffect(() => {
    const initialUsers = fetchUsers();
    setUsers(initialUsers);
  }, []);

  // Use useMemo to derive stats from the users array
  const { totalUsers, activeUsers, adminUsers, supervisorUsers, mobileUsers } = useMemo(() => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter(user => user.active).length,
      adminUsers: users.filter(user => user.role === 'admin').length,
      supervisorUsers: users.filter(user => user.role === 'supervisor').length,
      mobileUsers: users.filter(user => user.role === 'mobile').length
    };
  }, [users]); // This will recompute whenever the users array changes

  const getFilteredUsers = useCallback((role: string | null) => {
    if (!role || role === 'all') {
      return [...users];
    }
    return users.filter(user => user.role === role);
  }, [users]);

  const deleteUser = useCallback((userId: string) => {
    setUsers(prevUsers => {
      // First, update any reports that were assigned to this user
      const reports = getReports();
      reports.forEach(report => {
        if (report.assignedTo === userId) {
          updateReport(report.id, { assignedTo: undefined });
        }
      });
      
      const updatedUsers = prevUsers.filter(user => user.id !== userId);
      toast.success('Usuario eliminado correctamente');
      return updatedUsers;
    });
  }, []);

  return (
    <UserContext.Provider value={{ 
      users, 
      setUsers, 
      deleteUser,
      totalUsers,
      activeUsers,
      adminUsers,
      supervisorUsers,
      mobileUsers,
      getFilteredUsers
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};
