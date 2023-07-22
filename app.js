const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;
const TIMEOUT_MS = 500; 


app.get('/numbers', async (req, res) => {
  const { url } = req.query;

  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter missing.' });
  }

  try {
    
    const requests = Array.isArray(url) ? url : [url];

    
    const successfulResponses = [];

    
    const fetchDataWithTimeout = (url) => {
      return new Promise(async (resolve, reject) => {
        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => {
          source.cancel('Timeout occurred');
        }, TIMEOUT_MS);

        try {
          const response = await axios.get(url, { cancelToken: source.token });
          clearTimeout(timeout);
          resolve(response.data.numbers);
        } catch (error) {
          clearTimeout(timeout);
          if (axios.isCancel(error)) {
            
            console.error(`Timeout occurred for URL: ${url}`);
          } else {
            console.error(`Error fetching data from URL: ${url}`);
          }
          reject(error);
        }
      });
    };

    
    const responses = await Promise.allSettled(requests.map(fetchDataWithTimeout));

    
    responses.forEach((response) => {
      if (response.status === 'fulfilled') {
        successfulResponses.push(...response.value);
      }
    });

    
    const numbers = Array.from(new Set(successfulResponses)).sort((a, b) => a - b);

    res.json({ numbers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
