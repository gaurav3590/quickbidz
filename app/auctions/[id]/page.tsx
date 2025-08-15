import { AuctionDetailPage } from "@/components/pages";

export default function AuctionDetail({ params }: { params: { id: string } }) {
  return (
    <AuctionDetailPage auctionId={params.id} />
  );
}
