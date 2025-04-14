
// Type declarations for React-Leaflet components
declare module 'react-leaflet' {
  import * as React from 'react';
  import * as L from 'leaflet';

  export interface MapContainerProps {
    center: [number, number];
    zoom: number;
    scrollWheelZoom?: boolean;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  }

  export interface MarkerProps {
    position: [number, number];
    icon?: any;
    children?: React.ReactNode;
  }

  export interface TileLayerProps {
    attribution?: string;
    url: string;
  }

  export interface PopupProps {
    children?: React.ReactNode;
  }

  export const MapContainer: React.FC<MapContainerProps>;
  export const TileLayer: React.FC<TileLayerProps>;
  export const Marker: React.FC<MarkerProps>;
  export const Popup: React.FC<PopupProps>;
  export function useMap(): L.Map;
}

// Ampliar definiciones para reportes
interface Report {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  category: string;
  createdAt?: string;
  date?: string;
  location: Location | string;
  tags?: string[];
}

interface Location {
  name?: string;
  lat?: number | string;
  lng?: number | string;
  latitude?: number | string;
  longitude?: number | string;
}
