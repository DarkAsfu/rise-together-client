import { useState, useEffect } from 'react';
import axios from 'axios';

const useDonations = () => {
  const [donations, setDonations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/donations`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setDonations(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  return { donations, loading, error };
};

export default useDonations;
