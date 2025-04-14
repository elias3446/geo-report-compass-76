
// Helper function to convert location names to coordinates
export const getCoordinates = (locationName: string): [number, number] => {
  // This is a simplified mock implementation
  // In a real application, this would use a geocoding service
  const locationCoordinates: Record<string, [number, number]> = {
    "Av. Reforma 123": [19.427, -99.167],
    "Calle 16 de Septiembre": [19.432, -99.133],
    "Parque Lincoln": [19.428, -99.203],
    "Bosque de Chapultepec": [19.420, -99.181],
    "Insurgentes Sur": [19.373, -99.176],
    "Parque España": [19.419, -99.170],
    "Río Consulado": [19.451, -99.119],
    "Alameda Central": [19.435, -99.143],
    "Avenida Constituyentes": [19.411, -99.189],
    "Calle Madero": [19.433, -99.139],
    "Paseo de la Reforma": [19.427, -99.153],
    "Avenida Insurgentes": [19.408, -99.170],
    "Zócalo": [19.432, -99.133],
    "Periférico Sur": [19.348, -99.189],
    "Colonia Roma": [19.416, -99.166],
    "Calle Durango": [19.418, -99.168],
    "Metro Balderas": [19.427, -99.148],
    "Colonia Condesa": [19.412, -99.178],
    // Add international locations
    "Seattle, WA": [47.6062, -122.3321],
    "San Francisco, CA": [37.7749, -122.4194],
    "Colorado Mountains": [39.5501, -105.7821],
    "Central Iowa": [41.8781, -93.0977],
    "Mount Rainier, WA": [46.8652, -121.7604],
    "Hudson River, NY": [40.7128, -74.0060],
    "Florida Keys": [24.5551, -81.7800],
    "Amazon Rainforest, Brazil": [-3.4653, -62.2159],
    "Los Angeles, CA": [34.0522, -118.2437],
    "Louisiana Bayou": [29.9499, -90.0701],
    "Central Valley, CA": [36.7783, -119.4179],
    "Cape Cod, MA": [41.3804, -70.7214],
    "Iowa Farmlands": [41.5868, -93.6250],
    "Wisconsin Lakes": [44.5133, -89.5744],
    "Rocky Mountains, CO": [39.1911, -106.8175]
  };
  
  // Return exact match if it exists
  if (locationCoordinates[locationName]) {
    return locationCoordinates[locationName];
  }
  
  // For partial matches, check if location contains the key
  for (const [key, coords] of Object.entries(locationCoordinates)) {
    if (
      locationName.includes(key) || 
      key.includes(locationName) ||
      locationName.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(locationName.toLowerCase())
    ) {
      return coords;
    }
  }
  
  // Default to Mexico City center if no match found
  return [19.4326, -99.1332];
};

// Helper function to format coordinates for display
export const formatCoordinates = (coordinates: [number, number]): string => {
  return `${coordinates[0].toFixed(4)}°, ${coordinates[1].toFixed(4)}°`;
};

// Helper function to calculate distance between two sets of coordinates (in km)
export const calculateDistance = (
  coords1: [number, number],
  coords2: [number, number]
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (coords2[0] - coords1[0]) * Math.PI / 180;
  const dLon = (coords2[1] - coords1[1]) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};
