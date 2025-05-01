'use client'
import useUsers from '@/app/hooks/useUsers'
import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import DashboardTitle from '@/app/Components/DashboardTitle'

const ITEMS_PER_PAGE = 20

// Optimize initial loading with a separate component
const UsersTable = ({ displayedUsers, sortConfig, handleSort }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>No.</TableHead>
        <TableHead
          onClick={() => handleSort('name')}
          className='cursor-pointer'
        >
          Name{' '}
          {sortConfig.key === 'name' &&
            (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </TableHead>
        <TableHead
          onClick={() => handleSort('email')}
          className='cursor-pointer'
        >
          Email{' '}
          {sortConfig.key === 'email' &&
            (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </TableHead>
        <TableHead
          onClick={() => handleSort('role_id')}
          className='cursor-pointer'
        >
          Role{' '}
          {sortConfig.key === 'role_id' &&
            (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </TableHead>
        <TableHead
          onClick={() => handleSort('created_at')}
          className='cursor-pointer'
        >
          Created At{' '}
          {sortConfig.key === 'created_at' &&
            (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {displayedUsers.map((user, index) => (
        <TableRow key={user._id}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>{user.role_id?.name}</TableCell>
          <TableCell>
            {new Date(user.created_at).toLocaleDateString()}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

const Page = () => {
  const { users, loading } = useUsers()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'desc'
  })
  const [roleFilter, setRoleFilter] = useState('all')
  const [displayedUsers, setDisplayedUsers] = useState([])
  const [page, setPage] = useState(1)
  const loader = useRef(null)

  // Optimize sorting and filtering with debounced memoization
  const sortedAndFilteredUsers = useMemo(() => {
    if (!users) return []

    let filteredUsers = users.filter(user => {
      const roleMatch =
        roleFilter === 'all' ||
        user.role_id?.name.toLowerCase() === roleFilter.toLowerCase()

      const searchMatch =
        !searchTerm ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())

      return roleMatch && searchMatch
    })

    return filteredUsers.sort((a, b) => {
      const aValue =
        sortConfig.key === 'role_id' ? a.role_id?.name : a[sortConfig.key]
      const bValue =
        sortConfig.key === 'role_id' ? b.role_id?.name : b[sortConfig.key]
      return sortConfig.direction === 'asc'
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1
    })
  }, [users, sortConfig, searchTerm, roleFilter])

  useEffect(() => {
    const startIndex = 0
    const endIndex = page * ITEMS_PER_PAGE
    setDisplayedUsers(sortedAndFilteredUsers.slice(startIndex, endIndex))
  }, [sortedAndFilteredUsers, page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entities => {
        if (entities[0].isIntersecting) {
          setPage(prevPage => {
            const nextPage = prevPage + 1
            const maxPages = Math.ceil(
              sortedAndFilteredUsers.length / ITEMS_PER_PAGE
            )
            return nextPage <= maxPages ? nextPage : prevPage
          })
        }
      },
      { root: null, rootMargin: '20px', threshold: 1.0 }
    )

    if (loader.current) observer.observe(loader.current)
    return () => observer.disconnect()
  }, [sortedAndFilteredUsers.length])

  const handleSort = key => {
    setSortConfig(current => ({
      key,
      direction:
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-primary'></div>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-6'>
      <DashboardTitle title={"All users"} />
      <div className='flex justify-between items-center mb-6 gap-4'>
        <Input
          placeholder='Search users...'
          className='max-w-xs'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by role' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Roles</SelectItem>
            <SelectItem value='admin'>Admin</SelectItem>
            <SelectItem value='donor'>Donor</SelectItem>
            <SelectItem value='campaign creator'>Campaign Creator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='rounded-md border'>
        <Suspense fallback={<div>Loading table...</div>}>
          <UsersTable
            displayedUsers={displayedUsers}
            sortConfig={sortConfig}
            handleSort={handleSort}
          />
        </Suspense>
        <div ref={loader} className='' />
      </div>
    </div>
  )
}

export default Page
