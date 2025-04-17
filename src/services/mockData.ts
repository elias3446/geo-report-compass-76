import { User, Category, SystemSetting, Report, ReportStatus } from '../types/admin';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Usuario',
    email: 'admin@example.com',
    role: 'admin',
    active: true,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-03-15'),
    avatar: '/avatars/admin.jpg'
  },
  {
    id: '2',
    name: 'Supervisor Web',
    email: 'supervisor@example.com',
    role: 'supervisor',
    active: true,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-03-20'),
    avatar: '/avatars/supervisor.jpg'
  },
  {
    id: '3',
    name: 'Usuario Móvil Ciudadano',
    email: 'mobile.citizen@example.com',
    role: 'mobile',
    active: true,
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date('2024-03-25'),
    mobileUserType: 'citizen',
    avatar: '/avatars/mobile-citizen.jpg'
  },
  {
    id: '4',
    name: 'Usuario Móvil Técnico',
    email: 'mobile.technician@example.com',
    role: 'mobile',
    active: false,
    createdAt: new Date('2024-02-15'),
    lastLogin: new Date('2024-03-30'),
    mobileUserType: 'technician',
    avatar: '/avatars/mobile-technician.jpg'
  },
  {
    id: '5',
    name: 'Visualizador de Reportes',
    email: 'viewer@example.com',
    role: 'viewer',
    active: true,
    createdAt: new Date('2024-03-01'),
    lastLogin: null,
    avatar: '/avatars/viewer.jpg'
  },
];

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Alumbrado Público',
    description: 'Problemas relacionados con el alumbrado público',
    color: '#FFA000',
    icon: 'lightbulb',
    active: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cat-2',
    name: 'Recolección de Basura',
    description: 'Problemas relacionados con la recolección de basura',
    color: '#4CAF50',
    icon: 'trash',
    active: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cat-3',
    name: 'Estado de las Calles',
    description: 'Problemas relacionados con el estado de las calles',
    color: '#F44336',
    icon: 'road',
    active: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cat-4',
    name: 'Parques y Jardines',
    description: 'Problemas relacionados con parques y jardines',
    color: '#8BC34A',
    icon: 'tree',
    active: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cat-5',
    name: 'Mobiliario Urbano',
    description: 'Problemas relacionados con el mobiliario urbano',
    color: '#607D8B',
    icon: 'bench',
    active: true,
    createdAt: new Date('2024-01-01')
  },
];

export const mockSettings: SystemSetting[] = [
  {
    id: 'setting-1',
    key: 'app_name',
    value: 'City Services App',
    description: 'Nombre de la aplicación',
    group: 'general'
  },
  {
    id: 'setting-2',
    key: 'contact_email',
    value: 'contact@example.com',
    description: 'Email de contacto',
    group: 'general'
  },
  {
    id: 'setting-3',
    key: 'api_url',
    value: 'https://api.example.com',
    description: 'URL de la API',
    group: 'api'
  },
  {
    id: 'setting-4',
    key: 'map_provider',
    value: 'Google Maps',
    description: 'Proveedor de mapas',
    group: 'map'
  },
];

export const mockReports: Report[] = [
  {
    id: 'rep-1',
    title: 'Farola dañada',
    description: 'La farola de la calle principal no funciona',
    status: 'pending',
    category: 'cat-1',
    location: {
      name: 'Calle Principal 123',
      lat: 40.416775,
      lng: -3.703790
    },
    date: new Date('2024-03-01'),
    tags: ['urgent', 'night'],
    priority: 'high',
    updatedAt: new Date('2024-03-15')
  },
  {
    id: 'rep-2',
    title: 'Contenedor de basura lleno',
    description: 'El contenedor de basura en la esquina está lleno y desbordando',
    status: 'in-progress',
    category: 'cat-2',
    location: {
      name: 'Esquina Calle A y Calle B',
      lat: 40.416775,
      lng: -3.703790
    },
    date: new Date('2024-03-05'),
    tags: ['garbage', 'overflow'],
    priority: 'medium',
    updatedAt: new Date('2024-03-20')
  },
  {
    id: 'rep-3',
    title: 'Bache en la carretera',
    description: 'Hay un bache grande en la carretera que dificulta la circulación',
    status: 'resolved',
    category: 'cat-3',
    location: {
      name: 'Carretera XYZ Km 5',
      lat: 40.416775,
      lng: -3.703790
    },
    date: new Date('2024-03-10'),
    tags: ['road', 'damage'],
    priority: 'high',
    updatedAt: new Date('2024-03-25')
  },
  {
    id: 'rep-4',
    title: 'Árbol caído en el parque',
    description: 'Un árbol se ha caído en el parque debido a la tormenta',
    status: 'approved',
    category: 'cat-4',
    location: {
      name: 'Parque Central',
      lat: 40.416775,
      lng: -3.703790
    },
    date: new Date('2024-03-15'),
    tags: ['tree', 'storm'],
    priority: 'medium',
    updatedAt: new Date('2024-03-30')
  },
  {
    id: 'rep-5',
    title: 'Banco roto en la plaza',
    description: 'Un banco en la plaza principal está roto y necesita reparación',
    status: 'rejected',
    category: 'cat-5',
    location: {
      name: 'Plaza Principal',
      lat: 40.416775,
      lng: -3.703790
    },
    date: new Date('2024-03-20'),
    tags: ['bench', 'broken'],
    priority: 'low',
    updatedAt: new Date('2024-04-01')
  },
];
