'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';
import { useAuction, useAuctions } from '@/hooks/useAuctions';
import { useAuctionBids, useCreateBid } from '@/hooks/useBids';
import { useAuctionComments, useCreateComment } from '@/hooks/useComments';

export function AuctionsList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAuctions({ 
    page, 
    limit: 5,
    sortBy: 'endTime',
    sortOrder: 'asc'
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Failed to load auctions</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Latest Auctions</h2>
      <div className="space-y-4">
        {data?.auctions.map(auction => (
          <Card key={auction.id}>
            <CardHeader>
              <CardTitle>{auction.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{auction.description.substring(0, 100)}...</p>
              <div className="flex justify-between mt-4">
                <p className="font-semibold">Current Price: ${auction.currentPrice}</p>
                <Button asChild>
                  <a href={`/auctions/${auction.id}`}>View Details</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <Button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>Page {page} of {data?.totalPages || 1}</span>
        <Button 
          onClick={() => setPage(p => p + 1)}
          disabled={!data || page >= data.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export function AuctionDetail({ auctionId }: { auctionId: string }) {
  const { data: auction, isLoading, isError } = useAuction(auctionId);
  const { data: bidsData } = useAuctionBids(auctionId);
  const { data: commentsData } = useAuctionComments(auctionId);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [comment, setComment] = useState('');
  
  const createBidMutation = useCreateBid();
  const createCommentMutation = useCreateComment();

  // Set initial bid amount when auction data loads
  if (auction && bidAmount === 0) {
    setBidAmount(auction.currentPrice + 10); // Assuming minimum increment is 10
  }

  const handlePlaceBid = () => {
    if (!auction) return;
    
    createBidMutation.mutate(
      { auctionId, amount: bidAmount },
      {
        onSuccess: () => {
          toast.success('Bid placed successfully!');
          setBidAmount(bidAmount + 10); // Increment for next bid
        }
      }
    );
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    createCommentMutation.mutate(
      { auctionId, content: comment },
      {
        onSuccess: () => {
          toast.success('Comment added successfully!');
          setComment('');
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !auction) {
    return <div className="text-red-500">Failed to load auction details</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{auction.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardContent className="p-4">
              <div className="aspect-square relative mb-4">
                {auction.imageUrl && (
                  <img 
                    src={auction.imageUrl} 
                    alt={auction.title}
                    className="object-cover w-full h-full rounded-md"
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{auction.description}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auction Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Current Price:</span>
                  <span className="font-bold">${auction.currentPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bids:</span>
                  <span>{bidsData?.totalCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="capitalize">{auction.status.toLowerCase()}</span>
                </div>
                
                <div className="pt-4">
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={auction.currentPrice + 1}
                    className="mb-2"
                  />
                  <Button 
                    onClick={handlePlaceBid} 
                    className="w-full"
                    disabled={createBidMutation.isPending}
                  >
                    {createBidMutation.isPending ? 'Placing Bid...' : 'Place Bid'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Comments ({commentsData?.totalCount || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                  />
                  <Button 
                    onClick={handleAddComment}
                    disabled={createCommentMutation.isPending || !comment.trim()}
                  >
                    {createCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {commentsData?.comments.map(comment => (
                    <div key={comment.id} className="border rounded p-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">{comment.user?.username}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 