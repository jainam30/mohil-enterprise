import { supabase } from "../Config/supabaseClient";

export const createWorker = async (workerData: any) => {
  const { data, error } = await supabase
    .from("workers")
    .insert(workerData)
    .select();

  if (error) throw error;
  return data[0];
};

export const getWorkers = async () => {
  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getWorkerById = async (id: string) => {
  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const updateWorker = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from("workers")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteWorker = async (id: string) => {
  const { error } = await supabase
    .from("workers")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};
