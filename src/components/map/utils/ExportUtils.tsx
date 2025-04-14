
import { toast } from "sonner";
import { getCoordinates } from "./LocationUtils";

export const exportReportsToCSV = (filteredReports: any[]) => {
  if (filteredReports.length === 0) {
    toast.error("No hay reportes para exportar");
    return;
  }
  
  // Define CSV headers based on report properties
  const headers = [
    "ID", 
    "Título", 
    "Descripción", 
    "Estado", 
    "Prioridad", 
    "Categoría", 
    "Ubicación", 
    "Fecha de Creación", 
    "Latitud", 
    "Longitud"
  ].join(",");
  
  // Convert each report to CSV row
  const csvRows = filteredReports.map(report => {
    const coordinates = getCoordinates(report.location);
    // Check if properties exist before accessing them to avoid undefined errors
    const safeTitle = report.title ? report.title.replace(/"/g, '""') : "";
    const safeDescription = report.description ? report.description.replace(/"/g, '""') : "";
    const safeLocation = report.location ? report.location.replace(/"/g, '""') : "";
    
    return [
      report.id || "",
      `"${safeTitle}"`,
      `"${safeDescription}"`,
      report.status || "",
      report.priority || "",
      report.category || "",
      `"${safeLocation}"`,
      report.createdAt ? new Date(report.createdAt).toISOString() : "",
      coordinates[0],
      coordinates[1]
    ].join(",");
  });
  
  // Combine headers and rows
  const csvContent = [headers, ...csvRows].join("\n");
  
  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  // Configure link for download
  link.setAttribute("href", url);
  link.setAttribute("download", getExportFileName(filteredReports));
  
  // Add to document, click to download, then remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Notify user
  toast.success(`Exportación completada: ${getExportFileName(filteredReports)}`);
};

const getExportFileName = (reports: any[], filterStatus?: string, selectedCategories?: string[], selectedCategory?: string | null) => {
  let fileName = "todos_los_reportes.csv";
  
  if (filterStatus) {
    if (filterStatus === "open") fileName = "reportes_abiertos.csv";
    else if (filterStatus === "progress") fileName = "reportes_en_progreso.csv";
    else if (filterStatus === "resolved") fileName = "reportes_resueltos.csv";
    else fileName = "todos_los_reportes.csv";
  } else if (selectedCategories && selectedCategories.length > 0) {
    fileName = `reportes_${selectedCategories.join('_')}.csv`;
  } else if (selectedCategory) {
    fileName = `reportes_${selectedCategory.toLowerCase().replace(/\s+/g, '_')}.csv`;
  }
  
  return fileName;
};
