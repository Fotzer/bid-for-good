export interface IBet {
  id: number;
  betValue: number;
  userId: number;
  createdAt: string;
  auctionId: number;
  user: {
    name: string;
    email: string;
  };
}
