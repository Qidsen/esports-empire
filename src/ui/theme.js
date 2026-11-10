export const C = {
  bg0: '#04060a', bg1: '#080c14', bg2: '#0e1422',
  glass: 'rgba(16,22,36,0.78)', glass2: 'rgba(24,32,52,0.72)', glass3: 'rgba(34,44,70,0.65)',
  line: 'rgba(255,255,255,0.08)', line2: 'rgba(255,255,255,0.14)',
  tx: '#eef2fa', mu: '#8d97ad', mu2: '#566079',
  good: '#3ddc84', bad: '#ff5a6a', gold: '#ffc94d', blue: '#4da3ff', violet: '#b98cff',
};
export const F = { h: 'Exo2_700Bold', hm: 'Exo2_600SemiBold', hx: 'Exo2_800ExtraBold', b: 'Exo2_500Medium' };
export const ovrColor = o => o >= 90 ? C.violet : o >= 80 ? C.gold : o >= 70 ? C.good : o >= 60 ? C.blue : C.mu;
export function shade(hex, f) { const n = parseInt(hex.slice(1), 16); const ch = [n >> 16, (n >> 8) & 255, n & 255].map(x => Math.max(0, Math.min(255, Math.round(x * f)))); return '#' + ch.map(x => x.toString(16).padStart(2, '0')).join(''); }
export function alpha(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
