import { NextRequest, NextResponse } from 'next/server';
import { authorizedRequest } from '@/lib/api';

// Place Bid
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await authorizedRequest('/bids', {
      method: 'POST',
      data: body
    });
    
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to place bid' },
      { status: error.response?.status || 500 }
    );
  }
}

// Get All Bids
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const auctionId = searchParams.get('auctionId');
    const bidderId = searchParams.get('bidderId');
    const status = searchParams.get('status');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    
    const params: Record<string, string> = {
      page,
      limit
    };
    
    if (auctionId) params.auctionId = auctionId;
    if (bidderId) params.bidderId = bidderId;
    if (status) params.status = status;
    
    const response = await authorizedRequest('/bids', {
      params
    });
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch bids' },
      { status: error.response?.status || 500 }
    );
  }
} 