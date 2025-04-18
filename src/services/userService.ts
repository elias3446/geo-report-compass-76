import { User, UserRole } from '../types/admin';

const mockUsers: User[] = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@example.com",
    role: "admin" as UserRole,
    active: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date("2024-03-15"),
  },
  {
    id: "2",
    name: "Supervisor Principal",
    email: "supervisor@example.com",
    role: "supervisor" as UserRole,
    active: true,
    createdAt: new Date("2024-02-01"),
    lastLogin: new Date("2024-03-14"),
  }
];

export const mockUser: User = {
  id: "1",
  name: "Administrador",
  email: "admin@example.com",
  role: "admin" as UserRole,
  active: true,
  createdAt: new Date(),
  lastLogin: null
};

// Simulamos un store local de usuarios para desarrollo
let users: User[] = [
  {
    id: '1',
    name: 'Admin Usuario',
    email: 'admin@georeport.com',
    role: 'admin',
    active: true,
    createdAt: new Date(),
    lastLogin: new Date(),
  },
  {
    id: '2',
    name: 'Supervisor Test',
    email: 'supervisor@georeport.com',
    role: 'supervisor',
    active: true,
    createdAt: new Date(),
    lastLogin: new Date(),
  },
];

export const getUsers = (): User[] => {
  return users;
};

export const addUser = (user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): User => {
  const newUser = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date(),
    lastLogin: null,
  };
  users.push(newUser);
  return newUser;
};

export const updateUser = (id: string, userData: Partial<User>): User | null => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...userData };
  return users[index];
};

export const deleteUser = (id: string): boolean => {
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  return users.length < initialLength;
};

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};
