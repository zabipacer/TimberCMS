import React, { useState, useEffect } from 'react';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase/firebase';
import { ref as dbRef, update } from 'firebase/database'; // Use update for editing
import EndUseInput from './EndUserInput';

const EditForm = ({ species, onSubmit, toggleForm }) => {
  const [speciesName, setSpeciesName] = useState(species.name || '');
  const [grainImage, setGrainImage] = useState(null); // Handle new grain image
  const [existingGrainImage, setExistingGrainImage] = useState(species.grainImage || null); // Keep track of the existing image
  const [usageImages, setUsageImages] = useState([]);
  const [existingUsageImages, setExistingUsageImages] = useState(species.usageImages || []); // Track old images
  
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

  useEffect(() => {
    if (species) {
      setSpeciesName(species.name);
      setExistingGrainImage(species.grainImage);
      setExistingUsageImages(species.usageImages || []);
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
      if (species.grainImage) setGrainImage(species.grainImage);
      
    }
  }, [species]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const speciesId = species.id;
  
    // Function to upload an image if it exists
    const uploadImage = async (file, path) => {
      const storage = getStorage();
      const imageRef = storageRef(storage, path);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      return url;
    };
  
    // Check if a new grain image was selected, else use the existing image
    let grainImageUrl = existingGrainImage; // Default to existing image
    if (grainImage) {
      grainImageUrl = await uploadImage(grainImage, `species/${speciesId}/grainImage`);
    }
  
    // Handle usage images (replace if new ones are provided)
    let usageImageUrls = existingUsageImages;
    if (usageImages.length > 0) {
      usageImageUrls = []; // Replace the old images
      for (const file of usageImages) {
        const url = await uploadImage(file, `species/${speciesId}/usageImages/${file.name}`);
        usageImageUrls.push(url);
      }
    }
  
    // Update species in the database
    const speciesRef = dbRef(db, `species/${speciesId}`);
    await update(speciesRef, {
      name: speciesName,
      grainImage: grainImageUrl, // Use updated or existing grain image
      usageImages: usageImageUrls, // Use updated or existing usage images
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
  
    // Pass updated species to the onSubmit handler
    onSubmit({
      id: speciesId,
      name: speciesName,
      grainImage: grainImageUrl,
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
    toggleForm();
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
    
    setEndUses('');
  };
  // Grain image change handler:
  // Grain image change handler:
const handleGrainImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setGrainImage(file); // Only update state if a new image is selected
  }
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
    setEndUses([...endUses, { useName: '', useDescription: '' }]); // Add new object for additional use
  };



  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-md m-20">
      <h1 className="text-2xl font-bold mb-4">Edit Species</h1>
      
      {/* Species name */}
      <div className="mb-4">
        <label className="block text-gray-700">Species Name</label>
        <input
          type="text"
          value={speciesName}
          onChange={(e) => setSpeciesName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <h1 className="text-2xl font-bold mb-4">Edit The Species</h1>
  
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


      {/* Grain Image */}
      <div className="mb-4">
        <label className="block text-gray-700">Grain Image</label>
        <input type="file" onChange={handleGrainImageChange} />
        {existingGrainImage && (
          <div>
            <p>Existing Image:</p>
            <img src={existingGrainImage} alt="Grain" className="mt-2 w-32" />
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
              <img key={index} src={imgUrl} alt={`Usage ${index}`} className="mt-2 w-32" />
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Save Changes
      </button>
    </form>
  );
};

export default EditForm;

import React, { useState, useEffect } from 'react';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase/firebase';
import { ref as dbRef, update } from 'firebase/database';
import EndUseInput from './EndUserInput';

const EditForm = ({ species, onSubmit, toggleForm }) => {
  const [speciesName, setSpeciesName] = useState(species.name || '');
  const [grainImages, setGrainImages] = useState([]); // Allow multiple grain images
  const [existingGrainImages, setExistingGrainImages] = useState(species.grainImages || []); // Track existing grain images
  const [usageImages, setUsageImages] = useState([]);
  const [existingUsageImages, setExistingUsageImages] = useState(species.usageImages || []);

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
      setSpeciesName(species.name);
      setExistingGrainImages(species.grainImages || []);
      setExistingUsageImages(species.usageImages || []);
      setDescription(species.description || '');
      setCommonNames(species.commonNames || ['']);
      setColor(species.color || '');
      setMoe(species.moe || '');
      setJanka(species.Janka || '');
      setGrain(species.grain || '');
      setDurability(species.Durability || '');
      setWorkability(species.workability || '');
      setMor(species.mor || '');
      setEndgrain(species.Endgrain || '');
      setEndUses(species.endUses || [{ useName: '', useDescription: '' }]);
    }
    else{
      setSpeciesName('');
      setExistingGrainImages( []);
      setExistingUsageImages([]);
      setDescription( '');
      setCommonNames( ['']);
      setColor( '');
      setMoe( '');
      setJanka( '');
      setGrain('');
      setDurability( '');
      setWorkability( '');
      setMor( '');
      setEndgrain( '');
      setEndUses( [{ useName: '', useDescription: '' }]);
    }
    
  }, [species]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const speciesId = species.id;

    // Function to upload images
    const uploadImage = async (file, path) => {
      const storage = getStorage();
      const imageRef = storageRef(storage, path);
      await uploadBytes(imageRef, file);
      return await getDownloadURL(imageRef);
    };

    // Upload grain images if any
    let grainImageUrls = existingGrainImages;
    if (grainImages.length > 0) {
      grainImageUrls = [];
      for (const file of grainImages) {
        const url = await uploadImage(file, `species/${speciesId}/grainImages/${file.name}`);
        grainImageUrls.push(url);
      }
    }

    // Upload usage images if any
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
    toggleForm();
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

  // Handlers for image uploads
  const handleGrainImagesChange = (e) => {
    setGrainImages(Array.from(e.target.files)); // Handle multiple grain images
  };

  const handleUsageImagesChange = (e) => {
    setUsageImages(Array.from(e.target.files)); // Handle multiple usage images
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
        <label className="block text-gray-700">Species Name</label>
        <input
          type="text"
          value={speciesName}
          onChange={(e) => setSpeciesName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Other fields */}
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

      {/* Grain Images */}
      <div className="mb-4">
        <label className="block text-gray-700">Grain Images</label>
        <input type="file" multiple onChange={handleGrainImagesChange} />
        {existingGrainImages.length > 0 && (
          <div>
            <p>Existing Grain Images:</p>
            {existingGrainImages.map((imgUrl, index) => (
              <img key={index} src={imgUrl} alt={`Grain ${index}`} className="mt-2 w-32" />
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
            <p>Existing Usage Images:</p>
            {existingUsageImages.map((imgUrl, index) => (
              <img key={index} src={imgUrl} alt={`Usage ${index}`} className="mt-2 w-32" />
            ))}
          </div>
        )}
      </div>

      {/* End Uses */}
      {endUses.map((endUse, index) => (
        <EndUseInput key={index} index={index} endUse={endUse} handleChange={handleChange} />
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

      <div className="mt-6">
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditForm;
