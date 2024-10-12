import React from 'react';

const Delete = ({ speciesId, onDelete }) => {
  const handleClick = () => {
    onDelete(speciesId); // Call the delete function with the species ID
  };

  return (
    <button onClick={handleClick} className="text-red-500">
      Delete
    </button>
  );
};

export default Delete;
