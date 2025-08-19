"use client";
import { useMemo } from 'react';

export const useTasks = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const api = useMemo(() => ({
        async listTasks() {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!baseUrl) throw new Error('Missing API base URL');
            if (!token) throw new Error('Not authenticated');

            const response = await fetch(`${baseUrl}/tasks`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || 'Failed to fetch tasks');
            }
            return Array.isArray(data) ? data : (data?.tasks || []);
        },

        async createTask(taskPayload) {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!baseUrl) throw new Error('Missing API base URL');
            if (!token) throw new Error('Not authenticated');

            const response = await fetch(`${baseUrl}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(taskPayload),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || 'Failed to create task');
            }
            return data;
        },

        async getTaskById(taskId) {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!baseUrl) throw new Error('Missing API base URL');
            if (!token) throw new Error('Not authenticated');
            if (!taskId) throw new Error('Task ID is required');

            const response = await fetch(`${baseUrl}/task/${taskId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || 'Failed to fetch task');
            }
            return data;
        },

        async updateTask(taskId, updates) {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!baseUrl) throw new Error('Missing API base URL');
            if (!token) throw new Error('Not authenticated');
            if (!taskId) throw new Error('Task ID is required');

            const response = await fetch(`${baseUrl}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updates),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || 'Failed to update task');
            }
            return data;
        },

        async deleteTask(taskId) {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!baseUrl) throw new Error('Missing API base URL');
            if (!token) throw new Error('Not authenticated');
            if (!taskId) throw new Error('Task ID is required');

            const response = await fetch(`${baseUrl}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 204) return true;
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || 'Failed to delete task');
            }
            return true;
        },

        async assignTask(assignmentPayload) {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!baseUrl) throw new Error('Missing API base URL');
            if (!token) throw new Error('Not authenticated');

            const response = await fetch(`${baseUrl}/tasks/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(assignmentPayload),
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data?.message || 'Failed to assign task');
            }
            return data;
        },

        async listAssignments() {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!baseUrl) throw new Error('Missing API base URL');
            if (!token) throw new Error('Not authenticated');

            // Try common endpoints; prefer /tasks/assignments, fallback to /tasks/assign (GET)
            const tryEndpoints = [`${baseUrl}/tasks/assignments/volunteers`, `${baseUrl}/tasks/assign`];
            let lastError = null;
            for (const url of tryEndpoints) {
                try {
                    const response = await fetch(url, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        lastError = new Error(data?.message || `Failed to fetch from ${url}`);
                        continue;
                    }
                    return Array.isArray(data) ? data : (data?.assignments || []);
                } catch (e) {
                    lastError = e;
                }
            }
            if (lastError) throw lastError;
            return [];
        },

        async getAssignmentsByVolunteer(volunteerId) {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!baseUrl) throw new Error('Missing API base URL');
            if (!token) throw new Error('Not authenticated');
            if (!volunteerId) throw new Error('Volunteer ID is required');

            const response = await fetch(`${baseUrl}/tasks/assignments/volunteer/${volunteerId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || 'Failed to fetch volunteer assignments');
            }
            return Array.isArray(data) ? data : (data?.assignments || []);
        },

        async getAssignmentById(assignmentId) {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!baseUrl) throw new Error('Missing API base URL');
            if (!token) throw new Error('Not authenticated');
            if (!assignmentId) throw new Error('Assignment ID is required');

            const response = await fetch(`${baseUrl}/tasks/assignments/volunteer/${assignmentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || 'Failed to fetch assignment');
            }
            return Array.isArray(data) ? (data[0] || null) : data;
        },

        async getMyTasks(userId) {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!baseUrl) throw new Error('Missing API base URL');
            if (!token) throw new Error('Not authenticated');
            if (!userId) throw new Error('User ID is required');

            const response = await fetch(`${baseUrl}/tasks/assignments/volunteer-tasks/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || 'Failed to fetch my tasks');
            }
            return Array.isArray(data) ? data : [];
        },

        async updateAssignmentStatus(assignmentId, status) {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!baseUrl) throw new Error('Missing API base URL');
            if (!token) throw new Error('Not authenticated');
            if (!assignmentId) throw new Error('Assignment ID is required');
            if (!status) throw new Error('Status is required');

            const response = await fetch(`${baseUrl}/tasks/assignments/${assignmentId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || 'Failed to update assignment status');
            }
            return data;
        },
    }), [baseUrl]);

    return api;
};

export default useTasks;


