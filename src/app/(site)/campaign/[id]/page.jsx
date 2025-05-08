'use client'
import useCampaign from '@/app/hooks/useCampaign'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'
import Image from 'next/image'
import useFundRaiseInfo from '@/app/hooks/useFundRaiseInfo'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { HandHeart } from 'lucide-react'

const Page = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const { id } = useParams()
  const { campaign, loading, error } = useCampaign({ id })
  const user_id = campaign?.user_id
  console.log(user_id)
  const { fundRaiser } = useFundRaiseInfo(user_id)
  console.log(campaign)
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div className='max-w-5xl mx-auto flex my-10 justify-between'>
        <div className='w-[64%]'>
          <style jsx global>{`
            .swiper-button-next,
            .swiper-button-prev {
              color: #ff6b6b !important;
            }
            .swiper-pagination-bullet-active {
              background: #ff6b6b !important;
            }
          `}</style>
          <Swiper
            modules={[Navigation, Pagination, Thumbs, FreeMode]}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            thumbs={{ swiper: thumbsSwiper }}
            spaceBetween={0}
            slidesPerView={1}
            className='main-swiper mb-2'
          >
            {campaign?.images?.map((image, index) => (
              <SwiperSlide key={index}>
                <div className='relative w-full h-[400px]'>
                  <Image
                    src={image}
                    alt={`Campaign image ${index + 1}`}
                    fill
                    className='object-cover rounded-md'
                    quality={100}
                    priority={index === 0}
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 64vw'
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[FreeMode, Navigation, Thumbs]}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            loop={true}
            className='thumbs-swiper'
          >
            {campaign?.images?.map((image, index) => (
              <SwiperSlide key={index}>
                <div className='relative w-full h-[80px] cursor-pointer'>
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className='object-cover rounded-md'
                    quality={80}
                    sizes='(max-width: 768px) 25vw, 15vw'
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div>
            <h2 className='text-heading text-[32px] font-semibold my-4 capitalize'>
              {campaign?.title}
            </h2>
            <p className='text-[#777777] text-[16px] leading-7'>
              {campaign.description}
            </p>
            <h2 className='text-heading text-[24px] font-semibold my-4 capitalize'>
              About Fundraise
            </h2>
            <p className='text-[#777777] text-[16px] leading-7'>
              {fundRaiser?.about}
            </p>
          </div>
        </div>
        <div className='w-[32%]'>
          <div className='bg-[#F3F4F8] p-6 rounded-md'>
            <button className='group w-full cursor-pointer slide-anime px-3 md:px-5 py-3 rounded-full dark:bg-white bg-primary-base text-white dark:text-black flex justify-center items-center font-semibold bg-primary gap-1'>
              Donate Now{' '}
              <div className='group-hover:translate-x-2 transition-all'>
                <HandHeart size={18} />
              </div>
            </button>
          </div>
          <div className='mt-6 bg-[#F3F4F8] p-6 rounded-md'>
            <div className='flex justify-between items-center mb-4'>
              <span className='text-[#777777]'>Raised</span>
              <span className='text-heading font-semibold'>
                ${campaign.current_amount.toLocaleString()} / $
                {campaign.goal_amount.toLocaleString()}
              </span>
            </div>

            <div className='w-full bg-gray-200 rounded-full h-2.5 mb-6'>
              <div
                className='bg-primary-base h-2.5 rounded-full'
                style={{
                  width: `${
                    (campaign.current_amount / campaign.goal_amount) * 100
                  }%`
                }}
              ></div>
            </div>

            <div className='space-y-4'>
              <div className='flex justify-between'>
                <span className='text-[#777777]'>Category</span>
                <span className='text-heading font-medium'>
                  {campaign.category}
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='text-[#777777]'>Location</span>
                <span className='text-heading font-medium'>
                  {campaign.location}
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='text-[#777777]'>Days Left</span>
                <span className='text-heading font-medium'>
                  {Math.max(
                    0,
                    Math.ceil(
                      (new Date(campaign.deadline) - new Date()) /
                        (1000 * 60 * 60 * 24)
                    )
                  )}{' '}
                  days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
