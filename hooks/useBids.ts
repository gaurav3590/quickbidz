'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { privateApi } from '@/lib/api';
import { toast } from 'sonner';
import { auctionKeys } from './useAuctions';

// Types
export interface Bid {
  id: string;
  amount: number;
  userId: string;
  auctionId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
  };
}

export interface BidsResponse {
  bids: Bid[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Query keys
export const bidKeys = {
  all: ['bids'] as const,
  lists: () => [...bidKeys.all, 'list'] as const,
  list: (auctionId: string, page?: number, limit?: number) => 
    [...bidKeys.lists(), { auctionId, page, limit }] as const,
  myBids: () => [...bidKeys.all, 'my-bids'] as const,
};

// Fetch bids for an auction
export const useAuctionBids = (auctionId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: bidKeys.list(auctionId, page, limit),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await privateApi.get<BidsResponse>(
        `/bids/auction/${auctionId}?${params.toString()}`
      );
      return response.data;
    },
    enabled: !!auctionId,
  });
};

// Fetch current user's bids
export const useMyBids = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...bidKeys.myBids(), { page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await privateApi.get<BidsResponse>(
        `/bids/my-bids?${params.toString()}`
      );
      return response.data;
    },
  });
};

// Create a new bid
export const useCreateBid = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ auctionId, amount }: { auctionId: string; amount: number }) => {
      const response = await privateApi.post<Bid>('/bids', { auctionId, amount });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Bid placed successfully!');
      
      // Invalidate auction details to update current price
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(data.auctionId) });
      
      // Invalidate bids list for this auction
      queryClient.invalidateQueries({ 
        queryKey: bidKeys.list(data.auctionId)
      });
      
      // Invalidate my bids list
      queryClient.invalidateQueries({ 
        queryKey: bidKeys.myBids()
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to place bid');
    },
  });
}; 