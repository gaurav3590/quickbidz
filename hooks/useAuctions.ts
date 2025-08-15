'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicApi, privateApi } from '@/lib/api';
import { toast } from 'sonner';

// Types
export interface Auction {
  id: string;
  title: string;
  description: string;
  category?: string | null;
  condition?: string | null;
  imageUrls?: string[];
  imageUrl?: string; // Keep for backward compatibility
  startingPrice: number;
  currentPrice: number;
  reservePrice?: number | null;
  bidIncrements?: number | null;
  duration?: number | null;
  shippingCost?: number | null;
  shippingLocations?: string[];
  returnPolicy?: string | null;
  termsAccepted?: boolean | null;
  startTime: string | Date;
  endTime: string | Date;
  status: 'PENDING' | 'ACTIVE' | 'ENDED' | 'CANCELLED' | 'draft' | 'active' | 'ended' | 'cancelled';
  sellerId: string;
  userId?: string; // Keep for backward compatibility
  winningBidId?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  bidCount?: number; // Keep for backward compatibility
  
  // Additional properties used in the UI
  seller?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    rating?: number;
    createdAt?: string;
    totalSales?: number;
    location?: string;
  };
  
  // UI-specific properties
  isWatched?: boolean;
  _count?: {
    bids?: number;
  };
  totalBids?: number;
  images?: string[]; // Alternative to imageUrls
  watchers?: number;
  views?: number;
}

export interface AuctionsResponse {
  auctions: Auction[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface AuctionFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Query keys
export const auctionKeys = {
  all: ['auctions'] as const,
  lists: () => [...auctionKeys.all, 'list'] as const,
  list: (filters: AuctionFilters) => [...auctionKeys.lists(), filters] as const,
  details: () => [...auctionKeys.all, 'detail'] as const,
  detail: (id: string) => [...auctionKeys.details(), id] as const,
};

// Fetch auctions with filters
export const useAuctions = (filters: AuctionFilters = {}) => {
  return useQuery({
    queryKey: auctionKeys.list(filters),
    queryFn: async () => {
      const { page = 1, limit = 10, search, category, status, sortBy, sortOrder } = filters;
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (status) params.append('status', status);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      
      const response = await publicApi.get<AuctionsResponse>(`/auctions?${params.toString()}`);
      return response.data;
    },
  });
};

// Fetch a single auction by ID
export const useAuction = (id: string) => {
  return useQuery({
    queryKey: auctionKeys.detail(id),
    queryFn: async () => {
      const response = await publicApi.get<Auction>(`/auctions/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create a new auction
export const useCreateAuction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (auctionData: FormData) => {
      const response = await privateApi.post<Auction>('/auctions', auctionData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Auction created successfully!');
      queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create auction');
    },
  });
};

// Update an auction
export const useUpdateAuction = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (auctionData: FormData) => {
      const response = await privateApi.put<Auction>(`/auctions/${id}`, auctionData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Auction updated successfully!');
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update auction');
    },
  });
};

// Cancel an auction
export const useCancelAuction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await privateApi.post<Auction>(`/auctions/${id}/cancel`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Auction cancelled successfully!');
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel auction');
    },
  });
};

// Activate an auction
export const useActivateAuction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await privateApi.post<Auction>(`/auctions/${id}/activate`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Auction activated successfully!');
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to activate auction');
    },
  });
}; 