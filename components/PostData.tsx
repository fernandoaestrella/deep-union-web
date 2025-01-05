import React, { useState } from 'react';
import { UserData } from './UserDataForm';
import Dialog from './Dialog';

interface PostDataProps {
  userData: UserData | null;
  coordinates: string;
}

const PostData: React.FC<PostDataProps> = ({ userData, coordinates }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  if (!userData) {
    return <p>Please fill in user data first.</p>;
  }

  const handlePostData = async () => {
      if (!coordinates) {
        setDialogTitle('Error');
        setDialogMessage('Please input coordinates before posting.');
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
        setDialogTitle('Success');
        setDialogMessage('User data successfully posted to the database.');
        setShowDialog(true);
      } catch (error) {
        console.error('Error posting user data:', error);
        setDialogTitle('Error');
        setDialogMessage('Failed to post user data. Please try again.');
        setShowDialog(true);
      }
    };

  return (
    <>
      <div className="mt-8 rounded-lg bg-white p-4 shadow">
        <h4 className="mb-4 text-xl font-semibold">Post your data and coordinates to our database</h4>

        <div className="mb-4">
          <h5 className="mb-2 text-lg font-medium">Current User Data:</h5>
          <pre className="max-h-60 overflow-auto rounded bg-gray-100 p-3">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>

        <div className="mb-4">
          <h5 className="mb-2 text-lg font-medium">Current Coordinates:</h5>
          <pre className="rounded bg-gray-100 p-3">
            {coordinates || "No coordinates set"}
          </pre>
        </div>

        <button 
          className="focus:shadow-outline rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600 focus:outline-none"
          onClick={handlePostData}
        >
          Post Data to Database
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

