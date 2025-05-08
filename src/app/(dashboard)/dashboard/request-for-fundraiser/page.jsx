"use client"

import DashboardTitle from '@/app/Components/DashboardTitle';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const Page = () => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        setError,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            request_type: '',
            organization_name: '',
            personal_info: {
                full_name: '',
                date_of_birth: ''
            },
            verification_type: '',
            verification_number: '',
            location: {
                address: '',
                city: '',
                postal_code: ''
            },
            about: '',
            purpose: '',
            goals: '',
            attachments: []
        }
    });

    const requestType = watch('request_type');

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
    
            let imageUrls = [];
    
            if (data.attachments && data.attachments.length > 0) {
                for (let i = 0; i < data.attachments.length; i++) {
                    const file = data.attachments[i];
                    const formData = new FormData();
                    formData.append("image", file);
    
                    const imgbbResponse = await axios.post(
                        `https://api.imgbb.com/1/upload?key=6596fff948fdca8b4049937fcd8c96a3`,
                        formData
                    );
    
                    if (imgbbResponse.data.success) {
                        imageUrls.push(imgbbResponse.data.data.url);
                    }
                }
            }
    
            const submissionData = {
                ...data,
                attachments: imageUrls
            };

            console.log('Submission Data:', submissionData);
    
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/fundraiser-request`,
                submissionData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
    
            if (response.status === 200) {
                console.log('Response:', response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Fundraiser request submitted successfully',
                    confirmButtonColor: '#3085d6'
                }).then((result) => {
                    if (result.isConfirmed) {
                        reset(); // Reset form after successful submission
                    }
                });
            }
    
        } catch (error) {
            console.error('Error:', error?.response?.data?.error);
            const errorMsg = error?.response?.data?.error;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMsg || 'Something went wrong. Please try again later.',
                confirmButtonColor: '#d33'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-6">
            <DashboardTitle title={"Request for Fundraiser"} />
            
            <Card className="mt-6">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <Label>Request Type *</Label>
                                <select
                                    {...register("request_type", { required: "Request type is required" })}
                                    className="w-full mt-1 p-2 border rounded"
                                >
                                    <option value="">Select Type</option>
                                    <option value="ORGANIZATION">Organization</option>
                                    <option value="PERSONAL">Personal</option>
                                </select>
                                {errors.request_type && <p className="text-red-500 text-sm mt-1">{errors.request_type.message}</p>}
                            </div>

                            {requestType === 'ORGANIZATION' && (
                                <div>
                                    <Label>Organization Name *</Label>
                                    <Input
                                        {...register("organization_name", { required: "Organization name is required" })}
                                        className="mt-1"
                                    />
                                    {errors.organization_name && <p className="text-red-500 text-sm mt-1">{errors.organization_name.message}</p>}
                                </div>
                            )}

                            {requestType === 'PERSONAL' && (
                                <>
                                    <div>
                                        <Label>Full Name *</Label>
                                        <Input
                                            {...register("personal_info.full_name", { required: "Full name is required" })}
                                            className="mt-1"
                                        />
                                        {errors.personal_info?.full_name && <p className="text-red-500 text-sm mt-1">{errors.personal_info.full_name.message}</p>}
                                    </div>
                                    <div>
                                        <Label>Date of Birth *</Label>
                                        <Input
                                            type="date"
                                            {...register("personal_info.date_of_birth", { required: "Date of birth is required" })}
                                            className="mt-1"
                                        />
                                        {errors.personal_info?.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.personal_info.date_of_birth.message}</p>}
                                    </div>
                                </>
                            )}
                            <div>
                                <Label>About *</Label>
                                <Textarea
                                    {...register("about", { required: "About is required" })}
                                    className="mt-1"
                                    rows={4}
                                />
                                {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about.message}</p>}
                            </div>
                            <div>
                                <Label>Verification Type *</Label>
                                <select
                                    {...register("verification_type", { required: "Verification type is required" })}
                                    className="w-full mt-1 p-2 border rounded"
                                >
                                    <option value="">Select Type</option>
                                    <option value="NID">NID</option>
                                    <option value="DRIVING_LICENSE">Driving License</option>
                                    <option value="PASSPORT">Passport</option>
                                </select>
                                {errors.verification_type && <p className="text-red-500 text-sm mt-1">{errors.verification_type.message}</p>}
                            </div>

                            <div>
                                <Label>Verification Number *</Label>
                                <Input
                                    {...register("verification_number", { required: "Verification number is required" })}
                                    className="mt-1"
                                />
                                {errors.verification_number && <p className="text-red-500 text-sm mt-1">{errors.verification_number.message}</p>}
                            </div>

                            <div>
                                <Label>Address *</Label>
                                <Input
                                    {...register("location.address", { required: "Address is required" })}
                                    className="mt-1"
                                />
                                {errors.location?.address && <p className="text-red-500 text-sm mt-1">{errors.location.address.message}</p>}
                            </div>

                            <div>
                                <Label>City *</Label>
                                <Input
                                    {...register("location.city", { required: "City is required" })}
                                    className="mt-1"
                                />
                                {errors.location?.city && <p className="text-red-500 text-sm mt-1">{errors.location.city.message}</p>}
                            </div>

                            <div>
                                <Label>Postal Code *</Label>
                                <Input
                                    {...register("location.postal_code", { required: "Postal code is required" })}
                                    className="mt-1"
                                />
                                {errors.location?.postal_code && <p className="text-red-500 text-sm mt-1">{errors.location.postal_code.message}</p>}
                            </div>
                            <div>
                                <Label>Purpose *</Label>
                                <Textarea
                                    {...register("purpose", { required: "Purpose is required" })}
                                    className="mt-1"
                                    rows={4}
                                />
                                {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose.message}</p>}
                            </div>

                            <div>
                                <Label>Goals *</Label>
                                <Textarea
                                    {...register("goals", { required: "Goals are required" })}
                                    className="mt-1"
                                    rows={4}
                                />
                                {errors.goals && <p className="text-red-500 text-sm mt-1">{errors.goals.message}</p>}
                            </div>

                            <div>
                                <Label>Attachments</Label>
                                <Input
                                    type="file"
                                    multiple
                                    {...register("attachments")}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="bg-primary text-white hover:bg-primary/90"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
