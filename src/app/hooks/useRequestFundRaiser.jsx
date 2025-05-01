import { useState, useEffect } from 'react';
import axios from 'axios';

const useRequestFundRaiser = () => {
  const [requestFundRaiser, setRequestFundRaiser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequestFundRaiser = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/fundraiser-requests`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setRequestFundRaiser(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRequestFundRaiser();
  }, []);

  return { requestFundRaiser, loading, error };
};

export default useRequestFundRaiser;
