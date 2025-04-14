
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix the issue with Leaflet icons in React
const fixLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

// Initialize the icon fix
fixLeafletIcon();

// Create custom icons for different report statuses
export const getReportIcon = (status: string) => {
  // Define colors for different statuses
  const getIconColor = () => {
    switch (status) {
      case "Open":
        return "red";
      case "In Progress":
        return "yellow";
      case "Resolved":
        return "green";
      default:
        return "blue";
    }
  };

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${getIconColor()}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};
