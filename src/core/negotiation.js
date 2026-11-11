// Переговоры: сначала с клубом (сумма трансфера), затем с игроком и его агентом (контракт).
import { S, T, FAKE, FIRST, LAST, agentDisc, buyChance, clamp, feeFor, ovr, pnick, rnd, salaryFor, signDemand, signPlayer, starters, tname, userTeam, news, negKey } from './game';

const h01 = (n, k) => { const x = Math.sin(n * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
export const PRIO = { money: 'Деньги', time: 'Игровое время', ambition: 'Амбиции', security: 'Стабильность' };

// Характер игрока стабилен: зависит от id
export function persona(p) {
  const raw = { money: 0.6 + h01(p.id, 1) * 1.4, time: 0.4 + h01(p.id, 2) * 1.2 + (p.age < 22 ? 0.5 : 0), ambition: 0.3 + h01(p.id, 3) * 1.2 + (ovr(p) > 75 ? 0.6 : 0), security: 0.3 + h01(p.id, 4) * 1.0 + (p.age > 26 ? 0.6 : 0) };
  const s = Object.values(raw).reduce((a, b) => a + b, 0); const w = {}; Object.keys(raw).forEach(k => { w[k] = raw[k] / s; });
  return w;
}
export function agentName(p) { return FIRST[Math.floor(h01(p.id, 7) * FIRST.length)] + ' ' + LAST[Math.floor(h01(p.id, 8) * LAST.length)]; }

// Чего хочет игрок
export function demands(p) {
  const dm = signDemand(p); const ut = userTeam(p.d);
  const rival = ut ? starters(ut).filter(x => x.role === p.role).map(ovr)[0] : 0;
  const wantsStart = ovr(p) >= (rival || 0) - 2 || p.age >= 24;
  const w = persona(p);
  const years = w.security > 0.3 ? 3 : p.age < 21 ? 2 : 2;
  return { sal: dm.sal, refuse: dm.refuse, role: wantsStart ? 'start' : 'rot', years, rival };
}
export const ROLE = { start: 'Основной состав', rot: 'Ротация', bench: 'Запасной' };
export const CLAUSE = [[0, 'Нет'], [2, '×2 стоимости'], [4, '×4 стоимости']];
export const BONUS_W = [[0, 'Нет'], [2, '2 зарплаты'], [4, '4 зарплаты'], [8, '8 зарплат']];
export const WINB = [[0, 'Нет'], [0.1, '10% зарплаты'], [0.25, '25% зарплаты']];

export function newOffer(p) {
  const dm = demands(p);
  return { sal: Math.round(dm.sal * 0.9 / 10) * 10, years: 2, bonusW: 0, role: dm.role, winB: 0, clause: 4 };
}
// Интерес игрока к предложению (0–100) и разбивка по приоритетам
export function interest(p, o) {
  const dm = demands(p); const w = persona(p); const ut = userTeam(p.d);
  const salEff = o.sal * (1 + o.winB * 0.5) + (o.bonusW * o.sal) / (o.years * 20);
  const sc = {
    money: clamp((salEff / dm.sal - 0.72) / 0.36, 0, 1),
    time: o.role === 'start' ? 1 : o.role === 'rot' ? (dm.role === 'start' ? 0.45 : 0.95) : (dm.role === 'start' ? 0.05 : 0.5),
    ambition: clamp(((S.rep + (ut ? (2 - ut.tier) * 18 : 0)) / Math.max(10, ovr(p) - 30)) * 0.8 + (o.clause === 2 ? 0.25 : o.clause === 0 ? 0.35 : 0), 0, 1),
    security: o.years === 3 ? 1 : o.years === 2 ? 0.7 : 0.35,
  };
  if (p.age < 22 && o.years === 3) sc.security = 0.8;
  let v = 0; Object.keys(w).forEach(k => { v += w[k] * sc[k]; });
  return { v: Math.round(v * 100), sc, w };
}
export function costs(p, o, fee = 0) {
  const agent = fee ? Math.round(fee * 0.05 / 100) * 100 : o.sal * 2;
  const bonus = o.bonusW * o.sal;
  return { agent, bonus, now: fee + agent + bonus, weekly: o.sal };
}

// Клуб
export function askFee(p) { return Math.round(feeFor(p) * agentDisc() / 100) * 100; }
export function clubRespond(p, n, fee, sellOn) {
  const ask = askFee(p); const eff = (fee * (1 + sellOn * 0.7)) / ask; // процент с перепродажи ценится клубом
  const ch = buyChance(p, 0.9 + (eff - 0.9));
  if (rnd() < ch) return { ok: true, msg: tname(T(p.team)) + ' принимают предложение.' };
  n.clubPat--;
  const want = Math.round(ask * clamp(eff + 0.12 + rnd() * 0.15, 1.0, 1.7) / 100) * 100;
  if (n.clubPat <= 0) { S.negot[negKey(p)] = 'no'; return { ok: false, end: true, msg: tname(T(p.team)) + ' прекращают переговоры. Попробуй на следующей неделе.' }; }
  return { ok: false, counter: want, msg: tname(T(p.team)) + ': «Нас устроит $' + Math.round(want / 1000) + 'k.»' };
}
// Игрок
export function playerRespond(p, n, o) {
  const it = interest(p, o); const dm = demands(p);
  if (dm.refuse) return { ok: false, end: true, msg: 'Агент: «Мой клиент не рассматривает команду вашего уровня.»' };
  if (it.v >= 70) return { ok: true, msg: 'Агент: «Договорились! Готовим бумаги.»', v: it.v };
  n.patience--;
  if (n.patience <= 0 || it.v < 35) { if (n.patience <= 0) S.negot[negKey(p)] = 'no'; return { ok: false, end: n.patience <= 0, msg: n.patience <= 0 ? 'Агент: «Мы теряем время. Переговоры окончены.»' : 'Агент: «Это даже не близко к тому, что мы ждём.»' }; }
  // подсказка: самый важный и слабый пункт
  const worst = Object.keys(it.w).sort((a, b) => it.w[b] * (1 - it.sc[b]) - it.w[a] * (1 - it.sc[a]))[0];
  const hint = { money: 'Клиент рассчитывает на зарплату около $' + Math.round(dm.sal / 10) * 10 + '/нед.', time: 'Клиенту важно место в основе.', ambition: 'Клиент хочет уверенности, что не застрянет: меньше отступные или премии за победы.', security: 'Клиенту нужен контракт подлиннее.' }[worst];
  return { ok: false, msg: 'Агент: «Близко, но нет. ' + hint + '»', v: it.v };
}
export function finalize(p, o, fee) {
  const c = costs(p, o, fee);
  if (S.money < c.now) return 'Не хватает денег: нужно $' + Math.round(c.now / 100) * 100;
  const e = signPlayer(p, o.years, fee, o.sal); if (e) return e;
  S.money -= c.agent + c.bonus;
  const it = interest(p, o).v;
  p.winB = o.winB; p.clause = o.clause ? Math.round(feeFor(p) * o.clause / 100) * 100 : null; p.promise = o.role; p.mor = it >= 85 ? 92 : 80;
  if (o.role === 'start') { const ut = userTeam(p.d); const rival = starters(ut).find(x => x.role === p.role && x.id !== p.id); if (rival) { rival.bench = true; p.bench = false; } }
  if (o.role === 'bench') p.bench = true;
  news('📝 Контракт: ' + pnick(p) + ' · $' + o.sal + '/нед · ' + o.years + ' сез. · ' + ROLE[o.role].toLowerCase());
  return null;
}
