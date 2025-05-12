'use client'
import useMyCampaign from '@/app/hooks/useMyCampaign';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Swal from 'sweetalert2';

const Page = () => {
    const { campaigns, loading: campaignLoading, error: campaignError } = useMyCampaign();
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log(campaigns);
    useEffect(() => {
        const fetchPaymentInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/withdrawals/payment-info`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPaymentInfo(response?.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch payment information');
                setLoading(false);
            }
        };

        fetchPaymentInfo();
    }, []);

    const handleWithdrawRequest = async (campaign) => {
        const { value: amount } = await Swal.fire({
            title: 'Enter withdrawal amount',
            input: 'number',
            inputLabel: 'Amount (৳)',
            inputPlaceholder: 'Enter the amount you want to withdraw',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter an amount!';
                }
                if (value <= 0) {
                    return 'Amount must be greater than 0!';
                }
                if (value > campaign?.raisedAmount) {
                    return 'Amount cannot exceed raised amount!';
                }
            }
        });

        if (amount) {
            try {
                const token = localStorage.getItem('token');
                await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/withdrawals/request`, {
                    campaign_id: campaign?._id,
                    amount: parseFloat(amount),
                    payment_info_id: paymentInfo?._id
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Withdrawal request submitted successfully',
                });
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to submit withdrawal request',
                });
            }
        }
    };

    if (loading || campaignLoading) return <div>Loading...</div>;
    if (error || campaignError) return <div>Error: {error || campaignError}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Withdraw Requests</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Campaign Name</TableHead>
                        <TableHead>Raised Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {campaigns?.map((campaign) => (
                        <TableRow key={campaign?._id}>
                            <TableCell>{campaign?.title}</TableCell>
                            <TableCell>৳{campaign?.current_amount}</TableCell>
                            <TableCell>{campaign?.status}</TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => handleWithdrawRequest(campaign)}
                                    variant="default"
                                >
                                    Request Withdrawal
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default Page;
