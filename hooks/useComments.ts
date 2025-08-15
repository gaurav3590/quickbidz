'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { privateApi } from '@/lib/api';
import { toast } from 'sonner';

// Types
export interface Comment {
  id: string;
  content: string;
  userId: string;
  auctionId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
  };
}

export interface CommentsResponse {
  comments: Comment[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Query keys
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (auctionId: string, page?: number, limit?: number) => 
    [...commentKeys.lists(), { auctionId, page, limit }] as const,
  myComments: () => [...commentKeys.all, 'my-comments'] as const,
};

// Fetch comments for an auction
export const useAuctionComments = (auctionId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: commentKeys.list(auctionId, page, limit),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await privateApi.get<CommentsResponse>(
        `/comments/auction/${auctionId}?${params.toString()}`
      );
      return response.data;
    },
    enabled: !!auctionId,
  });
};

// Fetch current user's comments
export const useMyComments = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...commentKeys.myComments(), { page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await privateApi.get<CommentsResponse>(
        `/comments/my-comments?${params.toString()}`
      );
      return response.data;
    },
  });
};

// Create a new comment
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ auctionId, content }: { auctionId: string; content: string }) => {
      const response = await privateApi.post<Comment>('/comments', { auctionId, content });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Comment added successfully!');
      
      // Invalidate comments list for this auction
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.list(data.auctionId)
      });
      
      // Invalidate my comments list
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.myComments()
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add comment');
    },
  });
};

// Update a comment
export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const response = await privateApi.put<Comment>(`/comments/${commentId}`, { content });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Comment updated successfully!');
      
      // Invalidate comments list for this auction
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.list(data.auctionId)
      });
      
      // Invalidate my comments list
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.myComments()
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update comment');
    },
  });
};

// Delete a comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ commentId, auctionId }: { commentId: string; auctionId: string }) => {
      await privateApi.delete(`/comments/${commentId}`);
      return { commentId, auctionId };
    },
    onSuccess: ({ auctionId }) => {
      toast.success('Comment deleted successfully!');
      
      // Invalidate comments list for this auction
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.list(auctionId)
      });
      
      // Invalidate my comments list
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.myComments()
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete comment');
    },
  });
}; 