"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // Added Skeleton
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Heart,
  Share2,
  ArrowLeft,
  Clock3,
  DollarSign,
  ShoppingBag,
  Truck,
  Eye,
  MessageCircle,
  User,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  Star,
  Loader2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useProtectedApi } from "@/lib/protectedApi";
import { useUser } from "@/components/providers/UserContext";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useAuction } from "@/hooks/useAuctions";
import { useAuctionBids, useCreateBid } from "@/hooks/useBids";
import { useAuctionComments, useCreateComment, useUpdateComment, useDeleteComment } from "@/hooks/useComments";

interface Auction {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  startTime: string;
  endTime: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  sellerId: string;
  createdAt: string;
  updatedAt?: string;
  seller?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    rating?: number;
    createdAt: string;
    totalSales?: number;
    location?: string;
  };
  category?: string;
  condition?: string;
  shipping?: {
    cost: number;
    methods: string[];
    locations: string[];
  };
  paymentMethods?: string[];
  returnPolicy?: string;
  imageUrls?: string[];
  bidIncrements?: number;
  reservePrice?: number;
  watchers?: number;
  views?: number;
}

interface Bid {
  id: string;
  amount: number;
  status: string;
  auctionId: string;
  bidderId: string;
  bidder?: {
    username: string;
  };
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  auctionId: string;
  userId: string;
  parentId: string | null;
  user: {
    username: string;
    profileImage: string;
  };
  answer?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function AuctionDetailPage({
  auctionId,
}: {
  auctionId: string;
}) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [bidSuccess, setBidSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState<Bid[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);
  const [loadingAddComment, setLoadingAddComment] = useState(false);
  const [loadingAddReply, setLoadingAddReply] = useState(false);
  const { get, post, patch, delete: deleteComment } = useProtectedApi();
  const { user } = useUser();

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/images/placeholder.svg";
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return imageUrl;
    return `/${imageUrl}`;
  };

  const fetchAuctionDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await get(`auctions/${auctionId}`);

