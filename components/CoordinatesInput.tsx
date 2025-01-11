import React, { useState } from 'react';
import SubmitButton from './SubmitButton';
import Dialog from './Dialog';

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
    <div className="mx-auto mt-4 w-full rounded bg-white p-6 shadow">
      <h4 className="mb-2 text-lg font-semibold">Input your current coordinates</h4>
      <p className="mb-4 text-sm text-gray-600">
        Examples of valid coordinates:<br />
        <b>Decimal:</b> 10.9780, 76.7353<br />
        <b>DMS:</b> 10°58&apos;40&quot;N 76°44&apos;07&quot;E
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={coordinates}
            onChange={(e) => setCoordinates(e.target.value)}
            placeholder="Enter your coordinates here"
            className="w-full rounded-md border px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
        <SubmitButton text="Submit Coordinates" />
      </form>
      {showConfirmation && (
        <Dialog
        title='Success'
        message={`Valid coordinates received: ${coordinates}`}
        onClose={() => setShowConfirmation(false)}
        />
      )}

    </div>
  );
};

export default CoordinatesInput;

