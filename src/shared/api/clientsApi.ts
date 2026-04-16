import type { Client, PaginatedResponse, ClientStatus } from "./types/clients";
import { supabase } from "../utils/supabase";

export interface ClientParams {
  page: number;
  page_size: number;
  search?: string;
  sort_by?: keyof Client;
  order?: "asc" | "desc" | null;
  status?: ClientStatus | "active";
}

export const fetchClients = async (
  params: ClientParams,
): Promise<PaginatedResponse<Client>> => {
  const {
    page,
    page_size,
    search,
    sort_by = "id",
    order = "asc",
    status,
  } = params;
  const start = (page - 1) * page_size;
  const end = start + page_size - 1;

  let query = supabase
    .from("clients")
    .select("*", { count: "exact" })
    .order(sort_by, { ascending: order === "asc" })
    .range(start, end);
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, count, error } = await query;

  if (error) throw new Error(error.message);

  return {
    data: (data ?? []) as Client[],
    total: count ?? 0,
    page,
    page_size,
    total_pages: Math.ceil((count ?? 0) / page_size),
    start,
    end,
  };
};
