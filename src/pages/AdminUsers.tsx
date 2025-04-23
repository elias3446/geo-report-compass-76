
import React, { useState } from "react";
import { useUsers } from "@/contexts/UserContext";
import UserTable from "@/components/admin/UserTable";
import UserForm from "@/components/admin/UserForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createUser } from "@/services/adminService";

const AdminUsers = () => {
  const { users, setUsers } = useUsers();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateUser = (data: any) => {
    const nuevo = createUser(data);
    setUsers(prev => [...prev, nuevo]);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestión de Usuarios</CardTitle>
        <Button variant="default" onClick={() => setIsFormOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Nuevo Usuario
        </Button>
      </CardHeader>
      <CardContent>
        <div className="max-h-[600px] overflow-auto">
          <UserTable filteredUsers={users} onEdit={() => {}} />
        </div>
      </CardContent>
      <UserForm open={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleCreateUser} />
    </Card>
  );
};

export default AdminUsers;
