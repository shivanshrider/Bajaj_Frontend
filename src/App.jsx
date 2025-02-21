import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [inputData, setInputData] = useState('');
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Validate JSON input
  const isValidJson = (str) => {
    try {
      const parsedData = JSON.parse(str);
      if (parsedData && parsedData.data && Array.isArray(parsedData.data)) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  // Handle button click to select/deselect filter
  const handleFilterClick = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  // Submit JSON data
  // Submit JSON data
  const handleSubmit = async () => {
    if (!isValidJson(inputData)) {
      setError('Invalid JSON format or missing "data" field');
      setResponseData(null);
      return;
    }

    setError('');
    const jsonData = JSON.parse(inputData);

    // Fix the structure of the payload: it should be { data: [...] }
    const payload = { data: jsonData.data || jsonData }; // Ensure correct structure

    console.log('Payload:', payload); // Log the data being sent

    try {
      // Send the POST request to the backend API
      const res = await axios.post('https://bajaj-backend-mu-one.vercel.app/bfhl', payload, {
        headers: {
          'Content-Type': 'application/json'  // Ensure content-type is set to JSON
        }
      });
      setResponseData(res.data);
      setShowDropdown(true); // Show filter buttons after successful response
    } catch (err) {
      console.error('Error during POST request:', err);
      setError('Error submitting data');
      setResponseData(null);
    }
  };


  // Render the response based on selected filters
  const renderResponse = () => {
    if (!responseData) return null;

    const { alphabets, numbers, highest_alphabet } = responseData;

    let filteredResponse = [];

    // Add the Alphabets data if selected
    if (selectedFilters.includes('Alphabets') && alphabets.length > 0) {
      filteredResponse.push(<div key="alphabets">Alphabets: {alphabets.join(', ')}</div>);
    }

    // Add the Numbers data if selected
    if (selectedFilters.includes('Numbers') && numbers.length > 0) {
      filteredResponse.push(<div key="numbers">Numbers: {numbers.join(', ')}</div>);
    }

    // Add the Highest Alphabet data if selected
    if (selectedFilters.includes('Highest alphabet') && highest_alphabet.length > 0) {
      filteredResponse.push(<div key="highest_alphabet">Highest Alphabet: {highest_alphabet.join(', ')}</div>);
    }

    return (
      <div className="mt-2">
        <h3 className="text-lg font-semibold mb-2">Filtered Response</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          {filteredResponse.length > 0 ? filteredResponse : 'No data to display'}
        </div>
      </div>
    );
  };



  // Remove filter from selected filters
  const removeFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter((item) => item !== filter));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Flask API and React Frontend</h1>

        {/* Input Field and Submit Button */}
        <div className="mb-6">
          <textarea
            value={inputData}
            onChange={handleInputChange}
            rows="4"
            className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder='Enter valid JSON here, e.g., {"data": ["M", "1", "334", "4", "B"]}'
          />
          <button
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 mt-4"
          >
            Submit JSON
          </button>
          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        </div>

        {/* Buttons for selecting response filters */}
        {showDropdown && (
          <div className="m">
            <p className="text-sm font-medium text-gray-600">Select Filters:</p>
            <div className="mb-2 flex gap-2">
              <button
                onClick={() => handleFilterClick('Alphabets')}
                className={px-4 py-2 rounded-lg ${selectedFilters.includes('Alphabets') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}}
              >
                Alphabets
              </button>
              <button
                onClick={() => handleFilterClick('Numbers')}
                className={px-4 py-2 rounded-lg ${selectedFilters.includes('Numbers') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}}
              >
                Numbers
              </button>
              <button
                onClick={() => handleFilterClick('Highest alphabet')}
                className={px-4 py-2 rounded-lg ${selectedFilters.includes('Highest alphabet') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}}
              >
                Highest alphabet
              </button>
            </div>
          </div>
        )}

        {/* Display selected filters as tags */}
        {selectedFilters.length > 0 && (
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-600">Selected Filters:</p>
            <div className="flex gap-2 flex-wrap">
              {selectedFilters.map((filter, index) => (
                <div key={index} className="flex items-center bg-indigo-600 text-white px-3 py-1 rounded-lg">
                  <span className="text-md " >{filter}</span>
                  <button
                    className="ml-2 text-2xl text-white hover:text-red-500 cursor-pointer"
                    onClick={() => removeFilter(filter)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display filtered response based on selected filters */}
        {renderResponse()}
      </div>
    </div>
  );
}

export default App;