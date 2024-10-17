import React, { useState, useEffect } from 'react';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase/firebase';
import { ref as dbRef, update } from 'firebase/database'; // Use update for editing
import EndUseInput from './EndUserInput';
import { deleteObject } from "firebase/storage"; // Import deleteObject

const EditForm = ({ species, onSubmit, toggleForm }) => {  const [speciesName, setSpeciesName] = useState(species?.name || '');

  // Handle multiple grain images and set default values to empty arrays if undefined
  const [grainImages, setGrainImages] = useState([]); 
  const [existingGrainImages, setExistingGrainImages] = useState(species?.grainImages || []); // Handle undefined grainImages
  const [usageImages, setUsageImages] = useState([]);
  const [existingUsageImages, setExistingUsageImages] = useState(species?.usageImages || []); // Handle undefined usageImages
  const [loading, setLoading] = useState(false); 

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
      
      if (species.grain) setGrain(species.grain);
      if (species.Durability) setDurability(species.Durability);
      if (species.workability) setWorkability(species.workability);
      if (species.Janka) setJanka(species.Janka);
      if (species.Endgrain) setEndgrain(species.Endgrain);
      if (species.endUses) setEndUses(species.endUses);
    }
  }, [species]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
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

    // Handle usage images
  let usageImageUrls = [];
  
  // Upload replaced images
  for (let i = 0; i < existingUsageImages.length; i++) {
    if (typeof existingUsageImages[i] === 'string') {
      usageImageUrls.push(existingUsageImages[i]); // Keep existing URLs
    } else {
      // Replace existing image with new one
      const url = await uploadImage(existingUsageImages[i], `species/${speciesId}/usageImages/${existingUsageImages[i].name}`);
      usageImageUrls[i] = url;
    }
  }

  // Add new usage images
  if (usageImages.length > 0) {
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
      Janka,
      Endgrain,
      endUses,
      workability
    });

    onSubmit({
      id: speciesId,
      name: speciesName? speciesName : 'no name',
      grainImages: grainImageUrls,
      usageImages: usageImageUrls,
      category,
      tagline,
      description,
      commonNames,
      color,
      grain,
      Durability,
      Janka,
      Endgrain,
      endUses,
      workability
    });

    clearForm();
   setLoading(false)
   toggleForm()
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
    setJanka('');
    setMoe('');
    
    setEndgrain('');
    setGrainImages([]);
    setUsageImages([]);
    setEndUses([{ useName: '', useDescription: '' }]);
  };

  const handleGrainImagesChange = (e) => {
    setGrainImages(Array.from(e.target.files)); // Allow multiple grain images
  };
  const handleUsageImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setUsageImages((prevImages) => [...prevImages, ...files]); // Handle new images separately
  };
  
  const replaceUsageImage = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedExistingImages = [...existingUsageImages];
      updatedExistingImages[index] = file;  // Replace the image at the specified index
      setExistingUsageImages(updatedExistingImages);  // Update the existing images array
    }
  };
  const removeUsageImage = (index) => {
    const updatedImages = [...existingUsageImages];
    updatedImages.splice(index, 1); // Remove the image at specific index
    setExistingUsageImages(updatedImages);
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
 

const handleDeleteEndUse = async (index) => {
  const speciesId = species.id;

  try {
    // Remove the end use from the state
    const updatedEndUses = [...endUses];
    updatedEndUses.splice(index, 1); // Remove the specific use at the index
    setEndUses(updatedEndUses);

    // Update the database to reflect the deleted end use
    const speciesRef = dbRef(db, `species/${speciesId}`);
    await update(speciesRef, {
      endUses: updatedEndUses,
    });

    console.log(`Deleted end use at index ${index}`);
  } catch (error) {
    console.error("Error deleting end use:", error);
  }
};


  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-md m-20">
      <h1 className="text-2xl font-bold mb-4">Edit Species</h1>
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
      value={Janka}
      onChange={(e) => setJanka(e.target.value)}
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

  
  {endUses.map((endUse, index) => (
    <div key={index} className="mb-4">
          <EndUseInput 
            index={index} 
            endUse={endUse} 
            handleChange={handleChange} 
          />
          {/* Delete button for each end use */}
          <button
            type="button"
            className="ml-4 text-red-500"
            onClick={() => handleDeleteEndUse(index)}
          >
            Delete Use
          </button>
        </div>
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
        {existingUsageImages.length > 0 && (
          <div>
            <p>Existing Images:</p>
            {existingUsageImages.map((imgUrl, index) => (
              <div key={index} className="flex items-center mt-2">
                <img src={imgUrl} alt={`Usage ${index + 1}`} className="w-32" />
                <input type="file" onChange={(e) => replaceUsageImage(e, index)} />
                <button
                  type="button"
                  className="ml-4 text-red-500"
                  onClick={() => removeUsageImage(index)}
                >
                  Remove Image
                </button>
              </div>
            ))}
          </div>
        )}
        <input type="file" multiple onChange={handleUsageImagesChange} />
        <p className="text-gray-500">Add new images or replace existing ones above.</p>
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
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Save Changes</button>
        )}
</div>
   
     </form>
  );
};

export default EditForm;