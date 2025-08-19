"use client";
import React, { useEffect, useState } from 'react';
import useTasks from '../../../hooks/useTasks';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, Pencil, Trash2, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MapComponent = dynamic(() => import('../request-for-volunteer/MapComponent'), { ssr: false });

const page = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [deadline, setDeadline] = useState("");
    const [status, setStatus] = useState("Open");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const { listTasks, createTask, updateTask, deleteTask } = useTasks();
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editLatitude, setEditLatitude] = useState("");
    const [editLongitude, setEditLongitude] = useState("");
    const [editAddress, setEditAddress] = useState("");
    const [editDeadline, setEditDeadline] = useState("");
    const [editStatus, setEditStatus] = useState("Open");
    const [savingEdit, setSavingEdit] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoadingTasks(true);
                const data = await listTasks();
                setTasks(data);
            } catch (err) {
                console.error('Failed to load tasks', err);
            } finally {
                setLoadingTasks(false);
            }
        };
        fetchTasks();
    }, [listTasks]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            setSubmitting(true);

            const createdBy = localStorage.getItem('user_id');
            if (!createdBy) throw new Error('Missing user. Please sign in again.');

            const payload = {
                title: title.trim(),
                description: description.trim(),
                location: {
                    latitude: latitude === "" ? null : Number(latitude),
                    longitude: longitude === "" ? null : Number(longitude),
                    address: address.trim(),
                },
                deadline: deadline ? new Date(deadline).toISOString() : null,
                status,
                created_at: new Date().toISOString(),
                created_by: createdBy,
            };

            const data = await createTask(payload);

            setMessage({ type: 'success', text: 'Task created successfully.' });
            toast.success('Task created');

            // Optionally reset the form
            setTitle("");
            setDescription("");
            setAddress("");
            setLatitude("");
            setLongitude("");
            setDeadline("");
            setStatus("Open");

            try {
                const fresh = await listTasks();
                setTasks(fresh);
            } catch {}
            setOpenCreate(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Something went wrong' });
            toast.error(error.message || 'Failed to create task');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Volunteer Tasks</h1>
                <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4" />
                            New Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create Volunteer Task</DialogTitle>
                        </DialogHeader>
                        {message && (
                            <div className={`mb-2 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {message.text}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label className="mb-1 block">Title</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Organize Food Distribution Drive"
                                    required
                                />
                            </div>
                            <div>
                                <Label className="mb-1 block">Description</Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    placeholder="Describe the task and responsibilities"
                                    required
                                />
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" /> Location
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="h-80 rounded-lg overflow-hidden border">
                                        <MapComponent
                                            location={{
                                                latitude: latitude === "" ? 23.8103 : Number(latitude),
                                                longitude: longitude === "" ? 90.4125 : Number(longitude),
                                                address: address || 'Dhaka, Bangladesh',
                                            }}
                                            onLocationChange={(loc) => {
                                                setLatitude(String(loc.latitude));
                                                setLongitude(String(loc.longitude));
                                                setAddress(loc.address || "");
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                            <Label>Latitude</Label>
                                            <Input
                                                type="number"
                                                step="any"
                                                value={latitude}
                                                onChange={(e) => setLatitude(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label>Longitude</Label>
                                            <Input
                                                type="number"
                                                step="any"
                                                value={longitude}
                                                onChange={(e) => setLongitude(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label>Address</Label>
                                            <Input
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Deadline</Label>
                                    <Input
                                        type="datetime-local"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="Assigned">Assigned</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? 'Creating...' : 'Create Task'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Deadline</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loadingTasks ? (
                                <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
                            ) : tasks.length === 0 ? (
                                <TableRow><TableCell colSpan={5}>No tasks found.</TableCell></TableRow>
                            ) : (
                                tasks.map((t) => (
                                    <TableRow key={t._id}>
                                        <TableCell>{t.title}</TableCell>
                                        <TableCell>{t?.location?.address || '-'}</TableCell>
                                        <TableCell>{t.deadline ? new Date(t.deadline).toLocaleString() : '-'}</TableCell>
                                        <TableCell>{t.status}</TableCell>
                                        <TableCell>
                                            <Dialog open={openDetails && selectedTask?._id === t._id} onOpenChange={(o) => { if (!o) { setOpenDetails(false); setSelectedTask(null);} }}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedTask(t);
                                                            setEditTitle(t.title || "");
                                                            setEditDescription(t.description || "");
                                                            setEditLatitude(String(t?.location?.latitude ?? ""));
                                                            setEditLongitude(String(t?.location?.longitude ?? ""));
                                                            setEditAddress(t?.location?.address || "");
                                                            setEditDeadline(t.deadline ? new Date(t.deadline).toISOString().slice(0,16) : "");
                                                            setEditStatus(t.status || "Open");
                                                            setOpenDetails(true);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Details
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-3xl h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Task</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-1 gap-3">
                                                            <div>
                                                                <Label className="mb-1 block">Title</Label>
                                                                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                                            </div>
                                                            <div>
                                                                <Label className="mb-1 block">Description</Label>
                                                                <Textarea rows={4} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <Card>
                                                            <CardHeader>
                                                                <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Location</CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-3">
                                                                <div className="h-64 rounded-lg overflow-hidden border">
                                                                    {selectedTask && (
                                                                        <MapComponent
                                                                            location={{
                                                                                latitude: editLatitude === "" ? (selectedTask?.location?.latitude ?? 23.8103) : Number(editLatitude),
                                                                                longitude: editLongitude === "" ? (selectedTask?.location?.longitude ?? 90.4125) : Number(editLongitude),
                                                                                address: editAddress || selectedTask?.location?.address || 'Location',
                                                                            }}
                                                                            onLocationChange={(loc) => {
                                                                                setEditLatitude(String(loc.latitude));
                                                                                setEditLongitude(String(loc.longitude));
                                                                                setEditAddress(loc.address || "");
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                    <div>
                                                                        <Label>Latitude</Label>
                                                                        <Input type="number" step="any" value={editLatitude} onChange={(e) => setEditLatitude(e.target.value)} />
                                                                    </div>
                                                                    <div>
                                                                        <Label>Longitude</Label>
                                                                        <Input type="number" step="any" value={editLongitude} onChange={(e) => setEditLongitude(e.target.value)} />
                                                                    </div>
                                                                    <div>
                                                                        <Label>Address</Label>
                                                                        <Input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div>
                                                                <Label>Deadline</Label>
                                                                <Input type="datetime-local" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} />
                                                            </div>
                                                            <div>
                                                                <Label>Status</Label>
                                                                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="w-full border rounded px-3 py-2">
                                                                    <option value="Open">Open</option>
                                                                    <option value="Assigned">Assigned</option>
                                                                    <option value="In Progress">In Progress</option>
                                                                    <option value="Completed">Completed</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 justify-between pt-2">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="destructive">
                                                                        <Trash2 className="h-4 w-4" /> Delete
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Confirm Delete</DialogTitle>
                                                                    </DialogHeader>
                                                                    <p className="text-sm text-muted-foreground">This action cannot be undone. Are you sure you want to delete this task?</p>
                                                                    <div className="flex justify-end gap-2">
                                                                        <Button variant="outline">Cancel</Button>
                                                                        <Button
                                                                            variant="destructive"
                                                                            onClick={async () => {
                                                                                if (!selectedTask) return;
                                                                                try {
                                                                                    await deleteTask(selectedTask._id);
                                                                                    setTasks((prev) => prev.filter((it) => it._id !== selectedTask._id));
                                                                                    toast.success('Task deleted');
                                                                                } catch (e) {
                                                                                    console.error(e);
                                                                                    toast.error(e.message || 'Failed to delete task');
                                                                                }
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                            <Button
                                                                onClick={async () => {
                                                                    if (!selectedTask) return;
                                                                    setSavingEdit(true);
                                                                    try {
                                                                        const updates = {
                                                                            title: editTitle,
                                                                            description: editDescription,
                                                                            location: {
                                                                                latitude: editLatitude === "" ? null : Number(editLatitude),
                                                                                longitude: editLongitude === "" ? null : Number(editLongitude),
                                                                                address: editAddress,
                                                                            },
                                                                            deadline: editDeadline ? new Date(editDeadline).toISOString() : null,
                                                                            status: editStatus,
                                                                        };
                                                                        const updated = await updateTask(selectedTask._id, updates);
                                                                        setSelectedTask(updated);
                                                                        setTasks((prev) => prev.map((it) => it._id === updated._id ? updated : it));
                                                                        toast.success('Task updated');
                                                                    } catch (e) { console.error(e); }
                                                                    finally { setSavingEdit(false); }
                                                                }}
                                                                disabled={savingEdit}
                                                            >
                                                                {savingEdit ? 'Saving...' : 'Save Changes'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default page;