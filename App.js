import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [urls, setUrls] = useState('');
  const [numbers, setNumbers] = useState([]);

  const fetchNumbers = async () => {
    try {
      const response = await axios.get(`http://localhost:8008/numbers?url=${urls}`);
      setNumbers(response.data.numbers);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Number Management Service</h1>
      <div>
        <input
          type="text"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder=" "
        />
        <button onClick={fetchNumbers}>Fetch Numbers</button>
      </div>
      {numbers.length > 0 && (
        <div>
          <h2>Numbers:</h2>
          <ul>
            {numbers.map((num) => (
              <li key={num}>{num}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
