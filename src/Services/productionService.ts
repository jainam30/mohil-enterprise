import { supabase } from "../Config/supabaseClient";

// -------- Create Production Cutting (Batch)
export const createProductionCutting = async (data: any) => {
  const { data: result, error } = await supabase
    .from("production_cutting")
    .insert(data)
    .select();

  if (error) throw error;
  return result[0];
};

// -------- Create Production Operation
export const createProductionOperation = async (operationData: any) => {
  const { data, error } = await supabase
    .from("production_operations")
    .insert(operationData)
    .select();

  if (error) throw error;
  return data[0];
};

// -------- Get Production by Date
export const getProductionByDate = async (date: string) => {
  const { data, error } = await supabase
    .from("production_operations")
    .select("*, workers(name), operations(name), products(name)")
    .eq("date", date);

  if (error) throw error;
  return data;
};
