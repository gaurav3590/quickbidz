"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  Star,
  ArrowUpDown,
  Grid3X3,
  ListFilter,
  Heart,
  Share2,
  ArrowRight,
  Clock3,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useProtectedApi } from "@/lib/protectedApi";
import { useAuctions, type Auction, type AuctionFilters } from "@/hooks/useAuctions";

// Mock categories
const categories = [
  "All Categories",
  "Electronics",
  "Collectibles",
  "Fashion",
  "Home & Garden",
  "Art",
  "Vehicles",
  "Jewelry",
  "Sports",
  "Books & Media",
  "Other",
];

export default function AuctionsPage() {
  // Initialize protected API hook
  const { isAuthenticated } = useProtectedApi();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortOption, setSortOption] = useState("ending-soon");
  const [filterEndingSoon, setFilterEndingSoon] = useState(false);
  const [filterNewlyAdded, setFilterNewlyAdded] = useState(false);
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [minSellerRating, setMinSellerRating] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isAuth, setIsAuth] = useState(false);

  // Check authentication once at component mount
  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, [isAuthenticated]);

  // Set up query filters
  const filters: AuctionFilters = {
    page,
    limit,
    search: searchTerm || undefined,
    category: category !== "All Categories" ? category : undefined,
    sortBy: sortOption === "ending-soon" ? "endTime" : "currentPrice",
    sortOrder: sortOption === "price-high" ? "desc" : "asc",
  };

  // Use TanStack Query hook to fetch auctions
  const {
    data,
    isLoading: loading,
    isError
  } = useAuctions(filters);

  // Client-side filtering for filters not supported by the API
  const filteredAuctions = (data?.auctions || []).filter((auction: Auction) => {
    // Price range filter
    if (
      auction.currentPrice < priceRange[0] ||
      auction.currentPrice > priceRange[1]
    ) {
      return false;
    }

    // Ending soon filter
    if (filterEndingSoon) {
      const now = new Date();
      const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const endTime = new Date(auction.endTime);
      if (!(endTime <= oneDayFromNow && endTime > now)) {
        return false;
      }
    }

    // Newly added filter
    if (filterNewlyAdded) {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const createdAt = typeof auction.createdAt === 'string' ? new Date(auction.createdAt) : auction.createdAt;
      if (!(createdAt >= threeDaysAgo)) {
        return false;
      }
    }

    // Watchlist filter
    if (watchlistOnly && !auction.isWatched) {
      return false;
    }

    // Seller rating filter
    if (
      minSellerRating > 0 &&
      (auction.seller?.rating || 0) < minSellerRating
    ) {
      return false;
    }

    return true;
  });

  // Show error if query failed
  useEffect(() => {
    if (isError) {
      toast.error("Failed to load auctions. Please try again.");
    }
  }, [isError]);

  const getTimeRemaining = (endTime: string | Date) => {
    try {
      const date = typeof endTime === 'string' ? new Date(endTime) : endTime;
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Unknown";
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  const handleNextPage = () => {
    if (data && page < data.totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Skeleton loader for auctions
  const AuctionsPageSkeleton = () => (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="w-full md:w-auto flex items-center gap-2">
          <Skeleton className="h-10 w-full md:w-[300px]" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        </div>

        {/* Auction Listings Skeleton */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sort & View Controls Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-card rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-40" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Auctions Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent className="pb-3 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
                <CardFooter className="flex gap-2 border-t pt-4">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Add loading state
  if (loading) {
    return <AuctionsPageSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Browse Auctions</h1>
          <p className="text-muted-foreground">
            Discover unique items and place your bids
          </p>
        </div>
        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search auctions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/auctions/create">Create Auction</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-medium">Price Range</h3>
                  <span className="text-xs text-muted-foreground">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 2000]}
                  max={2000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </div>

              {/* Time Filters */}
              <div>
                <h3 className="text-sm font-medium mb-2">Time Left</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ending-soon"
                      checked={filterEndingSoon}
                      onCheckedChange={(checked) =>
                        setFilterEndingSoon(checked === true)
                      }
                    />
                    <label htmlFor="ending-soon" className="text-sm">
                      Ending Soon (within 24h)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newly-added"
                      checked={filterNewlyAdded}
                      onCheckedChange={(checked) =>
                        setFilterNewlyAdded(checked === true)
                      }
                    />
                    <label htmlFor="newly-added" className="text-sm">
                      Newly Added
                    </label>
                  </div>
                </div>
              </div>

              {/* Seller Rating Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2">
                  Minimum Seller Rating
                </h3>
                <Select
                  value={minSellerRating.toString()}
                  onValueChange={(value) => setMinSellerRating(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Watchlist Filter */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="watchlist"
                  checked={watchlistOnly}
                  onCheckedChange={(checked) =>
                    setWatchlistOnly(checked === true)
                  }
                />
                <label htmlFor="watchlist" className="text-sm font-medium">
                  Show only watchlisted items
                </label>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setCategory("All Categories");
                  setPriceRange([0, 2000]);
                  setFilterEndingSoon(false);
                  setFilterNewlyAdded(false);
                  setWatchlistOnly(false);
                  setMinSellerRating(0);
                }}
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Auction Listings */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sort & View Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-card rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {filteredAuctions.length}{" "}
                {filteredAuctions.length === 1 ? "result" : "results"}
              </div>
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <ListFilter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Auctions Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAuctions.length === 0 ? (
                <div className="col-span-full py-8 text-center">
                  <p className="text-muted-foreground">
                    No auctions match your search criteria
                  </p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchTerm("");
                      setCategory("All Categories");
                      setPriceRange([0, 2000]);
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                filteredAuctions.map((auction) => (
                  <Card key={auction.id} className="overflow-hidden group">
                    <div className="relative">
                      <div className="aspect-video w-full overflow-hidden">
                        <Image
                          src={(auction.imageUrl || "")}
                          alt={auction.title}
                          width={300}
                          height={200}
                          className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        {auction.seller?.rating &&
                          auction.seller.rating > 4 && (
                            <Badge variant="destructive">Hot</Badge>
                          )}
                        {auction.createdAt &&
                          (typeof auction.createdAt === 'string' ? new Date(auction.createdAt) : auction.createdAt) >
                          new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) && (
                            <Badge variant="secondary">New</Badge>
                          )}
                        {auction.isWatched && (
                          <Badge variant="outline" className="bg-white/80">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />{" "}
                            Watching
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <Link href={`/auctions/${auction.id}`}>
                        <CardTitle className="text-lg hover:underline">
                          {auction.title}
                        </CardTitle>
                      </Link>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>
                          Seller: {auction.seller?.username} {auction.seller?.rating && `(${auction.seller.rating}★)`}
                        </span>
                        <span className="text-primary">{auction.category}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm line-clamp-2">
                        {auction.description}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold">
                            ${auction.currentPrice}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {auction._count?.bids || auction.totalBids || 0} bids
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Clock3 className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {getTimeRemaining(auction.endTime)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 border-t pt-4">
                      <Button asChild className="flex-1">
                        <Link href={`/auctions/${auction.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Auctions List View */}
          {viewMode === "list" && (
            <div className="space-y-4">
              {filteredAuctions.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No auctions match your search criteria
                  </p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchTerm("");
                      setCategory("All Categories");
                      setPriceRange([0, 2000]);
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                filteredAuctions.map((auction) => (
                  <Card key={auction.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-1/4">
                        <div className="aspect-video md:aspect-square w-full overflow-hidden">
                          <Image
                            src={(auction.imageUrls?.[0] || auction.images?.[0] || "")}
                            alt={auction.title}
                            width={300}
                            height={200}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          {auction.seller?.rating &&
                            auction.seller.rating > 4 && (
                              <Badge variant="destructive">Hot</Badge>
                            )}
                          {auction.createdAt &&
                            (typeof auction.createdAt === 'string' ? new Date(auction.createdAt) : auction.createdAt) >
                            new Date(
                              Date.now() - 3 * 24 * 60 * 60 * 1000
                            ) && <Badge variant="secondary">New</Badge>}
                        </div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Link href={`/auctions/${auction.id}`}>
                            <h3 className="text-xl font-bold hover:underline">
                              {auction.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-1 text-amber-500 whitespace-nowrap">
                            <Clock3 className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {getTimeRemaining(auction.endTime)}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                          <span>
                            Seller: {auction.seller?.username} {auction.seller?.rating && `(${auction.seller.rating}★)`}
                          </span>
                          <span className="text-primary">
                            {auction.category}
                          </span>
                        </div>
                        <p className="text-sm mb-4">{auction.description}</p>
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-2xl font-bold">
                              ${auction.currentPrice}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {auction._count?.bids || auction.totalBids || 0} bids
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Heart className="h-4 w-4 mr-1" />
                              {auction.isWatched ? "Watching" : "Watch"}
                            </Button>
                            <Button asChild size="sm">
                              <Link href={`/auctions/${auction.id}`}>
                                View Auction{" "}
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Pagination (simplified for now) */}
          {filteredAuctions.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="mx-1">
                1
              </Button>
              <Button variant="outline" size="sm" className="mx-1" disabled>
                2
              </Button>
              <Button variant="outline" size="sm" className="mx-1" disabled>
                3
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
