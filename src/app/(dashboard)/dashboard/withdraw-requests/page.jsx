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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

const WithdrawRequests = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [open, setOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/withdrawals/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setWithdrawals(data);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    }
  };

  const handleRowClick = (withdrawal) => {
    setSelectedRequest(withdrawal);
    setOpen(true);
    setRejectionReason("");
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${selectedRequest._id}/process`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: newStatus,
          rejection_reason: newStatus === 'Rejected' ? rejectionReason : undefined
        })
      });

      if (response.ok) {
        fetchWithdrawals();
        setOpen(false);
      }
    } catch (error) {
      console.error('Error updating withdrawal status:', error);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'destructive';
      default: return 'warning';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Withdrawal Requests</h1>
      
      <Table>
        <TableCaption>A list of all withdrawal requests</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Requested</TableHead>
            <TableHead>User</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals.map((withdrawal) => (
            <TableRow 
              key={withdrawal._id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleRowClick(withdrawal)}
            >
              <TableCell>{withdrawal.campaign_id.title}</TableCell>
              <TableCell>${withdrawal.amount}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(withdrawal.status)}>
                  {withdrawal.status}
                </Badge>
              </TableCell>
              <TableCell>{format(new Date(withdrawal.date_requested), 'PPP')}</TableCell>
              <TableCell>{withdrawal.user_id.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdrawal Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Campaign</h3>
                <p>{selectedRequest.campaign_id.title}</p>
              </div>
              <div>
                <h3 className="font-semibold">User Details</h3>
                <p>Name: {selectedRequest.user_id.name}</p>
                <p>Email: {selectedRequest.user_id.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Payment Information</h3>
                {selectedRequest.payment_info_id.payment_type === 'BANK' ? (
                  <div>
                    <p>Bank Name: {selectedRequest.payment_info_id.bank_details.bank_name}</p>
                    <p>Account Holder: {selectedRequest.payment_info_id.bank_details.account_holder_name}</p>
                    <p>Account Number: {selectedRequest.payment_info_id.bank_details.account_number}</p>
                    <p>Branch: {selectedRequest.payment_info_id.bank_details.branch_name}</p>
                    <p>Routing Number: {selectedRequest.payment_info_id.bank_details.routing_number}</p>
                  </div>
                ) : (
                  <div>
                    <p>Provider: {selectedRequest.payment_info_id.mobile_banking.provider}</p>
                    <p>Account Type: {selectedRequest.payment_info_id.mobile_banking.account_type}</p>
                    <p>Account Number: {selectedRequest.payment_info_id.mobile_banking.account_number}</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold">Amount</h3>
                <p>${selectedRequest.amount}</p>
              </div>
              <div>
                <h3 className="font-semibold">Status</h3>
                <Badge variant={getStatusBadgeVariant(selectedRequest.status)}>
                  {selectedRequest.status}
                </Badge>
              </div>
              {selectedRequest.status === 'Pending' && (
                <>
                  <div className="mt-4">
                    <Input
                      placeholder="Rejection reason (required for rejection)"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>
                  <DialogFooter className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusUpdate('Rejected')}
                      disabled={!rejectionReason}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => handleStatusUpdate('Approved')}
                    >
                      Approve
                    </Button>
                  </DialogFooter>
                </>
              )}
              {selectedRequest.status === 'Rejected' && selectedRequest.rejection_reason && (
                <div>
                  <h3 className="font-semibold">Rejection Reason</h3>
                  <p>{selectedRequest.rejection_reason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WithdrawRequests;
