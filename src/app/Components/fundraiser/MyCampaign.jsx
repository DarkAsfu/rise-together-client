'use client'
import React, { useState, useEffect } from 'react';
import DashboardTitle from '../DashboardTitle';
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
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MyCampaign = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns/my/campaigns`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setCampaigns(response.data);
                setFilteredCampaigns(response.data);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            }
        };
        fetchCampaigns();
    }, []);

    const filterCampaigns = (term, status) => {
        let filtered = campaigns;
        
        // Apply search term filter
        if (term) {
            filtered = filtered.filter(campaign => 
                campaign.title.toLowerCase().includes(term.toLowerCase()) ||
                campaign.category.toLowerCase().includes(term.toLowerCase()) ||
                campaign.location.toLowerCase().includes(term.toLowerCase())
            );
        }
        
        // Apply status filter
        if (status && status !== 'all') {
            filtered = filtered.filter(campaign => campaign.status === status);
        }
        
        setFilteredCampaigns(filtered);
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        filterCampaigns(term, statusFilter);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        filterCampaigns(searchTerm, value);
    };

    return (
        <div className='mt-6 space-y-4'>
            <DashboardTitle title={"My Campaign"} />
            
            <div className="flex gap-4">
                <Input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Goal Amount</TableHead>
                        <TableHead className="text-right">Current Amount</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Deadline</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCampaigns.map((campaign) => (
                        <TableRow key={campaign._id}>
                            <TableCell className="font-medium">{campaign.title}</TableCell>
                            <TableCell>{campaign.category}</TableCell>
                            <TableCell className="text-right">${campaign.goal_amount}</TableCell>
                            <TableCell className="text-right">${campaign.current_amount}</TableCell>
                            <TableCell>{campaign.location}</TableCell>
                            <TableCell>
                                <Badge 
                                    className={`${
                                        campaign.status === 'Active' ? 'bg-primary text-white' :
                                        campaign.status === 'Completed' ? 'bg-blue-500 text-white' : ''
                                    }`}
                                    variant={campaign.status === 'Draft' ? 'secondary' : 'success'}
                                >
                                    {campaign.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{new Date(campaign.deadline).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default MyCampaign;