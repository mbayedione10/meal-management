import { supabase } from './supabase';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function signIn(email: string, password: string) {
  const result = loginSchema.safeParse({ email, password });
  
  if (!result.success) {
    throw new Error('Invalid credentials');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserRole() {
  const user = await getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data?.role;
}