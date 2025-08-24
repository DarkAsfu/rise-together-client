'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, User, Star, CalendarDays, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const MyRequestInfo = () => {
    const [volunteerData, setVolunteerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchVolunteerData();
    }, []);

    const fetchVolunteerData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://rise-together-tau.vercel.app/api/volunteer-applications/my-application`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch volunteer data');
            }
            
            const data = await response.json();
            setVolunteerData(data);
            // Initialize edit form with current data
            setEditForm({
                skills: data.skills || [],
                availability: {
                    preferences: data.availability?.preferences || '',
                    schedule: data.availability?.schedule || [],
                    specialDates: data.availability?.specialDates || []
                },
                location: {
                    address: data.location?.address || '',
                    latitude: data.location?.latitude || '',
                    longitude: data.location?.longitude || ''
                }
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
        // Reset form to original data
        if (volunteerData) {
            setEditForm({
                skills: volunteerData.skills || [],
                availability: {
                    preferences: volunteerData.availability?.preferences || '',
                    schedule: volunteerData.availability?.schedule || [],
                    specialDates: volunteerData.availability?.specialDates || []
                },
                location: {
                    address: volunteerData.location?.address || '',
                    latitude: volunteerData.location?.latitude || '',
                    longitude: volunteerData.location?.longitude || ''
                }
            });
        }
        toast.success('Changes cancelled');
    };

    const handleSave = async () => {
        try {
            setUpdating(true);
            const response = await fetch(`https://rise-together-tau.vercel.app/api/volunteer-applications/my-application`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm)
            });

            if (!response.ok) {
                throw new Error('Failed to update volunteer data');
            }

            const updatedData = await response.json();
            setVolunteerData(updatedData);
            setEditing(false);
            toast.success('Information updated successfully!');
        } catch (err) {
            toast.error(`Error updating information: ${err.message}`);
        } finally {
            setUpdating(false);
        }
    };

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setEditForm(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setEditForm(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const addSkill = () => {
        const newSkill = prompt('Enter new skill:');
        if (newSkill && newSkill.trim()) {
            setEditForm(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            toast.success('Skill added successfully!');
        }
    };

    const removeSkill = (index) => {
        setEditForm(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
        toast.success('Skill removed successfully!');
    };

    // Schedule management functions
    const addDay = () => {
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const existingDays = editForm.availability.schedule.map(day => day.dayOfWeek);
        const availableDays = dayNames.filter(day => !existingDays.includes(day));
        
        if (availableDays.length === 0) {
            toast.error('All days are already added!');
            return;
        }

        const newDay = {
            // _id: `temp_${Date.now()}`,
            dayOfWeek: availableDays[0],
            timeSlots: []
        };

        setEditForm(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                schedule: [...prev.availability.schedule, newDay]
            }
        }));
        toast.success(`${newDay.dayOfWeek} added to schedule!`);
    };

    const removeDay = (dayIndex) => {
        const dayName = editForm.availability.schedule[dayIndex].dayOfWeek;
        setEditForm(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                schedule: prev.availability.schedule.filter((_, i) => i !== dayIndex)
            }
        }));
        toast.success(`${dayName} removed from schedule!`);
    };

    const addTimeSlot = (dayIndex) => {
        const newTimeSlot = {
            // _id: `temp_${Date.now()}`,
            startTime: '09:00',
            endTime: '10:00'
        };

        setEditForm(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                schedule: prev.availability.schedule.map((day, index) => 
                    index === dayIndex 
                        ? { ...day, timeSlots: [...day.timeSlots, newTimeSlot] }
                        : day
                )
            }
        }));
        toast.success('Time slot added!');
    };

    const removeTimeSlot = (dayIndex, slotIndex) => {
        setEditForm(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                schedule: prev.availability.schedule.map((day, index) => 
                    index === dayIndex 
                        ? { ...day, timeSlots: day.timeSlots.filter((_, i) => i !== slotIndex) }
                        : day
                )
            }
        }));
        toast.success('Time slot removed!');
    };

    const updateTimeSlot = (dayIndex, slotIndex, field, value) => {
        setEditForm(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                schedule: prev.availability.schedule.map((day, index) => 
                    index === dayIndex 
                        ? { 
                            ...day, 
                            timeSlots: day.timeSlots.map((slot, slotIdx) => 
                                slotIdx === slotIndex 
                                    ? { ...slot, [field]: value }
                                    : slot
                            )
                        }
                        : day
                )
            }
        }));
    };

    const updateDayOfWeek = (dayIndex, newDay) => {
        setEditForm(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                schedule: prev.availability.schedule.map((day, index) => 
                    index === dayIndex 
                        ? { ...day, dayOfWeek: newDay }
                        : day
                )
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading volunteer information...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        );
    }

    if (!volunteerData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">No Data Available</h2>
                    <p className="text-gray-600">No volunteer information found for this user.</p>
                </div>
            </div>
        );
    }

    const { user_id, skills, availability, location } = volunteerData;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Toaster position="top-right" />
            
            <div className="flex items-center gap-3 mb-6">
                <User className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">My Request Information</h1>
            </div>

            {/* User Profile Card */}
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardTitle className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {user_id.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">{user_id.name}</h2>
                            <p className="text-gray-600">{user_id.email}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge 
                                variant={volunteerData.status === 'APPROVED' ? 'default' : 
                                       volunteerData.status === 'PENDING' ? 'secondary' : 'outline'}
                                className="text-xs"
                            >
                                {volunteerData.status}
                            </Badge>
                            <p className="text-xs text-gray-500">
                                Created: {new Date(volunteerData.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <span className="text-gray-700">Member since: {new Date(user_id.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Star className="h-5 w-5 text-yellow-600" />
                            <span className="text-gray-700">Role: {user_id.role_id.name}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Skills Section */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="h-6 w-6 text-yellow-600" />
                        Skills & Expertise
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {editing ? (
                        <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                                {editForm.skills.map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="text-sm px-3 py-1 flex items-center gap-2">
                                        {skill}
                                        <button
                                            onClick={() => removeSkill(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <Button onClick={addSkill} variant="outline" size="sm">
                                + Add Skill
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Location Section */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-6 w-6 text-red-600" />
                        Location
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {editing ? (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <Input
                                    value={editForm.location.address}
                                    onChange={(e) => handleInputChange('location.address', e.target.value)}
                                    placeholder="Enter address"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                    <Input
                                        value={editForm.location.latitude}
                                        onChange={(e) => handleInputChange('location.latitude', e.target.value)}
                                        placeholder="Latitude"
                                        type="number"
                                        step="any"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                    <Input
                                        value={editForm.location.longitude}
                                        onChange={(e) => handleInputChange('location.longitude', e.target.value)}
                                        placeholder="Longitude"
                                        type="number"
                                        step="any"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-red-500" />
                                <span className="text-gray-700 font-medium">{location.address}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>Latitude: {location.latitude}</div>
                                <div>Longitude: {location.longitude}</div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Availability Section */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-6 w-6 text-green-600" />
                        Availability
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Commitment Preference */}
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">Commitment Level</h3>
                        {editing ? (
                            <Select
                                value={editForm.availability.preferences}
                                onValueChange={(value) => handleInputChange('availability.preferences', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select commitment level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                    <SelectItem value="Part-time">Part-time</SelectItem>
                                    <SelectItem value="Flexible">Flexible</SelectItem>
                                    <SelectItem value="Weekends only">Weekends only</SelectItem>
                                    <SelectItem value="Evenings only">Evenings only</SelectItem>
                                    <SelectItem value="Project-Based">Project-Based</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <p className="text-green-700">{availability.preferences}</p>
                        )}
                    </div>

                    {/* Weekly Schedule */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-blue-600" />
                                Weekly Schedule
                            </h3>
                            {editing && (
                                <Button onClick={addDay} variant="outline" size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Day
                                </Button>
                            )}
                        </div>
                        <div className="space-y-3">
                            {editForm.availability.schedule.map((day, dayIndex) => (
                                <div key={day._id} className="border rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        {editing ? (
                                            <Select
                                                value={day.dayOfWeek}
                                                onValueChange={(value) => updateDayOfWeek(dayIndex, value)}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Monday">Monday</SelectItem>
                                                    <SelectItem value="Tuesday">Tuesday</SelectItem>
                                                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                                                    <SelectItem value="Thursday">Thursday</SelectItem>
                                                    <SelectItem value="Friday">Friday</SelectItem>
                                                    <SelectItem value="Saturday">Saturday</SelectItem>
                                                    <SelectItem value="Sunday">Sunday</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <h4 className="font-medium text-gray-800">{day.dayOfWeek}</h4>
                                        )}
                                        {editing && (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => addTimeSlot(dayIndex)}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => removeDay(dayIndex)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {day.timeSlots.map((slot, slotIndex) => (
                                            <div key={slot._id} className="flex items-center gap-2 text-sm">
                                                {editing ? (
                                                    <>
                                                        <Input
                                                            type="time"
                                                            value={slot.startTime}
                                                            onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'startTime', e.target.value)}
                                                            className="w-32"
                                                        />
                                                        <span className="text-gray-500">to</span>
                                                        <Input
                                                            type="time"
                                                            value={slot.endTime}
                                                            onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'endTime', e.target.value)}
                                                            className="w-32"
                                                        />
                                                        <Button
                                                            onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock className="h-4 w-4 text-blue-500" />
                                                        <span className="text-gray-600">{slot.startTime} - {slot.endTime}</span>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Special Dates */}
                    {availability.specialDates && availability.specialDates.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">Special Dates</h3>
                            <div className="space-y-3">
                                {availability.specialDates.map((specialDate) => (
                                    <div key={specialDate._id} className="border rounded-lg p-3 bg-yellow-50">
                                        <h4 className="font-medium text-gray-800 mb-2">
                                            {new Date(specialDate.date).toLocaleDateString()}
                                        </h4>
                                        <div className="space-y-2">
                                            {specialDate.timeSlots.map((slot) => (
                                                <div key={slot._id} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="h-4 w-4 text-yellow-500" />
                                                    <span>{slot.startTime} - {slot.endTime}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
                {editing ? (
                    <>
                        <Button 
                            onClick={handleSave} 
                            disabled={updating}
                            className="px-6"
                        >
                            {updating ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={handleCancel}
                            className="px-6"
                        >
                            Cancel
                        </Button>
                    </>
                ) : (
                    <>
                        <Button 
                            variant="outline" 
                            onClick={handleEdit}
                            className="px-6"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Information
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MyRequestInfo;