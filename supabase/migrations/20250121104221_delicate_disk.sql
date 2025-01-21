/*
  # Initial Schema Setup for Meal Management System

  1. New Tables
    - `users`: Store user information and roles
    - `meals`: Track meal reservations
    - `payments`: Record payment transactions
    - `settings`: System configuration

  2. Security
    - Enable RLS on all tables
    - Add policies for data access based on user roles
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('employee', 'admin');
CREATE TYPE meal_status AS ENUM ('taken', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'employee',
  created_at timestamptz DEFAULT now()
);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  status meal_status NOT NULL DEFAULT 'taken',
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  amount integer NOT NULL CHECK (amount >= 0),
  month date NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subsidy_active boolean NOT NULL DEFAULT true,
  subsidy_amount integer NOT NULL DEFAULT 150000,
  meal_price integer NOT NULL DEFAULT 1500,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users policies
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND role = 'admin'
    )
  );

-- Meals policies
CREATE POLICY "Users can view their own meals"
  ON meals
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own meals"
  ON meals
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own meals"
  ON meals
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all meals"
  ON meals
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND role = 'admin'
    )
  );

-- Payments policies
CREATE POLICY "Users can view their own payments"
  ON payments
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all payments"
  ON payments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND role = 'admin'
    )
  );

-- Settings policies
CREATE POLICY "Anyone can view settings"
  ON settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify settings"
  ON settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND role = 'admin'
    )
  );