# TanStack Query Implementation

This document outlines how TanStack Query (formerly React Query) is implemented in the QuickBidz auction platform.

## Overview

TanStack Query is a powerful data fetching and state management library for React applications. It provides hooks for fetching, caching, synchronizing, and updating server state in React applications.

## Setup

1. **Installation**:
   ```bash
   npm install @tanstack/react-query @tanstack/react-query-devtools
   ```

2. **Provider Setup**:
   The QueryProvider component is set up in `components/providers/QueryProvider.tsx` and integrated into the main Providers component in `components/providers/Providers.tsx`.

## Query Hooks

We've organized our query hooks by domain:

### Auctions

Location: `hooks/useAuctions.ts`

- `useAuctions(filters)`: Fetches a list of auctions with filtering and pagination
- `useAuction(id)`: Fetches a single auction by ID
- `useCreateAuction()`: Creates a new auction
- `useUpdateAuction(id)`: Updates an existing auction
- `useCancelAuction()`: Cancels an auction
- `useActivateAuction()`: Activates an auction

### Bids

Location: `hooks/useBids.ts`

- `useAuctionBids(auctionId, page, limit)`: Fetches bids for a specific auction
- `useMyBids(page, limit)`: Fetches the current user's bids
- `useCreateBid()`: Places a new bid

### Comments

Location: `hooks/useComments.ts`

- `useAuctionComments(auctionId, page, limit)`: Fetches comments for a specific auction
- `useMyComments(page, limit)`: Fetches the current user's comments
- `useCreateComment()`: Creates a new comment
- `useUpdateComment()`: Updates an existing comment
- `useDeleteComment()`: Deletes a comment

### User Profile

Location: `hooks/useProfile.ts`

- `useProfile()`: Fetches the current user's profile
- `useUpdateProfile()`: Updates the user's profile

### Notifications

Location: `hooks/useNotifications.ts`

- `useNotifications(page, limit)`: Fetches user notifications
- `useUnreadNotificationsCount()`: Fetches the count of unread notifications
- `useMarkNotificationAsRead()`: Marks a notification as read
- `useMarkAllNotificationsAsRead()`: Marks all notifications as read
- `useDeleteAllReadNotifications()`: Deletes all read notifications

## Query Keys

Each domain has its own query key structure to ensure proper cache management:

- Auctions: `['auctions', ...]`
- Bids: `['bids', ...]`
- Comments: `['comments', ...]`
- Profile: `['profile', ...]`
- Notifications: `['notifications', ...]`

## Examples

See `components/examples/TanStackExample.tsx` for example components that demonstrate how to use the TanStack Query hooks:

1. `AuctionsList`: Shows how to fetch and display a paginated list of auctions
2. `AuctionDetail`: Shows how to fetch and display auction details, bids, and comments

## Best Practices

1. **Optimistic Updates**: Use optimistic updates for mutations to provide a better user experience
2. **Query Invalidation**: Invalidate relevant queries after mutations to keep data fresh
3. **Error Handling**: Provide proper error handling for all queries and mutations
4. **Loading States**: Show loading states while data is being fetched
5. **Stale Time**: Configure appropriate stale times for different types of data

## DevTools

TanStack Query DevTools are available in development mode to help debug queries and mutations. They can be accessed by clicking the floating TanStack logo in the bottom-right corner of the screen. 