'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyPaymentsInfo = () => {
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaymentInfo = async () => {
            try {
                // Replace with your actual API endpoint and token
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/withdrawals/payment-info`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPaymentInfo(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch payment information');
                setLoading(false);
            }
        };

        fetchPaymentInfo();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!paymentInfo) return <div>No payment information available</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Account Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {paymentInfo.payment_type === 'BANK' && (
                            <>
                                <div>
                                    <p className="font-medium">Bank Name</p>
                                    <p>{paymentInfo.bank_details.bank_name}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Account Holder</p>
                                    <p>{paymentInfo.bank_details.account_holder_name}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Account Number</p>
                                    <p>{paymentInfo.bank_details.account_number}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Branch Name</p>
                                    <p>{paymentInfo.bank_details.branch_name}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Routing Number</p>
                                    <p>{paymentInfo.bank_details.routing_number}</p>
                                </div>
                            </>
                        )}
                        {paymentInfo.payment_type !== 'BANK' && (
                            <>
                                <div>
                                    <p className="font-medium">Provider</p>
                                    <p>{paymentInfo.mobile_banking.provider}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Account Type</p>
                                    <p>{paymentInfo.mobile_banking.account_type}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Account Number</p>
                                    <p>{paymentInfo.mobile_banking.account_number}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">Status</p>
                            <p>{paymentInfo.is_verified ? 'Verified' : 'Unverified'}</p>
                        </div>
                        <div>
                            <p className="font-medium">Primary Account</p>
                            <p>{paymentInfo.is_primary ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                            <p className="font-medium">Created Date</p>
                            <p>{new Date(paymentInfo.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPaymentsInfo;