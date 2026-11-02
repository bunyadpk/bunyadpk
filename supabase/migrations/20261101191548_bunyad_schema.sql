/*
# BUNYAD Platform Schema

1. New Tables
- `leads`: Customer inquiries submitted from the site (name, phone, interest, budget, message, status).
- `properties`: Listed plots with society, size, block, price, availability status, verification flag.
- `crm_clients`: Clients in the deal pipeline with escrow milestones and payment status.
- `agents`: Registered associate partners/agents with CNIC, verification, commission split.
- `material_rates`: Singleton-style row holding current civil material prices (cement, steel, bricks, crush).
2. Security
- All tables are single-tenant (no sign-in). Enable RLS and grant CRUD to anon + authenticated so the anon-key frontend can read/write its shared data.
3. Notes
- `material_rates` uses a fixed singleton row (id = 1) seeded with default Lahore 2026 rates.
- All tables use gen_random_uuid() primary keys and created_at/updated_at defaults.
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text,
  whatsapp text,
  email text,
  society_interest text,
  budget text,
  message text,
  status text NOT NULL DEFAULT 'New'
    CHECK (status IN ('New','Contacted','In-Progress','Closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON leads TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_leads" ON leads;
CREATE POLICY "anon_select_leads" ON leads FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_leads" ON leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_leads" ON leads FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_leads" ON leads FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  society_name text NOT NULL,
  plot_size text,
  block text,
  plot_number text,
  price text,
  status text NOT NULL DEFAULT 'Available'
    CHECK (status IN ('Available','Reserved','Sold')),
  verified_by_bintaha boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON properties TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_properties" ON properties;
CREATE POLICY "anon_select_properties" ON properties FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_properties" ON properties FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_properties" ON properties FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_properties" ON properties FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS crm_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  phone text,
  deal_society text,
  escrow_milestone text NOT NULL DEFAULT 'Foundation'
    CHECK (escrow_milestone IN ('Foundation','Structure','Finishing','Handover')),
  payment_status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE crm_clients ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON crm_clients TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_crm" ON crm_clients;
CREATE POLICY "anon_select_crm" ON crm_clients FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_crm" ON crm_clients FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_crm" ON crm_clients FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_crm" ON crm_clients FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name text NOT NULL,
  agency_name text,
  cnic text,
  phone text,
  verified boolean NOT NULL DEFAULT false,
  commission_split text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON agents TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_agents" ON agents;
CREATE POLICY "anon_select_agents" ON agents FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_agents" ON agents FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_agents" ON agents FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_agents" ON agents FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS material_rates (
  id int PRIMARY KEY DEFAULT 1,
  cement_bag numeric NOT NULL DEFAULT 1540,
  steel_kg numeric NOT NULL DEFAULT 282,
  bricks_pc numeric NOT NULL DEFAULT 21,
  crush_cft numeric NOT NULL DEFAULT 330,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT material_rates_singleton CHECK (id = 1)
);

ALTER TABLE material_rates ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON material_rates TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_rates" ON material_rates;
CREATE POLICY "anon_select_rates" ON material_rates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_rates" ON material_rates FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_rates" ON material_rates FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_rates" ON material_rates FOR DELETE TO anon, authenticated USING (true);

INSERT INTO material_rates (id, cement_bag, steel_kg, bricks_pc, crush_cft)
VALUES (1, 1540, 282, 21, 330)
ON CONFLICT (id) DO NOTHING;