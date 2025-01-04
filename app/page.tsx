'use client'

import React, { useState } from 'react';
import UserDataForm from '../components/UserDataForm';
import CoordinatesInput from '../components/CoordinatesInput';
import PostData from '../components/PostData';
import MapView from '../components/MapView';
import { UserData } from '../components/UserDataForm';

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [coordinates, setCoordinates] = useState<string>('');

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
        <MapView coordinates={coordinates} />
      </section>
    </main>
  );
}

