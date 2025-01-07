import React, { useState } from 'react';
import Dialog from './Dialog'; // Make sure to import the Dialog component

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
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [upperColorWarning, setUpperColorWarning] = useState(false);
    const [lowerColorWarning, setLowerColorWarning] = useState(false);
  
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
      {categories.map(category => (
        <label key={`${section}-${category}`} className="flex items-center space-x-2 rounded bg-sky-100 p-2">
          <input
            type="checkbox"
            name={`${section}-${category}`}
            checked={formDataStructure[section][category]}
            onChange={(e) => handleCategoryChange(section, category, e.target.checked)}
            className="mr-2"
          />
          <span>{category}</span>
        </label>
      ))}
    </div>
  );

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
      setDialogMessage('Please select both upper and lower body clothing colors.');
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
    setDialogMessage('Your user data has been updated successfully.');
  };

  const ColorWarning = ({ message }: { message: string }) => (
    <p className="mb-2 flex items-center rounded border border-yellow-400 bg-yellow-100 p-3 text-yellow-600">
      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      {message}
    </p>
  );


  return (
    <>
      <form className="rounded bg-white p-6 shadow" onSubmit={handleSubmit}>
        <h4 className="mb-4 text-xl font-semibold">Define your requests, offers, and how you look</h4>

        <h3 className="mb-2 mt-6 text-lg font-medium">Requests</h3>
        {renderCheckboxes('requests')}

        <h3 className="mb-2 mt-6 text-lg font-medium">Offers</h3>
        {renderCheckboxes('offers')}

        <h3 className="mb-2 mt-6 text-lg font-medium">Appearance</h3>
        <h4>Please answer in order, as several questions update after answering the first one</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 rounded bg-sky-100 p-2">
            <input
              type="checkbox"
              name="isMale"
              checked={formDataStructure.description.isMale}
              onChange={handleChange}
            />
            <span>Do you look like a man?</span>
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
                ? "Are you taller than 5'9\" (175 cm)?"
                : "Are you taller than 5'4\" (162 cm)?"}
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
                ? "Are you older than 30.3 years?"
                : "Are you older than 31.8 years?"}
            </span>
          </label>

          <label className="flex items-center space-x-2 rounded bg-sky-100 p-2">
            <input
              type="checkbox"
              name={formDataStructure.description.isMale ? "hasFacialHair" : "hasLongHair"}
              checked={formDataStructure.description.isMale ? formDataStructure.description.hasFacialHair : formDataStructure.description.hasLongHair}
              onChange={handleChange}
            />
            <span>{formDataStructure.description.isMale ? "Do you have facial hair?" : "Does your hair reach below your shoulder?"}</span>
          </label>
          <label className="flex items-center space-x-2 rounded bg-sky-100 p-2">
            <input
              type="checkbox"
              name="wearsGlasses"
              checked={formDataStructure.description.wearsGlasses}
              onChange={handleChange}
            />
            <span>Are you wearing glasses?</span>
          </label>
        </div>

        <div className="mt-4 space-y-2">
          {upperColorWarning && <ColorWarning message="Please select an upper body clothing color." />}
          <label className="block">
            <span className="mb-1 block">Upper body clothing color:</span>
            <select 
              name="upperColor" 
              value={formDataStructure.description.upperColor} 
              onChange={(e) => {
                handleChange(e);
                setUpperColorWarning(false);
              }} 
              className="w-full rounded border p-2"
            >
              <option value="">Select color</option>
              <option value="white">White</option>
              <option value="black">Black</option>
              <option value="gray">Gray</option>
              <option value="brown">Brown</option>
              <option value="red">Red</option>
              <option value="green">Green</option>
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="orange">Orange</option>
              <option value="yellow">Yellow</option>
              <option value="none">None</option>
            </select>
          </label>
        </div>

        <div className="mt-2 space-y-2">
          {lowerColorWarning && <ColorWarning message="Please select a lower body clothing color." />}
          <label className="block">
            <span className="mb-1 block">Lower body clothing color:</span>
            <select 
              name="lowerColor" 
              value={formDataStructure.description.lowerColor} 
              onChange={(e) => {
                handleChange(e);
                setLowerColorWarning(false);
              }} 
              className="w-full rounded border p-2"
            >
              <option value="">Select color</option>
              <option value="white">White</option>
              <option value="black">Black</option>
              <option value="gray">Gray</option>
              <option value="brown">Brown</option>
              <option value="blue">Blue</option>
              <option value="other">Other (i.e. a color not included above)</option>
              <option value="none">None</option>
            </select>
          </label>
        </div>


        <button className="mt-6 rounded bg-sky-300 px-4 py-2 font-bold text-white hover:bg-sky-400" type="submit">Submit</button>
      </form>

      {showDialog && (
        <Dialog
          title={dialogMessage.includes('successfully') ? 'Success' : 'Error'}
          message={dialogMessage}
          onClose={() => setShowDialog(false)}
        />
      )}
    </>
  );
};

export default UserDataForm;

