'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const PaymentInfoForm = () => {
    const router = useRouter();
    const user_id = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
    
    const [formData, setFormData] = useState({
        payment_type: 'BANK',
        bank_details: {
            bank_name: '',
            account_holder_name: '',
            account_number: '',
            branch_name: '',
            routing_number: ''
        },
        mobile_banking: {
            provider: 'bKash',
            account_type: 'Personal',
            account_number: ''
        },
        is_primary: false,
        is_verified: false
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.payment_type) {
            newErrors.payment_type = 'Payment type is required';
        }
        
        if (formData.payment_type === 'BANK') {
            if (!formData.bank_details.bank_name) {
                newErrors.bank_name = 'Bank name is required';
            }
            if (!formData.bank_details.account_holder_name) {
                newErrors.account_holder_name = 'Account holder name is required';
            }
            if (!formData.bank_details.account_number) {
                newErrors.account_number = 'Account number is required';
            }
        } else {
            if (!formData.mobile_banking.provider) {
                newErrors.provider = 'Provider is required';
            }
            if (!formData.mobile_banking.account_number) {
                newErrors.mobile_account_number = 'Account number is required';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        if (!user_id) {
            Swal.fire({
                title: "Authentication Error",
                text: "User not authenticated",
                icon: "error",
                button: "OK",
                className: "custom-Swal"
            });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                user_id,
                ...formData
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/withdrawals/payment-info`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            Swal.fire({
                title: "Success!",
                text: "Payment information saved successfully!",
                icon: "success",
                button: "Continue",
                className: "custom-Swal"
            }).then(() => {
                router.push('/dashboard');
            });
        } catch (error) {
            console.error('Error saving payment info:', error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.error || 'Failed to save payment information',
                icon: "error",
                button: "Try Again",
                className: "custom-Swal"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-primary">Add Payment Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Type Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-primary mb-2">
                        Payment Method Type
                    </label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="payment_type"
                                value="BANK"
                                checked={formData.payment_type === 'BANK'}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary focus:ring-secondary"
                            />
                            <span className="ml-2 text-primary">Bank Transfer</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="payment_type"
                                value="MOBILE_BANKING"
                                checked={formData.payment_type === 'MOBILE_BANKING'}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary focus:ring-secondary"
                            />
                            <span className="ml-2 text-primary">Mobile Banking</span>
                        </label>
                    </div>
                    {errors.payment_type && (
                        <p className="mt-1 text-sm text-red-600">{errors.payment_type}</p>
                    )}
                </div>

                {/* Bank Details */}
                {formData.payment_type === 'BANK' && (
                    <div className="space-y-4 border border-primary p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-primary">Bank Account Details</h3>
                        
                        <div>
                            <label htmlFor="bank_details.bank_name" className="block text-sm font-medium text-primary">
                                Bank Name
                            </label>
                            <input
                                type="text"
                                id="bank_details.bank_name"
                                name="bank_details.bank_name"
                                value={formData.bank_details.bank_name}
                                onChange={handleChange}
                                className={`mt-1 pl-2 py-2 block w-full rounded-md border-primary shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm ${errors.bank_name ? 'border-red-500' : ''}`}
                            />
                            {errors.bank_name && (
                                <p className="mt-1 text-sm text-red-600">{errors.bank_name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="bank_details.account_holder_name" className="block text-sm font-medium text-gray-700">
                                Account Holder Name
                            </label>
                            <input
                                type="text"
                                id="bank_details.account_holder_name"
                                name="bank_details.account_holder_name"
                                value={formData.bank_details.account_holder_name}
                                onChange={handleChange}
                                className={`mt-1 pl-2 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.account_holder_name ? 'border-red-500' : 'border'}`}
                            />
                            {errors.account_holder_name && (
                                <p className="mt-1 text-sm text-red-600">{errors.account_holder_name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="bank_details.account_number" className="block text-sm font-medium text-gray-700">
                                Account Number
                            </label>
                            <input
                                type="text"
                                id="bank_details.account_number"
                                name="bank_details.account_number"
                                value={formData.bank_details.account_number}
                                onChange={handleChange}
                                className={`mt-1 pl-2 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.account_number ? 'border-red-500' : 'border'}`}
                            />
                            {errors.account_number && (
                                <p className="mt-1 text-sm text-red-600">{errors.account_number}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="bank_details.branch_name" className="block text-sm font-medium text-gray-700">
                                Branch Name (Optional)
                            </label>
                            <input
                                type="text"
                                id="bank_details.branch_name"
                                name="bank_details.branch_name"
                                value={formData.bank_details.branch_name}
                                onChange={handleChange}
                                className="mt-1 pl-2 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="bank_details.routing_number" className="block text-sm font-medium text-gray-700">
                                Routing Number (Optional)
                            </label>
                            <input
                                type="text"
                                id="bank_details.routing_number"
                                name="bank_details.routing_number"
                                value={formData.bank_details.routing_number}
                                onChange={handleChange}
                                className="mt-1 pl-2 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                )}

                {/* Mobile Banking Details */}
                {formData.payment_type === 'MOBILE_BANKING' && (
                    <div className="space-y-4 border p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800">Mobile Banking Details</h3>
                        
                        <div>
                            <label htmlFor="mobile_banking.provider" className="block text-sm font-medium text-gray-700">
                                Provider
                            </label>
                            <select
                                id="mobile_banking.provider"
                                name="mobile_banking.provider"
                                value={formData.mobile_banking.provider}
                                onChange={handleChange}
                                className={`mt-1 pl-2 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.provider ? 'border-red-500' : 'border'}`}
                            >
                                <option value="bKash">bKash</option>
                                <option value="Nagad">Nagad</option>
                                <option value="Rocket">Rocket</option>
                            </select>
                            {errors.provider && (
                                <p className="mt-1 text-sm text-red-600">{errors.provider}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="mobile_banking.account_type" className="block text-sm font-medium text-gray-700">
                                Account Type
                            </label>
                            <select
                                id="mobile_banking.account_type"
                                name="mobile_banking.account_type"
                                value={formData.mobile_banking.account_type}
                                onChange={handleChange}
                                className="mt-1 pl-2 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="Personal">Personal</option>
                                <option value="Agent">Agent</option>
                                <option value="Merchant">Merchant</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="mobile_banking.account_number" className="block text-sm font-medium text-gray-700">
                                Account Number
                            </label>
                            <input
                                type="text"
                                id="mobile_banking.account_number"
                                name="mobile_banking.account_number"
                                value={formData.mobile_banking.account_number}
                                onChange={handleChange}
                                className={`mt-1 pl-2 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.mobile_account_number ? 'border-red-500' : 'border'}`}
                            />
                            {errors.mobile_account_number && (
                                <p className="mt-1 text-sm text-red-600">{errors.mobile_account_number}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Primary Payment Method */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_primary"
                        name="is_primary"
                        checked={formData.is_primary}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary focus:ring-secondary border-primary rounded"
                    />
                    <label htmlFor="is_primary" className="ml-2 block text-sm text-primary">
                        Set as primary payment method
                    </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Save Payment Information'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PaymentInfoForm;