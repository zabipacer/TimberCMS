import React, { useState, useEffect } from 'react';
import SpeciesForm from './SpeciesForm';
import { db } from '../firebase/firebase';
import { get, ref, remove } from 'firebase/database'; // Import 'remove'
import Delete from './Delete';
import EditForm from './EditForm';

const Dashboard = () => {
  const [species, setSpecies] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false); // For edit functionality

  useEffect(() => {
    const fetchSpecies = async () => {
      const speciesRef = ref(db, 'species');
      const snapshot = await get(speciesRef);
      if (snapshot.exists()) {
        setSpecies(Object.values(snapshot.val()));
      } else {
        setSpecies([]);
      }
    };

    fetchSpecies();
  }, []);

  // Handle delete species
  const handleDelete = async (id) => {
    const speciesRef = ref(db, `species/${id}`);
    await remove(speciesRef); // Remove from the database
    setSpecies((prevSpecies) => prevSpecies.filter((item) => item.id !== id)); // Update state
  };

  // Handle edit species
  const handleEdit = (speciesToEdit) => {
    setSelectedSpecies(speciesToEdit); // Set the selected species for editing
    setIsEditFormVisible(true); // Show the form with pre-filled values
  };

  // Handle form submission (for adding new or editing)
  const handleFormSubmit = (updatedSpecies) => {
    if (selectedSpecies) {
      // If editing, update the list with new values
      setSpecies((prevSpecies) =>
        prevSpecies.map((item) =>
          item.id === updatedSpecies.id ? updatedSpecies : item
        )
      );
    } else {
      // If adding new species
      setSpecies((prevSpecies) => [...prevSpecies, updatedSpecies]);
    }

    setIsFormVisible(false); // Hide the form after submission
    setSelectedSpecies(null); // Reset selected species
  };

  // Toggle form visibility
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
   setSelectedSpecies(null); // Reset selected species if closed
  };
  const toggleEditForm = () => {
   setSelectedSpecies(null);
    setIsEditFormVisible(!isEditFormVisible)
    // Reset selected species if closed
  };

  return (
    <div className="dashboard">
      <h1 className="text-3xl font-bold mb-6">Species Dashboard</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        onClick={toggleForm}
      >
        {isFormVisible ? 'Close Form' : 'Add New Species'}
      </button>

      {isFormVisible && (
        <SpeciesForm
          onSubmit={handleFormSubmit}
          toggleForm={toggleForm}
        />
      )}
      {
        isEditFormVisible && (
          <EditForm
onSubmit={handleFormSubmit}
          toggleForm={toggleEditForm}
          species={selectedSpecies}
          />
        )
      }

      <div className="species-list">
        {species.map((specimen) => (
          <div
            key={specimen.id}
            className="p-4 bg-white shadow-md rounded-md mb-4 flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{specimen.name}</h2>
              <p>{specimen.description}</p>
            </div>

            <div className="flex space-x-4">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                onClick={() => handleEdit(specimen)}
              >
                Edit
              </button>

              <button
                className="bg-red-500 text-white px-3 py-1 rounded-md"
                onClick={() => handleDelete(specimen.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