      if (response.status !== 200) {
        throw new Error("Failed to fetch auction details");
      }
      if (response.status === 200) {
        const data = await response.data;
        setAuction(data);

        if (data.currentPrice && data.bidIncrements) {
          setBidAmount(data.currentPrice + (data.bidIncrements || 10));
        }
      }
    } catch (error) {
      console.error("Error fetching auction details:", error);
      toast.error("Failed to load auction details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [auctionId]);

  useEffect(() => {
    fetchAuctionDetails();
  }, [fetchAuctionDetails]);

  const fetchBids = useCallback(async () => {
    if (!auction) return;

    try {
      setLoadingBids(true);
      const response = await get(`bids/auction/${auctionId}`);

      if (response.status !== 200) {
        throw new Error("Failed to fetch Bids");
      }
      if (response.status === 200) {
        const data = await response.data.bids;
        setBids(data || []);
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
      toast.error("Failed to load bid history.");
    } finally {
      setLoadingBids(false);
    }
  }, [auction, auctionId]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  const fetchComments = useCallback(async () => {
    if (!auction) return;

    try {
      setLoadingComments(true);
      const response = await get(`comments/auction/${auctionId}`);

      if (response.status !== 200) {
        throw new Error("Failed to fetch comments");
      }
      if (response.status === 200) {
        const data = await response.data.comments;
        setComments(data || []);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments.");
    } finally {
      setLoadingComments(false);
    }
  }, [auction, auctionId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const diffMs = auction?.endTime
        ? new Date(auction.endTime).getTime() - now.getTime()
        : 0;

      if (diffMs <= 0) {
        setTimeLeft("Auction ended");
        return;
      }

      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft(
        `${diffHrs.toString().padStart(2, "0")}:${diffMins
          .toString()
          .padStart(2, "0")}:${diffSecs.toString().padStart(2, "0")}`
      );
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [auction?.endTime]);

  const handleBidSubmit = useCallback(async () => {
    if (!auction || bidAmount <= auction.currentPrice) {
      toast.error("Bid amount must be higher than current price");
      return;
    }

    try {
      const response = await post("/bids", {
        amount: bidAmount,
        auctionId: auctionId,
      });

      if (response.status !== 200) {
        throw new Error("Failed to place bid");
      }

      const data = await response.data.bid;

      setAuction((prev) =>
        prev
          ? {
            ...prev,
            currentPrice: data.amount,
          }
          : null
      );

      const bidsResponse = await get(`bids/auction/${auctionId}`);
      const bidsData = await bidsResponse.data.bids;
      setBids(bidsData || []);

      setBidAmount(bidAmount + (auction.bidIncrements || 10));
      setBidSuccess(true);
      toast.success("Bid placed successfully!");

      setTimeout(() => setBidSuccess(false), 3000);
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("Failed to place bid. Please try again.");
    }
  }, [auction, auctionId, bidAmount]);

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) return;

    try {
      setLoadingAddComment(true);
      const response = await post("/comments", {
        content: newComment,
        auctionId: auctionId,
        parentId: null,
      });

      if (response.status !== 201) {
        throw new Error(`Failed to add comment: Status ${response.status}`);
      }

      const commentsResponse = await get(`comments/auction/${auctionId}`);
      const commentsData = await commentsResponse.data.comments;
      setComments(commentsData || []);

      setNewComment("");
      toast.success("Question posted successfully!");
    } catch (error) {
      console.error("Error adding comment:", error instanceof Error ? error.message : String(error));
      toast.error(`Failed to post question: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoadingAddComment(false);
    }
  }, [newComment, auctionId, get, post]);

  const handleAddReply = useCallback(async (parentCommentId: string) => {
    if (!replyContent.trim()) return;

    try {
      setLoadingAddReply(true);
      const response = await post("/comments", {
        content: replyContent,
        auctionId: auctionId,
        parentId: parentCommentId,
      });

      if (response.status !== 201) {
        throw new Error(`Failed to add reply: Status ${response.status}`);
      }

      // Refresh comments to get the updated list
      const commentsResponse = await get(`comments/auction/${auctionId}`);
      const commentsData = await commentsResponse.data.comments;
      setComments(commentsData || []);

      // Reset reply state
      setReplyingToCommentId(null);
      setReplyContent("");
      toast.success("Reply posted successfully!");
    } catch (error) {
      console.error("Error adding reply:", error instanceof Error ? error.message : String(error));
      toast.error(`Failed to post reply: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoadingAddReply(false);
    }
  }, [replyContent, auctionId, get, post]);

  const handleEditComment = useCallback(async (commentId: string) => {
    if (!editedCommentContent.trim()) return;

    try {
      setLoadingEdit(true);
      const response = await patch(`/comments/${commentId}`, {
        content: editedCommentContent,
      });

      if (response.status !== 200) {
        throw new Error("Failed to update comment");
      }

      const commentsResponse = await get(`comments/auction/${auctionId}`);
      const commentsData = await commentsResponse.data.comments;
      setComments(commentsData || []);

      setEditingCommentId(null);
      setEditedCommentContent("");
      toast.success("Comment updated successfully!");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment. Please try again.");
    } finally {
      setLoadingEdit(false);
    }
  }, [editedCommentContent, auctionId, patch, get]);

  const handleDeleteComment = useCallback(async (commentId: string) => {
    try {
      setLoadingDelete(commentId);
      const response = await deleteComment(`/comments/${commentId}`);

      if (response.status !== 200) {
        throw new Error("Failed to delete comment");
      }

      setComments(comments.filter(comment => comment.id !== commentId));
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment. Please try again.");
    } finally {
      setLoadingDelete(null);
    }
  }, [comments, deleteComment]);

  const startEditingComment = useCallback((comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentContent(comment.content);
  }, []);

  const cancelEditingComment = useCallback(() => {
    setEditingCommentId(null);
    setEditedCommentContent("");
  }, []);

  const startReplying = useCallback((commentId: string) => {
    setReplyingToCommentId(commentId);
    setReplyContent("");
  }, []);

  const cancelReplying = useCallback(() => {
    setReplyingToCommentId(null);
    setReplyContent("");
  }, []);

  const formatDate = useMemo(
    () => (dateString: string) => {
      try {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
      } catch (error) {
        return "Unknown date";
      }
    },
    []
  );

  const AuctionDetailPageSkeleton = () => (
    <div className="container mx-auto px-4 py-6 animate-pulse">
      <Skeleton className="h-5 w-32 mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="w-full aspect-[4/3] rounded-lg" />

          <div className="flex gap-2 pb-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-20 w-20 rounded-md flex-shrink-0"
              />
            ))}
          </div>

          {/* Skeleton */}
          <div className="mt-8">
            <div className="flex border-b">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 flex-1 mr-2 last:mr-0" />
              ))}
            </div>
            <div className="mt-4 space-y-4">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-1/2 mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <AuctionDetailPageSkeleton />;
  }

  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Auction Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The auction you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/auctions">Browse Other Auctions</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Link
        href="/auctions"
        className="flex items-center text-sm text-muted-foreground mb-6 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to auctions
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <div className="rounded-lg overflow-hidden border">
            {auction?.imageUrls && auction.imageUrls.length > 0 ? (
              <Image
                src={getImageUrl(auction.imageUrls[selectedImage])}
                alt={auction?.title || "Auction Item"}
                width={800}
                height={600}
                className="w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholder.svg";
                }}
              />
            ) : (
              <div className="flex items-center justify-center bg-muted h-[400px]">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {auction?.imageUrls && auction.imageUrls.length > 0 ? (
              auction.imageUrls.map((image, index) => (
                <div
                  key={index}
                  className={`relative rounded-md overflow-hidden border cursor-pointer h-20 w-20 flex-shrink-0 ${selectedImage === index ? "ring-2 ring-primary" : ""
                    }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`${auction?.title} - image ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/placeholder.svg";
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-sm">No images available</div>
            )}
          </div>

          {/* Auction Details */}
          <Tabs defaultValue="description" className="mt-8">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">
                Description
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex-1">
                Shipping & Returns
              </TabsTrigger>
              <TabsTrigger value="seller" className="flex-1">
                Seller Information
              </TabsTrigger>
              <TabsTrigger value="questions" className="flex-1">
                Q&A ({comments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{auction?.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{auction?.category}</Badge>
                  <Badge variant="outline">{auction?.condition}</Badge>
                </div>
                <div className="whitespace-pre-line text-muted-foreground">
                  {auction?.description}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b">
                  <Truck className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <h3 className="font-medium">Shipping</h3>
                    <p className="text-muted-foreground">
                      Shipping cost: ${auction?.shipping?.cost}
                    </p>
                    <p className="text-muted-foreground">
                      Available shipping methods:{" "}
                      {auction?.shipping?.methods.join(", ")}
                    </p>
                    <p className="text-muted-foreground">
                      Ships to: {auction?.shipping?.locations.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <h3 className="font-medium">Payment</h3>
                    <p className="text-muted-foreground">
                      Accepted payment methods:{" "}
                      {auction?.paymentMethods?.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Shield className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <h3 className="font-medium">Returns</h3>
                    <p className="text-muted-foreground">
                      {auction?.returnPolicy}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seller" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {auction?.seller?.firstName} {auction?.seller?.lastName}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>
                        {auction?.seller?.rating} ·{" "}
                        {auction?.seller?.totalSales} sales
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <h4 className="font-medium">Member Since</h4>
                      <p className="text-muted-foreground">
                        {auction?.seller?.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <h4 className="font-medium">Location</h4>
                      <p className="text-muted-foreground">
                        {auction?.seller?.location}
                      </p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="mt-4">
                  <MessageCircle className="h-4 w-4 mr-2" /> Contact Seller
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="mt-4">
              <div className="space-y-6">
                {loadingComments ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : comments.filter(c => !c.parentId).length > 0 ? (
                  comments.filter(c => !c.parentId).map((comment) => (
                    <div key={comment.id} className="border-b pb-4">
                      <div className="flex items-start gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user?.profileImage} alt={comment.user?.username} />
                          </Avatar>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                              {comment.user.username}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatDate(comment.createdAt)}
                                {comment.updatedAt && comment.updatedAt !== comment.createdAt &&
                                  <span className="ml-1 italic">(Edited)</span>
                                }
                              </span>

                              {user && user.id === comment.userId && (
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => startEditingComment(comment)}
                                    disabled={loadingEdit || loadingDelete === comment.id}
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-destructive"
                                        disabled={loadingEdit || loadingDelete === comment.id}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this comment? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteComment(comment.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          disabled={loadingDelete === comment.id}
                                        >
                                          {loadingDelete === comment.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            "Delete"
                                          )}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              )}
                            </div>
                          </div>

                          {editingCommentId === comment.id ? (
                            <div className="mt-2 space-y-2">
                              <Textarea
                                value={editedCommentContent}
                                onChange={(e) => setEditedCommentContent(e.target.value)}
                                className="min-h-[80px]"
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={cancelEditingComment}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleEditComment(comment.id)}
                                  disabled={loadingEdit}
                                >
                                  {loadingEdit ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : null}
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-1">{comment.content}</p>
                          )}

                          {comment.answer && (
                            <div className="mt-3 pl-4 border-l-2">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium text-sm">
                                  {auction.seller?.username || "Seller"}
                                </h5>
                              </div>
                              <p className="mt-1 text-sm">{comment.answer}</p>
                            </div>
                          )}

                          {/* Reply button - right aligned */}
                          {user && !editingCommentId && replyingToCommentId !== comment.id && (
                            <div className="flex justify-end mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => startReplying(comment.id)}
                              >
                                <MessageCircle className="h-3 w-3 mr-1" />
                                Reply
                              </Button>
                            </div>
                          )}

                          {/* Reply form */}
                          {replyingToCommentId === comment.id && (
                            <div className="mt-3 pl-4 border-l-2 space-y-2 bg-muted/30 p-3 rounded-md">
                              <p className="text-xs text-muted-foreground mb-2">Replying to {comment.user.username}'s comment</p>
                              <Textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="min-h-[80px] text-sm"
                                placeholder="Write your reply..."
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={cancelReplying}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleAddReply(comment.id)}
                                  disabled={loadingAddReply}
                                >
                                  {loadingAddReply ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : null}
                                  Reply
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Seller answer */}
                          {comment.answer && (
                            <div className="mt-3 pl-4 border-l-2">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium text-sm">
                                  {auction.seller?.username || "Seller"}
                                </h5>
                              </div>
                              <p className="mt-1 text-sm">{comment.answer}</p>
                            </div>
                          )}

                          {/* Display replies */}
                          {comments.some(reply => reply.parentId === comment.id) && (
                            <div className="mt-4 mb-2">
                              <div className="flex items-center text-xs text-muted-foreground mb-2">
                                <div className="h-px bg-border flex-grow mr-2"></div>
                                <span>Replies</span>
                                <div className="h-px bg-border flex-grow ml-2"></div>
                              </div>
                              <div className="pl-4 border-l-2 space-y-3">
                                {comments
                                  .filter(reply => reply.parentId === comment.id)
                                  .map((reply) => (
                                    <div key={reply.id} className="pt-3">
                                      <div className="flex items-start gap-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage src={reply.user?.profileImage} alt={reply.user.username} />
                                        </Avatar>
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                            <h5 className="font-medium text-sm">
                                              {reply.user.username}
                                            </h5>
                                            <span className="text-xs text-muted-foreground">
                                              {formatDate(reply.createdAt)}
                                              {reply.updatedAt && reply.updatedAt !== reply.createdAt &&
                                                <span className="ml-1 italic">(Edited)</span>
                                              }
                                            </span>
                                          </div>
                                          <p className="mt-1 text-sm">{reply.content}</p>

                                          {/* Reply edit/delete buttons - positioned on the right */}
                                          <div className="flex justify-end mt-1">
                                            {user && user.id === reply.userId && (
                                              <div className="flex gap-2">
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-5 w-5"
                                                  onClick={() => startEditingComment(reply)}
                                                >
                                                  <Pencil className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-5 w-5 text-destructive"
                                                  onClick={() => handleDeleteComment(reply.id)}
                                                >
                                                  <Trash2 className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No questions yet. Be the first to ask!
                  </p>
                )}

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Ask a Question</h3>
                  <div className="flex gap-2">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Type your question here..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={loadingAddComment}
                    >
                      {loadingAddComment ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Bidding Interface */}
        <div className="space-y-6">
          {/* Auction Status */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Auction Status</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={isWatchlisted ? "default" : "outline"}
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsWatchlisted(!isWatchlisted)}
                  >
                    <Heart
                      className={`h-4 w-4 ${isWatchlisted ? "fill-primary" : ""
                        }`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="flex items-center">
                <Eye className="h-4 w-4 mr-1" /> {auction?.views} views ·{" "}
                {auction?.watchers} watching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <div className="text-sm text-muted-foreground">Current Bid</div>
                <div className="text-2xl font-bold">
                  ${auction?.currentPrice.toFixed(2)}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm flex items-center gap-1">
                  <Clock3 className="h-4 w-4 text-amber-500" />
                  <span>
                    {timeLeft.includes("ended") ? (
                      <span className="text-red-500 font-medium">
                        Auction ended
                      </span>
                    ) : (
                      <span>
                        Ends in{" "}
                        <span className="text-amber-500 font-medium">
                          {timeLeft}
                        </span>
                      </span>
                    )}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {bids.length} bids
                </div>
              </div>

              {timeLeft.includes("ended") ? (
                <div className="bg-muted p-3 rounded-md text-sm text-center">
                  This auction has ended
                </div>
              ) : (
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min={
                        auction?.currentPrice + (auction.bidIncrements || 10)
                      }
                      step={auction.bidIncrements || 10}
                    />
                  </div>

                  {bidSuccess && (
                    <div className="flex items-center gap-2 py-1 px-2 bg-green-50 text-green-700 rounded text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Bid successfully placed!</span>
                    </div>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full">Place Bid</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm your bid</AlertDialogTitle>
                        <AlertDialogDescription>
                          You are about to place a bid of $
                          {bidAmount.toFixed(2)} on "{auction?.title}". This
                          action cannot be undone and you will be committed to
                          buying the item if you win.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBidSubmit}>
                          Confirm Bid
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <p className="text-xs text-muted-foreground text-center">
                    By placing a bid, you agree to the Auction Terms &
                    Conditions
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bid History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bid History</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingBids ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : bids.length > 0 ? (
                <div className="space-y-2">
                  {bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex justify-between items-center py-1 border-b last:border-0"
                    >
                      <div className="text-sm">
                        {bid.bidder?.username || "Anonymous"}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">${bid.amount}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(bid.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-2">
                  No bids yet. Be the first to bid!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Auction Details Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Auction Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Starting Price</span>
                  <span>${auction?.startingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reserve Price</span>
                  <span>${auction?.currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bid Increments</span>
                  <span>${(auction?.bidIncrements || 10).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Similar Auctions Teaser */}
          <Card>
            <CardHeader>
              <CardTitle>Similar Auctions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                No similar auctions found.
              </div>
              <Button variant="link" asChild className="p-0 mt-2">
                <Link href={`/auctions?category=${auction?.category}`}>
                  Browse more in {auction?.category}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
