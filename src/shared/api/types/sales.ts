export type SaleStatus = "completed" | "pending" | "failed";

export interface Sale {
  id: string;
  client_id: string;
  amount: number;
  date: string;
  status: SaleStatus;
  created_at?: string;
}

export interface SalesWithClient extends Sale {
  clients: {
    name: string;
    username: string;
    email: string;
    total_spent: number;
    joinedDate: string;
  };
}

export type ClientWithSale = {
  name: string;
  username: string;
  email: string;
  total_spent: number;
  joinedDate: string;
};
