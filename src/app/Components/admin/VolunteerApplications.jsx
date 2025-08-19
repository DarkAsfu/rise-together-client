'use client'
import useVolunteerApplications from '@/app/hooks/useVolunteerApplications'
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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DashboardTitle from '../DashboardTitle'
import { Calendar, Clock, MapPin, User, Eye, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react'

const VolunteerApplications = () => {
  const { volunteerApplications, loading, error } = useVolunteerApplications()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  })
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [applicationDetails, setApplicationDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: '',
    admin_notes: '',
    rejection_reason: null
  })
  const [updatingStatus, setUpdatingStatus] = useState(false)

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>

  const sortData = (data, key) => {
    if (!data) return []
    return [...data].sort((a, b) => {
      if (key === 'user_id') {
        return sortConfig.direction === 'ascending'
          ? a.user_id.name.localeCompare(b.user_id.name)
          : b.user_id.name.localeCompare(a.user_id.name)
      }
      if (key === 'created_at') {
        return sortConfig.direction === 'ascending'
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at)
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

  const handleStatusUpdate = async (id, status) => {
    setStatusUpdateData({
      status: status,
      admin_notes: '',
      rejection_reason: status === 'REJECTED' ? '' : null
    })
    setSelectedApplication({ _id: id })
    setIsStatusDialogOpen(true)
  }

  const submitStatusUpdate = async () => {
    try {
      setUpdatingStatus(true)
      const token = localStorage.getItem('token')
      
      const requestData = {
        status: statusUpdateData.status,
        admin_notes: statusUpdateData.admin_notes || null,
        rejection_reason: statusUpdateData.status === 'REJECTED' ? statusUpdateData.rejection_reason : null
      }

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/volunteer-applications/${selectedApplication._id}/review`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      setIsStatusDialogOpen(false)
      setStatusUpdateData({ status: '', admin_notes: '', rejection_reason: null })
      window.location.reload()
    } catch (err) {
      console.error('Error updating status:', err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const fetchApplicationDetails = async (id) => {
    try {
      setLoadingDetails(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/volunteer-applications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setApplicationDetails(response.data)
    } catch (err) {
      console.error('Error fetching application details:', err)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleViewDetails = async (application) => {
    setSelectedApplication(application)
    setIsDetailsDialogOpen(true)
    await fetchApplicationDetails(application._id)
  }

  const filteredData = volunteerApplications?.filter(item => {
    const matchesSearch =
      item.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user_id?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      'SUBMITTED': { color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
      'UNDER_REVIEW': { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      'APPROVED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'REJECTED': { color: 'bg-red-100 text-red-800', icon: XCircle },
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon }
    }
    
    const config = statusConfig[status] || statusConfig['SUBMITTED']
    const Icon = config.icon
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    )
  }

  return (
    <div className='p-4 space-y-4'>
      <DashboardTitle title={'Volunteer Applications'} />
      
      <div className='flex gap-4 items-center justify-between'>
        <Input
          type='text'
          placeholder='Search by name, email, or skills...'
          className='max-w-sm'
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
                     <SelectContent>
             <SelectItem value='ALL'>All</SelectItem>
             <SelectItem value='SUBMITTED'>Submitted</SelectItem>
             <SelectItem value='UNDER_REVIEW'>Under Review</SelectItem>
             <SelectItem value='APPROVED'>Approved</SelectItem>
             <SelectItem value='REJECTED'>Rejected</SelectItem>
             <SelectItem value='PENDING'>Pending</SelectItem>
           </SelectContent>
        </Select>
      </div>

      <div className=''>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('user_id')}
              >
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Volunteer Name
                </div>
              </TableHead>
              <TableHead>Email</TableHead>
              {/* <TableHead>Skills</TableHead> */}
              <TableHead>Location</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Applied Date
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData?.map((application) => (
              <TableRow key={application._id}>
                <TableCell className="font-medium">
                  {application.user_id?.name || 'N/A'}
                </TableCell>
                <TableCell>{application.user_id?.email || 'N/A'}</TableCell>
                {/* <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {application.skills?.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {application.skills?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{application.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </TableCell> */}
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="text-sm">
                      {application.location?.address || 'N/A'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(application.status)}
                </TableCell>
                <TableCell>
                  {formatDate(application.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(application)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                                         {application.status === 'SUBMITTED' && (
                       <div className="flex gap-1">
                         <Button
                           size="sm"
                           variant="outline"
                           className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                           onClick={() => handleStatusUpdate(application._id, 'UNDER_REVIEW')}
                           title="Mark as Under Review"
                         >
                           <ClockIcon className="w-3 h-3" />
                         </Button>
                         <Button
                           size="sm"
                           variant="outline"
                           className="text-green-600 border-green-600 hover:bg-green-50"
                           onClick={() => handleStatusUpdate(application._id, 'APPROVED')}
                           title="Approve"
                         >
                           <CheckCircle className="w-3 h-3" />
                         </Button>
                         <Button
                           size="sm"
                           variant="outline"
                           className="text-red-600 border-red-600 hover:bg-red-50"
                           onClick={() => handleStatusUpdate(application._id, 'REJECTED')}
                           title="Reject"
                         >
                           <XCircle className="w-3 h-3" />
                         </Button>
                       </div>
                     )}
                     {application.status === 'UNDER_REVIEW' && (
                       <div className="flex gap-1">
                         <Button
                           size="sm"
                           variant="outline"
                           className="text-green-600 border-green-600 hover:bg-green-50"
                           onClick={() => handleStatusUpdate(application._id, 'APPROVED')}
                           title="Approve"
                         >
                           <CheckCircle className="w-3 h-3" />
                         </Button>
                         <Button
                           size="sm"
                           variant="outline"
                           className="text-red-600 border-red-600 hover:bg-red-50"
                           onClick={() => handleStatusUpdate(application._id, 'REJECTED')}
                           title="Reject"
                         >
                           <XCircle className="w-3 h-3" />
                         </Button>
                       </div>
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
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Volunteer Application Details</DialogTitle>
            <DialogDescription>
              Detailed information about the volunteer application
            </DialogDescription>
          </DialogHeader>
          
          {loadingDetails ? (
            <div className="flex justify-center items-center h-32">Loading details...</div>
          ) : applicationDetails ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm">{applicationDetails.user_id?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm">{applicationDetails.user_id?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Role</label>
                      <p className="text-sm">{applicationDetails.user_id?.role_id?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="mt-1">{getStatusBadge(applicationDetails.status)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {applicationDetails.skills?.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{applicationDetails.location?.address}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Coordinates: {applicationDetails.location?.latitude}, {applicationDetails.location?.longitude}
                  </p>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Preferences</label>
                    <p className="text-sm">{applicationDetails.availability?.preferences}</p>
                  </div>
                  
                  {/* Regular Schedule */}
                  {applicationDetails.availability?.schedule?.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Regular Schedule</label>
                      <div className="mt-2 space-y-2">
                        {applicationDetails.availability.schedule.map((day, index) => (
                          <div key={index} className="border rounded p-3">
                            <h4 className="font-medium text-sm">{day.dayOfWeek}</h4>
                            <div className="mt-1 space-y-1">
                              {day.timeSlots.map((slot, slotIndex) => (
                                <div key={slotIndex} className="text-sm text-gray-600">
                                  {slot.startTime} - {slot.endTime}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Dates */}
                  {applicationDetails.availability?.specialDates?.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Special Dates</label>
                      <div className="mt-2 space-y-2">
                        {applicationDetails.availability.specialDates.map((date, index) => (
                          <div key={index} className="border rounded p-3">
                            <h4 className="font-medium text-sm">
                              {new Date(date.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </h4>
                            <div className="mt-1 space-y-1">
                              {date.timeSlots.map((slot, slotIndex) => (
                                <div key={slotIndex} className="text-sm text-gray-600">
                                  {slot.startTime} - {slot.endTime}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

                             {/* Admin Notes */}
               {applicationDetails.admin_notes && (
                 <Card>
                   <CardHeader>
                     <CardTitle>Admin Notes</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-gray-700">{applicationDetails.admin_notes}</p>
                   </CardContent>
                 </Card>
               )}

               {/* Rejection Reason */}
               {applicationDetails.rejection_reason && (
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-red-600">Rejection Reason</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-red-700">{applicationDetails.rejection_reason}</p>
                   </CardContent>
                 </Card>
               )}

               {/* Application Timeline */}
               <Card>
                 <CardHeader>
                   <CardTitle>Application Timeline</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                       <span>Submitted:</span>
                       <span>{formatDate(applicationDetails.created_at)}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span>Last Updated:</span>
                       <span>{formatDate(applicationDetails.updated_at)}</span>
                     </div>
                   </div>
                 </CardContent>
               </Card>
            </div>
          ) : (
            <div className="text-center text-gray-500">No details available</div>
          )}
          
                     <DialogFooter>
             <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
               Close
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>

       {/* Status Update Dialog */}
       <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle>Update Application Status</DialogTitle>
             <DialogDescription>
               Update the status and add notes for this volunteer application
             </DialogDescription>
           </DialogHeader>
           
           <div className="space-y-4">
             <div>
               <label className="text-sm font-medium text-gray-700">Status</label>
               <div className="mt-1">
                 {getStatusBadge(statusUpdateData.status)}
               </div>
             </div>
             
             <div>
               <label className="text-sm font-medium text-gray-700">Admin Notes</label>
               <textarea
                 className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 rows={3}
                 placeholder="Add notes about this application..."
                 value={statusUpdateData.admin_notes}
                 onChange={(e) => setStatusUpdateData(prev => ({
                   ...prev,
                   admin_notes: e.target.value
                 }))}
               />
             </div>
             
             {statusUpdateData.status === 'REJECTED' && (
               <div>
                 <label className="text-sm font-medium text-gray-700">Rejection Reason</label>
                 <textarea
                   className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                   rows={2}
                   placeholder="Reason for rejection..."
                   value={statusUpdateData.rejection_reason || ''}
                   onChange={(e) => setStatusUpdateData(prev => ({
                     ...prev,
                     rejection_reason: e.target.value
                   }))}
                 />
               </div>
             )}
           </div>
           
           <DialogFooter>
             <Button 
               variant="outline" 
               onClick={() => {
                 setIsStatusDialogOpen(false)
                 setStatusUpdateData({ status: '', admin_notes: '', rejection_reason: null })
               }}
             >
               Cancel
             </Button>
             <Button 
               onClick={submitStatusUpdate}
               disabled={updatingStatus}
               className={
                 statusUpdateData.status === 'APPROVED' 
                   ? 'bg-green-600 hover:bg-green-700' 
                   : statusUpdateData.status === 'REJECTED'
                   ? 'bg-red-600 hover:bg-red-700'
                   : 'bg-yellow-600 hover:bg-yellow-700'
               }
             >
               {updatingStatus ? 'Updating...' : 'Update Status'}
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     </div>
   )
 }

export default VolunteerApplications
