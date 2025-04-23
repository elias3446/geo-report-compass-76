
import React from "react";
import { Outlet, Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminUsers from "./AdminUsers";
import AdminReports from "./AdminReports";
import AdminRoles from "./AdminRoles";
import AdminStatuses from "./AdminStatuses";
import AdminCategories from "./AdminCategories";
import AdminSettings from "./AdminSettings";

const AdminLayout = () => (
  <div className="flex min-h-screen">
    <AdminSidebar />
    <div className="flex-1 p-6 overflow-auto bg-muted">
      <Outlet />
    </div>
  </div>
);

const Admin = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route index element={<Navigate to="users" />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="reports" element={<AdminReports />} />
      <Route path="roles" element={<AdminRoles />} />
      <Route path="statuses" element={<AdminStatuses />} />
      <Route path="categories" element={<AdminCategories />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>
  </Routes>
);

export default Admin;
