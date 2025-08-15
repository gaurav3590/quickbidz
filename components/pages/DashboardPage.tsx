"use client";

import { useState, useEffect } from "react"; // Added useEffect
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Added Skeleton
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Added Dialog components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Bell,
  Eye,
  Gavel, // Auction Icon
  Award,
  PlusCircle,
  User,
  Calendar,
  AlertTriangle, // For "No auction found"
} from "lucide-react";
import { useUser } from "@/components/providers/UserContext";
import moment from "moment";

// Mock data - would be replaced with actual API calls
const mockUserStats = {
  totalBids: 27,
  auctionsWon: 8,
  auctionsParticipated: 15,
  walletBalance: 1250.75,
};

const mockLiveAuctions = [
  {
    id: 1,
    title: "Vintage Camera Collection",
    currentBid: 320,
    endsIn: "2h 15m",
  },
  { id: 2, title: "Gaming Console Bundle", currentBid: 510, endsIn: "5h 42m" },
  {
    id: 3,
    title: "Limited Edition Sneakers",
    currentBid: 175,
    endsIn: "1d 3h",
  },
];

const mockUpcomingAuctions = [
  {
    id: 4,
    title: "Art Deco Furniture Set",
    startingBid: 400,
    startsIn: "1d 12h",
  },
  { id: 5, title: "Rare Coin Collection", startingBid: 250, startsIn: "2d 6h" },
];

const mockNotifications = [
  {
    id: 1,
    message: "You've been outbid on 'Vintage Camera Collection'",
    time: "15 minutes ago",
    read: false,
  },
  {
    id: 2,
    message: "Congratulations! You won 'Antique Desk Lamp'",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 3,
    message: "New message from seller regarding your bid",
    time: "1 day ago",
    read: true,
  },
];

