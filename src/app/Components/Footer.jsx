import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from '../../../public/logo1.png'

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='max-w-7xl mx-auto px-6 py-16'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12'>
          {/* Company Info */}
          <div className='lg:col-span-2'>
            <Link href='/' className='inline-block mb-6'>
              <Image 
                src={logo} 
                alt='Rise Together Logo' 
                width={180} 
                height={90} 
                className='h-20 w-auto'
              />
            </Link>
            <p className='text-gray-300 text-base leading-relaxed max-w-lg'>
              Empowering communities through collective growth, support, and meaningful connections. 
              Together we rise, together we thrive.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-semibold text-white mb-6 border-b border-gray-700 pb-2'>
              Quick Links
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link href='/' className='text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/about-us' className='text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm'>
                  About Us
                </Link>
              </li>
              <li>
                <Link href='/campaign' className='text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm'>
                  Campaigns
                </Link>
              </li>
              <li>
                <Link href='/how-it-works' className='text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm'>
                  How It Works
                </Link>
              </li>
              <li>
                <Link href='/contact-us' className='text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className='text-lg font-semibold text-white mb-6 border-b border-gray-700 pb-2'>
              Our Services
            </h3>
            <ul className='space-y-3'>
              <li>
                <span className='text-gray-300 text-sm flex items-center'>
                  <span className='w-2 h-2 bg-blue-400 rounded-full mr-3'></span>
                  Fundraising Campaigns
                </span>
              </li>
              <li>
                <span className='text-gray-300 text-sm flex items-center'>
                  <span className='w-2 h-2 bg-blue-400 rounded-full mr-3'></span>
                  Volunteer Programs
                </span>
              </li>
              <li>
                <span className='text-gray-300 text-sm flex items-center'>
                  <span className='w-2 h-2 bg-blue-400 rounded-full mr-3'></span>
                  Community Support
                </span>
              </li>
              <li>
                <span className='text-gray-300 text-sm flex items-center'>
                  <span className='w-2 h-2 bg-blue-400 rounded-full mr-3'></span>
                  Donation Management
                </span>
              </li>
              <li>
                <span className='text-gray-300 text-sm flex items-center'>
                  <span className='w-2 h-2 bg-blue-400 rounded-full mr-3'></span>
                  Impact Reporting
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className='text-lg font-semibold text-white mb-6 border-b border-gray-700 pb-2'>
              Contact Info
            </h3>
            <div className='space-y-3'>
              <div className='flex items-start space-x-3'>
                <svg className='w-4 h-4 text-blue-400 mt-1 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
                <p className='text-gray-300 text-sm'>info@risetogether.com</p>
              </div>
              
              <div className='flex items-start space-x-3'>
                <svg className='w-4 h-4 text-blue-400 mt-1 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                </svg>
                <p className='text-gray-300 text-sm'>+880 1777-112564</p>
              </div>
              
              <div className='flex items-start space-x-3'>
                <svg className='w-4 h-4 text-blue-400 mt-1 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
                <p className='text-gray-300 text-sm'>Nikunja-2, Dhaka</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='pt-8 border-t border-gray-700'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-gray-400 text-sm'>
              © {new Date().getFullYear()} Rise Together. All rights reserved.
            </p>
            <div className='flex items-center space-x-6'>
              <a href='#' className='text-gray-400 hover:text-blue-400 transition-colors duration-200'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'/>
                </svg>
              </a>
              <a href='#' className='text-gray-400 hover:text-blue-400 transition-colors duration-200'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z'/>
                </svg>
              </a>
              <a href='#' className='text-gray-400 hover:text-blue-400 transition-colors duration-200'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
