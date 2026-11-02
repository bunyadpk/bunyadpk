/* BUNYAD isolated data model — societies, LDA docs, property listings.
   Existing operational tables (leads, properties, crm_clients, agents, material_rates) remain in use. */

-- 1) Societies directory (38+ Lahore housing societies)
CREATE TABLE IF NOT EXISTS societies (
  id int PRIMARY KEY,
  name text NOT NULL,
  name_ur text,
  corridor text NOT NULL,
  plan text,
  dc_rate_per_marla text,
  fbr_estimate text,
  noc_status text NOT NULL,
  pricing jsonb NOT NULL DEFAULT '[]'::jsonb,
  photo_urls text[] DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE societies ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON societies TO anon, authenticated;
CREATE POLICY "anon_read_societies" ON societies FOR SELECT TO anon, authenticated USING (true);

-- 2) LDA official documents hub
CREATE TABLE IF NOT EXISTS lda_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,        -- e.g. 'Challan','Transfer','Possession','Zoning'
  description text,
  steps text[] DEFAULT '{}',
  download_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lda_documents ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON lda_documents TO anon, authenticated;
CREATE POLICY "anon_read_lda_docs" ON lda_documents FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_write_lda_docs" ON lda_documents FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 3) Property listings (residential/commercial plots & houses)
CREATE TABLE IF NOT EXISTS property_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  society_name text,
  type text NOT NULL DEFAULT 'Residential',  -- Residential | Commercial | House
  plot_size text,
  block text,
  price text,
  status text NOT NULL DEFAULT 'Available',  -- Available | Reserved | Sold
  verified_by_bintaha boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE property_listings ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON property_listings TO anon, authenticated;
CREATE POLICY "anon_read_listings" ON property_listings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_write_listings" ON property_listings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed LDA documents
INSERT INTO lda_documents (title, category, description, steps) VALUES
  ('Transfer Challan Form', 'Challan', 'Official society transfer challan for plot ownership change.', ARRAY['Download challan from society office','Deposit at designated bank','Submit stamped copy to society transfer desk']),
  ('Possession Application', 'Possession', 'Application to obtain physical possession of allotted plot.', ARRAY['Submit possession application','Pay possession/development charges','Site inspection by society staff','Handover of plot possession letter']),
  ('NDC Checklist', 'Transfer', 'No Demand Certificate verification before transfer.', ARRAY['Clear all outstanding dues','Apply for NDC at society office','Verification of payments','NDC issued within 7 working days']),
  ('Affidavit Template', 'Transfer', 'Standard ownership affidavit format.', ARRAY['Stamp paper (Rs. 100)','CNIC copy attached','Witness signatures','Submit with transfer application']),
  ('Authority Letter', 'Transfer', 'Authorized representative power of attorney.', ARRAY['Stamp paper (Rs. 50)','Principal and agent CNIC copies','Attestation by Oath Commissioner','Valid for single transaction']),
  ('LDA Avenue 1 Zoning Master Plan', 'Zoning', 'Master sector map A-M with residential, commercial, and park zoning.', ARRAY['Refer to LDA-approved master plan','Verify plot zoning category','Confirm setback and FAR bylaws','Submit building plan for approval'])
ON CONFLICT DO NOTHING;
