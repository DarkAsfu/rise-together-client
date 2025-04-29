import Image from 'next/image'
import TitleSubTitle from './TitleSubTitle'
import dashboard from '../../../public/dashboard.svg'
import donors from '../../../public/donors.svg'
import manage from '../../../public/manage.svg'
import intl from '../../../public/intl.svg'
import payment from '../../../public/payment.svg'
import success from '../../../public/success.svg'
import support from '../../../public/support.svg'
import withdraw from '../../../public/withdraw.svg'

const Service = () => {
  const services = [
    {
      id: 1,
      icon: success,
      title: "Industry's best fundraising success"
    },
    {
      id: 2,
      icon: donors,
      title: 'Supported By 10+ Donors'
    },
    {
      id: 3,
      icon: manage,
      title: 'Easy-To-Manage Tools To Boost Results'
    },
    {
      id: 4,
      icon: support,
      title: 'Rise Together Get Expert Support 24/7'
    },
    {
      id: 5,
      icon: dashboard,
      title: 'A Dedicated Smart-Dashboard'
    },
    {
      id: 6,
      icon: payment,
      title: 'Receive donations via all popular payment'
    },
    {
      id: 7,
      icon: intl,
      title: 'International Payment Support'
    },
    {
      id: 8,
      icon: withdraw,
      title: 'Withdraw Funds Without Hassle'
    }
  ]
  return (
    <div
      className='max-w-7xl mx-auto relative'
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
      <div className='relative z-10 py-20'>
        <TitleSubTitle
          subTitle={'Services'}
          titleStyle={'text-center'}
          subTitleStyle={'font-semibold text-center'}
          title={'Why Rise Together'}
        />
        {/* <Image src={dashboard} width={80} height={10} alt="icon"/> */}
        <div className='mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-2'>
          {services.map((s) => (
            <div key={s.id} className='group text-center bg-white hover:bg-primary transition-all translate-3 p-10 rounded-2xl'>
                <Image className='mx-auto' src={s.icon} width={60} height={10} alt="icon"/>
                <div className='border-3 my-3 border-secondary w-16 mx-auto rounded-md group-hover:border-white'></div>
                <h3 className='text-[#071c35] group-hover:text-white text-[18px]'>{s.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Service
