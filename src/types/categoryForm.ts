
import { Category } from './admin';

export interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Category, 'id' | 'createdAt'>) => void;
  initialData?: Category;
  currentUser?: { id: string; name: string };
}

export const iconOptions = [
  { value: 'lightbulb', label: 'Bombilla' },
  { value: 'trash', label: 'Basura' },
  { value: 'road', label: 'Carretera' },
  { value: 'tree', label: 'Árbol' },
  { value: 'bench', label: 'Banco' },
  { value: 'water', label: 'Agua' },
  { value: 'construction', label: 'Construcción' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'category', label: 'Categoría' }
];
