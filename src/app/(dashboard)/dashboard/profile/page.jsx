'use client'

import useProfile from '@/app/hooks/useProfile';
import React from 'react';
import { FiUser, FiMail, FiShield, FiCalendar, FiHash, FiEdit2 } from 'react-icons/fi';
import Image from 'next/image';

const Page = () => {
    const { profile, loading, error } = useProfile();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary/5 to-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary shadow-lg"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary/5 to-gray-50">
                <div className="bg-red-50 text-red-700 px-8 py-6 rounded-xl shadow-lg flex items-center space-x-3 backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Error loading profile. Please try again later.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-8 py-10 relative">
                        <div className="flex items-center gap-8">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <Image
                                        src={"https://i.ibb.co.com/fdDYDbc5/default-user.jpg"}
                                        alt="Profile"
                                        width={128}
                                        height={128}
                                        className="object-cover"
                                    />
                                </div>
                                <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <FiEdit2 className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile?.name || "User Name"}</h1>
                                <p className="text-gray-600 text-lg">{profile?.role_id?.name || "Role"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="grid gap-6">
                            <ProfileItem icon={<FiMail />} label="Email" value={profile?.email} />
                            <ProfileItem icon={<FiShield />} label="Role" value={profile?.role_id?.name} />
                            <ProfileItem icon={<FiCalendar />} label="Created At" value={new Date(profile?.created_at).toLocaleDateString()} />
                            <ProfileItem icon={<FiHash />} label="Profile ID" value={profile?._id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileItem = ({ icon, label, value }) => (
    <div className="flex items-center space-x-4 p-6 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100">
        <div className="bg-primary/10 p-3 rounded-lg">
            <div className="text-primary text-xl">{icon}</div>
        </div>
        <div className="flex-1">
            <label className="text-sm font-medium text-gray-500 block">{label}</label>
            <p className="text-gray-900 font-semibold mt-1">{value || '-'}</p>
        </div>
    </div>
);

export default Page;
