import { memo, useCallback, useEffect, useState } from 'react';
import { motion } from '@/lib/motion';
import { FileText, Download, Gavel, Home } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type LdaDoc = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  steps: string[] | null;
  download_url: string | null;
};

const FALLBACK_DOCS: LdaDoc[] = [
  {
    id: '1', title: 'Transfer Challan Form', category: 'Challan',
    description: 'Official society transfer challan for plot ownership change.',
    steps: ['Download challan from society office', 'Deposit at designated bank', 'Submit stamped copy to society transfer desk'],
    download_url: null,
  },
  {
    id: '2', title: 'Possession Application', category: 'Possession',
    description: 'Application to obtain physical possession of allotted plot.',
    steps: ['Submit possession application', 'Pay possession/development charges', 'Site inspection by society staff', 'Handover of plot possession letter'],
    download_url: null,
  },
  {
    id: '3', title: 'NDC Checklist', category: 'Transfer',
    description: 'No Demand Certificate verification before transfer.',
    steps: ['Clear all outstanding dues', 'Apply for NDC at society office', 'Verification of payments', 'NDC issued within 7 working days'],
    download_url: null,
  },
  {
    id: '4', title: 'Affidavit Template', category: 'Transfer',
    description: 'Standard ownership affidavit format.',
    steps: ['Stamp paper (Rs. 100)', 'CNIC copy attached', 'Witness signatures', 'Submit with transfer application'],
    download_url: null,
  },
  {
    id: '5', title: 'Authority Letter', category: 'Transfer',
    description: 'Authorized representative power of attorney.',
    steps: ['Stamp paper (Rs. 50)', 'Principal and agent CNIC copies', 'Attestation by Oath Commissioner', 'Valid for single transaction'],
    download_url: null,
  },
  {
    id: '6', title: 'LDA Avenue 1 Zoning Master Plan', category: 'Zoning',
    description: 'Master sector map A-M with residential, commercial, and park zoning.',
    steps: ['Refer to LDA-approved master plan', 'Verify plot zoning category', 'Confirm setback and FAR bylaws', 'Submit building plan for approval'],
    download_url: null,
  },
];

const CATEGORY_ICON: Record<string, typeof Gavel> = {
  Challan: FileText, Transfer: Gavel, Possession: Home, Zoning: FileText,
};

function LdaDocsHub() {
  const [docs, setDocs] = useState<LdaDoc[]>(FALLBACK_DOCS);

  const load = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('lda_documents').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) setDocs(data as LdaDoc[]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function download(name: string) {
    const content = `${name}\n\nBin Taha Associates & Builders\nCEO: Taha Mubeen Bhutta\nHelpline: 0321-9404812\nHQ: Block J, LDA Avenue 1, Lahore\n\n[Fill in your details below]\n\nName: _______________\nCNIC: _______________\nPlot: _______________\nSociety: _______________\n\nSignature: _______________\nDate: _______________\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name.replace(/\s+/g, '_') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Gavel className="h-5 w-5 text-cyan" />
          <h2 className="font-display text-base font-bold text-platinum">Official LDA Documents Hub</h2>
        </div>
        <p className="mt-1 text-xs text-platinum/60">
          Download official challan forms, transfer procedures, possession guides, and zoning master plans.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {docs.map((d, i) => {
          const Icon = CATEGORY_ICON[d.category] || FileText;
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-platinum">{d.title}</h3>
                    <span className="chip mt-0.5">{d.category}</span>
                  </div>
                </div>
                <button onClick={() => download(d.title)} className="rounded-md p-2 text-cyan hover:bg-cyan/10" title="Download">
                  <Download className="h-4 w-4" />
                </button>
              </div>
              {d.description && <p className="mt-2 text-xs text-platinum/60">{d.description}</p>}
              {d.steps && d.steps.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {d.steps.map((s, si) => (
                    <div key={si} className="flex items-start gap-2 text-xs text-platinum/70">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan/15 font-mono text-[9px] text-cyan">{si + 1}</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => download(d.title)}
                className="btn-ghost mt-3 w-full py-1.5 text-xs"
              >
                <Download className="h-3.5 w-3.5" /> Download Template
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(LdaDocsHub);
