'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import UserDataForm from '../components/UserDataForm';
import CoordinatesInput from '../components/CoordinatesInput';
import PostData from '../components/PostData';
import { UserData } from '../components/UserDataForm';

// Dynamically import MapView with SSR disabled
const MapView = dynamic(() => import('../components/MapView'), { ssr: false });
export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [coordinates, setCoordinates] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const handleUserDataSubmit = (data: UserData) => {
    setUserData(data);
  };

  const handleCoordinatesSubmit = (coords: string) => {
    setCoordinates(coords);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="mb-8 w-full max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">1. User Data</h2>
        <UserDataForm onSubmit={handleUserDataSubmit} />
      </section>

      <section className="mb-8 w-full max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">2. Coordinates</h2>
        <CoordinatesInput onSubmit={handleCoordinatesSubmit} />
      </section>

      <section className="mb-8 w-full max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">3. Post</h2>
        <PostData userData={userData} coordinates={coordinates} />
      </section>

      <section className="mb-8 w-full max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">4. Map</h2>
        {isClient && <MapView userCoordinates={coordinates} />}
      </section>
    </main>
  );
}

