
// Expanded list of sample locations to support more reports
export const sampleLocations: Record<string, [number, number]> = {
  "Av. Reforma 123": [19.4326, -99.1332],
  "Calle 16 de Septiembre": [19.4328, -99.1386],
  "Parque Lincoln": [19.4284, -99.2007],
  "Bosque de Chapultepec": [19.4120, -99.1946],
  "Insurgentes Sur": [19.3984, -99.1713],
  "Centro Histórico": [19.4326, -99.1332],
  "Paseo de la Reforma": [19.4284, -99.1557],
  "Polanco": [19.4284, -99.1907],
  "Condesa": [19.4128, -99.1732],
  "Roma Norte": [19.4195, -99.1599],
  "Coyoacán": [19.3429, -99.1609],
  "Santa Fe": [19.3659, -99.2873],
  "Xochimilco": [19.2571, -99.1050],
  "Zócalo": [19.4326, -99.1332],
  "Alameda Central": [19.4362, -99.1443],
  "Bellas Artes": [19.4352, -99.1413],
  "Plaza Garibaldi": [19.4396, -99.1386],
  "Torre Latinoamericana": [19.4339, -99.1406],
  "Universidad Nacional": [19.3324, -99.1868],
  "Perisur": [19.3031, -99.1914],
  "Aeropuerto": [19.4360, -99.0719],
  "Estadio Azteca": [19.3031, -99.1504],
  "Basílica de Guadalupe": [19.4849, -99.1177],
  "Six Flags": [19.2957, -99.2159],
  "Teotihuacán": [19.6926, -98.8444]
};

// Helper function to generate coordinates for locations not in our predefined list
export const generateRandomCoordinates = (locationName: string): [number, number] => {
  // Use location name to generate a deterministic position based on hash
  const hash = locationName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Create a position within Mexico City area (approximately)
  const baseLat = 19.4;
  const baseLng = -99.15;
  const latOffset = (hash % 200) / 1000; // +/- 0.2 degrees
  const lngOffset = ((hash * 13) % 200) / 1000;
  
  return [
    baseLat + latOffset - 0.1,
    baseLng + lngOffset - 0.1
  ];
};

// Default location (Mexico City)
export const defaultCenter: [number, number] = [19.4326, -99.1332];

// Get coordinates for a location
export const getCoordinates = (location: string): [number, number] => {
  if (!location) return defaultCenter;
  
  // First check if it's already in lat,lng format from an edited location
  const coordsRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)\s*(\(.*\))?$/;
  const match = location.match(coordsRegex);
  
  if (match) {
    // Location is in format "lat,lng (locationName)" or just "lat,lng"
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[3]);
    if (!isNaN(lat) && !isNaN(lng)) {
      console.log("Extracted coordinates from location string:", [lat, lng]);
      return [lat, lng];
    }
  }
  
  // Try to extract coordinates from any string containing lat/lng
  const anyNumbersRegex = /(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)/;
  const numbersMatch = location.match(anyNumbersRegex);
  
  if (numbersMatch) {
    const lat = parseFloat(numbersMatch[1]);
    const lng = parseFloat(numbersMatch[3]);
    if (!isNaN(lat) && !isNaN(lng)) {
      console.log("Extracted coordinates from partial match:", [lat, lng]);
      return [lat, lng];
    }
  }
  
  // Check if it's in predefined locations
  if (location in sampleLocations) {
    console.log("Found location in predefined locations:", location);
    return sampleLocations[location];
  }
  
  // Extract just the location name if it's in parentheses
  const nameMatch = location.match(/\(([^)]+)\)/);
  if (nameMatch && nameMatch[1] && sampleLocations[nameMatch[1]]) {
    console.log("Found location name in parentheses:", nameMatch[1]);
    return sampleLocations[nameMatch[1]];
  }
  
  // Generate deterministic coordinates for unknown locations
  console.log("Generating coordinates for unknown location:", location);
  return generateRandomCoordinates(location);
};
