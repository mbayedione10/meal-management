export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'employee' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role?: 'employee' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'employee' | 'admin'
          created_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          date: string
          status: 'taken' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          status?: 'taken' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          status?: 'taken' | 'cancelled'
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          amount: number
          month: string
          status: 'pending' | 'paid'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          month: string
          status?: 'pending' | 'paid'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          month?: string
          status?: 'pending' | 'paid'
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          subsidy_active: boolean
          subsidy_amount: number
          meal_price: number
          updated_at: string
        }
        Insert: {
          id?: string
          subsidy_active?: boolean
          subsidy_amount?: number
          meal_price?: number
          updated_at?: string
        }
        Update: {
          id?: string
          subsidy_active?: boolean
          subsidy_amount?: number
          meal_price?: number
          updated_at?: string
        }
      }
    }
  }
}