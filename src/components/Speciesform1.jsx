import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import { ref as dbRef, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import EndUseInput from './EndUserInput';

const SpeciesForm = ({ onSubmit, toggleForm }) => {
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

  const [grainImage, setGrainImage] = useState(null);
  const [usageImages, setUsageImages] = useState([]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const speciesId = Math.random().toString(36).substr(2, 9);

    const uploadImage = async (file, path) => {
      toggleForm();
      const storage = getStorage();
      const imageRef = storageRef(storage, path);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      return url;
    };

    let grainImageUrl = null;
    if (grainImage) {
      grainImageUrl = await uploadImage(grainImage, `species/${speciesId}/grainImage`);
    }

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
      MOR: mor,
      MOE: moe,
      Janka,
      Endgrain,
      grainImage: grainImageUrl,
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
      MOR: mor,
      MOE: moe,
      Janka,
      Endgrain,
      grainImage: grainImageUrl,
      usageImages: usageImageUrls,
      endUses,
      workability
    });

    clearForm();
  };

  const handleGrainImageChange = (e) => {
    setGrainImage(e.target.files[0]);
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
    setGrainImage(null);
    setUsageImages([]);
    setEndUses([{ useName: '', useDescription: '' }]); // Clear end uses
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-md m-20">
      <h1 className="text-2xl font-bold mb-4">Add New Species</h1>
      {/* Form fields */}
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
  <label className="block text-gray-700">description</label>
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
  <label className="block text-gray-700">Workability</label>
  <input
    type="text"
    value={workability}
    onChange={(e) => setWorkability(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md"
    required
  />
</div>
<div className="mb-4">
  <label className="block text-gray-700">MOR</label>
  <input
    type="text"
    value={mor}
    onChange={(e) => setMor(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md"
    required
  />
</div>
<div className="mb-4">
  <label className="block text-gray-700">MOE</label>
  <input
    type="text"
    value={moe}
    onChange={(e) => setMoe(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md"
    required
  />
</div>
<div className="mb-4">
  <label className="block text-gray-700">Janka Hardness '(Side)</label>
  <input
    type="text"
    value={Janka}
    onChange={(e) => setJanka(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md"
    required
  />
</div>
<div className="mb-4">
  <label className="block text-gray-700">Janka Hardness (End Grain)</label>
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

      {/* File uploads for images */}
      <div className="mb-4">
        <label className="block text-gray-700">Grain Image</label>
        <input type="file" onChange={handleGrainImageChange} className="w-full p-2 border border-gray-300 rounded-md" accept="image/*" />
        {grainImage && <img src={URL.createObjectURL(grainImage)} alt="Grain" className="mt-2 w-32 h-32 object-cover" />}
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
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Add Species</button>
    
    </form>
  );
};

export default SpeciesForm;
