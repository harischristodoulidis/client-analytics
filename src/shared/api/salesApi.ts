import { supabase } from "../utils/supabase";
import type { Sale, SalesWithClient } from "./types/sales";

export const fetchRecentSales = async (
  limit = 5,
  offset = 0,
): Promise<SalesWithClient[]> => {
  const { data, error } = await supabase
    .from("sales")
    .select(`*, clients(name, username, email, total_spent, joinedDate)`)
    .order("edited_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
};

export const addSale = async (sale: Omit<Sale, "id" | "created_at">) => {
  const { data, error } = await supabase.from("sales").insert([sale]).select();

  if (error) throw error;
  return data;
};

export const editSale = async ({ id, ...payload }: Sale) => {
  const { data, error } = await supabase
    .from("sales")
    .update({ ...payload, edited_at: new Date().toISOString() })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

export const deleteSale = async ({ id }: Pick<Sale, "id">) => {
  const { error } = await supabase.from("sales").delete().eq("id", id);

  if (error) throw error;
};
