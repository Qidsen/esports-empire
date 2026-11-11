// Прогресс и история: рейтинги, ачивки, карьера менеджера, зал славы.
import { S, onHook, userTeam, starters, ovr, pnick, news, FAKE, DISC_ORDER, teamOvr, pack, T, clamp } from './game';

// ---- карьера менеджера ----
export const MGR_LV = [[0, 'Новичок'], [150, 'Перспективный'], [500, 'Опытный'], [1200, 'Признанный'], [2500, 'Элитный'], [5000, 'Легенда']];
export const MGR_PERK = ['—', 'Агенты охотнее идут на контакт (+5 к притяжению клуба)', 'Игроки просят на 5% меньше', 'Спонсоры платят на 10% больше', '+1 к силе команды в матчах', 'Звонки агентов чаще, скидки больше'];
export function mgr() { return S.mgr || (S.mgr = { xp: 0, m: 0, w: 0, t: 0, best: 0 }); }
export function mgrLevel() { const x = mgr().xp; let l = 0; MGR_LV.forEach(([v], i) => { if (x >= v) l = i; }); return l; }
function addXp(n, why) { const M = mgr(); const l0 = mgrLevel(); M.xp += n; const l1 = mgrLevel(); if (l1 > l0) { news('⭐ Карьера менеджера: новый статус — «' + MGR_LV[l1][1] + '». Бонус: ' + MGR_PERK[l1], 'gold'); S.toastQ = (S.toastQ || []).concat('⭐ ' + MGR_LV[l1][1]); } }

// ---- ачивки ----
export const ACH = [
  ['first_win', 'Первая кровь', 'Выиграть первый матч', 'swords'],
  ['wins10', 'Разогрев', '10 побед', 'medal'],
  ['wins50', 'Машина побед', '50 побед', 'medal'],
  ['streak5', 'Неудержимые', '5 побед подряд', 'flame'],
  ['upset', 'Сенсация', 'Обыграть команду на 8+ OVR сильнее', 'explosion'],
  ['trophy1', 'Витрина открыта', 'Выиграть первый трофей', 'trophy'],
  ['major', 'Мейджор!', 'Выиграть мейджор', 'laurel'],
  ['tier1', 'Повышение', 'Выйти во вторую лигу', 'upgrade'],
  ['tier0', 'Высшая лига', 'Пробиться в высшую лигу', 'crown'],
  ['multi3', 'Империя', 'Открыть 3 дивизиона', 'castle'],
  ['multi5', 'Все дисциплины', 'Открыть все 5 дивизионов', 'globe'],
  ['star75', 'Звезда в составе', 'Иметь игрока с OVR 75+', 'star'],
  ['fans10k', 'Народная команда', '10 000 фанатов', 'friends'],
  ['fans50k', 'Фанбаза', '50 000 фанатов', 'megaphone'],
  ['rich1m', 'Миллионер', 'Бюджет $1 000 000', 'money'],
  ['chem90', 'Одна команда', 'Химия 90+ в дивизионе', 'handshake'],
  ['season2', 'Ветеран', 'Дожить до 2-го сезона', 'hourglass'],
  ['season5', 'Династия', 'Дожить до 5-го сезона', 'castle'],
];
function unlock(id) { S.ach = S.ach || {}; if (S.ach[id]) return; S.ach[id] = { s: S.season, w: S.week }; const a = ACH.find(x => x[0] === id); news('🏅 Достижение: «' + a[1] + '» — ' + a[2], 'gold'); S.toastQ = (S.toastQ || []).concat('🏅 ' + a[1]); addXp(40); }
function checkAch() {
  const st = S.stats; if (st.wins >= 1) unlock('first_win'); if (st.wins >= 10) unlock('wins10'); if (st.wins >= 50) unlock('wins50');
  if (S.trophies.length) unlock('trophy1'); if (S.trophies.some(t => t.n === pack(t.d).major)) unlock('major');
  const ds = Object.keys(S.divs); if (ds.length >= 3) unlock('multi3'); if (ds.length >= 5) unlock('multi5');
  ds.forEach(d => { const t = userTeam(d); if (t.tier <= 1) unlock('tier1'); if (t.tier === 0) unlock('tier0'); if (t.chem >= 90) unlock('chem90'); if (t.roster.some(i => S.players[i] && ovr(S.players[i]) >= 75)) unlock('star75'); if ((t.last || []).length >= 5 && t.last.slice(-5).every(x => x === 'W')) unlock('streak5'); });
  if (S.fans >= 10000) unlock('fans10k'); if (S.fans >= 50000) unlock('fans50k'); if (S.money >= 1e6) unlock('rich1m');
  if (S.season >= 2) unlock('season2'); if (S.season >= 5) unlock('season5');
}

