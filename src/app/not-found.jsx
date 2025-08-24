import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
            <div className="text-center max-w-2xl mx-auto">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-primary/20 select-none">
                        404
                    </h1>
                </div>

                {/* Main Message */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        The page you're looking for doesn't exist or has been moved. 
                        Don't worry, let's get you back on track!
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                        <Link href="/">
                            <svg 
                                className="w-4 h-4 mr-2" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                                />
                            </svg>
                            Go Home
                        </Link>
                    </Button>
                    
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                        <Link href="/campaign">
                            <svg 
                                className="w-4 h-4 mr-2" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                />
                            </svg>
                            Browse Campaigns
                        </Link>
                    </Button>
                </div>

                {/* Additional Help */}
                <div className="text-sm text-muted-foreground">
                    <p className="mb-2">
                        Need help? Contact our support team or check out our{' '}
                        <Link href="/how-it-works" className="text-primary hover:underline">
                            how it works
                        </Link>{' '}
                        page.
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default NotFound;