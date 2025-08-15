'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { privateApi } from '@/lib/api';
import { toast } from 'sonner';

// Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'bid' | 'auction' | 'comment' | 'system';
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface UnreadCountResponse {
  count: number;
}

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (page?: number, limit?: number) => 
    [...notificationKeys.lists(), { page, limit }] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};

// Fetch user notifications
export const useNotifications = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: notificationKeys.list(page, limit),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await privateApi.get<NotificationsResponse>(
        `/notifications/my?${params.toString()}`
      );
      return response.data;
    },
  });
};

// Fetch unread notifications count
export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const response = await privateApi.get<UnreadCountResponse>('/notifications/unread-count');
      return response.data;
    },
    refetchInterval: 60000, // Refetch every minute
  });
};

// Mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await privateApi.post<Notification>(
        `/notifications/${notificationId}/mark-as-read`
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate notifications list
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.lists()
      });
      
      // Invalidate unread count
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.unreadCount()
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark notification as read');
    },
  });
};

// Mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await privateApi.post('/notifications/mark-all-as-read');
      return response.data;
    },
    onSuccess: () => {
      toast.success('All notifications marked as read');
      
      // Invalidate notifications list
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.lists()
      });
      
      // Invalidate unread count
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.unreadCount()
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark all notifications as read');
    },
  });
};

// Delete all read notifications
export const useDeleteAllReadNotifications = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await privateApi.delete('/notifications/delete-all-read');
      return response.data;
    },
    onSuccess: () => {
      toast.success('All read notifications deleted');
      
      // Invalidate notifications list
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.lists()
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete read notifications');
    },
  });
}; 