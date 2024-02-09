export interface IAuction {
  id: string;
  startPrice: number;
  createdAt: string;
  userId: number;
  mainPhoto: string;
  name: string;
  description: string;
}

export enum AuctionStatus {
  ALL = "ALL",
  MY = "MY",
}
