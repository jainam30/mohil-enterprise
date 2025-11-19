import { supabase } from "../Config/supabaseClient";

export const createProduct = async (product: any) => {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select();

  if (error) throw error;
  return data[0];
};

export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) throw error;
  return data;
};
