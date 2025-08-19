'use client'
import { useState, useEffect } from 'react'
import { ArrowRight, HandHeart, MenuIcon, X } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '../hooks/use-media-query'
import {
  DrawerContent,
  HeaderDrawer
} from '@/components/core/drawer/vaul-header'
import logo from '../../../public/logo.png'
import logo1 from '../../../public/logo1.png'
import { useAuth } from '../hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const featuredCampaigns = [
  {
    id: 1,
    classname: 'bg-gradient-to-l from-green-400 to-emerald-500',
    img: '/images/education-campaign.jpg',
    title: 'Education for All'
  },
  {
    id: 2,
    classname: 'bg-gradient-to-r from-blue-300 to-blue-800',
    img: '/images/healthcare-campaign.jpg',
    title: 'Healthcare Initiative'
  },
  {
    id: 3,
    classname: 'bg-gradient-to-tl from-purple-500 to-indigo-400',
    img: '/images/community-campaign.jpg',
    title: 'Community Development'
  }
]

export default function Navbar () {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [headerOpen, setHeaderOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`sticky top-0 z-50 ${
        isScrolled ? 'bg-white' : 'bg-transparent'
      } transition-colors duration-300 relative`}
    >
      <header
        className={`max-w-[94em] mx-auto grid grid-cols-2 md:grid-cols-3 items-center px-2 py-4 rounded-md ${
          isScrolled ? 'backdrop-blur-md' : ''
        }`}
      >
        <HeaderDrawer
          open={headerOpen}
          setOpen={setHeaderOpen}
          drawerBtn={() => (
            <button className='bg-primary max-w-max justify-self-start text-white p-2 rounded-md dark:bg-white dark:text-black'>
              <MenuIcon />
            </button>
          )}
        >
          <DrawerContent>
            {!isDesktop && (
              <div className='flex justify-center w-full absolute bottom-2 left-0'>
                <div className='w-16 h-[0.30rem] flex-shrink-0 rounded-full bg-gray-600 my-4' />
              </div>
            )}
            <div className='max-w-[94em] xl:mx-auto gap-4 px-2'>
              <div className='flex justify-between items-center align-middle border-b pb-4'>
                <button
                  className='flex justify-start p-2 mb-2 rounded-md dark:bg-white dark:text-black bg-primary text-white'
                  onClick={() => setHeaderOpen(false)}
                >
                  <X />
                </button>
                <Link href='/'>
                  <Image src={logo} alt='logo' width={150} height={100} />
                </Link>
              </div>
              <div className='flex justify-between pt-2'>
                <nav className='flex gap-8 w-[100%] md:w-[30%] lg:w-[20%]'>
                  <ul className='text-[16px] space-y-3 font-semibold uppercase pr-8'>
                    <li>
                      <Link
                        href='/'
                        className='relative flex items-center gap-2 max-w-max after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 dark:after:bg-white after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100'
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/about-us'
                        className='relative flex items-center gap-2 max-w-max after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 dark:after:bg-white after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100'
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/campaign'
                        className='relative flex items-center gap-2 max-w-max after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 dark:after:bg-white after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100'
                      >
                        Campaigns
                      </Link>
                    </li>
                    
                    <li>
                      <Link
                        href='/how-it-works'
                        className='relative flex items-center gap-2 max-w-max after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 dark:after:bg-white after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100'
                      >
                        How it Works
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/contact-us'
                        className='relative flex items-center gap-2 max-w-max after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 dark:after:bg-white after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100'
                      >
                       Contact Us
                      </Link>
                    </li>
                    <li>
                      {user && (
                     
                            <Link href="/dashboard"><Avatar>
                            <AvatarImage
                              className='cursor-pointer'
                              src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                              alt={user.name}
                            />
                            <AvatarFallback>
                              {user.name
                                .split(' ')
                                .map(name => name[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar></Link>
                      )}
                    </li>
                    <li>
                      {!user ? (
                        <Link
                          href='/auth/signin'
                          className='relative flex items-center gap-2 max-w-max after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 dark:after:bg-white after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100'
                        >
                          Sign In
                        </Link>
                      ) : (
                        <button
                          onClick={logout}
                          className='relative flex items-center gap-2 max-w-max after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 dark:after:bg-white after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100'
                        >
                          Logout
                        </button>
                      )}
                    </li>
                    <li>
                      <Link className='cursor-pointer' href='/#donations'>
                        <Button>Donate Now</Button>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </DrawerContent>
        </HeaderDrawer>

        <Link
          href='/'
          className='text-primary text-2xl font-bold justify-self-end md:justify-self-center'
        >
          <Image
            src={isScrolled ? logo : logo1}
            alt='logo'
            width={150}
            height={100}
          />
        </Link>

        <div className='hidden md:flex items-center justify-self-end gap-3'>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    className='cursor-pointer'
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt={user.name}
                  />
                  <AvatarFallback>
                    {user.name
                      .split(' ')
                      .map(name => name[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href='/dashboard'>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href='/dashboard/profile'>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href='/auth/signup'
              className='hidden lg:block text-white px-10 py-2 rounded-full bg-primary hover:bg-transparent border-1 border-primary hover:text-primary font-semibold transition-all'
            >
              Sign Up
            </Link>
          )}
          <Link
            href='/#donations'
            className='hidden md:block group relative cursor-pointer p-2 w-40 border bg-white rounded-full overflow-hidden text-black text-center font-semibold'
          >
            <span className='translate-x-1 group-hover:translate-x-12 group-hover:opacity-0 transition-all duration-300 inline-block'>
              Donate Now
            </span>
            <div className='flex gap-2 text-white z-10 items-center absolute top-0 h-full w-full justify-center translate-x-12 opacity-0 group-hover:-translate-x-1 group-hover:opacity-100 transition-all duration-300'>
              <span>Donate Now</span>
              <HandHeart size={18} />
            </div>
            <div className='absolute top-[40%] left-[12%] h-2 w-2 group-hover:h-full group-hover:w-full rounded-lg bg-primary scale-[1] dark:group-hover:bg-[#e7cb6e] group-hover:bg-primary group-hover:scale-[1.8] transition-all duration-300 group-hover:top-[0%] group-hover:left-[0%]'></div>
          </Link>
        </div>
      </header>
    </div>
  )
}
