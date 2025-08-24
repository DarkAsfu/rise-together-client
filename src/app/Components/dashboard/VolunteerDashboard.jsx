"use client";
import React, { useEffect, useState } from 'react';
import useTasks from '../../hooks/useTasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'react-hot-toast';
import { 
    FileText, 
    Calendar, 
    MapPin, 
    User, 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    TrendingUp,
    Award,
    Target,
    Activity,
    Star
} from 'lucide-react';
import Link from 'next/link';

const VolunteerDashboard = () => {
    const { getMyTasks } = useTasks();
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const userId = localStorage.getItem('user_id');
                const userData = localStorage.getItem('user');
                
                if (!userId) {
                    toast.error('User ID not found. Please login again.');
                    return;
                }

                // Set user profile from localStorage
                if (userData) {
                    setUserProfile(JSON.parse(userData));
                }

                // Fetch tasks
                const tasks = await getMyTasks(userId);
                setMyTasks(tasks);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                toast.error(error.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [getMyTasks]);

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Assigned': { variant: 'secondary', icon: Clock, color: 'bg-blue-100 text-blue-800' },
            'In Progress': { variant: 'default', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800' },
            'Completed': { variant: 'default', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
            'Open': { variant: 'outline', icon: Clock, color: 'bg-gray-100 text-gray-800' },
        };

        const config = statusConfig[status] || statusConfig['Assigned'];
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color}`}>
                <Icon className="h-3 w-3" />
                {status}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    // Calculate statistics
    const totalTasks = myTasks.length;
    const completedTasks = myTasks.filter(task => task.status === 'Completed').length;
    const inProgressTasks = myTasks.filter(task => task.status === 'In Progress').length;
    const assignedTasks = myTasks.filter(task => task.status === 'Assigned').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Get recent tasks (last 5)
    const recentTasks = myTasks.slice(0, 5);

    // Get upcoming deadlines (tasks due within 7 days)
    const upcomingDeadlines = myTasks.filter(task => {
        if (!task.task_id?.deadline) return false;
        const deadline = new Date(task.task_id.deadline);
        const now = new Date();
        const diffTime = deadline - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome back, {userProfile?.name || 'Volunteer'}! 👋
                        </h1>
                        <p className="text-blue-100">
                            Thank you for your dedication to helping others. Here's your volunteer activity overview.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <Award className="h-16 w-16 text-blue-200" />
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTasks}</div>
                        <p className="text-xs text-muted-foreground">
                            All assigned tasks
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                        <p className="text-xs text-muted-foreground">
                            Successfully finished
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{inProgressTasks}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently working on
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
                        <Progress value={completionRate} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                            Task success rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Recent Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentTasks.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No tasks assigned yet.</p>
                                <p className="text-sm">Check back later for new opportunities.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentTasks.map((assignment) => {
                                    const task = assignment?.task_id;
                                    return (
                                        <div key={assignment._id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{task?.title || 'Unknown Task'}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Assigned: {formatDate(assignment.date_assigned)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(assignment.status)}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="pt-2">
                                    <Link href="/dashboard/my-tasks">
                                        <Button variant="outline" size="sm" className="w-full">
                                            View All Tasks
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Upcoming Deadlines */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Upcoming Deadlines
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {upcomingDeadlines.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No upcoming deadlines.</p>
                                <p className="text-sm">You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingDeadlines.map((assignment) => {
                                    const task = assignment?.task_id;
                                    const deadline = new Date(task?.deadline);
                                    const now = new Date();
                                    const diffTime = deadline - now;
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    
                                    return (
                                        <div key={assignment._id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{task?.title || 'Unknown Task'}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Due: {formatDateOnly(task?.deadline)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={diffDays <= 1 ? "destructive" : "secondary"}>
                                                    {diffDays === 0 ? 'Today' : `${diffDays} day${diffDays > 1 ? 's' : ''}`}
                                                </Badge>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Profile Overview */}
            {userProfile && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Your Profile Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Name</div>
                                    <div className="font-medium">{userProfile.name || 'Not provided'}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Email</div>
                                    <div className="font-medium">{userProfile.email || 'Not provided'}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Role</div>
                                    <div className="font-medium">{userProfile.role_id?.name || 'Volunteer'}</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Member Since</div>
                                    <div className="font-medium">
                                        {userProfile.created_at ? formatDateOnly(userProfile.created_at) : 'Unknown'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">User ID</div>
                                    <div className="font-medium text-xs font-mono">{userProfile._id}</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Quick Actions</div>
                                    <div className="space-y-2">
                                        <Link href="/dashboard/my-tasks">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <FileText className="h-4 w-4 mr-2" />
                                                View My Tasks
                                            </Button>
                                        </Link>
                                        <Link href="/dashboard/profile">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <User className="h-4 w-4 mr-2" />
                                                Edit Profile
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Motivation Section */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardContent className="pt-6">
                    <div className="text-center">
                        <Star className="h-12 w-12 mx-auto mb-4 text-green-600" />
                        <h3 className="text-lg font-semibold mb-2">Thank You for Your Service!</h3>
                        <p className="text-muted-foreground mb-4">
                            Your dedication to helping others makes a real difference in our community. 
                            Every task you complete brings hope and support to those in need.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {completedTasks} Tasks Completed
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {completionRate}% Success Rate
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VolunteerDashboard;