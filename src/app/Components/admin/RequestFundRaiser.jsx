'use client'
import useRequestFundRaiser from '@/app/hooks/useRequestFundRaiser'
import React, { useState } from 'react'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import DashboardTitle from '../DashboardTitle'

const RequestFundRaiser = () => {
  const { requestFundRaiser, loading, error } = useRequestFundRaiser()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  })
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const sortData = (data, key) => {
    if (!data) return []
    return [...data].sort((a, b) => {
      if (key === 'user_id') {
        return sortConfig.direction === 'ascending'
          ? a.user_id.name.localeCompare(b.user_id.name)
          : b.user_id.name.localeCompare(a.user_id.name)
      }
      return sortConfig.direction === 'ascending'
        ? a[key]?.localeCompare(b[key])
        : b[key]?.localeCompare(a[key])
    })
  }

  const handleSort = key => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending'
    })
  }

  const handleStatusUpdate = async (id, status, reason = '') => {
    try {
      const token = localStorage.getItem('token')
      const data =
        status === 'REJECTED'
          ? { status, rejection_reason: reason }
          : { status }

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/fundraiser-request/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setIsRejectionDialogOpen(false)
      window.location.reload()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const filteredData = requestFundRaiser?.filter(item => {
    const matchesSearch =
      item.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user_id.name.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === 'ALL') return matchesSearch
    return matchesSearch && item.status === statusFilter
  })

  const sortedData = sortConfig.key
    ? sortData(filteredData, sortConfig.key)
    : filteredData

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className='p-4 space-y-4'>
      <DashboardTitle title={'Fund Raiser Request'} />
      <div className='flex gap-4 items-center justify-between'>
        <Input
          type='text'
          placeholder='Search by organization or user name...'
          className='max-w-sm'
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ALL'>All</SelectItem>
            <SelectItem value='APPROVED'>Approved</SelectItem>
            <SelectItem value='REJECTED'>Rejected</SelectItem>
            <SelectItem value='PENDING'>Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className=''>
        <Table>
          <TableHeader className='text-black'>
            <TableRow>
              <TableHead className='cursor-pointer' onClick={() => handleSort('user_id')}>
                User Name {sortConfig.key === 'user_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </TableHead>
              <TableHead className=''>Organization</TableHead>
              <TableHead className=''>Status</TableHead>
              <TableHead className=''>Submitted Date</TableHead>
              <TableHead className='rounded-tr-md '>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData?.map(request => (
              <TableRow key={request._id}>
                <TableCell>{request.user_id.name}</TableCell>
                <TableCell>{request.organization_name}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>{formatDate(request.submitted_at)}</TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setSelectedRequest(request)
                        setIsDetailsDialogOpen(true)
                      }}
                    >
                      Details
                    </Button>
                    {request.status === 'PENDING' && (
                      <>
                        <Button
                          variant='default'
                          onClick={() => handleStatusUpdate(request._id, 'APPROVED')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant='destructive'
                          onClick={() => {
                            setSelectedRequest(request)
                            setIsRejectionDialogOpen(true)
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl mx-2 overflow-y-auto max-h-[90vh]" style={{ overflowY: 'auto' }}>
          <DialogHeader>
            <DialogTitle>Fundraiser Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h3 className="font-semibold">User Information</h3>
                <p>Name: {selectedRequest.user_id.name}</p>
                <p>Email: {selectedRequest.user_id.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Organization Details</h3>
                <p>Name: {selectedRequest.organization_name}</p>
                <p>Type: {selectedRequest.request_type}</p>
              </div>
              <div>
                <h3 className="font-semibold">Verification</h3>
                <p>Type: {selectedRequest.verification_type}</p>
                <p>Number: {selectedRequest.verification_number}</p>
              </div>
              <div>
                <h3 className="font-semibold">Location</h3>
                <p>City: {selectedRequest.location.city}</p>
                <p>Address: {selectedRequest.location.address}</p>
              </div>
              <div className="col-span-2">
                <h3 className="font-semibold">Fundraiser Information</h3>
                <p>About: {selectedRequest.about}</p>
              </div>
              <div className="col-span-2">
                <h3 className="font-semibold">Campaign Information</h3>
                <p>Purpose: {selectedRequest.purpose}</p>
                <p>Goals: {selectedRequest.goals}</p>
              </div>
              <div className="col-span-2">
                <h3 className="font-semibold">Attachments</h3>
                {selectedRequest.attachments.map((url, index) => (
                  <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block">
                    Document {index + 1}
                  </a>
                ))}
              </div>
              <div className="col-span-2">
                <h3 className="font-semibold">Status Information</h3>
                <p>Current Status: {selectedRequest.status}</p>
                <p>Submitted: {formatDate(selectedRequest.submitted_at)}</p>
                {selectedRequest.processed_at && (
                  <p>Processed: {formatDate(selectedRequest.processed_at)}</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant='outline' onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Fundraiser Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={e => setRejectionReason(e.target.value)}
            placeholder='Enter rejection reason...'
          />
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsRejectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                if (selectedRequest && rejectionReason) {
                  handleStatusUpdate(
                    selectedRequest._id,
                    'REJECTED',
                    rejectionReason
                  )
                }
              }}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RequestFundRaiser
