
import L from 'leaflet';

export const createDraggableMarker = (
  map: L.Map,
  position: [number, number],
  onDragEnd: (lat: number, lng: number) => void
): L.Marker => {
  // Create a new marker
  const marker = L.marker(position, {
    draggable: true,
    icon: new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
  }).addTo(map);

  // Add popup
  marker.bindPopup(`
    <div class="text-sm">
      <p>Arrastra el marcador para actualizar la ubicación</p>
      <p class="text-muted-foreground mt-1">
        Lat: ${position[0].toFixed(6)}, 
        Lng: ${position[1].toFixed(6)}
      </p>
    </div>
  `);

  // Add drag event handler
  marker.on('dragend', function(e) {
    const latLng = marker.getLatLng();
    marker.setPopupContent(`
      <div class="text-sm">
        <p>Arrastra el marcador para actualizar la ubicación</p>
        <p class="text-muted-foreground mt-1">
          Lat: ${latLng.lat.toFixed(6)}, 
          Lng: ${latLng.lng.toFixed(6)}
        </p>
      </div>
    `);
    onDragEnd(latLng.lat, latLng.lng);
  });

  return marker;
};
