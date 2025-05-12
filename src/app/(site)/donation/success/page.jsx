'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

const SuccessPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home page after 5 seconds
        const timeout = setTimeout(() => {
            router.push('/');
        }, 5000);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="-mt-20 flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center p-8 rounded-lg">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Payment Successful!
                </h1>
                <p className="text-gray-600 mb-4">
                    Thank you for your payment. You will be redirected to the homepage shortly.
                </p>
            </div>
        </div>
    );
};

export default SuccessPage;
