'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, MapPin, Calendar, Clock, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Dynamically import Leaflet components to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

const RequestForVolunteer = () => {
    const [formData, setFormData] = useState({
        skills: [],
        availability: {
            schedule: [],
            specialDates: [],
            preferences: 'Project-Based'
        },
        location: {
            latitude: 23.8103,
            longitude: 90.4125,
            address: 'Dhaka, Bangladesh'
        }
    });

    const [skillInput, setSkillInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // Predefined skills for easy selection
    const predefinedSkills = [
        'Disaster Management', 'Community Outreach', 'First Aid', 'Search & Rescue',
        'Food Distribution', 'Medical Support', 'Logistics', 'Communication',
        'Translation', 'Technical Support', 'Fundraising', 'Social Media',
        'Child Care', 'Elder Care', 'Construction', 'Transportation'
    ];

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const addSkill = (skill) => {
        if (skill && !formData.skills.includes(skill)) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skill]
            }));
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const addSchedule = () => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                schedule: [...prev.availability.schedule, {
                    dayOfWeek: 'Monday',
                    timeSlots: [{ startTime: '09:00', endTime: '12:00' }]
                }]
            }
        }));
    };

    const updateSchedule = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                schedule: prev.availability.schedule.map((item, i) => 
                    i === index ? { ...item, [field]: value } : item
                )
            }
        }));
    };

    const updateTimeSlot = (scheduleIndex, timeSlotIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                schedule: prev.availability.schedule.map((schedule, i) => 
                    i === scheduleIndex ? {
                        ...schedule,
                        timeSlots: schedule.timeSlots.map((slot, j) => 
                            j === timeSlotIndex ? { ...slot, [field]: value } : slot
                        )
                    } : schedule
                )
            }
        }));
    };

    const addTimeSlot = (scheduleIndex) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                schedule: prev.availability.schedule.map((schedule, i) => 
                    i === scheduleIndex ? {
                        ...schedule,
                        timeSlots: [...schedule.timeSlots, { startTime: '09:00', endTime: '12:00' }]
                    } : schedule
                )
            }
        }));
    };

    const removeTimeSlot = (scheduleIndex, timeSlotIndex) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                schedule: prev.availability.schedule.map((schedule, i) => 
                    i === scheduleIndex ? {
                        ...schedule,
                        timeSlots: schedule.timeSlots.filter((_, j) => j !== timeSlotIndex)
                    } : schedule
                )
            }
        }));
    };

    const removeSchedule = (index) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                schedule: prev.availability.schedule.filter((_, i) => i !== index)
            }
        }));
    };

    const addSpecialDate = () => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                specialDates: [...prev.availability.specialDates, {
                    date: new Date().toISOString().split('T')[0],
                    timeSlots: [{ startTime: '09:00', endTime: '12:00' }]
                }]
            }
        }));
    };

    const updateSpecialDate = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                specialDates: prev.availability.specialDates.map((item, i) => 
                    i === index ? { ...item, [field]: value } : item
                )
            }
        }));
    };

    const updateSpecialDateTimeSlot = (dateIndex, timeSlotIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                specialDates: prev.availability.specialDates.map((date, i) => 
                    i === dateIndex ? {
                        ...date,
                        timeSlots: date.timeSlots.map((slot, j) => 
                            j === timeSlotIndex ? { ...slot, [field]: value } : slot
                        )
                    } : date
                )
            }
        }));
    };

    const addSpecialDateTimeSlot = (dateIndex) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                specialDates: prev.availability.specialDates.map((date, i) => 
                    i === dateIndex ? {
                        ...date,
                        timeSlots: [...date.timeSlots, { startTime: '09:00', endTime: '12:00' }]
                    } : date
                )
            }
        }));
    };

    const removeSpecialDateTimeSlot = (dateIndex, timeSlotIndex) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                specialDates: prev.availability.specialDates.map((date, i) => 
                    i === dateIndex ? {
                        ...date,
                        timeSlots: date.timeSlots.filter((_, j) => j !== timeSlotIndex)
                    } : date
                )
            }
        }));
    };

    const removeSpecialDate = (index) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                specialDates: prev.availability.specialDates.filter((_, i) => i !== index)
            }
        }));
    };

    const updateLocation = (locationData) => {
        setFormData(prev => ({
            ...prev,
            location: locationData
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('User not found. Please login again.');
            return;
        }

        if (formData.skills.length === 0) {
            toast.error('Please add at least one skill.');
            return;
        }

        if (formData.availability.schedule.length === 0 && formData.availability.specialDates.length === 0) {
            toast.error('Please add at least one availability schedule.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('user_id');

            const requestData = {
                user_id: userId,
                ...formData
            };

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/volunteer-applications`, requestData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201 || response.status === 200) {
                toast.success('Volunteer request submitted successfully!');
                // Reset form
                setFormData({
                    skills: [],
                    availability: {
                        schedule: [],
                        specialDates: [],
                        preferences: 'Project-Based'
                    },
                    location: {
                        latitude: 23.8103,
                        longitude: 90.4125,
                        address: 'Dhaka, Bangladesh'
                    }
                });
            }
        } catch (error) {
            console.error('Error submitting volunteer request:', error);
            toast.error(error.response?.data?.message || 'Failed to submit volunteer request');
        } finally {
            setLoading(false);
        }
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Request to Become a Volunteer</h1>
                <p className="text-gray-600">
                    Join our community of volunteers and make a difference in disaster relief efforts.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Skills Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Skills & Expertise
                        </CardTitle>
                        <CardDescription>
                            Select or add your skills and areas of expertise
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {formData.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-2">
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        className="ml-1 hover:text-red-500"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>

                        <div className="flex gap-2 mb-4">
                            <Input
                                placeholder="Add a skill..."
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                            />
                            <Button type="button" onClick={() => addSkill(skillInput)} variant="outline">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {predefinedSkills.map((skill) => (
                                <Button
                                    key={skill}
                                    type="button"
                                    variant={formData.skills.includes(skill) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => addSkill(skill)}
                                    disabled={formData.skills.includes(skill)}
                                >
                                    {skill}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Availability Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Availability & Schedule
                        </CardTitle>
                        <CardDescription>
                            Set your regular weekly schedule and special date availability
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Regular Schedule */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Weekly Schedule</h3>
                                <Button type="button" onClick={addSchedule} variant="outline" size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Day
                                </Button>
                            </div>
                            
                            {formData.availability.schedule.map((schedule, scheduleIndex) => (
                                <div key={scheduleIndex} className="border rounded-lg p-4 mb-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <select
                                            value={schedule.dayOfWeek}
                                            onChange={(e) => updateSchedule(scheduleIndex, 'dayOfWeek', e.target.value)}
                                            className="border rounded px-3 py-2"
                                        >
                                            {daysOfWeek.map(day => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                        <Button
                                            type="button"
                                            onClick={() => removeSchedule(scheduleIndex)}
                                            variant="destructive"
                                            size="sm"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {schedule.timeSlots.map((timeSlot, timeSlotIndex) => (
                                            <div key={timeSlotIndex} className="flex items-center gap-2">
                                                <Input
                                                    type="time"
                                                    value={timeSlot.startTime}
                                                    onChange={(e) => updateTimeSlot(scheduleIndex, timeSlotIndex, 'startTime', e.target.value)}
                                                    className="w-32"
                                                />
                                                <span>to</span>
                                                <Input
                                                    type="time"
                                                    value={timeSlot.endTime}
                                                    onChange={(e) => updateTimeSlot(scheduleIndex, timeSlotIndex, 'endTime', e.target.value)}
                                                    className="w-32"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => removeTimeSlot(scheduleIndex, timeSlotIndex)}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            onClick={() => addTimeSlot(scheduleIndex)}
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Time Slot
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Special Dates */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Special Dates</h3>
                                <Button type="button" onClick={addSpecialDate} variant="outline" size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Date
                                </Button>
                            </div>
                            
                            {formData.availability.specialDates.map((specialDate, dateIndex) => (
                                <div key={dateIndex} className="border rounded-lg p-4 mb-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <Input
                                            type="date"
                                            value={specialDate.date}
                                            onChange={(e) => updateSpecialDate(dateIndex, 'date', e.target.value)}
                                            className="w-48"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => removeSpecialDate(dateIndex)}
                                            variant="destructive"
                                            size="sm"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {specialDate.timeSlots.map((timeSlot, timeSlotIndex) => (
                                            <div key={timeSlotIndex} className="flex items-center gap-2">
                                                <Input
                                                    type="time"
                                                    value={timeSlot.startTime}
                                                    onChange={(e) => updateSpecialDateTimeSlot(dateIndex, timeSlotIndex, 'startTime', e.target.value)}
                                                    className="w-32"
                                                />
                                                <span>to</span>
                                                <Input
                                                    type="time"
                                                    value={timeSlot.endTime}
                                                    onChange={(e) => updateSpecialDateTimeSlot(dateIndex, timeSlotIndex, 'endTime', e.target.value)}
                                                    className="w-32"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => removeSpecialDateTimeSlot(dateIndex, timeSlotIndex)}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            onClick={() => addSpecialDateTimeSlot(dateIndex)}
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Time Slot
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Preferences */}
                        <div>
                            <Label htmlFor="preferences">Availability Preferences</Label>
                            <select
                                id="preferences"
                                value={formData.availability.preferences}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    availability: { ...prev.availability, preferences: e.target.value }
                                }))}
                                className="w-full border rounded-md px-3 py-2 mt-1"
                            >
                                <option value="Project-Based">Project-Based</option>
                                <option value="Regular Commitment">Regular Commitment</option>
                                <option value="On-Call">On-Call</option>
                                <option value="Weekend Only">Weekend Only</option>
                                <option value="Flexible">Flexible</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Location Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Location & Service Area
                        </CardTitle>
                        <CardDescription>
                            Set your location and service area for volunteer opportunities
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="h-96 rounded-lg overflow-hidden border">
                            <MapComponent
                                location={formData.location}
                                onLocationChange={updateLocation}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="latitude">Latitude</Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="0.0001"
                                    value={formData.location.latitude}
                                    onChange={(e) => updateLocation({
                                        ...formData.location,
                                        latitude: parseFloat(e.target.value)
                                    })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="longitude">Longitude</Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="0.0001"
                                    value={formData.location.longitude}
                                    onChange={(e) => updateLocation({
                                        ...formData.location,
                                        longitude: parseFloat(e.target.value)
                                    })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={formData.location.address}
                                    onChange={(e) => updateLocation({
                                        ...formData.location,
                                        address: e.target.value
                                    })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3"
                    >
                        {loading ? 'Submitting...' : 'Submit Volunteer Request'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default RequestForVolunteer;