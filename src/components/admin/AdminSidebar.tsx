
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  FileText,
  Users,
  List,
  Folder,
  Settings,
} from "lucide-react";

const menu = [
  { to: "/admin/users", label: "Usuarios", icon: <User className="h-5 w-5"/> },
  { to: "/admin/reports", label: "Reportes", icon: <FileText className="h-5 w-5"/> },
  { to: "/admin/roles", label: "Roles", icon: <Users className="h-5 w-5"/> },
  { to: "/admin/statuses", label: "Estados", icon: <List className="h-5 w-5"/> },
  { to: "/admin/categories", label: "Categorías", icon: <Folder className="h-5 w-5"/> },
  { to: "/admin/settings", label: "Configuración", icon: <Settings className="h-5 w-5"/> },
];

const AdminSidebar = () => {
  const { pathname } = useLocation();
  return (
    <aside className="w-60 min-h-screen bg-background border-r flex flex-col py-6 gap-2">
      <div className="font-bold text-lg mb-8 tracking-tight px-6">Administración</div>
      <nav className="flex flex-col gap-2 flex-1">
        {menu.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-6 py-2 rounded-md transition-colors ${
              pathname.startsWith(item.to)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            } font-medium`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
