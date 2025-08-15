'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { privateApi } from '@/lib/api';
import { toast } from 'sonner';

// Types
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  dob: string;
  bio?: string;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
};

// Fetch current user's profile
export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: async () => {
      const response = await privateApi.get<UserProfile>('/auth/me');
      return response.data;
    },
  });
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: FormData) => {
      const response = await privateApi.put<UserProfile>('/users/update-profile', profileData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}; 