import { useState, useEffect } from 'react';
import axios from 'axios';

const useCampaign = ({id}) => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns/${id}`);
        setCampaign(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCampaign();
  }, []);

  return { campaign, loading, error };
};

export default useCampaign;
