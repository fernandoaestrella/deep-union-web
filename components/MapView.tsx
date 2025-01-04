import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
// delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

interface UserData {
  requests: Record<string, boolean>;
  offers: Record<string, boolean>;
  description: {
    isMale: boolean;
    isTaller: boolean;
    isOlder: boolean;
    hasFacialHair: boolean;
    hasLongHair: boolean;
    wearsGlasses: boolean;
    upperColor: string;
    lowerColor: string;
  };
}

interface MapViewProps {
  userCoordinates: string; // Changed to string
}

const CenterMapButton: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  return (
    <button
      className="absolute left-2 top-2 z-[1000] rounded bg-white p-2 shadow"
      onClick={() => map.setView(center, 13)}
    >
      Center Map
    </button>
  );
};

const MapView: React.FC<MapViewProps> = ({ userCoordinates }) => {
  const [nearbyUsers, setNearbyUsers] = useState<Array<{ id: string; coordinates: [number, number]; userData: UserData }>>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: string; userData: UserData } | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);

  // Function to convert coordinates string to [number, number]
  const convertCoordinates = (coords: string): [number, number] => {
    // Detect if coordinates are in DMS format or decimal
    if (coords.includes('°')) {
      // Handle DMS format
      // TODO: Implement DMS to decimal conversion
      const [lat, latDMS, latDir] = coords.split(' ');
      const [lng, lngDMS, lngDir] = coords.split(' ').reverse();
      const latDecimal = parseFloat(latDMS) + (parseFloat(lat.replace(',', '.')) / 60);
      const lngDecimal = parseFloat(lngDMS) + (parseFloat(lng.replace(',', '.')) / 60);
      const latFinal = latDir === 'N'? latDecimal : -latDecimal;
      const lngFinal = lngDir === 'E'? lngDecimal : -lngDecimal;
      return [latFinal, lngFinal];
    } else
    {
      // Handle decimal format
      const [lat, lng] = coords.split(',').map(Number);
      return [lat, lng];
    }
  };

  // Fetch nearby users
  useEffect(() => {
    const fetchNearbyUsers = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch('/api/nearby-users');
        const data = await response.json();
        setNearbyUsers(data);
      } catch (error) {
        console.error('Error fetching nearby users:', error);
      }
    };

    fetchNearbyUsers();
  }, []); // Empty dependency array means this effect runs once on mount

  // Update map center when userCoordinates change
  useEffect(() => {
    if (userCoordinates) {
      const convertedCoords = convertCoordinates(userCoordinates);
      setMapCenter(convertedCoords);
    }
  }, [userCoordinates]);


  return (
    <div className="mt-8">
      <h4 className="mb-4 text-xl font-semibold">See a map to find users near you</h4>
      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <CenterMapButton center={mapCenter} />
          {nearbyUsers.map((user) => (
            <Marker
              key={user.id}
              position={user.coordinates}
              eventHandlers={{
                click: () => setSelectedUser({ id: user.id, userData: user.userData }),
              }}
            >
              <Popup>User {user.id}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {selectedUser && (
        <div className="mt-4 rounded bg-gray-100 p-4">
          <h5 className="mb-2 text-lg font-medium">Selected User Data:</h5>
          <pre className="max-h-60 overflow-auto rounded bg-white p-3">
            {JSON.stringify(selectedUser.userData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default MapView;

