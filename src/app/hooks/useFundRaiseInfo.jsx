import { useState, useEffect } from 'react';
import axios from 'axios';

const useFundRaiseInfo = (user_id) => {
    console.log(user_id); // here it get up in api show undifined
  const [fundRaiser, setFundRaiser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFundRaiser = async () => {
      try {
        if (!user_id) {
          setError('User ID is required');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/fundraiser/${user_id}`);
        setFundRaiser(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFundRaiser();
  }, [user_id]);

  return { fundRaiser, loading, error };
};

export default useFundRaiseInfo;
