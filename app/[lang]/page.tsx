'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import UserDataForm from '../../components/UserDataForm';
import CoordinatesInput from '../../components/CoordinatesInput';
import PostData from '../../components/PostData';
import { UserData } from '../../components/UserDataForm';
import CollapsibleSection from '@/components/CollapsibleSection';
import { useTranslation } from '@/lib/i18n/client';

// Dynamically import MapView with SSR disabled
const MapView = dynamic(() => import('../../components/MapView'), { ssr: false });

export default function Home() {
  const { t } = useTranslation();
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
      <CollapsibleSection title={t('howItWorks.title')}>
          <h2 className="mb-4 text-2xl font-semibold">{t('howItWorks.title')}</h2>
          <ol className="space-y-6 rounded bg-white p-8 shadow">
            <li>
              <p>1. {t('howItWorks.step1')}</p>
              <div className="mt-4 flex flex-col gap-4">
                <div className="flex gap-4">
                  <img src="/images/1a.png" alt="Step 1 - Request form" className="w-1/2 rounded-lg border shadow-sm" />
                  <img src="/images/1b.png" alt="Step 1 - Offers form" className="w-1/2 rounded-lg border shadow-sm" />
                </div>
                <img src="/images/1c.png" alt="Step 1 - Visual description" className="w-full rounded-lg border shadow-sm" />
              </div>
            </li>
            <li>2. {t('howItWorks.step2')}</li>
            <li>
              <p>3. {t('howItWorks.step3')}</p>
              <div className="mt-4">
                <img src="/images/3a.png" alt="Step 3 - Map matching" className="w-full rounded-lg border shadow-sm" />
              </div>
            </li>
            <li>
              <p>4. {t('howItWorks.step4')}</p>
              <div className="mt-4 flex flex-col gap-4">
                <img src="/images/4a.png" alt="Step 4 - User details" className="w-full rounded-lg border shadow-sm" />
                <img src="/images/4b.png" alt="Step 4 - Distance and direction" className="w-full rounded-lg border shadow-sm" />
                <img src="/images/4c.png" alt="Step 4 - Visuals" className="w-full rounded-lg border shadow-sm" />
              </div>
            </li>
          </ol>
      </CollapsibleSection>
        </section>

      <section className="mb-8 w-full max-w-4xl lg:max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">{t('section1.title')}</h2>
        <UserDataForm onSubmit={handleUserDataSubmit} />
      </section>

      <section className="mb-8 w-full max-w-4xl lg:max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">{t('section2.title')}</h2>
        <CoordinatesInput onSubmit={handleCoordinatesSubmit} />
      </section>

      <section className="mb-8 w-full max-w-4xl lg:max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">{t('section3.title')}</h2>
        <PostData userData={userData} coordinates={coordinates} />
      </section>

      <section className="mb-8 w-full max-w-4xl lg:max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">{t('section4.title')}</h2>
        {isClient && <MapView userData={userData} userCoordinates={coordinates} />}
      </section>

      <section className="mb-8 w-full max-w-4xl lg:max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">{t('section5.title')}</h2>
        <div className='space-y-2 rounded bg-white p-8 shadow'>
          <p>
            {t('about.intro')}
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>{t('about.point1')}</li>
            <li>{t('about.point2')}</li>
            <li>{t('about.point3')}</li>
            <li>{t('about.point4')}</li>
            <li>{t('about.point5')}</li>
          </ul>
          <p>{t('about.enjoy')}</p>
        </div>
      </section>
    </main>
  );
}

