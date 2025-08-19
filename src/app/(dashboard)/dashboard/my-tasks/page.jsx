"use client";
import React, { useEffect, useState } from 'react';
import useTasks from '../../../hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import { Calendar, MapPin, Clock, User, FileText, CheckCircle, AlertCircle, Clock as ClockIcon } from 'lucide-react';

const page = () => {
    const { getMyTasks } = useTasks();
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        const fetchMyTasks = async () => {
            try {
                setLoading(true);
                const userId = localStorage.getItem('user_id');
                if (!userId) {
                    toast.error('User ID not found. Please login again.');
                    return;
                }
                const tasks = await getMyTasks(userId);
                setMyTasks(tasks);
            } catch (error) {
                console.error('Failed to fetch my tasks:', error);
                toast.error(error.message || 'Failed to load tasks');
            } finally {
                setLoading(false);
            }
        };

        fetchMyTasks();
    }, [getMyTasks]);

    const openTaskDetails = (task) => {
        setSelectedTask(task);
        setDetailsOpen(true);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Assigned': { variant: 'secondary', icon: ClockIcon },
            'In Progress': { variant: 'default', icon: AlertCircle },
            'Completed': { variant: 'default', icon: CheckCircle },
            'Open': { variant: 'outline', icon: ClockIcon },
        };

        const config = statusConfig[status] || statusConfig['Assigned'];
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {status}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString();
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">My Tasks</h1>
                    <p className="text-muted-foreground">View and manage your assigned volunteer tasks</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Assigned Tasks
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : myTasks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No tasks assigned yet.</p>
                            <p className="text-sm">Check back later for new volunteer opportunities.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Task</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Deadline</TableHead>
                                    <TableHead>Assigned Date</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {myTasks.map((assignment) => {
                                    const task = assignment?.task_id;
                                    const taskTitle = task?.title || 'Unknown Task';
                                    const taskDescription = task?.description || '';
                                    const taskDeadline = task?.deadline;
                                    const taskLocation = task?.location?.address || 'No location specified';
                                    
                                    return (
                                        <TableRow key={assignment._id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{taskTitle}</div>
                                                    <div className="text-sm text-muted-foreground line-clamp-2">
                                                        {taskDescription}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(assignment.status)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDateOnly(taskDeadline)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDate(assignment.date_assigned)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <MapPin className="h-3 w-3" />
                                                    {taskLocation}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => openTaskDetails(assignment)}
                                                >
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Task Details Modal */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="sm:max-w-4xl h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Task Details</DialogTitle>
                    </DialogHeader>
                    {selectedTask && (
                        <div className="space-y-6">
                            {/* Assignment Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Assignment Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <div><span className="font-medium">Assignment ID:</span> {selectedTask._id}</div>
                                            <div><span className="font-medium">Status:</span> {getStatusBadge(selectedTask.status)}</div>
                                        </div>
                                        <div>
                                            <div><span className="font-medium">Date Assigned:</span> {formatDate(selectedTask.date_assigned)}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Task Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Task Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 text-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <div><span className="font-medium">Task ID:</span> {selectedTask.task_id?._id}</div>
                                                <div><span className="font-medium">Title:</span> {selectedTask.task_id?.title}</div>
                                                <div><span className="font-medium">Status:</span> {selectedTask.task_id?.status}</div>
                                            </div>
                                            <div>
                                                <div><span className="font-medium">Deadline:</span> {formatDate(selectedTask.task_id?.deadline)}</div>
                                                <div><span className="font-medium">Created At:</span> {formatDate(selectedTask.task_id?.created_at)}</div>
                                                <div><span className="font-medium">Created By:</span> {selectedTask.task_id?.created_by}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div><span className="font-medium">Description:</span></div>
                                            <div className="mt-1 p-3 bg-muted rounded-md whitespace-pre-wrap">
                                                {selectedTask.task_id?.description || 'No description provided'}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <div><span className="font-medium">Location:</span></div>
                                                <div className="mt-1">{selectedTask.task_id?.location?.address || 'No location specified'}</div>
                                            </div>
                                            <div>
                                                <div><span className="font-medium">Latitude:</span></div>
                                                <div className="mt-1">{selectedTask.task_id?.location?.latitude || '-'}</div>
                                            </div>
                                            <div>
                                                <div><span className="font-medium">Longitude:</span></div>
                                                <div className="mt-1">{selectedTask.task_id?.location?.longitude || '-'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Volunteer Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Your Volunteer Profile
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 text-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <div><span className="font-medium">Volunteer ID:</span> {selectedTask.volunteer_id?._id}</div>
                                                <div><span className="font-medium">User ID:</span> {typeof selectedTask.volunteer_id?.user_id === 'string' ? selectedTask.volunteer_id.user_id : selectedTask.volunteer_id?.user_id?._id || '-'}</div>
                                                <div><span className="font-medium">Name:</span> {typeof selectedTask.volunteer_id?.user_id === 'object' ? selectedTask.volunteer_id.user_id?.name || '-' : '-'}</div>
                                                <div><span className="font-medium">Email:</span> {typeof selectedTask.volunteer_id?.user_id === 'object' ? selectedTask.volunteer_id.user_id?.email || '-' : '-'}</div>
                                                <div><span className="font-medium">Status:</span> {selectedTask.volunteer_id?.status}</div>
                                            </div>
                                            <div>
                                                <div><span className="font-medium">Created At:</span> {formatDate(selectedTask.volunteer_id?.created_at)}</div>
                                                <div><span className="font-medium">Updated At:</span> {formatDate(selectedTask.volunteer_id?.updated_at)}</div>
                                                <div><span className="font-medium">Processed At:</span> {formatDate(selectedTask.volunteer_id?.processed_at)}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div><span className="font-medium">Skills:</span></div>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {Array.isArray(selectedTask.volunteer_id?.skills) ? (
                                                    selectedTask.volunteer_id.skills.map((skill, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            {skill}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-muted-foreground">No skills listed</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <div><span className="font-medium">Preferences:</span> {selectedTask.volunteer_id?.availability?.preferences || '-'}</div>
                                                <div><span className="font-medium">Address:</span> {selectedTask.volunteer_id?.location?.address || '-'}</div>
                                            </div>
                                            <div>
                                                <div><span className="font-medium">Latitude:</span> {selectedTask.volunteer_id?.location?.latitude || '-'}</div>
                                                <div><span className="font-medium">Longitude:</span> {selectedTask.volunteer_id?.location?.longitude || '-'}</div>
                                            </div>
                                        </div>
                                        {selectedTask.volunteer_id?.admin_notes && (
                                            <div>
                                                <div><span className="font-medium">Admin Notes:</span></div>
                                                <div className="mt-1 p-3 bg-muted rounded-md">
                                                    {selectedTask.volunteer_id.admin_notes}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Availability Schedule */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Your Availability
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="font-medium mb-2">Weekly Schedule</div>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Day</TableHead>
                                                        <TableHead>Time Slots</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {Array.isArray(selectedTask.volunteer_id?.availability?.schedule) && 
                                                     selectedTask.volunteer_id.availability.schedule.length > 0 ? (
                                                        selectedTask.volunteer_id.availability.schedule.map((item, idx) => (
                                                            <TableRow key={`sch-${idx}`}>
                                                                <TableCell>{item?.dayOfWeek || '-'}</TableCell>
                                                                <TableCell>
                                                                    {Array.isArray(item?.timeSlots) && item.timeSlots.length > 0 ? (
                                                                        item.timeSlots.map((ts, i) => (
                                                                            <span key={`ts-${i}`} className="inline-block mr-2 mb-1 px-2 py-0.5 rounded bg-accent text-accent-foreground text-xs">
                                                                                {ts?.startTime || '-'} - {ts?.endTime || '-'}
                                                                            </span>
                                                                        ))
                                                                    ) : (
                                                                        '-'
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow><TableCell colSpan={2}>No schedule provided</TableCell></TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <div>
                                            <div className="font-medium mb-2">Special Dates</div>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Time Slots</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {Array.isArray(selectedTask.volunteer_id?.availability?.specialDates) && 
                                                     selectedTask.volunteer_id.availability.specialDates.length > 0 ? (
                                                        selectedTask.volunteer_id.availability.specialDates.map((sd, idx) => (
                                                            <TableRow key={`sd-${idx}`}>
                                                                <TableCell>{sd?.date ? formatDateOnly(sd.date) : '-'}</TableCell>
                                                                <TableCell>
                                                                    {Array.isArray(sd?.timeSlots) && sd.timeSlots.length > 0 ? (
                                                                        sd.timeSlots.map((ts, i) => (
                                                                            <span key={`sdt-${i}`} className="inline-block mr-2 mb-1 px-2 py-0.5 rounded bg-accent text-accent-foreground text-xs">
                                                                                {ts?.startTime || '-'} - {ts?.endTime || '-'}
                                                                            </span>
                                                                        ))
                                                                    ) : (
                                                                        '-'
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow><TableCell colSpan={2}>No special dates provided</TableCell></TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default page;