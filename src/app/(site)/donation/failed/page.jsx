'use client'
import React from 'react';
import Link from 'next/link';

const Page = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                <div className="mb-6">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction Failed</h2>
                <p className="text-gray-600 mb-6">
                    We apologize, but your donation transaction could not be completed. Please try again or contact support if the issue persists.
                </p>
                
                <div className="space-y-4">
                    <Link href="/donation" 
                        className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                        Try Again
                    </Link>
                    <Link href="/" 
                        className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200">
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Page;
