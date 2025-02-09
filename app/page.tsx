'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import UserDataForm from '../components/UserDataForm';
import CoordinatesInput from '../components/CoordinatesInput';
import PostData from '../components/PostData';
import { UserData } from '../components/UserDataForm';
import CollapsibleSection from '@/components/CollapsibleSection';

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
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
        <section className="mb-8 w-full max-w-4xl lg:max-w-2xl">
      <CollapsibleSection title='Quickstart'>
          <h2 className="mb-4 text-2xl font-semibold">Quickstart</h2>
          <ol className="space-y-2 rounded bg-white p-8 shadow">
            <li>1. Submit your requests, offers, visual description and current coordinates. They all stay local to you.</li>
            <li>2. You can choose to post everything in our database so others can find you.</li>
            <li>3. Select other users in the Map section to see how well your requests and offers match.</li>
            <li>4. If you choose to approach them, you can see their visual description so you know how they look, and their distance and direction from your location so you know where to go.</li>
          </ol>
      </CollapsibleSection>
        </section>

      <section className="mb-8 w-full max-w-4xl lg:max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">1. User Data</h2>
        <UserDataForm onSubmit={handleUserDataSubmit} />
      </section>

      <section className="mb-8 w-full max-w-4xl lg:max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">2. Coordinates</h2>
        <CoordinatesInput onSubmit={handleCoordinatesSubmit} />
      </section>

      <section className="mb-8 w-full max-w-4xl lg:max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">3. Post</h2>
        <PostData userData={userData} coordinates={coordinates} />
      </section>

      <section className="mb-8 w-full max-w-4xl lg:max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">4. Map</h2>
        {isClient && <MapView userData={userData} userCoordinates={coordinates} />}
      </section>

      <section className="mb-8 w-full max-w-4xl lg:max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">5. About this app</h2>
        <div className='space-y-2 rounded bg-white p-8 shadow'>
          <p>
            We hope this app reminds you of the magic that is already out there in the world. As you use it, we invite you to allow yourself to:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Be clear about your deeper desires instead of being pushed around by expectations.</li>
            <li>Receive help from someone you may not have considered that could enrich your life.</li>
            <li>See your life in many more dimensions than just survival and pleasure.</li>
            <li>Fulfill different needs than the ones you have already covered (i.e. don&apos;t continuously fulfill the same one/s).</li>
            <li>Blur the lines between giving and receiving help, which may help discover a deeper reality than the apparent separation we experience. In other words, be open to what you might receive when you feel you are giving, and open yourself to noticing the flavor your life takes when you feel grateful for the help you receive.</li>
          </ul>
          <p>Enjoy!</p>
        </div>
      </section>
    </main>
  );
}

