import DashboardTitle from '@/app/Components/DashboardTitle';
import CampaignRequestForm from '@/app/Components/fundraiser/CampaignRequestForm';
import React from 'react';

const page = () => {
    return (
        <div className='container mx-auto py-7'>
            <DashboardTitle title={"Create Campaign"} />
            <CampaignRequestForm/>
        </div>
    );
};

export default page;