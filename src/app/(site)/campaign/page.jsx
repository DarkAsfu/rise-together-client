import Campaigns from '@/app/Components/Campaigns';
import SectionBanner from '@/app/Components/reusable/SectionBanner';
import React from 'react';

const page = () => {
    return (
        <div>
            <SectionBanner title={"Campaigns"} />
            <Campaigns/>
        </div>
    );
};

export default page;