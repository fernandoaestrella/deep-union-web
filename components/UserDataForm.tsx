'use client'

import React, { useState } from 'react';
import Dialog from './Dialog';
import WarningIcon from './WarningIcon';
import SubmitButton from './SubmitButton';
import { useTranslation } from '@/lib/i18n/client';

export interface UserData {
  requests: Record<string, boolean>;
  offers: Record<string, boolean>;
  description: {
    isMale: boolean;
    isTaller: boolean;
    isOlder: boolean;
    hasFacialHair: boolean;
    hasLongHair: boolean;
    wearsGlasses: boolean;
    upperColor: string;
    lowerColor: string;
  };
}

interface UserDataFormProps {
  onSubmit: (data: UserData) => void;
}

const UserDataForm: React.FC<UserDataFormProps> = ({ onSubmit }) => {
    const { t } = useTranslation();
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [upperColorWarning, setUpperColorWarning] = useState(false);
    const [lowerColorWarning, setLowerColorWarning] = useState(false);
    const [visibleExplanations, setVisibleExplanations] = useState<Record<string, boolean>>({});
    
    const categories = [
    'Preservation',
    'Gratification',
    'Definition',
    'Acceptance',
    'Expression',
    'Reflection',
    'Knowledge'
  ];

  const initialCategoryState = categories.reduce((acc, category) => {
    acc[category] = false;
    return acc;
  }, {} as Record<string, boolean>);

  const [formDataStructure, setFormDataStructure] = useState({
    requests: { ...initialCategoryState },
    offers: { ...initialCategoryState },
    description: {
      isMale: false,
      isTaller: false,
      isOlder: false,
      hasFacialHair: false,
      hasLongHair: false,
      wearsGlasses: false,
      upperColor: '',
      lowerColor: '',
    },
  });

  const renderCheckboxes = (section: 'requests' | 'offers') => (
    <div className="space-y-2">
      {categories.map(category => {
        const key = `${section}-${category}`;
        return (
          <div key={key} className="space-y-1">
            <div className="flex items-center space-x-2">
              <label className="flex flex-grow items-center space-x-2 rounded bg-sky-100 p-2">
                <input
                  type="checkbox"
                  name={key}
                  checked={formDataStructure[section][category]}
                  onChange={(e) => handleCategoryChange(section, category, e.target.checked)}
                  className="mr-2"
                />
                <span>{t(`need.${category}`)}</span>
              </label>
              <button
                type="button"
                onClick={() => toggleExplanation(key)}
                className="ml-2 text-gray-600 hover:text-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {visibleExplanations[key] && (
              <div className="relative mt-1 rounded bg-white p-3 text-sm shadow">
                <button
                  onClick={() => toggleExplanation(key)}
                  className="absolute right-1 top-1 text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {getExplanation(section, category)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );


  const toggleExplanation = (key: string) => {
    setVisibleExplanations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getExplanation = (section: 'requests' | 'offers', category: string): string => {
    const explanationKey = section === 'requests' 
      ? `need.explanationRequest${category}` 
      : `need.explanationOffer${category}`;
    return t(explanationKey);
  };

  const handleCategoryChange = (section: 'requests' | 'offers', category: string, checked: boolean) => {
    setFormDataStructure(prevState => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [category]: checked
      }
    }));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormDataStructure(prevState => ({
      ...prevState,
      description: {
        ...prevState.description,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }
    }));
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate color selections
    if (!formDataStructure.description.upperColor || !formDataStructure.description.lowerColor) {
      setShowDialog(true);
      setDialogMessage(t('userDataForm.validationError'));
      setUpperColorWarning(!formDataStructure.description.upperColor);
      setLowerColorWarning(!formDataStructure.description.lowerColor);
      return;
    }

    // If validation passes, proceed with form submission
    const formData: UserData = {
      requests: formDataStructure.requests,
      offers: formDataStructure.offers,
      description: formDataStructure.description,
    };
    onSubmit(formData);
    setShowDialog(true);
    setDialogMessage(t('userDataForm.success'));
  };

  const ColorWarning = ({ message }: { message: string }) => (
    <p className="mb-2 flex items-center rounded border border-yellow-400 bg-yellow-100 p-3 text-yellow-600">
      <WarningIcon />
      {message}
    </p>
  );


  return (
    <>
      <form className="rounded bg-white p-6 shadow" onSubmit={handleSubmit}>
        <h4 className="mb-4 text-xl font-semibold">{t('userDataForm.title')}</h4>

        <h3 className="mb-2 mt-6 text-lg font-medium">{t('userDataForm.requests')}</h3>
        {renderCheckboxes('requests')}

        <h3 className="mb-2 mt-6 text-lg font-medium">{t('userDataForm.offers')}</h3>
        {renderCheckboxes('offers')}

        <h3 className="mb-2 mt-6 text-lg font-medium">{t('userDataForm.appearance')}</h3>
        <h4>{t('userDataForm.appearanceInstruction1')}</h4>
        <h4>{t('userDataForm.appearanceInstruction2')}</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 rounded bg-sky-100 p-2">
            <input
              type="checkbox"
              name="isMale"
              checked={formDataStructure.description.isMale}
              onChange={handleChange}
            />
            <span>{t('userDataForm.isMale')}</span>
          </label>
          <label className="flex items-center space-x-2 rounded bg-sky-100 p-2">
            <input
              type="checkbox"
              name="isTaller"
              checked={formDataStructure.description.isTaller}
              onChange={handleChange}
            />
            <span>
              {formDataStructure.description.isMale
                ? t('userDataForm.isTallerMale')
                : t('userDataForm.isTallerFemale')}
            </span>
          </label>
          <label className="flex items-center space-x-2 rounded bg-sky-100 p-2">
            <input
              type="checkbox"
              name="isOlder"
              checked={formDataStructure.description.isOlder}
              onChange={handleChange}
            />
            <span>
              {formDataStructure.description.isMale
                ? t('userDataForm.isOlderMale')
                : t('userDataForm.isOlderFemale')}
            </span>
          </label>

          <label className="flex items-center space-x-2 rounded bg-sky-100 p-2">
            <input
              type="checkbox"
              name={formDataStructure.description.isMale ? "hasFacialHair" : "hasLongHair"}
              checked={formDataStructure.description.isMale ? formDataStructure.description.hasFacialHair : formDataStructure.description.hasLongHair}
              onChange={handleChange}
            />
            <span>{formDataStructure.description.isMale ? t('userDataForm.hasFacialHair') : t('userDataForm.hasLongHair')}</span>
          </label>
          <label className="flex items-center space-x-2 rounded bg-sky-100 p-2">
            <input
              type="checkbox"
              name="wearsGlasses"
              checked={formDataStructure.description.wearsGlasses}
              onChange={handleChange}
            />
            <span>{t('userDataForm.wearsGlasses')}</span>
          </label>
        </div>

        <div className="mt-4 space-y-2">
          {upperColorWarning && <ColorWarning message={t('userDataForm.colorWarningUpper')} />}
          <label className="block">
            <span className="mb-1 block">{t('userDataForm.upperColor')}</span>
            <select 
              name="upperColor" 
              value={formDataStructure.description.upperColor} 
              onChange={(e) => {
                handleChange(e);
                setUpperColorWarning(false);
              }} 
              className="w-full rounded border p-2"
            >
              <option value="">{t('userDataForm.selectColor')}</option>
              <option value="white">{t('color.white')}</option>
              <option value="black">{t('color.black')}</option>
              <option value="gray">{t('color.gray')}</option>
              <option value="brown">{t('color.brown')}</option>
              <option value="red">{t('color.red')}</option>
              <option value="green">{t('color.green')}</option>
              <option value="blue">{t('color.blue')}</option>
              <option value="purple">{t('color.purple')}</option>
              <option value="orange">{t('color.orange')}</option>
              <option value="yellow">{t('color.yellow')}</option>
              <option value="none">{t('color.none')}</option>
            </select>
          </label>
        </div>

        <div className="mt-2 space-y-2">
          {lowerColorWarning && <ColorWarning message={t('userDataForm.colorWarningLower')} />}
          <label className="block">
            <span className="mb-1 block">{t('userDataForm.lowerColor')}</span>
            <select 
              name="lowerColor" 
              value={formDataStructure.description.lowerColor} 
              onChange={(e) => {
                handleChange(e);
                setLowerColorWarning(false);
              }} 
              className="w-full rounded border p-2"
            >
              <option value="">{t('userDataForm.selectColor')}</option>
              <option value="white">{t('color.white')}</option>
              <option value="black">{t('color.black')}</option>
              <option value="gray">{t('color.gray')}</option>
              <option value="brown">{t('color.brown')}</option>
              <option value="blue">{t('color.blue')}</option>
              <option value="other">{t('color.other')}</option>
              <option value="none">{t('color.none')}</option>
            </select>
          </label>
        </div>

        <br />

        <SubmitButton text={t('userDataForm.submitButton')} />
      </form>

      {showDialog && (
        <Dialog
          title={dialogMessage.includes(t('userDataForm.success')) ? t('dialog.success') : t('dialog.error')}
          message={dialogMessage}
          onClose={() => setShowDialog(false)}
        />
      )}
    </>
  );
};

export default UserDataForm;