export default function DashboardPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [showAuctionPopup, setShowAuctionPopup] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);

  // Simulate data fetching for the main page
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulate 1.5 seconds loading time
    return () => clearTimeout(timer);
  }, []);

  // Simulate loading for the auction popup
  useEffect(() => {
    if (showAuctionPopup) {
      setPopupLoading(true);
      const timer = setTimeout(() => {
        setPopupLoading(false);
      }, 1500); // Simulate 1.5 seconds popup loading
      return () => clearTimeout(timer);
    }
  }, [showAuctionPopup]);

  const DashboardPageSkeleton = () => (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <div className="flex space-x-4 border-b">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 mb-[-1px]" />
          ))}
        </div>

        {/* Overview Tab Skeleton Content */}
        <div className="space-y-6">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Live & Upcoming Auctions Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, cardIndex) => (
              <Card key={cardIndex}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(3)].map((_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}! Here's your auction activity at a
            glance.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowAuctionPopup(true)}
            aria-label="View Live Auction"
          >
            <Gavel className="h-5 w-5" />
          </Button>
          <Button asChild variant="outline">
            <Link href="/auctions">Browse Auctions</Link>
          </Button>
          <Button asChild>
            <Link href="/auctions/create">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Auction
            </Link>
          </Button>
        </div>
      </div>

      {/* Auction Popup Dialog */}
      <Dialog open={showAuctionPopup} onOpenChange={setShowAuctionPopup}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {popupLoading
                ? "Loading Auction..."
                : mockLiveAuctions.length > 0
                ? "Live Auction Spotlight"
                : "Live Auctions"}
            </DialogTitle>
            {!popupLoading && mockLiveAuctions.length > 0 && (
              <DialogDescription>
                Check out this ongoing auction!
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="py-4">
            {popupLoading ? (
              <div className="space-y-3 animate-pulse">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full mt-2" />
              </div>
            ) : mockLiveAuctions.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary">
                  {mockLiveAuctions[0].title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Current Bid:{" "}
                  <span className="font-bold text-foreground">
                    ${mockLiveAuctions[0].currentBid}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Ends In:{" "}
                  <span className="font-bold text-orange-500">
                    {mockLiveAuctions[0].endsIn}
                  </span>
                </p>
                <Button asChild className="w-full mt-2">
                  <Link href={`/auctions/${mockLiveAuctions[0].id}`}>
                    View Auction
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No Live Auctions Found</p>
                <p className="text-sm text-muted-foreground">
                  There are currently no auctions live. Check back later!
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAuctionPopup(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="auctions">My Auctions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Bids Placed
                </CardTitle>
                <Gavel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockUserStats.totalBids}
                </div>
                <p className="text-xs text-muted-foreground">+4 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Auctions Won
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockUserStats.auctionsWon}
                </div>
                <p className="text-xs text-muted-foreground">+2 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Auctions Participated
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockUserStats.auctionsParticipated}
                </div>
                <p className="text-xs text-muted-foreground">
                  Since you joined
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Wallet Balance
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${mockUserStats.walletBalance.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Available for bidding
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Live & Upcoming Auctions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Auctions</CardTitle>
                <CardDescription>
                  Auctions you're currently participating in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLiveAuctions.map((auction) => (
                    <div
                      key={auction.id}
                      className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <Link
                          href={`/auctions/${auction.id}`}
                          className="font-medium hover:underline"
                        >
                          {auction.title}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          Current Bid: ${auction.currentBid}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-right">
                          <span className="text-orange-500 font-medium">
                            Ends in: {auction.endsIn}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/auctions/${auction.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Auctions</CardTitle>
                <CardDescription>
                  Auctions on your watchlist starting soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUpcomingAuctions.map((auction) => (
                    <div
                      key={auction.id}
                      className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <Link
                          href={`/auctions/${auction.id}`}
                          className="font-medium hover:underline"
                        >
                          {auction.title}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          Starting Bid: ${auction.startingBid}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-right">
                          <span className="text-blue-500 font-medium">
                            Starts in: {auction.startsIn}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/auctions/${auction.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="auctions">
          <Card>
            <CardHeader>
              <CardTitle>Your Auctions</CardTitle>
              <CardDescription>
                Track your active and past auctions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Your auction history will appear here
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/auctions">Browse Auctions</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Stay updated with your auction activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.read ? "bg-background" : "bg-primary/5"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Bell
                          className={`h-5 w-5 mt-0.5 ${
                            notification.read
                              ? "text-muted-foreground"
                              : "text-primary"
                          }`}
                        />
                        <div>
                          <p
                            className={`${
                              notification.read ? "" : "font-medium"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Your Wallet</CardTitle>
              <CardDescription>
                Manage your funds for bidding and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 p-6 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Available Balance
                  </h3>
                  <div className="text-4xl font-bold mt-2">
                    ${mockUserStats.walletBalance.toFixed(2)}
                  </div>
                  <div className="flex gap-4 mt-4">
                    <Button>Add Funds</Button>
                    <Button variant="outline">Withdraw</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Recent Transactions
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Deposit</p>
                        <p className="text-sm text-muted-foreground">
                          2 days ago
                        </p>
                      </div>
                      <div className="text-green-500 font-medium">+$500.00</div>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Auction Payment</p>
                        <p className="text-sm text-muted-foreground">
                          1 week ago
                        </p>
                      </div>
                      <div className="text-red-500 font-medium">-$320.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                View and manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="bg-primary/5 p-6 rounded-lg flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <User className="h-12 w-12 text-primary/60" />
                      </div>
                      <h3 className="text-xl font-medium">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>

                      <div className="mt-4 flex flex-col gap-2 w-full">
                        <Button asChild variant="outline" size="sm">
                          <Link href="/profile">Edit Profile</Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-2/3">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <User className="h-5 w-5 mr-2" /> Account Information
                        </h3>
                        <div className="bg-muted/20 p-4 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Username:
                            </span>
                            <span className="font-medium">
                              {user?.username}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Email:
                            </span>
                            <span className="font-medium">{user?.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Member Since:
                            </span>
                            <span className="font-medium">April 2023</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <Calendar className="h-5 w-5 mr-2" /> Date of Birth
                        </h3>
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-medium">
                              {user?.dob
                                ? moment(user.dob).format("DD/MM/YYYY")
                                : "Not provided"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <Award className="h-5 w-5 mr-2" /> Auction Activity
                        </h3>
                        <div className="bg-muted/20 p-4 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Auctions Won:
                            </span>
                            <span className="font-medium">
                              {mockUserStats.auctionsWon}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Total Bids:
                            </span>
                            <span className="font-medium">
                              {mockUserStats.totalBids}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
