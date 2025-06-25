
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vjowjaomtrhyzwidcatz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqb3dqYW9tdHJoeXp3aWRjYXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1Mzg2OTQsImV4cCI6MjA2NjExNDY5NH0.5_SVfNTZgmAQk9hiSPDtXiBwqJR3r2s1lAs5YId3T5Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Updated interface to match actual database schema
export interface SupabasePickupRequest {
  id: number;
  name: string;
  phone: string;
  strain: string;
  quantity: number;
  pickup_time: string;
  status: 'new' | 'seen' | 'ready' | 'completed';
  created_at: string;
  total_amount: number;
}
