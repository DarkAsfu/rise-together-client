import { useState, useEffect } from 'react';
import axios from 'axios';

const useMyCampaign = () => {
  const [campaigns, setCampaigns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns/my/campaigns`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Filter out campaigns with Draft status
        const nonDraftCampaigns = response.data.filter(campaign => campaign.status !== 'Draft');
        setCampaigns(nonDraftCampaigns);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMyCampaigns();
  }, []);

  return { campaigns, loading, error };
};

export default useMyCampaign;
