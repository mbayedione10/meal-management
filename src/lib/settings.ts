import { supabase } from './supabase';

export async function getSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();

  if (error) throw error;

  return {
    subsidy_active: data.subsidy_active,
    subsidy_amount: data.subsidy_amount,
    meal_price: data.meal_price,
  };
}