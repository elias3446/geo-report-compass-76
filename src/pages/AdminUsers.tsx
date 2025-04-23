
import React from "react";
import { useUsers } from "@/contexts/UserContext";
import UserTable from "@/components/admin/UserTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AdminUsers = () => {
  const { users } = useUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[600px] overflow-auto">
          <UserTable filteredUsers={users} onEdit={() => {}} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUsers;
