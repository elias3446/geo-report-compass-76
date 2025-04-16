
import { User, Category, SystemSetting, Report } from '../types/admin';
import { subDays, subHours, subMinutes } from 'date-fns';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Usuario',
    email: 'admin@example.com',
    role: 'admin',
    active: true,
    lastLogin: subHours(new Date(), 2),
    createdAt: subDays(new Date(), 120),
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    name: 'Supervisor Web',
    email: 'supervisor@example.com',
    role: 'supervisor',
    active: true,
    lastLogin: subDays(new Date(), 1),
    createdAt: subDays(new Date(), 30),
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    name: 'Usuario Móvil',
    email: 'movil@example.com',
    role: 'mobile',
    active: true,
    lastLogin: subHours(new Date(), 6),
    createdAt: subDays(new Date(), 15),
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: '4',
    name: 'Segundo Supervisor',
    email: 'supervisor2@example.com',
    role: 'supervisor',
    active: true,
    lastLogin: subDays(new Date(), 3),
    createdAt: subDays(new Date(), 45),
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: '5',
    name: 'Usuario Inactivo',
    email: 'inactivo@example.com',
    role: 'mobile',
    active: false,
    lastLogin: subDays(new Date(), 90),
    createdAt: subDays(new Date(), 180),
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  {
    id: '6',
    name: 'Nuevo Usuario',
    email: 'nuevo@example.com',
    role: 'viewer',
    active: true,
    createdAt: subHours(new Date(), 12),
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
  },
  {
    id: '7',
    name: 'Admin Secundario',
    email: 'admin2@example.com',
    role: 'admin',
    active: true,
    lastLogin: subDays(new Date(), 5),
    createdAt: subDays(new Date(), 100),
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
  }
];

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Alumbrado Público',
    description: 'Problemas con el alumbrado de calles y parques',
    color: '#FFD700',
    icon: 'lightbulb',
    active: true,
    createdAt: subDays(new Date(), 200)
  },
  {
    id: '2',
    name: 'Residuos y Limpieza',
    description: 'Acumulación de basura o falta de limpieza en espacios públicos',
    color: '#00CED1',
    icon: 'trash',
    active: true,
    createdAt: subDays(new Date(), 190)
  },
  {
    id: '3',
    name: 'Vías Públicas',
    description: 'Problemas en calles, aceras o señalización',
    color: '#FF6347',
    icon: 'road',
    active: true,
    createdAt: subDays(new Date(), 180)
  },
  {
    id: '4',
    name: 'Parques y Jardines',
    description: 'Mantenimiento de áreas verdes y juegos infantiles',
    color: '#32CD32',
    icon: 'tree',
    active: true,
    createdAt: subDays(new Date(), 170)
  },
  {
    id: '5',
    name: 'Mobiliario Urbano',
    description: 'Daños en bancos, papeleras u otros elementos urbanos',
    color: '#9370DB',
    icon: 'bench',
    active: true,
    createdAt: subDays(new Date(), 160)
  }
];

// Mock System Settings
export const mockSettings: SystemSetting[] = [
  {
    id: '1',
    key: 'app.name',
    value: 'GeoReport',
    description: 'Nombre de la aplicación',
    group: 'general'
  },
  {
    id: '2',
    key: 'app.logo',
    value: '/logo.png',
    description: 'Ruta del logotipo de la aplicación',
    group: 'general'
  },
  {
    id: '3',
    key: 'map.initialZoom',
    value: '13',
    description: 'Nivel de zoom inicial del mapa',
    group: 'map'
  },
  {
    id: '4',
    key: 'map.center',
    value: '40.416775,-3.703790',
    description: 'Coordenadas iniciales del mapa (lat, lng)',
    group: 'map'
  },
  {
    id: '5',
    key: 'notifications.email',
    value: 'true',
    description: 'Activar notificaciones por email',
    group: 'notifications'
  },
  {
    id: '6',
    key: 'notifications.push',
    value: 'true',
    description: 'Activar notificaciones push',
    group: 'notifications'
  },
  {
    id: '7',
    key: 'reports.requireApproval',
    value: 'true',
    description: 'Requerir aprobación para publicar reportes',
    group: 'reports'
  }
];

// Mock Reports
export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Farola sin luz en Calle Principal',
    description: 'La farola de la esquina entre Calle Principal y Avenida Central lleva 3 días sin funcionar',
    categoryId: '1',
    status: 'pending',
    priority: 'medium',
    location: {
      latitude: 40.416775,
      longitude: -3.703790,
      address: 'Calle Principal 123, Madrid'
    },
    createdBy: '3',
    createdAt: subDays(new Date(), 5),
    updatedAt: subDays(new Date(), 5),
    comments: [
      {
        id: '101',
        reportId: '1',
        userId: '3',
        content: 'Sigue sin funcionar la farola',
        createdAt: subDays(new Date(), 3)
      }
    ]
  },
  {
    id: '2',
    title: 'Acumulación de basura en el parque',
    description: 'Hay una gran cantidad de basura acumulada en el Parque Central, cerca de la zona infantil',
    categoryId: '2',
    status: 'in-progress',
    priority: 'high',
    location: {
      latitude: 40.419974,
      longitude: -3.700337,
      address: 'Parque Central, Madrid'
    },
    createdBy: '3',
    assignedTo: '2',
    createdAt: subDays(new Date(), 3),
    updatedAt: subHours(new Date(), 12),
    comments: [
      {
        id: '201',
        reportId: '2',
        userId: '2',
        content: 'Programada limpieza para mañana',
        createdAt: subHours(new Date(), 12)
      }
    ]
  },
  {
    id: '3',
    title: 'Banco roto en la plaza',
    description: 'Uno de los bancos de la Plaza Mayor tiene varios listones rotos',
    categoryId: '5',
    status: 'resolved',
    priority: 'low',
    location: {
      latitude: 40.415511,
      longitude: -3.707803,
      address: 'Plaza Mayor, Madrid'
    },
    createdBy: '6',
    assignedTo: '4',
    createdAt: subDays(new Date(), 10),
    updatedAt: subDays(new Date(), 1),
    comments: [
      {
        id: '301',
        reportId: '3',
        userId: '4',
        content: 'Reparación completada',
        createdAt: subDays(new Date(), 1)
      }
    ]
  }
];
