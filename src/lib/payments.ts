import { supabase } from './supabase';

export async function getUserPayments(userId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('month', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createPayment(userId: string, amount: number, month: string) {
  const { error } = await supabase
    .from('payments')
    .insert({
      user_id: userId,
      amount,
      month,
      status: 'pending'
    });

  if (error) throw error;
}

export async function getMonthlyPaymentStatus(userId: string, month: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}