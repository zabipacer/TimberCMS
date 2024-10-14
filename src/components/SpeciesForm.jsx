import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import { ref as dbRef, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import EndUseInput from './EndUserInput';

const SpeciesForm = ({ onSubmit, toggleForm }) => {
  const [loading, setLoading] = useState(false); 
  const [speciesName, setSpeciesName] = useState('');
  const [category, setCategory] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [commonNames, setCommonNames] = useState(['']);
  const [color, setColor] = useState(['']);
  const [moe, setMoe] = useState(['']);
  const [Janka, setJanka] = useState(['']);
  const [grain, setGrain] = useState(['']);
  const [Durability, setDurability] = useState(['']);
  const [workability, setWorkability] = useState(['']);
  const [mor, setMor] = useState(['']);
  const [Endgrain, setEndgrain] = useState(['']);
  const [endUses, setEndUses] = useState([{ useName: '', useDescription: '' }]); // Initialize as an array of objects
  const [submittedData, setSubmittedData] = useState(null);

  const [grainImages, setGrainImages] = useState([]); // Store multiple grain images
  const [usageImages, setUsageImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const speciesId = Math.random().toString(36).substr(2, 9);

    const uploadImage = async (file, path) => {
      const storage = getStorage();
      const imageRef = storageRef(storage, path);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      return url;
    };

    // Upload multiple grain images
    let grainImageUrls = [];
    for (const file of grainImages) {
      const url = await uploadImage(file, `species/${speciesId}/grainImages/${file.name}`);
      grainImageUrls.push(url);
    }

    // Upload usage images
    let usageImageUrls = [];
    for (const file of usageImages) {
      const url = await uploadImage(file, `species/${speciesId}/usageImages/${file.name}`);
      usageImageUrls.push(url);
    }

    const speciesRef = dbRef(db, `species/${speciesId}`);
    set(speciesRef, {
      id: speciesId,
      name: speciesName,
      category,
      tagline,
      description,
      commonNames,
      color,
      grain,
      Durability,
      
      Janka: mor,
      Endgrain,
      workability,
      grainImages: grainImageUrls, // Save multiple grain images
      usageImages: usageImageUrls,
      endUses // Save end uses properly
    });

    onSubmit({
      id: speciesId,
      name: speciesName,
      category,
      tagline,
      description,
      commonNames,
      color,
      grain,
      Durability,
      Janka: mor,
      
      Endgrain,
      grainImages: grainImageUrls,
      usageImages: usageImageUrls,
      endUses,
      workability
    });
setLoading(false);
    clearForm();
  };

  const handleGrainImageChange = (e) => {
    setGrainImages(Array.from(e.target.files)); // Handle multiple grain images
  };

  const handleUsageImagesChange = (e) => {
    setUsageImages(Array.from(e.target.files));
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedEndUses = [...endUses];
    updatedEndUses[index][name] = value;
    setEndUses(updatedEndUses);
  };

  const addNewUse = () => {
    setEndUses([...endUses, { useName: '', useDescription: '' }]); // Add new object for additional use
  };

  const clearForm = () => {
    setSpeciesName('');
    setCategory('');
    setTagline('');
    setDescription('');
    setCommonNames(['']);
    setColor('');
    setGrain('');
    setDurability('');
    setMor('');
    setMoe('');
    setJanka('');
    setEndgrain('');
    setGrainImages([]); // Clear grain images
    setUsageImages([]);
    setEndUses([{ useName: '', useDescription: '' }]); // Clear end uses
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-md m-20">
      <h1 className="text-2xl font-bold mb-4">Add New Species</h1>
      {/* Form fields */}
      {/* Other input fields here */}
      <div className='mb-4'> <label className="block text-gray-700">Name</label>
  <input
    type="text"
    value={speciesName}
    onChange={(e) => setSpeciesName(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md"
    required
  />
</div>
<div className="mb-4">
  <label className="block text-gray-700">Scientific name</label>
  <input
    type="text"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md"
    required
  />
</div>
<div className="mb-4">
  <label className="block text-gray-700">Common Names</label>
  <input
    type="text"
    value={commonNames}
    onChange={(e) => setCommonNames(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md"
    required
  />
</div>
<div className="mb-4">
  <label className="block text-gray-700">Color</label>
  <input
    type="text"
    value={color}
    onChange={(e) => setColor(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md"
    required
  />
</div>
<div className="mb-4">
  <label className="block text-gray-700">Grain</label>
  <input
    type="text"
    value={grain}
    onChange={(e) => setGrain(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md"
    required
  />
</div>
<div className="mb-4">
  <label className="block text-gray-700">Durability</label>
  <input
    type="text"
    value={Durability}
    onChange={(e) => setDurability(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md"
    required
  />
</div>
<div className="mb-4">
  <label className="block text-gray-700">Texture</label>
  <input
    type="text"
    value={workability}
    onChange={(e) => setWorkability(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md"
    required
  />
</div>
<div className="mb-4">
  <label className="block text-gray-700">Janka Hardness</label>
  <input
    type="text"
    value={mor}
    onChange={(e) => setMor(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md"
    required
  />
</div>

<div className="mb-4">
  <label className="block text-gray-700">Average Dried Weight(kg/m³)</label>
  <input
    type="text"
    value={Endgrain}
    onChange={(e) => setEndgrain(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md"
    required
  />
</div>
  
      {/* Input fields for species data */}
      {/* End Uses input dynamically */}
      {endUses.map((endUse, index) => (
        <EndUseInput 
          key={index} 
          index={index} 
          endUse={endUse} 
          handleChange={handleChange} 
        />
      ))}
      <div className="w-full h-32">
        <button
          type="button"
          onClick={addNewUse}
          className="w-36 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Add Use
        </button>
      </div>
      {/* Grain Images Upload */}
      <div className="mb-4">
        <label className="block text-gray-700">Grain Images</label>
        <input type="file" onChange={handleGrainImageChange} className="w-full p-2 border border-gray-300 rounded-md" accept="image/*" multiple />
        <div className="flex mt-2">
          {Array.from(grainImages).map((image, index) => (
            <img key={index} src={URL.createObjectURL(image)} alt={`Grain ${index}`} className="w-20 h-20 object-cover mr-2" />
          ))}
        </div>
      </div>

      {/* Usage Images Upload */}
      <div className="mb-4">
        <label className="block text-gray-700">Usage Images</label>
        <input type="file" onChange={handleUsageImagesChange} className="w-full p-2 border border-gray-300 rounded-md" accept="image/*" multiple />
        <div className="flex mt-2">
          {Array.from(usageImages).map((image, index) => (
            <img key={index} src={URL.createObjectURL(image)} alt={`Usage ${index}`} className="w-20 h-20 object-cover mr-2" />
          ))}
        </div>
      </div>

      {/* Submit button */}
  <div className="mt-6">
        {loading ? (
          <div className="flex justify-center">
            <svg
              className="animate-spin h-6 w-6 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        ) : (
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Add Species</button>
        )}
      </div></form>
  );
};

export default SpeciesForm;
