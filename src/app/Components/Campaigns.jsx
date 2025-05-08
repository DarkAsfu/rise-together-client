'use client'
import React from 'react'
import TitleSubTitle from './TitleSubTitle'
import useCampaigns from '../hooks/useCampaigns'
import CampaignCard from './reusable/CampaignCard'

const Campaigns = () => {
  const { campaigns, loading, error } = useCampaigns();
  console.log(campaigns);
  return (
    <div
      className=' relative mt-10 md:mt-0'
      style={{
        backgroundImage: `url('/servicebg.png')`, // ✅ direct path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
        // minHeight: ''
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(243, 244, 246, 0.5)' // overlay
        }}
      />
      <div className='relative z-10 py-20 max-w-7xl mx-auto px-2'>
        <TitleSubTitle
          title={'Show All Running Campaigns'}
          titleStyle={'text-center max-w-2xl mx-auto'}
          subTitle={'LATEST CAUSES'}
          subTitleStyle={'font-semibold text-center'}
        />
        <CampaignCard campaigns={campaigns} />
      </div>
    </div>
  )
}

export default Campaigns
