import React, { useState } from 'react';
import Dialog from './Dialog'; // Make sure to import the Dialog component
import WarningIcon from './WarningIcon';
import SubmitButton from './SubmitButton';

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
                <span>{category}</span>
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
    const explanations: Record<string, Record<string, string>> = {
      requests: {
        Preservation: "e.g. ask for something needed for your survival",
        Gratification: "e.g. ask someone to join you in a game",
        Definition: "e.g. ask for help in a great project",
        Acceptance: "e.g. face your fears",
        Expression: "e.g. say what has been hard to say",
        Reflection: "e.g. find clarity and truth about how you limit yourself without your awareness",
        Knowledge: "e.g. let your identity be universal"
      },
      offers: {
        Preservation: "e.g. provide for someone's survival",
        Gratification: "e.g. join someone's game",
        Definition: "e.g. help someone succeed in a great project",
        Acceptance: "e.g. help someone grow by facing their fears",
        Expression: "e.g. listen to someone and try to uncover what they are really trying to say but can't",
        Reflection: "e.g. find ways in which others are limiting themselves and humbly suggest playful ways to notice and break those limitations",
        Knowledge: "e.g. let your identity be universal"
      }
    };

    return explanations[section][category] || "No explanation available";
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
      <WarningIcon />
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
        <h4>Click the checkbox if:</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 rounded bg-sky-100 p-2">
            <input
              type="checkbox"
              name="isMale"
              checked={formDataStructure.description.isMale}
              onChange={handleChange}
            />
            <span>You look like a man</span>
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
                ? "You are taller than 5'9\" (175 cm)"
                : "You are taller than 5'4\" (162 cm)"}
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
                ? "You are older than 30 years and 3 months"
                : "You are older than 31 years and 9 months"}
            </span>
          </label>

          <label className="flex items-center space-x-2 rounded bg-sky-100 p-2">
            <input
              type="checkbox"
              name={formDataStructure.description.isMale ? "hasFacialHair" : "hasLongHair"}
              checked={formDataStructure.description.isMale ? formDataStructure.description.hasFacialHair : formDataStructure.description.hasLongHair}
              onChange={handleChange}
            />
            <span>{formDataStructure.description.isMale ? "You have facial hair" : "Your hair reaches below your shoulder"}</span>
          </label>
          <label className="flex items-center space-x-2 rounded bg-sky-100 p-2">
            <input
              type="checkbox"
              name="wearsGlasses"
              checked={formDataStructure.description.wearsGlasses}
              onChange={handleChange}
            />
            <span>You are wearing glasses</span>
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

        <br />

        <SubmitButton text={'Submit User Data'} />
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

