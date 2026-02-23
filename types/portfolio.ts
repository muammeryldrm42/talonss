export interface PortfolioEntry {
  id: string;
  name: string;
  symbol: string;
  image: string;
  quantity: number;
  buyPrice: number;
  addedAt: number;
}

export interface PortfolioEntryEnriched extends PortfolioEntry {
  currentPrice: number;
  pnl: number | null;
  pnlUsd: number | null;
  totalValue: number;
}
