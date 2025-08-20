import { useEffect, useRef } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

export default function ListingMap({ location }) {
  const mapRef = useRef(null);
  
  const center = {
    lat: location?.coordinates[1] || 23.8103,
    lng: location?.coordinates[0] || 90.4125
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={location ? 15 : 12}
        ref={mapRef}
      >
        {location && (
          <Marker position={{ lat: location.coordinates[1], lng: location.coordinates[0] }} />
        )}
      </GoogleMap>
    </LoadScript>
  );
}