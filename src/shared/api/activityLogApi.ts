import { supabase } from "../utils/supabase";
import type { ActivityAction, ActivityLogEntry } from "./types/activityLog";

interface LogInput {
  client_id: string;
  action: ActivityAction;
  sale_id?: string;
  metadata?: Record<string, unknown>;
}

export const logActivity = async (input: LogInput) => {
  const { error } = await supabase.from("client_activity_log").insert([input]);
  if (error) throw error;
};

export const safeLog = async (input: LogInput) => {
  try {
    await logActivity(input);
  } catch (err) {
    console.warn("activity log insert failed", input.action, err);
  }
};

export const fetchClientActivity = async (clientId: string, limit = 5) => {
  const { data, error } = await supabase
    .from("client_activity_log")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data as ActivityLogEntry[];
};
