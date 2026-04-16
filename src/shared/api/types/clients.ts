export interface Client {
  id: string;
  name: string;
  username: string;
  email: string;
  status: "active" | "inactive" | "pending";
  totalSpent: number;
  joinedDate: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  start: number;
  end: number;
}

export type ClientStatus = "all" | "active" | "inactive" | "pending";
