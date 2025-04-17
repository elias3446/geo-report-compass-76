
// Mantener las importaciones y definiciones anteriores
import { v4 as uuidv4 } from 'uuid';

export interface AdminActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
  relatedItemId?: string;
}

// Almacenamiento en memoria para las actividades
const adminActivities: AdminActivity[] = [];

// Función para registrar una nueva actividad administrativa
export const registerAdminActivity = (activity: Omit<AdminActivity, 'id' | 'timestamp'>) => {
  const newActivity: AdminActivity = {
    id: uuidv4(),
    ...activity,
    timestamp: new Date().toISOString()
  };
  
  adminActivities.unshift(newActivity); // Añadimos al inicio para tener las más recientes primero
  
  // Limitamos a 50 actividades para evitar problemas de memoria
  if (adminActivities.length > 50) {
    adminActivities.pop();
  }
  
  // Emitimos un evento para notificar sobre la nueva actividad
  const event = new CustomEvent('admin-activity-created', { detail: newActivity });
  document.dispatchEvent(event);
  
  return newActivity;
};

// Función para obtener todas las actividades administrativas
export const getAdminActivities = (): AdminActivity[] => {
  return [...adminActivities];
};

// Función para obtener actividades de un usuario específico
export const getActivitiesByUserId = (userId: string): AdminActivity[] => {
  return adminActivities.filter(
    activity => activity.userId === userId || activity.relatedItemId === userId
  );
};

// Función para obtener actividades de una categoría específica
export const getActivitiesByCategoryId = (categoryId: string): AdminActivity[] => {
  return adminActivities.filter(activity => activity.relatedItemId === categoryId);
};

// Función para obtener actividades de un reporte específico
export const getActivitiesByReportId = (reportId: string): AdminActivity[] => {
  return adminActivities.filter(activity => activity.relatedItemId === reportId);
};

// Función para formatear una actividad administrativa para el dashboard
export const formatAdminActivityForDashboard = (activity: AdminActivity): {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  user: string;
} => {
  return {
    id: activity.id,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    time: activity.timestamp,
    user: activity.userName
  };
};
