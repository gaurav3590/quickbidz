"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Package, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to QuickBidz
          </h1>
          <p className="text-xl mb-8">
            Your premier destination for real-time online auctions. Discover
            unique items, place secure bids, and join a community of trusted
            sellers and passionate bidders.
          </p>
          <Card className="bg-card/5 mb-10">
            <CardHeader>
              <CardTitle className="text-2xl">Why Choose QuickBidz?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex flex-col items-center md:items-start">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Secure Bidding</h3>
                  <p className="text-muted-foreground">
                    End-to-end encryption and fraud prevention for safe
                    transactions
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Diverse Listings</h3>
                  <p className="text-muted-foreground">
                    Thousands of products across categories from verified
                    sellers
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Trusted Community
                  </h3>
                  <p className="text-muted-foreground">
                    Verified sellers, user reviews, and comprehensive rating
                    system
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/signup">Sign Up Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auctions">Browse Active Auctions</Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="text-xl">For Bidders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Find unique items, track your bids, and manage your auctions
                  all in one place.
                </p>
                <div className="flex gap-2">
                  <Button asChild variant="default">
                    <Link href="/auctions">Browse Auctions</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard">My Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardHeader>
                <CardTitle className="text-xl">For Sellers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  List your items, set your terms, and reach thousands of
                  potential buyers.
                </p>
                <div className="flex gap-2">
                  <Button asChild variant="default">
                    <Link href="/auctions/create">Create Auction</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard">Seller Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
