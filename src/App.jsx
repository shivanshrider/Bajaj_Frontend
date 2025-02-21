import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [inputData, setInputData] = useState('');
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Validate JSON input
  const isValidJson = (str) => {
    try {
      const parsedData = JSON.parse(str);
      // Check if the parsed JSON has the correct structure: { "data": [ ... ] }
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

  // Handle multi-select dropdown change
  const handleDropdownChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedOptions(options);
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

  // Ensure that the payload is correctly structured: { data: [...] }
  const payload = { data: jsonData.data || jsonData };  // Fixing the structure

  console.log('Payload:', payload); // Log the data being sent

  try {
    // Send the POST request to the backend API
    const res = await axios.post('https://bajaj-backend-mu-one.vercel.app/bfhl', payload, {
      headers: {
        'Content-Type': 'application/json'  // Ensure content-type is set to JSON
      }
    });
    setResponseData(res.data);
    setShowDropdown(true); // Show dropdown after successful response
  } catch (err) {
    console.error('Error during POST request:', err);
    setError('Error submitting data');
    setResponseData(null);
  }
};


  // Render the response based on selected options
  const renderResponse = () => {
    if (!responseData) return null;

    const { alphabets, numbers, highest_alphabet } = responseData;

    let filteredResponse = {};

    if (selectedOptions.includes('Alphabets')) {
      filteredResponse = { ...filteredResponse, Alphabets: alphabets };
    }
    if (selectedOptions.includes('Numbers')) {
      filteredResponse = { ...filteredResponse, Numbers: numbers };
    }
    if (selectedOptions.includes('Highest alphabet')) {
      filteredResponse = { ...filteredResponse, HighestAlphabet: highest_alphabet };
    }

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Response:</h3>
        <pre className="bg-gray-100 p-4 rounded-lg">{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
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

        {/* Dropdown for selecting response options */}
        {showDropdown && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Select data to display:</label>
            <select
              multiple
              value={selectedOptions}
              onChange={handleDropdownChange}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Alphabets">Alphabets</option>
              <option value="Numbers">Numbers</option>
              <option value="Highest alphabet">Highest alphabet</option>
            </select>
          </div>
        )}

        {/* Display filtered response based on dropdown selection */}
        {renderResponse()}
      </div>
    </div>
  );
}

export default App;
