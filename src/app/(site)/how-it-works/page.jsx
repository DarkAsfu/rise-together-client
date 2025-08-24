import SectionBanner from '@/app/Components/reusable/SectionBanner';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import people from '../../../../public/people.svg';
import pray from '../../../../public/pray.svg';
import service from '../../../../public/service.png';
import pay from '../../../../public/pay.svg';
import success from '../../../../public/success.svg';
import support from '../../../../public/support.svg';

const HowItWorksPage = () => {
    const donorSteps = [
        {
            step: 1,
            title: "Discover Campaigns",
            description: "Browse through verified fundraising campaigns that align with your values and causes you care about.",
            icon: people
        },
        {
            step: 2,
            title: "Choose Your Cause",
            description: "Select from various categories including education, healthcare, disaster relief, and community projects.",
            icon: pray
        },
        {
            step: 3,
            title: "Make a Donation",
            description: "Contribute securely using our multiple payment options with complete transparency.",
            icon: pay
        },
        {
            step: 4,
            title: "Track Impact",
            description: "Receive updates on how your donation is making a difference and see the progress of campaigns.",
            icon: success
        }
    ];

    const fundraiserSteps = [
        {
            step: 1,
            title: "Submit Campaign Request",
            description: "Fill out a detailed application explaining your cause, goals, and funding requirements.",
            icon: people
        },
        {
            step: 2,
            title: "Verification Process",
            description: "Our team reviews and verifies your campaign to ensure authenticity and compliance.",
            icon: support
        },
        {
            step: 3,
            title: "Launch & Promote",
            description: "Once approved, your campaign goes live with tools to share and promote your cause.",
            icon: service
        },
        {
            step: 4,
            title: "Receive & Manage Funds",
            description: "Collect donations and manage your campaign through our dedicated dashboard.",
            icon: success
        }
    ];

    const volunteerSteps = [
        {
            step: 1,
            title: "Browse Opportunities",
            description: "Explore volunteer tasks and opportunities that match your skills and interests.",
            icon: people
        },
        {
            step: 2,
            title: "Apply for Tasks",
            description: "Submit your application with relevant experience and availability details.",
            icon: pray
        },
        {
            step: 3,
            title: "Get Assigned",
            description: "Receive task assignments and detailed instructions for your volunteer work.",
            icon: service
        },
        {
            step: 4,
            title: "Complete & Report",
            description: "Finish your tasks and report back to help track impact and maintain transparency.",
            icon: success
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <SectionBanner title={"How it Works"} />
            
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                {/* Introduction Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-[#071c35] mb-6">
                        Making a Difference Together
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Rise Together is a comprehensive platform that connects generous donors with meaningful causes, 
                        empowers fundraisers to make an impact, and enables volunteers to contribute their time and skills. 
                        Here's how each part of our ecosystem works together to create positive change.
                    </p>
                </div>

                {/* For Donors Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-[#071c35] mb-4">For Donors</h3>
                        <p className="text-lg text-gray-600">Simple steps to make your contribution count</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {donorSteps.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#1B8271]">
                                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#1B8271] text-white rounded-full flex items-center justify-center font-bold text-xl">
                                        {step.step}
                                    </div>
                                    <div className="mt-4 text-center">
                                        <Image 
                                            src={step.icon} 
                                            alt={step.title} 
                                            width={60} 
                                            height={60} 
                                            className="mx-auto mb-4"
                                        />
                                        <h4 className="text-xl font-semibold text-[#071c35] mb-3">{step.title}</h4>
                                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* For Fundraisers Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-[#071c35] mb-4">For Fundraisers</h3>
                        <p className="text-lg text-gray-600">Turn your vision into reality with our support</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {fundraiserSteps.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#ff7468]">
                                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#ff7468] text-white rounded-full flex items-center justify-center font-bold text-xl">
                                        {step.step}
                                    </div>
                                    <div className="mt-4 text-center">
                                        <Image 
                                            src={step.icon} 
                                            alt={step.title} 
                                            width={60} 
                                            height={60} 
                                            className="mx-auto mb-4"
                                        />
                                        <h4 className="text-xl font-semibold text-[#071c35] mb-3">{step.title}</h4>
                                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* For Volunteers Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-[#071c35] mb-4">For Volunteers</h3>
                        <p className="text-lg text-gray-600">Share your time and skills to make a difference</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {volunteerSteps.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#1B8271]">
                                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#1B8271] text-white rounded-full flex items-center justify-center font-bold text-xl">
                                        {step.step}
                                    </div>
                                    <div className="mt-4 text-center">
                                        <Image 
                                            src={step.icon} 
                                            alt={step.title} 
                                            width={60} 
                                            height={60} 
                                            className="mx-auto mb-4"
                                        />
                                        <h4 className="text-xl font-semibold text-[#071c35] mb-3">{step.title}</h4>
                                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Features */}
                <div className="bg-white rounded-3xl p-12 shadow-lg">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-[#071c35] mb-4">Platform Features</h3>
                        <p className="text-lg text-gray-600">Everything you need to succeed in your charitable endeavors</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-[#1B8271] hover:text-white transition-all duration-300">
                            <div className="w-16 h-16 bg-[#1B8271] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Secure Payments</h4>
                            <p className="text-sm">Multiple payment options with bank-level security</p>
                        </div>
                        
                        <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-[#ff7468] hover:text-white transition-all duration-300">
                            <div className="w-16 h-16 bg-[#ff7468] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Real-time Updates</h4>
                            <p className="text-sm">Track progress and impact of your contributions</p>
                        </div>
                        
                        <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-[#1B8271] hover:text-white transition-all duration-300">
                            <div className="w-16 h-16 bg-[#1B8271] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Verification System</h4>
                            <p className="text-sm">All campaigns are thoroughly vetted for authenticity</p>
                        </div>
                        
                        <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-[#ff7468] hover:text-white transition-all duration-300">
                            <div className="w-16 h-16 bg-[#ff7468] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Smart Dashboard</h4>
                            <p className="text-sm">Comprehensive tools to manage campaigns and donations</p>
                        </div>
                        
                        <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-[#1B8271] hover:text-white transition-all duration-300">
                            <div className="w-16 h-16 bg-[#1B8271] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold mb-2">24/7 Support</h4>
                            <p className="text-sm">Expert assistance whenever you need help</p>
                        </div>
                        
                        <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-[#ff7468] hover:text-white transition-all duration-300">
                            <div className="w-16 h-16 bg-[#ff7468] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Community Building</h4>
                            <p className="text-sm">Connect with like-minded individuals and organizations</p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <h3 className="text-3xl font-bold text-[#071c35] mb-6">Ready to Make a Difference?</h3>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join thousands of people who are already making an impact through Rise Together. 
                        Whether you want to donate, fundraise, or volunteer, we're here to help you succeed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signin">
                            <button className="bg-[#1B8271] hover:bg-[#156b5e] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
                                Start Donating
                            </button>
                        </Link>
                        <Link href="/signin">
                            <button className="bg-[#ff7468] hover:bg-[#e65a4f] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
                                Create Campaign
                            </button>
                        </Link>
                        <Link href="/signin">
                            <button className="bg-white border-2 border-[#1B8271] text-[#1B8271] hover:bg-[#1B8271] hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                                Volunteer Now
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksPage;