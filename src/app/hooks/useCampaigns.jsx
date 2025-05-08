import { useState, useEffect } from 'react';
import axios from 'axios';

const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Filter campaigns to only show active ones
        const activeCampaigns = response.data.filter(campaign => campaign.status === "Active");
        setCampaigns(activeCampaigns);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return { campaigns, loading, error };
};

export default useCampaigns;
