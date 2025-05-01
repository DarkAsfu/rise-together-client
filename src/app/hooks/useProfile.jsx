import { useState, useEffect } from 'react';
import axios from 'axios';

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};

export default useProfile;
