'use client'

import React, { useState } from 'react';
import SubmitButton from './SubmitButton';
import Dialog from './Dialog';
import { useTranslation } from '@/lib/i18n/client';

interface CoordinatesInputProps {
  onSubmit: (coordinates: string) => void;
}

const CoordinatesInput: React.FC<CoordinatesInputProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
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
      setError(t('coordinates.error'));
    }
  };

  return (
    <div className="mx-auto mt-4 w-full rounded bg-white p-6 shadow">
      <h4 className="mb-2 text-lg font-semibold">{t('coordinates.title')}</h4>
      <p className="mb-4 text-sm text-gray-600">
        {t('coordinates.examples')}<br />
        <b>DMS:</b> {t('coordinates.dms')}<br />
        <b>Decimal:</b> {t('coordinates.decimal')}<br />
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={coordinates}
            onChange={(e) => setCoordinates(e.target.value)}
            placeholder={t('coordinates.placeholder')}
            className="w-full rounded-md border px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
        <SubmitButton text={t('coordinates.submitButton')} />
      </form>
      {showConfirmation && (
        <Dialog
        title={t('dialog.success')}
        message={`${t('coordinates.success')} ${coordinates}`}
        onClose={() => setShowConfirmation(false)}
        />
      )}

    </div>
  );
};

export default CoordinatesInput;

