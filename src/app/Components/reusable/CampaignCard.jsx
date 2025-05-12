import { Slider } from '@/components/ui/slider'
import { Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CampaignCard = ({ campaigns = [] }) => {
  return (
    <div className=''>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10'>
        {campaigns?.map((campaign, index) => (
          <Link
            href={`/campaign/${campaign._id}`}
            key={campaign.id || index}
            className='rounded-lg bg-white overflow-hidden shadow-md h-[600px] flex flex-col'
          >
            <div className='relative h-[240px] flex-shrink-0'>
              {campaign?.images?.[0] ? (
                <Image
                  src={campaign.images[0]}
                  alt={`${campaign.category || 'Campaign'} image`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className='transition-opacity duration-300'
                  loading='lazy'
                  sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                />
              ) : (
                <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                  <span className='text-gray-400'>No image available</span>
                </div>
              )}
            </div>
            <div className='py-6 px-7 flex-grow flex flex-col'>
              {campaign.category && (
                <h3 className='mt-4 text-[14px] font-bold text-primary capitalizer'>
                  {campaign.category}
                </h3>
              )}
              <h2 className='text-[24px] text-heading font-semibold'>
                {campaign?.title}
              </h2>
              <div className='flex items-center gap-3 my-2'>
                <Image
                  width={30}
                  height={30}
                  alt='user-img'
                  src='https://i.ibb.co.com/fdDYDbc5/default-user.jpg'
                />
                <h4 className='text-[14px] text-heading'>
                  {campaign?.user_id?.name}
                </h4>
                <h3 className='flex items-center gap-1 text-[14px]'>
                  <Calendar className='text-primary' size={18} />
                  {Math.max(
                    0,
                    Math.ceil(
                      (new Date(campaign?.deadline) - new Date()) /
                        (1000 * 60 * 60 * 24)
                    )
                  )}{' '}
                  days left
                </h3>
              </div>
              <p className='text-[16px] text-[#777777] mt-1 '>
                {campaign?.description?.slice(0, 50)}...
              </p>
              <div className='mt-auto'>
                <div className='relative group mb-4'>
                  <Slider
                    value={[campaign.current_amount]}
                    max={campaign.goal_amount}
                    disabled
                    className='cursor-default'
                  />
                </div>
                <div className='flex justify-between'>
                  <h3 className='text-[13px] text-[#777777] font-semibold'>
                    Raised:{' '}
                    <span className={`${(campaign.current_amount >= campaign.goal_amount) ? 'text-green-500' : 'text-primary'}`}>
                      {campaign.current_amount}BDT
                    </span>
                  </h3>
                  <h3 className='text-[13px] text-[#777777] font-semibold'>
                    Goal:{' '}
                    <span className='text-primary'>
                      {campaign.goal_amount}BDT
                    </span>
                  </h3>
                  <h3 className='text-[13px] text-[#777777] font-semibold'>
                    Progress:{' '}
                    <span className={`${(campaign.current_amount >= campaign.goal_amount) ? 'text-green-500 animate-pulse' : 'text-primary'}`}>
                      {Math.round((campaign.current_amount / campaign.goal_amount) * 100)}%
                    </span>
                  </h3>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CampaignCard
