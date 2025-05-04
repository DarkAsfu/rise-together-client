'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Swal from 'sweetalert2';

const CampaignRequestForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);

    // Handle Image Upload
    const handleImageUpload = async (files) => {
        if (!files || files.length === 0) return;

        setIsLoading(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append('image', file);

                const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
                    params: {
                        key: `${process.env.NEXT_PUBLIC_IMGBB_KEY}`
                    }
                });

                return response.data.data.url;
            });

            const imageUrls = await Promise.all(uploadPromises);
            setImages(prev => [...prev, ...imageUrls]);
        } catch (error) {
            console.error('Error uploading images:', error);
            Swal.fire('Error', 'Failed to upload images', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Remove Image
    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // Submit Form
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                Swal.fire('Error', 'You must be logged in to create a campaign', 'error');
                setIsLoading(false);
                return;
            }

            // Log the submission data
            const submissionData = {
                ...data,
                goal_amount: Number(data.goal_amount), // Ensure goal_amount is a number
                deadline: new Date(data.deadline).toISOString(), // Convert to ISO string if necessary
                images,
            };

            console.log('Submitting campaign data:', submissionData); // Log the submission data

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log(response.status);
            if (response.status === 201 && response.data) {
                Swal.fire('Success', 'Campaign created successfully!', 'success');
                reset();
                setImages([]);
            } else {
                Swal.fire('Error', response.data.message || 'Failed to create campaign', 'error');
            }
        } catch (error) {
            console.error('Error creating campaign:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
            Swal.fire('Error', message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-6">
            <Card className="mt-6">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Title */}
                        <div>
                            <Label>Title *</Label>
                            <Input
                                {...register("title", { required: "Title is required" })}
                                className="mt-1"
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <Label>Description *</Label>
                            <Textarea
                                {...register("description", { required: "Description is required" })}
                                rows={4}
                                className="mt-1"
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>

                        {/* Goal Amount */}
                        <div>
                            <Label>Goal Amount *</Label>
                            <Input
                                type="number"
                                {...register("goal_amount", {
                                    required: "Goal amount is required",
                                    min: { value: 1, message: "Amount must be positive" }
                                })}
                                className="mt-1"
                            />
                            {errors.goal_amount && <p className="text-red-500 text-sm">{errors.goal_amount.message}</p>}
                        </div>

                        {/* Deadline */}
                        <div>
                            <Label>Deadline *</Label>
                            <Input
                                type="date"
                                {...register("deadline", { required: "Deadline is required" })}
                                className="mt-1"
                            />
                            {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline.message}</p>}
                        </div>

                        {/* Location */}
                        <div>
                            <Label>Location *</Label>
                            <Input
                                {...register("location", { required: "Location is required" })}
                                className="mt-1"
                            />
                            {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <Label>Category *</Label>
                            <select
                                {...register("category", { required: "Category is required" })}
                                className="w-full mt-1 p-2 border rounded"
                            >
                                <option value="">Select Category</option>
                                <option value="Disaster Relief">Disaster Relief</option>
                                <option value="Medical">Medical</option>
                                <option value="Education">Education</option>
                                <option value="Community">Community</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <Label>Attachments (Images)</Label>
                            <Input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e.target.files)}
                                className="mt-1"
                            />
                            {isLoading && <p className="text-blue-500 text-sm">Uploading images...</p>}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {images.map((url, index) => (
                                    <div key={index} className="relative w-24 h-24">
                                        <img
                                            src={url}
                                            alt={`Upload ${index + 1}`}
                                            className="w-full h-full object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-primary text-white hover:bg-primary/90"
                            >
                                {isLoading ? 'Submitting...' : 'Create Campaign'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CampaignRequestForm;
