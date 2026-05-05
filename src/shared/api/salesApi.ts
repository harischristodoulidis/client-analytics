import { supabase } from "../utils/supabase";
import { safeLog } from "./activityLogApi";
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

export const fetchSalesByCustomer = async () => {
  const { data, error } = await supabase.rpc("get_sales_by_customer");

  if (error) throw error;

  return data as {
    name: string;
    total_amount: number;
    completed_count: number;
  }[];
};

export const addSale = async (sale: Omit<Sale, "id" | "created_at">) => {
  const { data, error } = await supabase.from("sales").insert([sale]).select();

  if (error) throw error;

  const created = data?.[0] as Sale | undefined;
  if (created) {
    await safeLog({
      client_id: created.client_id,
      sale_id: created.id,
      action: "sale_created",
    });
  }

  return data;
};

export const editSale = async ({
  next,
  prev,
}: {
  next: Sale;
  prev: Sale;
}) => {
  const { id, ...payload } = next;
  const { data, error } = await supabase
    .from("sales")
    .update({ ...payload, edited_at: new Date().toISOString() })
    .eq("id", id)
    .select();

  if (error) throw error;

  if (prev.status !== next.status) {
    await safeLog({
      client_id: next.client_id,
      sale_id: id,
      action: "sale_status_changed",
      metadata: { from: prev.status, to: next.status },
    });
  } else {
    await safeLog({
      client_id: next.client_id,
      sale_id: id,
      action: "sale_updated",
    });
  }

  return data;
};

export const deleteSale = async ({
  id,
  client_id,
}: Pick<Sale, "id" | "client_id">) => {
  await safeLog({ client_id, sale_id: id, action: "sale_deleted" });

  const { error } = await supabase.from("sales").delete().eq("id", id);

  if (error) throw error;
};
