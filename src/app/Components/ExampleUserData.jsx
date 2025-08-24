'use client'
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ExampleUserData = () => {
    const { user, getCurrentUser, loading } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [lastRefreshTime, setLastRefreshTime] = useState(null);

    const handleRefreshUserData = async () => {
        try {
            setRefreshing(true);
            setError(null);
            const freshUserData = await getCurrentUser();
            setLastRefreshTime(new Date().toLocaleTimeString());
            console.log('Fresh user data:', freshUserData);
        } catch (err) {
            setError(err.message);
            console.error('Error refreshing user data:', err);
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>User Data Debug Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold mb-2 text-green-600">Current User Data (Real-time from Server):</h3>
                        <div className="bg-green-50 p-3 rounded border border-green-200">
                            <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
                            <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                            <p><strong>Role:</strong> {user?.role_id?.name || 'N/A'}</p>
                            <p><strong>User ID:</strong> {user?._id || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold mb-2 text-blue-600">Status Information:</h3>
                        <div className="bg-blue-50 p-3 rounded border border-blue-200">
                            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                            <p><strong>Refreshing:</strong> {refreshing ? 'Yes' : 'No'}</p>
                            {lastRefreshTime && (
                                <p><strong>Last Refresh:</strong> {lastRefreshTime}</p>
                            )}
                        </div>
                    </div>
                </div>

                <Button 
                    onClick={handleRefreshUserData} 
                    disabled={refreshing || loading}
                    className="w-full"
                    variant="outline"
                >
                    {refreshing ? 'Refreshing...' : '🔄 Refresh User Data from Server'}
                </Button>

                {error && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <p><strong>How it works:</strong></p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>User data is automatically fetched from server on app load</li>
                        <li>Click "Refresh" to manually get latest data from server</li>
                        <li>This ensures you always see the current role, even if it was changed by admin</li>
                        <li>No need to logout/login when role changes</li>
                    </ul>
                </div>

                <details className="text-sm">
                    <summary className="cursor-pointer font-semibold text-gray-700">View Full User Object</summary>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto mt-2">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </details>
            </CardContent>
        </Card>
    );
};

export default ExampleUserData;
