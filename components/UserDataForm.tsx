import React, { useState } from 'react';

const UserDataForm: React.FC = () => {
  const [formData, setFormData] = useState({
    needs: [],
    supplies: [],
    appearance: {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>Needs</h3>
      {/* Add checkboxes for needs */}
      <div>
        <label>
          <input
            type="checkbox"
            name="needs"
            value="survival"
            onChange={handleChange}
          /> Survival
        </label>
        <label>
          <input
            type="checkbox"
            name="needs"
            value="companionship"
            onChange={handleChange}
          /> Companionship
        </label>
        {/* Add more needs as checkboxes */}
      </div>

      <h3>Supplies</h3>
      {/* Add checkboxes for supplies */}
      <div>
        <label>
          <input
            type="checkbox"
            name="supplies"
            value="food"
            onChange={handleChange}
          /> Food
        </label>
        <label>
          <input
            type="checkbox"
            name="supplies"
            value="shelter"
            onChange={handleChange}
          /> Shelter
        </label>
        {/* Add more supplies as checkboxes */}
      </div>

      <h3>Appearance</h3>
      <div>
        <label>
          <input
            type="checkbox"
            name="isMale"
            checked={formData.appearance.isMale}
            onChange={handleChange}
          /> Do you look like a man?
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="isTaller"
            checked={formData.appearance.isTaller}
            onChange={handleChange}
          /> Are you taller than median height?
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="isOlder"
            checked={formData.appearance.isOlder}
            onChange={handleChange}
          /> Are you older than median age?
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name={formData.appearance.isMale ? "hasFacialHair" : "hasLongHair"}
            checked={formData.appearance.isMale ? formData.appearance.hasFacialHair : formData.appearance.hasLongHair}
            onChange={handleChange}
          /> 
          {formData.appearance.isMale ? "Do you have facial hair?" : "Does your hair reach below your shoulder?"}
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="wearsGlasses"
            checked={formData.appearance.wearsGlasses}
            onChange={handleChange}
          /> Are you wearing glasses?
        </label>
      </div>
      <div>
        <label>
          Upper body clothing color:
          <select name="upperColor" value={formData.appearance.upperColor} onChange={handleChange}>
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
          <select name="lowerColor" value={formData.appearance.lowerColor} onChange={handleChange}>
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

      <button type="submit">Submit</button>
    </form>
  );
};

export default UserDataForm;
