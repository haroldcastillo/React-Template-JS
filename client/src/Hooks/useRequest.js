import { useState } from 'react';
import axios from 'axios';

function useRequest() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = async (config) => {
    setLoading(true);
    try {
      const response = await axios(config);
      setData(response.data);
      alert('Request Successful!'); // Modify this based on your needs
    } catch (error) {
      setError(error);
      console.error('Error making request:', error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, makeRequest };
}

export default useRequest;
