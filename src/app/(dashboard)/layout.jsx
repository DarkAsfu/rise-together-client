'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  User2Icon,
  CalendarCheck,
  HandHeart,
  FileSpreadsheet,
  UserCog,
  Loader2,
  UserRoundCog,
  UserSquare,
  List,
  CornerDownLeftIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from '@/components/ui/sheet'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import Image from 'next/image'
import logo from '../../../public/logo.png'
import useProfile from '../hooks/useProfile'

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [routes, setRoutes] = useState([])
  const { profile, loading, error } = useProfile()

  // Base routes that are always shown first
  const baseRoutes = [
    {
      label: 'Overview',
      icon: LayoutDashboard,
      href: '/dashboard'
    },
    {
      label: 'Profile',
      icon: User2Icon,
      href: '/dashboard/profile'
    }
  ]

  // Role-specific routes
  const roleRoutes = {
    Admin: [
      {
        label: 'Users',
        icon: Users,
        href: '/dashboard/users'
      },
      {
        label: 'Analytics',
        icon: BarChart3,
        href: '/dashboard/analytics'
      },
      {
        label: 'User Management',
        icon: UserCog,
        href: '/dashboard/user-management'
      },
      {
        label: 'Campaign request',
        icon: CornerDownLeftIcon,
        href: '/dashboard/campaign-request'
      },
      {
        label: 'Fund Raiser Request',
        icon: UserSquare,
        href: '/dashboard/fund-raiser-request'
      }
    ],
    'Campaign Creator': [
      {
        label: 'Campaigns',
        icon: CalendarCheck,
        href: '/dashboard/campaigns'
      },
      {
        label: 'My Campaigns',
        icon: List,
        href: '/dashboard/my-campaigns'
      },
      {
        label: 'Reports',
        icon: FileSpreadsheet,
        href: '/dashboard/reports'
      }
    ],
    Volunteer: [
      {
        label: 'Available Campaigns',
        icon: HandHeart,
        href: '/dashboard/available-campaigns'
      },
      {
        label: 'My Activities',
        icon: CalendarCheck,
        href: '/dashboard/my-activities'
      }
    ],
    Donor: [
      {
        label: 'My Donations',
        icon: HandHeart,
        href: '/dashboard/my-donations'
      },
      {
        label: 'Request for Fundraiser',
        icon: CalendarCheck,
        href: '/dashboard/request-for-fundraiser'
      }
    ]
  }

  useEffect(() => {
    // Show base routes immediately
    setRoutes(baseRoutes)

    // Add role-specific routes after profile is loaded
    if (profile?.role_id?.name) {
      const roleSpecificRoutes = roleRoutes[profile.role_id.name] || []
      setRoutes([...baseRoutes, ...roleSpecificRoutes])
    }
  }, [profile])

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  return (
    <div className='flex min-h-screen'>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden fixed left-4 top-4 z-50'
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='w-52 p-0'>
          <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
          <SidebarContent routes={routes} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <nav
        className={cn(
          'hidden md:flex flex-col border-r bg-background transition-all duration-300 fixed h-screen',
          isCollapsed ? 'w-16' : 'w-72'
        )}
      >
        <div
          className={cn(
            'flex z-40 p-3',
            !isCollapsed ? 'justify-end' : 'justify-center'
          )}
        >
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='h-10 w-10 border cursor-pointer'
          >
            {isCollapsed ? (
              <ChevronRight size={24} />
            ) : (
              <ChevronLeft size={24} />
            )}
          </Button>
        </div>
        <SidebarContent routes={routes} isCollapsed={isCollapsed} />
      </nav>

      {/* Main Content */}
      <main className={cn('flex-1 overflow-y-auto', isCollapsed ? 'md:ml-16' : 'md:ml-72')}>
        <div className='container mx-auto p-6 max-w-7xl'>{children}</div>
      </main>
    </div>
  )
}

const SidebarContent = ({ routes, isCollapsed }) => {
  return (
    <div className='space-y-4 py-4 flex flex-col h-full bg-background'>
      <div className='px-3 py-2'>
        {!isCollapsed && (
          <Link href="/">
            <Image className='pl-4' src={logo} alt='logo' width={150} height={100} />
          </Link>
        )}
        {isCollapsed && (
          <VisuallyHidden>
            <Link href="/">
              <Image src={logo} alt='logo' width={150} height={100} />
            </Link>
          </VisuallyHidden>
        )}
      </div>
      <div className='space-y-1 px-3'>
        {routes.map(route => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'flex items-center gap-x-2 text-sm font-medium px-4 py-2.5',
              'hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors',
              'text-muted-foreground',
              isCollapsed && 'justify-center px-2'
            )}
            title={isCollapsed ? route.label : undefined}
          >
            <route.icon className='h-4 w-4' />
            {!isCollapsed && route.label}
            {isCollapsed && <VisuallyHidden>{route.label}</VisuallyHidden>}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DashboardLayout
