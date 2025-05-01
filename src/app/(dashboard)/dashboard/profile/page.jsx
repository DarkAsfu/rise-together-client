'use client'

import useProfile from '@/app/hooks/useProfile';
import React from 'react';

const Page = () => {
    const { profile, loading, error } = useProfile();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="bg-red-100 text-red-700 px-6 py-4 rounded-md shadow">
                    Error loading profile. Please try again later.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Profile Information</h1>
                <div className="space-y-6">
                    <ProfileItem label="Name" value={profile?.name} />
                    <ProfileItem label="Email" value={profile?.email} />
                    <ProfileItem label="Role" value={profile?.role_id?.name} />
                    <ProfileItem label="Created At" value={new Date(profile?.created_at).toLocaleDateString()} />
                    <ProfileItem label="Profile ID" value={profile?._id} />
                </div>
            </div>
        </div>
    );
};

const ProfileItem = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center">
        <label className="text-gray-600 font-medium w-40">{label}:</label>
        <p className="text-gray-800">{value || '-'}</p>
    </div>
);

export default Page;
