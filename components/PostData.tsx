import React from 'react';
import { UserData } from './UserDataForm';

interface PostDataProps {
  userData: UserData | null;
  coordinates: string;
}

const PostData: React.FC<PostDataProps> = ({ userData, coordinates }) => {
  if (!userData) {
    return <p>Please fill in user data first.</p>;
  }
  return (
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
        onClick={() => {
          // Here you would typically send the data to your backend
          console.log('Posting data:', { userData, coordinates });
        }}
      >
        Post Data to Database
      </button>
    </div>
  );
};


export default PostData;

