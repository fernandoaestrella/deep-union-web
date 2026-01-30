'use client'

import React, { useState } from 'react';
import { UserData } from './UserDataForm';
import Dialog from './Dialog';
import { useTranslation } from '@/lib/i18n/client';

interface PostDataProps {
  userData: UserData | null;
  coordinates: string;
}

const PostData: React.FC<PostDataProps> = ({ userData, coordinates }) => {
  const { t } = useTranslation();
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  
  if (!userData) {
    return <p className="flex items-center rounded border border-yellow-400 bg-yellow-100 p-3 text-yellow-600">
    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
    {t('postData.errorNoUserData')}
  </p>;
  }

  const handlePostData = async () => {
      if (!coordinates) {
        setDialogTitle(t('dialog.error'));
        setDialogMessage(t('postData.errorNoCoordinates'));
        setShowDialog(true);
        return;
      }

      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coordinates,
            userData: {
              requests: userData.requests,
              offers: userData.offers,
              description: userData.description,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to post user data');
        }

        const result = await response.json();
        setDialogTitle(t('dialog.success'));
        setDialogMessage(t('postData.success'));
        setShowDialog(true);
      } catch (error) {
        console.error('Error posting user data:', error);
        setDialogTitle(t('dialog.error'));
        setDialogMessage(t('postData.errorFailed'));
        setShowDialog(true);
      }
    };

  return (
    <>
      <div className="mt-8 rounded-lg bg-white p-4 shadow">
        <h4 className="mb-4 text-xl font-semibold">{t('postData.title')}</h4>

        <div className="mb-4">
          <h5 className="mb-2 text-lg font-medium">{t('postData.currentUserData')}</h5>
          <pre className="max-h-60 overflow-auto rounded bg-gray-100 p-3">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>

        <div className="mb-4">
          <h5 className="mb-2 text-lg font-medium">{t('postData.currentCoordinates')}</h5>
          <pre className="rounded bg-gray-100 p-3">
            {coordinates || t('postData.noCoordinates')}
          </pre>
        </div>

        {/* Notify users that their data will be deleted automatically */}
        <div className="mb-4">
          <p className="text-gray-600">
            <b>{t('postData.note')}</b> {t('postData.deleteNote')}
          </p>
        </div>

        <button 
          className="focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
          onClick={handlePostData}
        >
          {t('postData.submitButton')}
        </button>
      </div>

      {showDialog && (
        <Dialog
          title={dialogTitle}
          message={dialogMessage}
          onClose={() => setShowDialog(false)}
        />
      )}
    </>
  );
};

export default PostData;

