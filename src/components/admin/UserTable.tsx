
import React from 'react';
import { format } from 'date-fns';
import { User } from '../../types/admin';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EditIcon, Trash2Icon, MoreHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const roleColors = {
  admin: 'bg-red-100 text-red-800 border-red-200',
  supervisor: 'bg-blue-100 text-blue-800 border-blue-200',
  mobile: 'bg-green-100 text-green-800 border-green-200',
  viewer: 'bg-gray-100 text-gray-800 border-gray-200'
};

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  if (!users.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No se encontraron usuarios.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Último Acceso</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name.split(' ').map(name => name[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline" className={roleColors[user.role]}>
                  {user.role === 'admin' && 'Administrador'}
                  {user.role === 'supervisor' && 'Supervisor'}
                  {user.role === 'mobile' && 'Usuario Móvil'}
                  {user.role === 'viewer' && 'Visualizador'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.active ? "success" : "destructive"}>
                  {user.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell>
                {user.lastLogin 
                  ? format(user.lastLogin, 'dd/MM/yyyy HH:mm')
                  : 'Nunca'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <EditIcon className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(user.id)} className="text-destructive">
                      <Trash2Icon className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
