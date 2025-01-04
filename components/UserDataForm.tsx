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
    // Collect and validate form data
    const formData: UserData = {
      requests: formDataStructure.requests,
      offers: formDataStructure.offers,
      description: formDataStructure.description,
    };
    onSubmit(formData);
    setShowDialog(true); // Show the dialog after submitting
  };


  return (
    <>
      <form className="rounded bg-white p-6 shadow" onSubmit={handleSubmit}>
        <h4 className="mb-4 text-xl font-semibold">Define your requests, offers, and how you look</h4>

        <h3 className="mb-2 mt-6 text-lg font-medium">Requests</h3>
        {renderCheckboxes('requests')}

        <h3 className="mb-2 mt-6 text-lg font-medium">Offers</h3>
        {renderCheckboxes('offers')}

        <h3 className="mb-2 mt-6 text-lg font-medium">Appearance</h3>
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
            <span>Are you taller than median height?</span>
          </label>
          <label className="flex items-center space-x-2 rounded bg-sky-100 p-2">
            <input
              type="checkbox"
              name="isOlder"
              checked={formDataStructure.description.isOlder}
              onChange={handleChange}
            />
            <span>Are you older than median age?</span>
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
          <label className="block">
            <span className="mb-1 block">Upper body clothing color:</span>
            <select name="upperColor" value={formDataStructure.description.upperColor} onChange={handleChange} className="w-full rounded border p-2">
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
          <label className="block">
            <span className="mb-1 block">Lower body clothing color:</span>
            <select name="lowerColor" value={formDataStructure.description.lowerColor} onChange={handleChange} className="w-full rounded border p-2">
              <option value="">Select color</option>
              <option value="white">White</option>
              <option value="black">Black</option>
              <option value="gray">Gray</option>
              <option value="brown">Brown</option>
              <option value="blue">Blue</option>
              <option value="other">Other</option>
              <option value="none">None</option>
            </select>
          </label>
        </div>


        <button className="mt-6 rounded bg-sky-300 px-4 py-2 font-bold text-white hover:bg-sky-400" type="submit">Submit</button>
      </form>

      {showDialog && (
        <Dialog
          title="Success"
          message="Your user data has been updated successfully."
          onClose={() => setShowDialog(false)}
        />
      )}
    </>
  );
};

export default UserDataForm;

