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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const MyDonations = () => {
    const [donations, setDonations] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const user_id = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/donations/user/${user_id}`);
                setDonations(response.data);
            } catch (error) {
                console.error('Error fetching donations:', error);
            }
        };
        fetchDonations();
    }, [user_id]);

    const showDialog = (campaign) => {
        setSelectedCampaign(campaign);
        setIsDialogOpen(true);
    };

    const calculateProgress = (current, goal) => {
        return Math.round((current / goal) * 100);
    };

    return (
        <div className='mt-6'>
            <DashboardTitle title={"My Donations"} />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Campaign Title</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Payment Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {donations.map((donation) => (
                            <TableRow key={donation._id}>
                                <TableCell className="font-medium">{donation?.campaign_id?.title}</TableCell>
                                <TableCell>{donation.amount} {donation?.currency}</TableCell>
                                <TableCell>{donation?.payment_method}</TableCell>
                                <TableCell>{donation?.status}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="outline"
                                        onClick={() => showDialog(donation.campaign_id)}
                                        className="cursor-pointer"
                                    >
                                        Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {selectedCampaign && (
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedCampaign.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Goal Amount: {selectedCampaign.goal_amount}</p>
                                <p className="text-sm text-muted-foreground">Current Amount: {selectedCampaign.current_amount}</p>
                                <div className="mt-2">
                                    <Progress 
                                        value={calculateProgress(selectedCampaign.current_amount, selectedCampaign.goal_amount)} 
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Category: {selectedCampaign.category}</p>
                                <p className="text-sm text-muted-foreground">Location: {selectedCampaign.location}</p>
                                <p className="text-sm text-muted-foreground">
                                    Deadline: {new Date(selectedCampaign.deadline).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
};

export default MyDonations;