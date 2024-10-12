import React, { useState, useEffect } from 'react';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase/firebase';
import { ref as dbRef, update } from 'firebase/database'; // Use update for editing
import EndUseInput from './EndUserInput';

const EditForm = ({ species, onSubmit, toggleForm }) => {  const [speciesName, setSpeciesName] = useState(species?.name || '');

  // Handle multiple grain images and set default values to empty arrays if undefined
  const [grainImages, setGrainImages] = useState([]); 
  const [existingGrainImages, setExistingGrainImages] = useState(species?.grainImages || []); // Handle undefined grainImages
  const [usageImages, setUsageImages] = useState([]);
  const [existingUsageImages, setExistingUsageImages] = useState(species?.usageImages || []); // Handle undefined usageImages

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
  const [endUses, setEndUses] = useState([{ useName: '', useDescription: '' }]);

  useEffect(() => {
    if (species) {
      setSpeciesName(species?.name || '');
      setExistingGrainImages(species?.grainImages || []);
      setExistingUsageImages(species?.usageImages || []);
      if (species.description) setDescription(species.description);
      if (species.commonNames) setCommonNames(species.commonNames);
      if (species.color) setColor(species.color);
      if (species.moe) setMoe(species.moe);
      if (species.Janka) setJanka(species.Janka);
      if (species.grain) setGrain(species.grain);
      if (species.Durability) setDurability(species.Durability);
      if (species.workability) setWorkability(species.workability);
      if (species.mor) setMor(species.mor);
      if (species.Endgrain) setEndgrain(species.Endgrain);
      if (species.endUses) setEndUses(species.endUses);
    }
  }, [species]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toggleForm();
    const speciesId = species.id;

    // Function to upload an image
    const uploadImage = async (file, path) => {
      const storage = getStorage();
      const imageRef = storageRef(storage, path);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      return url;
    };

    // Handle grain images
    let grainImageUrls = existingGrainImages;
    if (grainImages.length > 0) {
      grainImageUrls = []; // Clear the old images if new ones are provided
      for (const file of grainImages) {
        const url = await uploadImage(file, `species/${speciesId}/grainImages/${file.name}`);
        grainImageUrls.push(url);
      }
    }

    // Handle usage images (replace if new ones are provided)
    let usageImageUrls = existingUsageImages;
    if (usageImages.length > 0) {
      usageImageUrls = [];
      for (const file of usageImages) {
        const url = await uploadImage(file, `species/${speciesId}/usageImages/${file.name}`);
        usageImageUrls.push(url);
      }
    }

    // Update species in the database
    const speciesRef = dbRef(db, `species/${speciesId}`);
    await update(speciesRef, {
      name: speciesName,
      grainImages: grainImageUrls, // Updated grain images
      usageImages: usageImageUrls, // Updated usage images
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
      endUses,
    });

    onSubmit({
      id: speciesId,
      name: speciesName,
      grainImages: grainImageUrls,
      usageImages: usageImageUrls,
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
      endUses,
    });

    clearForm();
   
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
    setGrainImages([]);
    setUsageImages([]);
    setEndUses([{ useName: '', useDescription: '' }]);
  };

  const handleGrainImagesChange = (e) => {
    setGrainImages(Array.from(e.target.files)); // Allow multiple grain images
  };

  const handleUsageImagesChange = (e) => {
    setUsageImages(Array.from(e.target.files)); // Set new usage images
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedEndUses = [...endUses];
    updatedEndUses[index][name] = value;
    setEndUses(updatedEndUses);
  };

  const addNewUse = () => {
    setEndUses([...endUses, { useName: '', useDescription: '' }]);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-md m-20">
      <h1 className="text-2xl font-bold mb-4">Edit Species</h1>
      <div className="mb-4">
    <label className="block text-gray-700">Description</label>
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
    <label className="block text-gray-700">Janka Hardness (Side)</label>
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

      <div className="mb-4">
        <label className="block text-gray-700">Species Name</label>
        <input
          type="text"
          value={speciesName}
          onChange={(e) => setSpeciesName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Grain Images */}
      <div className="mb-4">
        <label className="block text-gray-700">Grain Images</label>
        <input type="file" multiple onChange={handleGrainImagesChange} />
        {existingGrainImages.length > 0 && (
          <div>
            <p>Existing Images:</p>
            {existingGrainImages.map((imgUrl, index) => (
              <img key={index} src={imgUrl} alt="Grain" className="mt-2 w-32" />
            ))}
          </div>
        )}
      </div>

      {/* Usage Images */}
      <div className="mb-4">
        <label className="block text-gray-700">Usage Images</label>
        <input type="file" multiple onChange={handleUsageImagesChange} />
        {existingUsageImages.length > 0 && (
          <div>
            <p>Existing Images:</p>
            {existingUsageImages.map((imgUrl, index) => (
              <img key={index} src={imgUrl} alt="Usage" className="mt-2 w-32" />
            ))}
          </div>
        )}
      </div>

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

      <button
        type="submit"
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
      >
        Save Changes
      </button>
    </form>
  );
};

export default EditForm;
