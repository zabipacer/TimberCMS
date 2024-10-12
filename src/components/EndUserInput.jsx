const EndUseInput = ({ index, endUse, handleChange }) => {
    return (
      <div className="flex space-x-4 mb-4">
        <div className=''>
          <label htmlFor={`useName-${index}`} className="block text-sm font-medium text-gray-700">End Use Name</label>
          <input
            type="text"
            id={`useName-${index}`}
            name="useName"
            value={endUse.useName}
            onChange={(e) => handleChange(e, index)}
            className="mt-1 w-36 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter name of end use for species"
          />
        </div>
  
        <div className=''>
          <label htmlFor={`useDescription-${index}`} className="block text-sm font-medium text-gray-700">End Use Description</label>
          <textarea
            id={`useDescription-${index}`}
            name="useDescription"
            value={endUse.useDescription}
            onChange={(e) => handleChange(e, index)}
            className="mt-1 w-36 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter a description for end use of species"
          ></textarea>
        </div>
      </div>
    );
  };
  
  export default EndUseInput;
  