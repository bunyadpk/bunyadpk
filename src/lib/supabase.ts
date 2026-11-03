import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Live Supabase Project Credentials with ENV fallback
const LIVE_URL = 'https://ajrvlrvnxpatbculnwil.supabase.co';
const LIVE_ANON_KEY = 'sb_publishable_ndHx-NyVhYxvDwfvBnK2iA_woPQhjJi';

const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const finalUrl = (envUrl && envUrl.startsWith('http') && !envUrl.includes('your-')) ? envUrl : LIVE_URL;
const finalKey = (envKey && !envKey.includes('your-')) ? envKey : LIVE_ANON_KEY;

export const isSupabaseConfigured = Boolean(finalUrl && finalKey);

let client: SupabaseClient | null = null;

try {
  if (isSupabaseConfigured) {
    client = createClient(finalUrl, finalKey, {
      auth: { persistSession: false },
    });
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.warn('Supabase client init failed, running in local mode:', err);
  client = null;
}

export const supabase = client;

export type Lead = {
  id: string;
  full_name: string;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  society_interest?: string | null;
  budget?: string | null;
  message?: string | null;
  status: 'New' | 'Contacted' | 'In-Progress' | 'Closed';
  created_at?: string;
};

export type Property = {
  id: string;
  title: string;
  society_name: string;
  plot_size?: string | null;
  block?: string | null;
  plot_number?: string | null;
  price?: string | null;
  status: 'Available' | 'Reserved' | 'Sold';
  verified_by_bintaha: boolean;
  created_at?: string;
};

export type CrmClient = {
  id: string;
  client_name: string;
  phone?: string | null;
  deal_society?: string | null;
  escrow_milestone: 'Foundation' | 'Structure' | 'Finishing' | 'Handover';
  payment_status: string;
  created_at?: string;
};

export type Agent = {
  id: string;
  agent_name: string;
  agency_name?: string | null;
  cnic?: string | null;
  phone?: string | null;
  verified: boolean;
  commission_split?: string | null;
  created_at?: string;
};

export type MaterialRates = {
  cement_bag: number;
  steel_kg: number;
  bricks_pc: number;
  crush_cft: number;
  updated_at?: string;
};

export const DEFAULT_RATES: MaterialRates = {
  cement_bag: 1540,
  steel_kg: 282,
  bricks_pc: 21,
  crush_cft: 330,
};
