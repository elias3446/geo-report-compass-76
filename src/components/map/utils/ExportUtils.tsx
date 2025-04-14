
import { toast } from "sonner";
import { getCoordinates } from "./LocationUtils";

export const exportReportsToCSV = (filteredReports: any[]) => {
  try {
    if (filteredReports.length === 0) {
      toast.error("No hay reportes para exportar");
      return;
    }
    
    // Define CSV headers based on report properties
    const headers = [
      "ID", 
      "Título", 
      "Estado", 
      "Prioridad", 
      "Categoría", 
      "Ubicación", 
      "Fecha de Creación", 
      "Latitud", 
      "Longitud",
      "Etiquetas"
    ].join(",");
    
    // Convert each report to CSV row
    const csvRows = filteredReports.map(report => {
      // Extraer coordenadas
      let lat = "", lng = "";
      
      try {
        // Intentar obtener coordenadas de diferentes formatos posibles
        if (typeof report.location === 'object' && report.location !== null) {
          if ('lat' in report.location && 'lng' in report.location) {
            lat = report.location.lat?.toString() || "";
            lng = report.location.lng?.toString() || "";
          } else if ('latitude' in report.location && 'longitude' in report.location) {
            lat = report.location.latitude?.toString() || "";
            lng = report.location.longitude?.toString() || "";
          }
        } else if (typeof report.location === 'string') {
          const coords = getCoordinates(report.location);
          lat = coords[0]?.toString() || "";
          lng = coords[1]?.toString() || "";
        }
      } catch (error) {
        console.warn("Error al extraer coordenadas:", error);
      }
      
      // Verificar y sanitizar datos
      const safeTitle = report.title ? report.title.replace(/"/g, '""') : "";
      const safeLocation = typeof report.location === 'string' 
        ? report.location.replace(/"/g, '""') 
        : (report.location?.name || "").replace(/"/g, '""');
      
      // Manejar etiquetas
      const tags = Array.isArray(report.tags) 
        ? report.tags.join(';')
        : "";
      
      // Obtener fecha en el formato adecuado
      const date = report.createdAt 
        ? new Date(report.createdAt).toISOString().split('T')[0]
        : (report.date ? new Date(report.date).toISOString().split('T')[0] : "");
      
      return [
        report.id || "",
        `"${safeTitle}"`,
        report.status || "",
        report.priority || "",
        report.category || "",
        `"${safeLocation}"`,
        date,
        lat,
        lng,
        `"${tags}"`
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
    URL.revokeObjectURL(url);
    
    // Notify user
    toast.success(`Exportación completada: ${getExportFileName(filteredReports)}`);
    return true;
  } catch (error) {
    console.error("Error en la exportación:", error);
    toast.error("Error al generar el archivo CSV", { 
      description: "No se pudo completar la exportación. Por favor, inténtelo nuevamente." 
    });
    return false;
  }
};

const getExportFileName = (reports: any[], filterStatus?: string, selectedCategories?: string[], selectedCategory?: string | null) => {
  const date = new Date().toISOString().slice(0, 10);
  let fileName = `reportes_todos_${date}.csv`;
  
  if (filterStatus) {
    if (filterStatus === "open") fileName = `reportes_abiertos_${date}.csv`;
    else if (filterStatus === "progress") fileName = `reportes_en_progreso_${date}.csv`;
    else if (filterStatus === "resolved") fileName = `reportes_resueltos_${date}.csv`;
    else fileName = `reportes_todos_${date}.csv`;
  } else if (selectedCategories && selectedCategories.length > 0) {
    fileName = `reportes_${selectedCategories.join('_')}_${date}.csv`;
  } else if (selectedCategory) {
    fileName = `reportes_${selectedCategory.toLowerCase().replace(/\s+/g, '_')}_${date}.csv`;
  }
  
  return fileName;
};
