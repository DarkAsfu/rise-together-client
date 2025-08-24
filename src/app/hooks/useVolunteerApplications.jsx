import { useState, useEffect } from 'react';
import axios from 'axios';

const useVolunteerApplications = () => {
  const [volunteerApplications, setVolunteerApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVolunteerApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/volunteer-applications`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setVolunteerApplications(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchVolunteerApplications();
  }, []);

  return { volunteerApplications, loading, error };
};

export default useVolunteerApplications;
