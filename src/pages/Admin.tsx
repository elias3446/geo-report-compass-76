
import React from "react";
import { Outlet, Route, Routes, Navigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminUsers from "./AdminUsers";
import AdminReports from "./AdminReports";
import AdminRoles from "./AdminRoles";
import AdminStatuses from "./AdminStatuses";
import AdminCategories from "./AdminCategories";
import AdminSettings from "./AdminSettings";
import AppLayout from "@/components/layout/AppLayout";

// Layout específico para las páginas de administración que incluye la barra lateral
const AdminLayout = () => (
  <div className="flex bg-muted/30 min-h-[calc(100vh-4rem)]">
    <AdminSidebar />
    <div className="flex-1 p-6 overflow-auto">
      <Outlet />
    </div>
  </div>
);

const Admin = () => (
  <AppLayout>
    <Routes>
      <Route element={<AdminLayout />}>
        {/* Redirigir /admin a /admin/users por defecto */}
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="roles" element={<AdminRoles />} />
        <Route path="statuses" element={<AdminStatuses />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  </AppLayout>
);

export default Admin;
