
import { Popup } from "react-leaflet";

interface Report {
  id: string;
  title: string;
  status: string;
  location: string;
  category: string;
  priority: string;
  createdAt: string;
  description?: string;
}

interface ReportPopupProps {
  report: Report;
}

const ReportPopup = ({ report }: ReportPopupProps) => {
  return (
    <Popup>
      <div className="p-1">
        <h3 className="font-semibold">{report.title}</h3>
        <p className="text-sm mt-1">Estado: {report.status}</p>
        <p className="text-sm">Ubicación: {report.location}</p>
        <p className="text-sm">Categoría: {report.category}</p>
        <p className="text-sm">Prioridad: {report.priority}</p>
        <p className="text-sm">Fecha: {new Date(report.createdAt).toLocaleDateString()}</p>
      </div>
    </Popup>
  );
};

export default ReportPopup;