// ---- зал славы: легенды клуба ----
function hofTrack() {
  S.hof = S.hof || {};
  Object.keys(S.divs).forEach(d => { const t = userTeam(d); t.roster.forEach(i => { const p = S.players[i]; if (!p) return; const h = S.hof[i] || (S.hof[i] = { id: i, d, nk: pnick(p), seasons: 0, k: 0, mvp: 0, mp: 0, tr: 0, best: 0 }); h.nk = pnick(p); h.k = Math.max(h.k, p.car.k); h.mvp = Math.max(h.mvp, p.car.mvp); h.mp = Math.max(h.mp, p.car.mp); h.best = Math.max(h.best, ovr(p)); }); });
}
export function legends() { return Object.values(S.hof || {}).filter(h => h.seasons >= 2 || h.tr >= 1 || h.mvp >= 10).sort((a, b) => (b.tr * 100 + b.mvp * 3 + b.seasons * 10) - (a.tr * 100 + a.mvp * 3 + a.seasons * 10)); }
export function records() { const L = Object.values(S.hof || {}); const top = k => L.slice().sort((a, b) => b[k] - a[k])[0]; return [['Больше всех убийств/голов', top('k'), 'k'], ['Больше всех MVP', top('mvp'), 'mvp'], ['Больше всех матчей', top('mp'), 'mp'], ['Пиковый OVR', top('best'), 'best']].filter(x => x[1] && x[1][x[2]] > 0); }

// ---- рейтинги ----
export function teamRanking(d) { return S.world[d].teams.map(t => ({ t, elo: t.elo || 1500 + (2 - t.tier) * 150 })).sort((a, b) => b.elo - a.elo); }
export function playerRanking(d) { const W = S.world[d]; const ps = W.teams.flatMap(t => starters(t)); return ps.map(p => ({ p, rt: p.st.mp ? p.st.rt / p.st.mp : 0, mp: p.st.mp })).filter(x => x.mp >= 4).sort((a, b) => (b.rt + ovr(b.p) / 400) - (a.rt + ovr(a.p) / 400)); }

// ---- хуки ----
onHook('match', (d, m, W, L) => {
  const A = W, B = L; if (!W.user && !L.user) return; const M = mgr(); M.m++;
  if (W.user) { M.w++; addXp(10 + (2 - W.tier) * 5 + (m.po ? 20 : 0) + (m.wc ? 40 : 0)); if (teamOvr(L) >= teamOvr(W) + 8) { unlock('upset'); addXp(20); } }
  else addXp(2);
  if (W.user && m.po === 2) { addXp(150); M.t++; starters(W).forEach(p => { S.hof = S.hof || {}; const h = S.hof[p.id]; if (h) h.tr++; }); }
  if (W.user && m.wc === 3) { addXp(400); M.t++; }
  hofTrack(); checkAch();
});
onHook('week', () => { hofTrack(); checkAch(); });
onHook('season', () => { hofTrack(); Object.keys(S.divs).forEach(d => userTeam(d).roster.forEach(i => { const h = S.hof && S.hof[i]; if (h) h.seasons++; })); });
