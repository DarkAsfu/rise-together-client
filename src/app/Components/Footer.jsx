import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from '../../../public/logo1.png'
const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white py-8'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <Link href='/'>
              <Image src={logo} alt='logo' width={150} height={100} />
            </Link>
            <p className='text-gray-300 mt-4'>
              Empowering communities through collective growth and support.
            </p>
          </div>
          <div>
            <h3 className='text-xl font-bold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <a href='/' className='hover:text-blue-400'>
                  Home
                </a>
              </li>
              <li>
                <a href='/about' className='hover:text-blue-400'>
                  About Us
                </a>
              </li>
              <li>
                <a href='/services' className='hover:text-blue-400'>
                  Services
                </a>
              </li>
              <li>
                <a href='/contact' className='hover:text-blue-400'>
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-xl font-bold mb-4'>Contact Info</h3>
            <ul className='space-y-2 text-gray-300'>
              <li>Email: info@risetogether.com</li>
              <li>Phone: 01777112564</li>
              <li>Address: Nikunja-2, Dhaka</li>
            </ul>
          </div>
        </div>
        <div className='border-t border-gray-600 mt-8 pt-8 text-center'>
          <p className='text-gray-300'>
            © {new Date().getFullYear()} Rise Together. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
