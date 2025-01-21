import { supabase } from './supabase';
import { getSettings } from './settings';

export async function getMealStats(userId: string) {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Get current month's meals
  const { data: meals, error: mealsError } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'taken')
    .gte('date', firstDayOfMonth.toISOString())
    .lte('date', lastDayOfMonth.toISOString());

  if (mealsError) throw mealsError;

  // Get settings for price and subsidy calculations
  const settings = await getSettings();
  
  const currentMonthMeals = meals?.length || 0;
  const totalAmount = currentMonthMeals * settings.meal_price;
  
  // Get total meals for subsidy calculation
  const { count: totalMeals } = await supabase
    .from('meals')
    .select('*', { count: 'exact' })
    .eq('status', 'taken')
    .gte('date', firstDayOfMonth.toISOString())
    .lte('date', lastDayOfMonth.toISOString());

  // Calculate subsidy
  const subsidyAmount = settings.subsidy_active
    ? Math.floor((settings.subsidy_amount * currentMonthMeals) / (totalMeals || 1))
    : 0;

  return {
    currentMonthMeals,
    totalAmount,
    subsidyAmount,
  };
}

export async function getUserMeals(userId: string) {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createMeal(userId: string, date: string) {
  const { error } = await supabase
    .from('meals')
    .insert({
      user_id: userId,
      date,
      status: 'taken'
    });

  if (error) throw error;
}

export async function cancelMeal(userId: string, mealId: string) {
  const { error } = await supabase
    .from('meals')
    .update({ status: 'cancelled' })
    .eq('id', mealId)
    .eq('user_id', userId);

  if (error) throw error;
}