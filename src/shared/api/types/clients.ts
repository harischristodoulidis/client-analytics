export type ClientStatus = "all" | "active" | "inactive" | "pending";

export interface Client {
  id: string;
  name: string;
  username: string;
  email: string;
  status: ClientStatus;
  total_spent: number;
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
