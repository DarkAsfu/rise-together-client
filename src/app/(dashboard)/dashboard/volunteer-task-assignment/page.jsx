"use client";
import React, { useEffect, useMemo, useState } from 'react';
import useTasks from '../../../hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const page = () => {
    const { listTasks, assignTask, listAssignments, getAssignmentsByVolunteer, getAssignmentById, updateAssignmentStatus } = useTasks();

    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);

    const [approvedVolunteers, setApprovedVolunteers] = useState([]);
    const [loadingVolunteers, setLoadingVolunteers] = useState(true);

    const [assignments, setAssignments] = useState([]);
    const [loadingAssignments, setLoadingAssignments] = useState(true);

    const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [status, setStatus] = useState('Assigned');
    const [dateAssigned, setDateAssigned] = useState(() => new Date().toISOString().slice(0, 16));
    const [submitting, setSubmitting] = useState(false);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsVolunteer, setDetailsVolunteer] = useState(null);
    const [detailsTask, setDetailsTask] = useState(null);
    const [detailsAssignment, setDetailsAssignment] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Status update modal state
    const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const openDetailsForVolunteer = async (assignment) => {
        try {
            const id = assignment?._id;
            if (!id) return toast.error('Assignment id not found');
            setDetailsOpen(true);
            setLoadingDetails(true);
            const full = await getAssignmentById(id);
            setDetailsAssignment(full);
            const v = full?.volunteer ?? full?.volunteer_id;
            const t = full?.task ?? full?.task_id;
            setDetailsVolunteer(v || null);
            setDetailsTask(t || null);
        } catch (e) {
            toast.error(e.message || 'Failed to load details');
        } finally {
            setLoadingDetails(false);
        }
    };

    const openStatusUpdate = (assignment) => {
        setSelectedAssignment(assignment);
        setNewStatus(assignment.status || 'Assigned');
        setStatusUpdateOpen(true);
    };

    const handleStatusUpdate = async () => {
        if (!selectedAssignment?._id) return toast.error('Assignment not found');
        if (!newStatus) return toast.error('Please select a status');

        try {
            setUpdatingStatus(true);
            await updateAssignmentStatus(selectedAssignment._id, newStatus);
            toast.success('Status updated successfully');
            setStatusUpdateOpen(false);
            setSelectedAssignment(null);
            setNewStatus('');
            await refreshAssignments(); // Refresh the assignments list
        } catch (error) {
            toast.error(error.message || 'Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Assigned': { variant: 'secondary', color: 'bg-blue-100 text-blue-800' },
            'In Progress': { variant: 'default', color: 'bg-yellow-100 text-yellow-800' },
            'Completed': { variant: 'default', color: 'bg-green-100 text-green-800' },
            'Open': { variant: 'outline', color: 'bg-gray-100 text-gray-800' },
        };

        const config = statusConfig[status] || statusConfig['Assigned'];

        return (
            <Badge variant={config.variant} className={config.color}>
                {status}
            </Badge>
        );
    };

    useEffect(() => {
        const run = async () => {
            try {
                setLoadingTasks(true);
                const taskList = await listTasks();
                setTasks(taskList);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingTasks(false);
            }
        };
        run();
    }, [listTasks]);

    useEffect(() => {
        const run = async () => {
            try {
                setLoadingVolunteers(true);
                const token = localStorage.getItem('token');
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const res = await fetch(`${baseUrl}/volunteer-applications/approved`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Failed to load volunteers');
                setApprovedVolunteers(Array.isArray(data) ? data : (data?.applications || []));
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingVolunteers(false);
            }
        };
        run();
    }, []);

    const refreshAssignments = async () => {
        try {
            setLoadingAssignments(true);
            const list = await listAssignments();
            setAssignments(list);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingAssignments(false);
        }
    };

    useEffect(() => {
        refreshAssignments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const volunteerOptions = useMemo(() => {
        return approvedVolunteers.map(v => ({
            id: v?._id,
            name: v?.user_id?.name || 'Unnamed',
            email: v?.user_id?.email || '',
        }));
    }, [approvedVolunteers]);

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!selectedVolunteerId) return toast.error('Select a volunteer');
        if (!selectedTaskId) return toast.error('Select a task');
        try {
            setSubmitting(true);
            const payload = {
                volunteer_id: selectedVolunteerId,
                task_id: selectedTaskId,
                status,
                date_assigned: new Date(dateAssigned).toISOString(),
            };
            await assignTask(payload);
            toast.success('Task assigned');
            setSelectedVolunteerId('');
            setSelectedTaskId('');
            setStatus('Assigned');
            setDateAssigned(new Date().toISOString().slice(0, 16));
            await refreshAssignments();
        } catch (e) {
            toast.error(e.message || 'Failed to assign');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Assign Volunteer to Task</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAssign} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label>Volunteer</Label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={selectedVolunteerId}
                                onChange={(e) => setSelectedVolunteerId(e.target.value)}
                                disabled={loadingVolunteers}
                            >
                                <option value="">{loadingVolunteers ? 'Loading...' : 'Select volunteer'}</option>
                                {volunteerOptions.map(v => (
                                    <option key={v.id} value={v.id}>{v.name} {v.email ? `(${v.email})` : ''}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label>Task</Label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={selectedTaskId}
                                onChange={(e) => setSelectedTaskId(e.target.value)}
                                disabled={loadingTasks}
                            >
                                <option value="">{loadingTasks ? 'Loading...' : 'Select task'}</option>
                                {tasks.map(t => (
                                    <option key={t._id} value={t._id}>{t.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label>Status</Label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Assigned">Assigned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <Label>Date assigned</Label>
                            <Input
                                type="datetime-local"
                                value={dateAssigned}
                                onChange={(e) => setDateAssigned(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-4">
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'Assigning...' : 'Assign Task'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Volunteer</TableHead>
                                <TableHead>Task</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date Assigned</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loadingAssignments ? (
                                <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
                            ) : assignments.length === 0 ? (
                                <TableRow><TableCell colSpan={5}>No assignments found.</TableCell></TableRow>
                            ) : (
                                assignments.map((a) => {
                                    const volunteerValue = (() => {
                                        const v = a?.volunteer ?? a?.volunteer_id;
                                        if (!v) return '-';
                                        if (typeof v === 'string') return v;
                                        if (typeof v?.name === 'string') return v.name;
                                        if (typeof v?.email === 'string') return v.email;
                                        if (typeof v?.user?.name === 'string') return v.user.name;
                                        if (typeof v?.user?.email === 'string') return v.user.email;
                                        if (typeof v?.user_id === 'string') return v.user_id;
                                        if (typeof v?._id === 'string') return v._id;
                                        return '-';
                                    })();

                                    const taskValue = (() => {
                                        const t = a?.task ?? a?.task_id;
                                        if (!t) return '-';
                                        if (typeof t === 'string') return t;
                                        if (typeof t?.title === 'string') return t.title;
                                        if (typeof t?._id === 'string') return t._id;
                                        return '-';
                                    })();

                                    const rowKey = a?._id || `${typeof a?.volunteer_id === 'string' ? a.volunteer_id : a?.volunteer_id?._id || 'v'}-${typeof a?.task_id === 'string' ? a.task_id : a?.task_id?._id || 't'}-${a?.date_assigned || ''}`;

                                    return (
                                        <TableRow key={rowKey}>
                                            <TableCell>{volunteerValue}</TableCell>
                                            <TableCell>{taskValue}</TableCell>
                                            <TableCell>{getStatusBadge(a?.status)}</TableCell>
                                            <TableCell>{a?.date_assigned ? new Date(a.date_assigned).toLocaleString() : '-'}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => openDetailsForVolunteer(a)}>
                                                        View
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => openStatusUpdate(a)}>
                                                        Update Status
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Details Modal */}
            <Dialog open={detailsOpen} onOpenChange={(o) => setDetailsOpen(o)}>
                <DialogContent className="sm:max-w-3xl h-[70vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Assignment Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                            {(() => {
                                const v = detailsVolunteer;
                                const name = typeof v?.name === 'string' ? v.name : (v?.user?.name || v?.user_id?.name);
                                const email = typeof v?.email === 'string' ? v.email : (v?.user?.email || v?.user_id?.email);
                                const id = typeof v === 'string' ? v : (v?._id || '');
                                return (
                                    <div>
                                        <div><span className="font-medium">Volunteer:</span> {name || email || id || '-'}</div>
                                        {email && <div><span className="font-medium">Email:</span> {email}</div>}
                                    </div>
                                );
                            })()}
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Assignment</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loadingDetails ? (
                                    <div>Loading...</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <div><span className="font-medium">Assignment ID:</span> {detailsAssignment?._id || '-'}</div>
                                            <div><span className="font-medium">Status:</span> {getStatusBadge(detailsAssignment?.status)}</div>
                                        </div>
                                        <div>
                                            <div><span className="font-medium">Date Assigned:</span> {detailsAssignment?.date_assigned ? new Date(detailsAssignment.date_assigned).toLocaleString() : '-'}</div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Task</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loadingDetails ? (
                                    <div>Loading...</div>
                                ) : (
                                    <div className="space-y-3 text-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <div><span className="font-medium">Title:</span> {typeof detailsTask === 'string' ? detailsTask : (detailsTask?.title || '-')}</div>
                                                <div><span className="font-medium">Status:</span> {typeof detailsTask === 'object' ? (detailsTask?.status || '-') : '-'}</div>
                                                <div><span className="font-medium">Task ID:</span> {typeof detailsTask === 'string' ? detailsTask : (detailsTask?._id || '-')}</div>
                                            </div>
                                            <div>
                                                <div><span className="font-medium">Deadline:</span> {typeof detailsTask === 'object' && detailsTask?.deadline ? new Date(detailsTask.deadline).toLocaleString() : '-'}</div>
                                                <div><span className="font-medium">Created At:</span> {typeof detailsTask === 'object' && detailsTask?.created_at ? new Date(detailsTask.created_at).toLocaleString() : '-'}</div>
                                                <div><span className="font-medium">Created By:</span> {typeof detailsTask === 'object' ? (detailsTask?.created_by || '-') : '-'}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div><span className="font-medium">Description:</span></div>
                                            <div className="mt-1 whitespace-pre-wrap">{typeof detailsTask === 'object' ? (detailsTask?.description || '-') : '-'}</div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <div><span className="font-medium">Location:</span> {typeof detailsTask === 'object' ? (detailsTask?.location?.address || '-') : '-'}</div>
                                            </div>
                                            <div>
                                                <div><span className="font-medium">Latitude:</span> {typeof detailsTask === 'object' && detailsTask?.location?.latitude != null ? String(detailsTask.location.latitude) : '-'}</div>
                                            </div>
                                            <div>
                                                <div><span className="font-medium">Longitude:</span> {typeof detailsTask === 'object' && detailsTask?.location?.longitude != null ? String(detailsTask.location.longitude) : '-'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Volunteer Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loadingDetails ? (
                                    <div>Loading...</div>
                                ) : (
                                    <div className="space-y-2 text-sm">
                                        {(() => {
                                            const v = detailsVolunteer;
                                            if (!v) return <div>-</div>;
                                            const id = typeof v === 'string' ? v : (v?._id || '-');
                                            const name = typeof v?.name === 'string' ? v.name : (v?.user?.name || v?.user_id?.name || '-');
                                            const email = typeof v?.email === 'string' ? v.email : (v?.user?.email || v?.user_id?.email || '-');
                                            const status = v?.status || '-';
                                            const skills = Array.isArray(v?.skills) ? v.skills.join(', ') : '-';
                                            const preferences = v?.availability?.preferences || '-';
                                            const address = v?.location?.address || '-';
                                            const latitude = v?.location?.latitude;
                                            const longitude = v?.location?.longitude;
                                            return (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <div><span className="font-medium">Volunteer ID:</span> {id}</div>
                                                        <div><span className="font-medium">Name:</span> {name}</div>
                                                        <div><span className="font-medium">Email:</span> {email}</div>
                                                        <div><span className="font-medium">Status:</span> {status}</div>
                                                    </div>
                                                    <div>
                                                        <div><span className="font-medium">Skills:</span> {skills}</div>
                                                        <div><span className="font-medium">Preferences:</span> {preferences}</div>
                                                        <div><span className="font-medium">Address:</span> {address}</div>
                                                        <div><span className="font-medium">Lat/Lng:</span> {latitude != null && longitude != null ? `${latitude}, ${longitude}` : '-'}</div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Volunteer Availability</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loadingDetails ? (
                                    <div>Loading...</div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <div className="font-medium mb-1">Weekly Schedule</div>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Day</TableHead>
                                                        <TableHead>Time Slots</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {Array.isArray(detailsVolunteer?.availability?.schedule) && detailsVolunteer.availability.schedule.length > 0 ? (
                                                        detailsVolunteer.availability.schedule.map((item, idx) => (
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
                                            <div className="font-medium mb-1">Special Dates</div>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Time Slots</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {Array.isArray(detailsVolunteer?.availability?.specialDates) && detailsVolunteer.availability.specialDates.length > 0 ? (
                                                        detailsVolunteer.availability.specialDates.map((sd, idx) => (
                                                            <TableRow key={`sd-${idx}`}>
                                                                <TableCell>{sd?.date ? new Date(sd.date).toLocaleDateString() : '-'}</TableCell>
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
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Status Update Modal */}
            <Dialog open={statusUpdateOpen} onOpenChange={setStatusUpdateOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Assignment Status</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {selectedAssignment && (
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-sm font-medium">Assignment ID</Label>
                                    <div className="text-sm text-muted-foreground">{selectedAssignment._id}</div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Current Status</Label>
                                    <div className="mt-1">{getStatusBadge(selectedAssignment.status)}</div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">New Status</Label>
                                    <Select value={newStatus} onValueChange={setNewStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select new status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Assigned">Assigned</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusUpdateOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleStatusUpdate} disabled={updatingStatus}>
                            {updatingStatus ? 'Updating...' : 'Update Status'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default page;