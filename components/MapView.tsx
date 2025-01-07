import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import prisma from '@/lib/prisma'

// Add this new custom icon setup
const customIcon = new L.Icon({
  iconUrl: '/images/marker.svg',
  iconRetinaUrl: '/images/marker.svg',
  shadowUrl: '/images/marker-shadow.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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

interface User {
  id: string;
  coordinates: string;
  userData: UserData; // Replace 'any' with a more specific type if possible
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

  const generateCompatibilityDescription = (currentUser: UserData | null, selectedUser: UserData): string => {
    if (!currentUser) return "Please submit your user data to see compatibility details.";

    const needs = ['Preservation', 'Gratification', 'Definition', 'Acceptance', 'Expression', 'Reflection', 'Knowledge'];
    let description = "";

    needs.forEach(need => {
      if (currentUser.offers[need] && selectedUser.requests[need]) {
        description += `• You can offer ${need} to the selected user!\n`;
      }
      if (currentUser.requests[need] && selectedUser.offers[need]) {
        description += `• You can request ${need} from the selected user!\n`;
      }
    });

    return description.trim() || "No direct matches found.";
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

  const getMarkerColor = (matches: number): string => {
    if (matches >= 10) return 'green';
    if (matches >= 5) return 'yellow';
    return ''; // Default orange
  };

  const createCustomIcon = (color: string) => {
    return L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="marker-icon ${color}" width="25" height="41">
               <path d="M12 0c-4.4 0-8 3.6-8 8 0 5.4 8 13 8 13s8-7.6 8-13c0-4.4-3.6-8-8-8zm0 11c-1.6 0-3-1.4-3-3s1.4-3 3-3 3 1.4 3 3-1.4 3-3 3z"/>
             </svg>`,
      className: '',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
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

        const data: User[] = await response.json();
        console.log('Fetched users:', data);

        // Assuming the API returns an array of users with the correct structure
        // You might need to transform the data if the structure is different
        setNearbyUsers(data.map((user: User) => ({
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
      <h5>Click on markers to see their user data below.</h5>
      <br />
      <h5 className="text-sm">Marker Color Legend:</h5>
      <ul className="list-disc pl-4 text-xs">
        <li className="mb-1 text-green-600">Green: 10 or more matches</li>
        <li className="mb-1 text-yellow-400">Yellow: 9 to 5 matches</li>
        <li className="mb-1 text-orange-500">Orange: 4 or less matches</li>
      </ul>
      
      <br />

      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <CenterMapButton center={mapCenter} />
          {nearbyUsers.map((user) => {
            const matches = calculateMatches(userData, user.userData);
            const markerColor = getMarkerColor(matches);
            return (
              <Marker
                key={user.id}
                position={user.coordinates}
                icon={createCustomIcon(markerColor)}
                eventHandlers={{
                  click: () => setSelectedUser({ id: user.id, userData: user.userData }),
                }}
              >
                <Popup>User {user.id} (Matches: {matches} out of 14)</Popup>
              </Marker>
            );
          })}

        </MapContainer>
      </div>
      {selectedUser && userData && (
        <div className="mt-4 rounded bg-gray-100 p-4">
          <h5 className="mb-2 text-lg font-medium">Compatibility with Selected User:</h5>
          <p className="text-xl">
            Matches: {calculateMatches(userData, selectedUser.userData)} / 14
          </p>

          <br />
          
          <h5 className="mb-2 text-lg font-medium">Compatibility Description</h5>
          <pre className="whitespace-pre-wrap rounded bg-white p-3">
            {generateCompatibilityDescription(userData, selectedUser.userData)}
          </pre>

          <br />

    <h5 className="mb-2 text-lg font-medium">Selected User&apos;s Visual Description</h5>
    <div className="flex flex-wrap gap-2">
      {[
        { src: `${selectedUser.userData.description.isMale ? 'male' : 'female'}.png`, alt: "Gender", title: selectedUser.userData.description.isMale ? "Male" : "Female" },
        { src: `${selectedUser.userData.description.isTaller ? 'tall' : 'small'}.png`, alt: "Height", title: selectedUser.userData.description.isTaller ? "Taller" : "Shorter" },
        { src: `${selectedUser.userData.description.isOlder ? 'old' : 'young'}.png`, alt: "Age", title: selectedUser.userData.description.isOlder ? "Older" : "Younger" },
        ...(selectedUser.userData.description.isMale 
          ? [{ src: `${selectedUser.userData.description.hasFacialHair ? 'male_bearded' : 'male_shaved'}.png`, alt: "Facial Hair", title: selectedUser.userData.description.hasFacialHair ? "Has Facial Hair" : "No Facial Hair" }]
          : [{ src: `${selectedUser.userData.description.hasLongHair ? 'long_hair' : 'short_hair'}.png`, alt: "Hair Length", title: selectedUser.userData.description.hasLongHair ? "Long Hair" : "Short Hair" }]
        ),
        { src: `${selectedUser.userData.description.wearsGlasses ? 'glasses' : 'no_glasses'}.png`, alt: "Glasses", title: selectedUser.userData.description.wearsGlasses ? "Wears Glasses" : "No Glasses" },
        { src: `top_${selectedUser.userData.description.upperColor.toLowerCase()}.png`, alt: "Upper Clothing Color", title: `Upper Clothing Color: ${selectedUser.userData.description.upperColor}` },
        { src: `bottom_${selectedUser.userData.description.lowerColor.toLowerCase()}.png`, alt: "Lower Clothing Color", title: `Lower Clothing Color: ${selectedUser.userData.description.lowerColor}` },
      ].map((image, index) => (
        <div key={index} className="relative">
          <img 
            src={`/images/user-visual-description/${image.src}`} 
            alt={image.alt} 
            className="h-10 w-10 cursor-pointer"
            onClick={() => {
              console.log(`Clicked on image ${image.alt}`);
              const titleElement = document.getElementById('imageTitleDisplay');
              if (titleElement) {
                titleElement.textContent = image.title;
                titleElement.style.display = 'block';
              }
            }}
          />
        </div>
      ))}
    </div>
    <div id="imageTitleDisplay" className="mt-2 rounded bg-gray-200 p-2 text-center"></div>

          <br />

          <h5 className="mb-2 text-lg font-medium">Selected User Data:</h5>
          <pre className="max-h-60 overflow-auto rounded bg-white p-3">
            {JSON.stringify(selectedUser.userData, null, 2)}
          </pre>
        </div>
      )}

      {selectedUser && !userData && (
        <div className="mt-4 rounded bg-gray-100 p-4">
          <p className="flex items-center rounded border border-yellow-400 bg-yellow-100 p-3 text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Submit your user data to see a comparison with the selected user below
          </p>
          <br />
          <h5 className="mb-2 text-lg font-medium">Selected User Data:</h5>
          <pre className="max-h-60 overflow-auto rounded bg-white p-3">
            {JSON.stringify(selectedUser.userData, null, 2)}
          </pre>
        </div>
      )}

      <br />

      {/* If no selected user and no userData submitted */}
      {!selectedUser &&!userData && (
        <p className="flex items-center rounded border border-yellow-400 bg-yellow-100 p-3 text-yellow-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Please select a user in the map above by clicking on their marker to see your compatibility with them here
      </p>
      )}


    </div>
  );
};

export default MapView;

