export const isGeminiConfigured = false;

export async function askBunyadAI(prompt: string): Promise<string> {
  return fallbackAnswer(prompt);
}

function fallbackAnswer(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('cost') || p.includes('estimate') || p.includes('budget')) {
    return 'For a 5 Marla (25x50) gray structure in Lahore 2026, estimate around PKR 45–55 lakh using current rates (cement PKR 1,540/bag, steel PKR 282/kg). Turnkey luxury finish adds roughly PKR 25–35 lakh. For an exact estimate, use the Live Construction Cost Estimator in the Utility Suite, or call CEO Taha Mubeen Bhutta at 0321-9404812.';
  }
  if (p.includes('lda') || p.includes('bylaw') || p.includes('setback')) {
    return 'LDA Avenue 1 typical setbacks: front 10 ft, rear 5–7 ft, side 5 ft for residential plots. FAR varies by plot size — consult the society bylaws or call 0321-9404812 for plot-specific guidance.';
  }
  if (p.includes('dc rate') || p.includes('fbr') || p.includes('tax')) {
    return 'DC rates and FBR valuations vary per society and plot size. Use the Smart DC Rate & FBR Tax Engine for filer vs non-filer breakdowns. For confirmation, contact 0321-9404812.';
  }
  return `I'm the Bunyad AI Consultant. I can advise on Lahore societies, LDA bylaws, construction costs, DC rates, escrow milestones, and more. For a precise answer on "${prompt}", please share the society and plot size, or call CEO Taha Mubeen Bhutta directly at 0321-9404812.`;
}
