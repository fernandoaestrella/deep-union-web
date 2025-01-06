import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import prisma from '@/lib/prisma'

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
  userCoordinates: string;
  userData: UserData | null; // Add this line
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

const MapView: React.FC<MapViewProps> = ({ userCoordinates, userData }) => {
  const [nearbyUsers, setNearbyUsers] = useState<Array<{ id: string; coordinates: [number, number]; userData: UserData }>>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: string; userData: UserData } | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);

  const calculateMatches = (currentUser: UserData | null, selectedUser: UserData): number => {
    if (!currentUser) return 0;
    let matches = 0;
    const needs = [ 'Preservation', 'Gratification', 'Definition', 'Acceptance', 'Expression', 'Reflection', 'Knowledge'];

    needs.forEach(need => {
      if (currentUser.requests[need] && selectedUser.offers[need]) matches++;
      if (currentUser.offers[need] && selectedUser.requests[need]) matches++;
    });

    return matches;
  };

  // Function to convert coordinates string to [number, number]
  const convertCoordinates = (coords: string): [number, number] => {
    // Detect if coordinates are in DMS format or decimal
    if (coords.includes('°')) {
      // Convert DMS to decimal
      const dmsToDecimal = (dms: string, direction: string): number => {
        const parts = dms.split(/[°'"]+/).map(part => parseFloat(part.trim()));
        let decimal = parts[0] + (parts[1] || 0) / 60 + (parts[2] || 0) / 3600;
        if (direction === 'S' || direction === 'W') {
          decimal = -decimal;
        }
        return parseFloat(decimal.toFixed(6)); // Round to 6 decimal places
      };

      const [latDMS, lngDMS] = coords.split(/\s+/);
      const latDirection = latDMS.slice(-1);
      const lngDirection = lngDMS.slice(-1);

      const latDecimal = dmsToDecimal(latDMS, latDirection);
      const lngDecimal = dmsToDecimal(lngDMS, lngDirection);
      return [latDecimal, lngDecimal];
    } else {
      // Handle decimal format
      const [lat, lng] = coords.split(',').map(Number);
      return [lat, lng];
    }
  };


  // Fetch nearby users
  useEffect(() => {
    const fetchNearbyUsers = async () => {
      try {
        const response = await fetch('/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch nearby users');
        }

        const data = await response.json();
        console.log('Fetched users:', data);

        // Assuming the API returns an array of users with the correct structure
        // You might need to transform the data if the structure is different
        setNearbyUsers(data.map(user => ({
          id: user.id,
          coordinates: convertCoordinates(user.coordinates),
          userData: user.userData
        })));
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
      <h5>Click on markers to see their user data below</h5>
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
      {selectedUser && userData && (
        <div className="mt-4 rounded bg-gray-100 p-4">
          <div className="mb-4">
            <h5 className="mb-2 text-lg font-medium">Compatibility with Selected User:</h5>
            <p className="text-xl font-bold">
              Matches: {calculateMatches(userData, selectedUser.userData)} / 14
            </p>
          </div>
          <h5 className="mb-2 text-lg font-medium">Selected User Data:</h5>
          <pre className="max-h-60 overflow-auto rounded bg-white p-3">
            {JSON.stringify(selectedUser.userData, null, 2)}
          </pre>
        </div>
      )}
      {selectedUser && !userData && (
        <div className="mt-4 rounded bg-gray-100 p-4">
          <h5 className="mb-2 text-lg font-medium">Compatibility with Selected User:</h5>
          <p className="">Submit your user data to see a comparison with the selected user here</p>
          <p className="text-xl font-bold">
              Matches: 0 / 14
            </p>
          <br />
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

