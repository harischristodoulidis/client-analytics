import { supabase } from "../utils/supabase";
import type { Client, PaginatedResponse, ClientStatus } from "./types/clients";

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
    query = query.or(`name.ilike.%${search}%,username.ilike.%${search}%`);
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

export const addClient = async (client: Omit<Client, "id">) => {
  const { data, error } = await supabase
    .from("clients")
    .insert([client])
    .select();

  if (error) throw error;
  return data;
};

export const editClient = async ({ id, ...payload }: Client) => {
  const { data, error } = await supabase
    .from("clients")
    .update(payload)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

export const deleteClient = async ({ id }: Pick<Client, "id">) => {
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) throw error;
};

export const getClientByName = async (params: {
  search: string;
}): Promise<Client[]> => {
  const { search } = params;
  const { data, error } = await supabase
    .from("clients")
    .select("*", { count: "exact" })
    .eq("status", "active")
    .or(`name.ilike.${search}%,username.ilike.${search}%`);

  if (error) throw new Error(error.message);

  return data;
};
