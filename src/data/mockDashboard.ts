import type { Agent, Lead, Property } from '@/lib/supabase';

export const MOCK_AGENTS: Agent[] = [
  { id: 'demo-agent-1', agent_name: 'Ayesha Khan', agency_name: 'Lahore Prime Estates', cnic: '35202-1234567-8', phone: '0300-2145876', verified: true, commission_split: '50/50', created_at: '2026-10-28T09:30:00Z' },
  { id: 'demo-agent-2', agent_name: 'Hassan Raza', agency_name: 'Avenue Property Network', cnic: '35201-7654321-9', phone: '0321-7788455', verified: true, commission_split: '55/45', created_at: '2026-10-26T12:10:00Z' },
  { id: 'demo-agent-3', agent_name: 'Maryam Siddiqui', agency_name: 'Urban Key Consultants', cnic: '35202-2468135-7', phone: '0333-9041208', verified: false, commission_split: '50/50', created_at: '2026-10-24T15:45:00Z' },
  { id: 'demo-agent-4', agent_name: 'Bilal Ahmed', agency_name: 'Bahria Link Realtors', cnic: '35201-9876543-2', phone: '0301-6621098', verified: true, commission_split: '60/40', created_at: '2026-10-21T08:20:00Z' },
];

export const MOCK_LEADS: Lead[] = [
  { id: 'demo-lead-1', full_name: 'Usman Tariq', phone: '0308-4129087', email: 'usman.tariq@example.com', society_interest: 'LDA Avenue 1', budget: 'PKR 3.5 Crore', message: 'Looking for a 10 Marla corner plot in a developed block.', status: 'New', created_at: '2026-11-01T10:15:00Z' },
  { id: 'demo-lead-2', full_name: 'Sana Malik', phone: '0322-7516409', email: 'sana.malik@example.com', society_interest: 'DHA Lahore', budget: 'PKR 6 Crore', message: 'Interested in a turnkey build with a modern elevation.', status: 'Contacted', created_at: '2026-10-31T14:40:00Z' },
  { id: 'demo-lead-3', full_name: 'Hamza Iqbal', phone: '0334-9055122', society_interest: 'Lake City', budget: 'PKR 1.8 Crore', message: 'Please share current DC rate and transfer cost breakdown.', status: 'In-Progress', created_at: '2026-10-29T11:05:00Z' },
  { id: 'demo-lead-4', full_name: 'Nida Farooq', phone: '0307-1836240', email: 'nida.farooq@example.com', society_interest: 'Bahria Town Lahore', budget: 'PKR 2.25 Crore', message: 'Need a verified 5 Marla residential option near amenities.', status: 'Closed', created_at: '2026-10-27T16:25:00Z' },
];

export const MOCK_PROPERTIES: Property[] = [
  { id: 'demo-property-1', title: 'Premium Corner Plot', society_name: 'LDA Avenue 1', plot_size: '10 Marla', block: 'J', plot_number: 'J-214', price: 'PKR 3.45 Crore', status: 'Available', verified_by_bintaha: true, created_at: '2026-11-01T09:00:00Z' },
  { id: 'demo-property-2', title: 'Park Facing Residential Plot', society_name: 'Lake City Lahore', plot_size: '5 Marla', block: 'M-7', plot_number: 'M7-884', price: 'PKR 1.72 Crore', status: 'Reserved', verified_by_bintaha: true, created_at: '2026-10-30T13:30:00Z' },
  { id: 'demo-property-3', title: 'Developed Block Plot', society_name: 'Bahria Town Lahore', plot_size: '8 Marla', block: 'Sector C', plot_number: 'C-109', price: 'PKR 2.1 Crore', status: 'Available', verified_by_bintaha: true, created_at: '2026-10-28T10:45:00Z' },
  { id: 'demo-property-4', title: 'Main Boulevard Commercial', society_name: 'Etihad Town', plot_size: '4 Marla', block: 'B', plot_number: 'B-42', price: 'PKR 3.8 Crore', status: 'Sold', verified_by_bintaha: true, created_at: '2026-10-25T17:10:00Z' },
];
