import React from 'react';

const DashboardTitle = ({title, titleStyle}) => {
    return (
        <div>
            <h4 className={`text-primary text-[24px] font-semibold capitalize border-dashed border-b-2 border-secondary max-w-max mb-3 ${titleStyle}`}>{title}</h4>
        </div>
    );
};

export default DashboardTitle;