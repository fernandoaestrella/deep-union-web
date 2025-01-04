import React, { useState } from 'react';

const UserDataForm: React.FC = () => {
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

  const [formData, setFormData] = useState({
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
    <div>
      {categories.map(category => (
        <label key={`${section}-${category}`}>
          <input
            type="checkbox"
            name={`${section}-${category}`}
            checked={formData[section][category]}
            onChange={(e) => handleCategoryChange(section, category, e.target.checked)}
          /> {category}
        </label>
      ))}
    </div>
  );
  const handleCategoryChange = (section: 'requests' | 'offers', category: string, checked: boolean) => {
    setFormData(prevState => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [category]: checked
      }
    }));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prevState => ({
      ...prevState,
      description: {
        ...prevState.description,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }
    }));
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(JSON.stringify(formData, null, 2));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Requests</h3>
      {renderCheckboxes('requests')}

      <h3>Offers</h3>
      {renderCheckboxes('offers')}

      <h3>Appearance</h3>
      <div>
        <label>
          <input
            type="checkbox"
            name="isMale"
            checked={formData.description.isMale}
            onChange={handleChange}
          /> Do you look like a man?
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="isTaller"
            checked={formData.description.isTaller}
            onChange={handleChange}
          /> Are you taller than median height?
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="isOlder"
            checked={formData.description.isOlder}
            onChange={handleChange}
          /> Are you older than median age?
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name={formData.description.isMale ? "hasFacialHair" : "hasLongHair"}
            checked={formData.description.isMale ? formData.description.hasFacialHair : formData.description.hasLongHair}
            onChange={handleChange}
          /> 
          {formData.description.isMale ? "Do you have facial hair?" : "Does your hair reach below your shoulder?"}
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="wearsGlasses"
            checked={formData.description.wearsGlasses}
            onChange={handleChange}
          /> Are you wearing glasses?
        </label>
      </div>
      <div>
        <label>
          Upper body clothing color:
          <select name="upperColor" value={formData.description.upperColor} onChange={handleChange}>
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
      <div>
        <label>
          Lower body clothing color:
          <select name="lowerColor" value={formData.description.lowerColor} onChange={handleChange}>
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

      <button className="rounded bg-sky-300 px-4 py-2 font-bold text-white hover:bg-sky-400" type="submit">Submit</button>
    </form>
  );
};

export default UserDataForm;
