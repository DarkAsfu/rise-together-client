'use client'
import useRequestFundRaiser from '@/app/hooks/useRequestFundRaiser';
import React, { useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const RequestFundRaiser = () => {
    const { requestFundRaiser, loading, error } = useRequestFundRaiser();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // Sorting function
    const sortData = (data, key) => {
        if (!data) return [];
        return [...data].sort((a, b) => {
            if (key === 'user_id') {
                return sortConfig.direction === 'ascending' 
                    ? a.user_id.name.localeCompare(b.user_id.name)
                    : b.user_id.name.localeCompare(a.user_id.name);
            }
            return sortConfig.direction === 'ascending' 
                ? a[key]?.localeCompare(b[key])
                : b[key]?.localeCompare(a[key]);
        });
    };

    // Handle sort
    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'ascending' 
                ? 'descending' 
                : 'ascending'
        });
    };

    // Handle status update
    const handleStatusUpdate = async (id, status, reason = '') => {
        try {
            const token = localStorage.getItem('token');
            const data = status === 'REJECTED' 
                ? { status, rejection_reason: reason }
                : { status };
            
            await axios.patch(
                `http://localhost:5000/api/users/fundraiser-request/${id}`, 
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setIsDialogOpen(false);
            window.location.reload();
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    // Filter and sort data
    const filteredData = requestFundRaiser?.filter(item => {
        const matchesSearch = 
            item.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.user_id.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (statusFilter === 'ALL') return matchesSearch;
        return matchesSearch && item.status === statusFilter;
    });
    
    const sortedData = sortConfig.key ? sortData(filteredData, sortConfig.key) : filteredData;

    return (
        <div className="p-4 space-y-4">
            <div className="flex gap-4 items-center justify-between">
                <Input
                    type="text"
                    placeholder="Search by organization or user name..."
                    className="max-w-sm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <Table className="border rounded-md">
                <TableHeader className="bg-primary text-white">
                    <TableRow>
                        <TableHead className="cursor-pointer rounded-tl-md text-white" onClick={() => handleSort('user_id')}>
                            User Name {sortConfig.key === 'user_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead className="text-white">Email</TableHead>
                        <TableHead className="cursor-pointer text-white" onClick={() => handleSort('organization_name')}>
                            Organization {sortConfig.key === 'organization_name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead className="text-white">Location</TableHead>
                        <TableHead className="text-white">Purpose</TableHead>
                        <TableHead className="text-white">Status</TableHead>
                        <TableHead className="rounded-tr-md text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedData?.map((request) => (
                        <TableRow key={request._id}>
                            <TableCell className="">{request.user_id.name}</TableCell>
                            <TableCell className="">{request.user_id.email}</TableCell>
                            <TableCell>{request.organization_name}</TableCell>
                            <TableCell>
                                {request.location.city}, {request.location.address}
                            </TableCell>
                            <TableCell>{request.purpose}</TableCell>
                            <TableCell>{request.status}</TableCell>
                            <TableCell>
                                {request.status === 'PENDING' && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="default"
                                            onClick={() => handleStatusUpdate(request._id, 'APPROVED')}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                setSelectedRequest(request);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Fundraiser Request</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejection
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive"
                            onClick={() => {
                                if (selectedRequest && rejectionReason) {
                                    handleStatusUpdate(selectedRequest._id, 'REJECTED', rejectionReason);
                                }
                            }}
                        >
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RequestFundRaiser;