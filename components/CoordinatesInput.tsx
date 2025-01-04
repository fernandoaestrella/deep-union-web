import React, { useState } from 'react';

interface CoordinatesInputProps {
  onSubmit: (coordinates: string) => void;
}

const CoordinatesInput: React.FC<CoordinatesInputProps> = ({ onSubmit }) => {
  const [coordinates, setCoordinates] = useState('');
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validateCoordinates = (input: string) => {
    // Decimal format regex
    const decimalRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

    // DMS format regex
    const dmsRegex = /^(\d{1,2})°(\d{1,2})'(\d{1,2}(\.\d+)?)"([NS])\s*(\d{1,3})°(\d{1,2})'(\d{1,2}(\.\d+)?)"([EW])$/;

    return decimalRegex.test(input) || dmsRegex.test(input);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCoordinates(coordinates)) {
      console.log('Valid coordinates:', coordinates);
      setError('');
      setShowConfirmation(true);
      onSubmit(coordinates);  // Call the onSubmit prop with the valid coordinates
    } else {
      setError('Invalid coordinates. Please use either decimal or DMS format.');
    }
  };

  return (
    <div className="mx-auto mt-4 w-full max-w-md">
      <h4 className="mb-2 text-lg font-semibold">Input your current coordinates</h4>
      <p className="mb-4 text-sm text-gray-600">
        Examples of valid coordinates:<br />
        <b>Decimal:</b> 40.7128, -74.0060<br />
        <b>DMS:</b> 19°27&apos;20.4&quot;N 70°39&apos;08.6&quot;W
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={coordinates}
            onChange={(e) => setCoordinates(e.target.value)}
            placeholder="Enter coordinates here"
            className="w-full rounded-md border px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
        <button
          type="submit"
          className="focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
        >
          Submit Coordinates
        </button>
      </form>
      {showConfirmation && (
        <div className="mt-4 rounded-md bg-green-100 p-4 text-green-700">
          <p>Valid coordinates received: {coordinates}</p>
          <button 
            onClick={() => setShowConfirmation(false)}
            className="mt-2 rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CoordinatesInput;

