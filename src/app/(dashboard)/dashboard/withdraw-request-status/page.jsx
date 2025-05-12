"use client";
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const WithdrawRequestStatus = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWithdrawals = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/withdrawals/my-withdrawals`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setWithdrawals(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching withdrawals:', error);
                setLoading(false);
            }
        };

        fetchWithdrawals();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Withdrawal Request Status</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {withdrawals.map((withdrawal, index) => (
                        <TableRow key={index}>
                            <TableCell>${withdrawal.amount}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded ${
                                    withdrawal.status === 'approved' ? 'bg-green-200 text-green-800' :
                                    withdrawal.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                    'bg-red-200 text-red-800'
                                }`}>
                                    {withdrawal.status}
                                </span>
                            </TableCell>
                            <TableCell>{new Date(withdrawal.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default WithdrawRequestStatus;
