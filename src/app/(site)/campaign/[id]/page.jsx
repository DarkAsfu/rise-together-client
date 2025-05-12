'use client'
import useCampaign from '@/app/hooks/useCampaign'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Slider } from "@/components/ui/slider"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

const Page = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [donorMessage, setDonorMessage] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [amountError, setAmountError] = useState('')
  const router = useRouter()
  const { id } = useParams()
  const { campaign, loading, error } = useCampaign({ id })
  const user_id = campaign?.user_id?._id
  const { fundRaiser } = useFundRaiseInfo(user_id)

  const isGoalReached = campaign?.current_amount >= campaign?.goal_amount

  const remainingAmount = campaign?.goal_amount - campaign?.current_amount

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const handleDonateClick = () => {
    if (isGoalReached) {
      return
    }
    
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname)
      router.push('/signin')
      return
    }
    setIsModalOpen(true)
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    setAmount(value)
    
    if (Number(value) > remainingAmount) {
      setAmountError(`Maximum donation amount cannot exceed $${remainingAmount.toLocaleString()}`)
    } else {
      setAmountError('')
    }
  }

  const handleDonationSubmit = async () => {
    if (Number(amount) > remainingAmount) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          campaign_id: id,
          amount: Number(amount),
          is_anonymous: isAnonymous,
          donor_message: donorMessage
        })
      })

      const data = await response.json()
      console.log('Donation Response:', data)

      if (response.ok && data.success) {
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
        }
        
        setIsModalOpen(false)
        setAmount('')
        setIsAnonymous(false)
        setDonorMessage('')
        setAmountError('')
      } else {
        console.error('Donation failed:', data)
      }
    } catch (error) {
      console.error('Error submitting donation:', error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div className='max-w-5xl mx-auto flex my-10 justify-between px-2'>
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
          {/* Rest of the Swiper components remain the same */}
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
          {/* Campaign details section remains the same */}
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
            <h4 className='text-[18px] text-semibold capitalize'>
              {campaign?.user_id?.name}
            </h4>
            <p className='text-[#777777] text-[14px] '>
              {campaign?.user_id?.email}
            </p>
            {fundRaiser?.organizationName && (
              <h4 className='text-[16px] mt-2 text-semibold capitalize'>
                Organization Name: {fundRaiser?.organizationName}
              </h4>
            )}
            <p className='text-[#777777] text-[16px] leading-7'>
              {fundRaiser?.about}
            </p>
            <div className='my-4'>
              <p className='text-gray-600 text-base leading-relaxed'>
                <span className='font-semibold text-gray-800'>
                  Campaign Goal:{' '}
                </span>
                {fundRaiser?.goals}
              </p>
            </div>
            <div className='mb-4'>
              <p className='text-gray-600 text-base leading-relaxed'>
                <span className='font-semibold text-gray-800'>
                  Campaign Purpose:{' '}
                </span>
                {fundRaiser?.purpose}
              </p>
            </div>
          </div>
        </div>
        <div className='w-[32%]'>
          <div className='bg-[#F3F4F8] p-6 rounded-md'>
            {isGoalReached ? (
              <div className='text-center text-green-600 font-semibold mb-2'>
                Fundraising goal has been reached! Thank you for your support.
              </div>
            ) : (
              <button 
                onClick={handleDonateClick}
                className='group w-full cursor-pointer slide-anime px-3 md:px-5 py-3 rounded-full dark:bg-white bg-primary-base text-white dark:text-black flex justify-center items-center font-semibold bg-primary gap-1'
              >
                Donate Now{' '}
                <div className='group-hover:translate-x-2 transition-all'>
                  <HandHeart size={18} />
                </div>
              </button>
            )}
          </div>
          <div className='mt-6 bg-[#F3F4F8] p-6 rounded-md'>
            <div className='flex justify-between items-center mb-4'>
              <span className='text-[#777777]'>Raised</span>
              <span className='text-heading font-semibold'>
                ${campaign?.current_amount?.toLocaleString() || '0'} / $
                {campaign?.goal_amount?.toLocaleString() || '0'}
              </span>
            </div>

            <Slider
              defaultValue={[campaign?.current_amount && campaign?.goal_amount 
                ? Math.min((campaign.current_amount / campaign.goal_amount) * 100, 100)
                : 0]}
              max={100}
              step={1}
              disabled
              className="w-full mb-6"
              value={[campaign?.current_amount && campaign?.goal_amount 
                ? Math.min((campaign.current_amount / campaign.goal_amount) * 100, 100)
                : 0]}
            />

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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a Donation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount ($)</label>
              <Input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter donation amount"
                max={remainingAmount}
              />
              {amountError && (
                <p className="text-red-500 text-sm mt-1">{amountError}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              <label htmlFor="anonymous">Make donation anonymous</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message (Optional)</label>
              <Textarea
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                placeholder="Leave a message..."
              />
            </div>
            <Button 
              onClick={handleDonationSubmit} 
              className="w-full"
              disabled={!!amountError || !amount}
            >
              Submit Donation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Page
