// События с выбором: карточка между неделями, у каждого ответа свои последствия.
import { S, userTeam, starters, pnick, clamp, news, fmt, pack, ri, pick, rnd, ovr, staffSk } from './game';

const cl = (v, a = 0, b = 100) => clamp(v, a, b);
const mor = (p, n) => { p.mor = cl(p.mor + n); };
const form = (p, n) => { p.form = clamp(p.form + n, -10, 10); };
const chem = (t, n) => { t.chem = cl(t.chem + n); };
const all = c => starters(c.t);
const $ = n => '$' + fmt(n);
const sgn = (n, u = '') => (n >= 0 ? '+' : '−') + Math.abs(Math.round(n)) + u;

// Каждое событие: cond (может ли случиться), text, варианты. f() применяет эффект и возвращает итог.
export const EVENT_DEFS = [
  {
    id: 'fight', ic: '💢', title: 'Ссора в составе', need2: true,
    text: c => `${pnick(c.p)} и ${pnick(c.p2)} сцепились после скрима — орали на весь геймхаус. Остальные ждут, что скажет менеджер.`,
    opts: [
      { t: 'Собрать обоих и помирить', sub: 'Шанс выше с психологом', f: c => { const ok = rnd() < 0.65 + c.psych * 0.03; if (ok) { mor(c.p, 4); mor(c.p2, 4); chem(c.t, 3); return 'Пожали руки. Химия +3, мораль обоих +4'; } chem(c.t, -3); return 'Не вышло — затаили обиду. Химия −3'; } },
      { t: 'Встать на сторону {p}', sub: 'Один доволен, другой — нет', f: c => { mor(c.p, 10); mor(c.p2, -14); chem(c.t, -2); return `${pnick(c.p)} мораль +10, ${pnick(c.p2)} −14, химия −2`; } },
      { t: 'Пусть разбираются сами', sub: 'Риск, что станет хуже', f: c => { if (rnd() < 0.4) { chem(c.t, 1); return 'Остыли сами. Химия +1'; } chem(c.t, -7); return 'Конфликт затянулся. Химия −7'; } },
    ],
  },
  {
    id: 'show', ic: '📺', title: 'Приглашение на шоу',
    text: c => `${pnick(c.p)} зовут на популярное шоу-матч с блогерами. Гонорар организации — ${$(c.fee)}, но пара дней без тренировок.`,
    pre: c => { c.fee = Math.round((1500 + S.fans * 0.2) / 100) * 100; },
    opts: [
      { t: 'Отпустить', sub: 'Деньги и фанаты, минус форма', f: c => { S.money += c.fee; const f = ri(300, 900); S.fans += f; form(c.p, -3); mor(c.p, 6); return `+${$(c.fee)}, +${f} фанатов, форма ${pnick(c.p)} −3`; } },
      { t: 'Отказать — у нас сезон', sub: 'Игрок расстроится', f: c => { mor(c.p, -8); form(c.p, 1); return `${pnick(c.p)} мораль −8, но форма держится`; } },
    ],
  },
  {
    id: 'tweet', ic: '🔥', title: 'Скандал в соцсетях',
    text: c => `${pnick(c.p)} после поражения написал грубость про соперника. Твит разлетелся, спонсоры звонят.`,
    opts: [
      { t: 'Оштрафовать публично', sub: 'Репутация спасена, игрок зол', f: c => { mor(c.p, -12); S.rep = cl(S.rep + 1.5); return `Репутация +1.5, ${pnick(c.p)} мораль −12`; } },
      { t: 'Защитить игрока', sub: 'Команда за тебя, спонсоры — нет', f: c => { mor(c.p, 10); chem(c.t, 2); S.rep = cl(S.rep - 2); return `${pnick(c.p)} мораль +10, химия +2, репутация −2`; } },
      { t: 'Промолчать', sub: 'Пусть само утихнет', f: c => { const f = ri(150, 500); S.fans = Math.max(0, S.fans - f); S.rep = cl(S.rep - 0.8); return `−${f} фанатов, репутация −0.8`; } },
    ],
  },
  {
    id: 'agent', ic: '🕴️', title: 'Агент звонит',
    cond: c => ovr(c.p) >= 55,
    pre: c => { c.raise = Math.max(c.p.sal + 50, Math.round(c.p.sal * 1.15 / 10) * 10); },
    text: c => `Агент ${pnick(c.p)}: «Клубы из высшей лиги интересуются. Если ничего не изменится — будем слушать предложения». Сейчас зарплата ${$(c.p.sal)}/нед.`,
    opts: [
      { t: c => `Поднять до ${$(c.raise)}`, sub: '+15% к зарплате', f: c => { c.p.sal = c.raise; mor(c.p, 12); return `Зарплата ${$(c.raise)}/нед, мораль +12`; } },
      { t: 'Пообещать место в основе', sub: 'Если посадишь на скамейку — обидится', f: c => { c.p.promise = 'start'; c.p.bench = false; mor(c.p, 6); return `${pnick(c.p)} гарантировано место в основе, мораль +6`; } },
      { t: 'Пусть слушают', sub: 'Риск запроса на трансфер', f: c => { mor(c.p, -10); if (rnd() < 0.35) { c.p.transferReq = true; return `${pnick(c.p)} подал запрос на трансфер!`; } return `${pnick(c.p)} мораль −10`; } },
    ],
  },
  {
    id: 'ad', ic: '🥤', title: 'Реклама энергетика',
    pre: c => { c.fee = Math.round((2500 + S.rep * 120) / 100) * 100; },
    text: c => `Бренд энергетиков хочет снять ролик с ${pnick(c.p)}. Платят ${$(c.fee)} сразу. Съёмки — целый день вместо буткемпа.`,
    opts: [
      { t: c => `Снимать (+${$(c.fee)})`, sub: 'Химия −2', f: c => { S.money += c.fee; chem(c.t, -2); return `+${$(c.fee)}, химия −2`; } },
      { t: 'Отказаться', sub: 'Тренировки важнее', f: c => { chem(c.t, 1); return 'Команда оценила. Химия +1'; } },
    ],
  },
  {
    id: 'family', ic: '🏠', title: 'Просьба об отпуске',
    text: c => `${pnick(c.p)} просит несколько дней съездить домой к семье. Матч на следующей неделе никто не отменял.`,
    opts: [
      { t: 'Конечно, езжай', sub: 'Мораль вверх, форма вниз', f: c => { mor(c.p, 15); form(c.p, -3); return `${pnick(c.p)} мораль +15, форма −3`; } },
      { t: 'Только после матча', sub: 'Компромисс', f: c => { mor(c.p, 3); return `${pnick(c.p)} согласился подождать. Мораль +3`; } },
      { t: 'Нет', sub: 'Сосредоточься на игре', f: c => { mor(c.p, -12); form(c.p, 1); return `${pnick(c.p)} мораль −12`; } },
    ],
  },
  {
    id: 'leak', ic: '🕵️', title: 'Утечка стратегий',
    text: c => `Бывший член штаба грозится слить ваши заготовки соперникам по ${pack(c.d).game}. Просит ${$(c.fee)} за молчание.`,
    pre: c => { c.fee = Math.round((2000 + S.rep * 60) / 100) * 100; },
    opts: [
      { t: c => `Заплатить ${$(c.fee)}`, sub: 'Тихо и дорого', f: c => { S.money -= c.fee; return `−${$(c.fee)}. Заготовки в безопасности`; } },
      { t: 'Переписать стратегии', sub: 'Подготовка к картам −8', f: c => { c.t.prac = c.t.prac.map(v => cl(v - 8, 10, 100)); return 'Подготовка ко всем картам −8, зато сюрпризов не будет'; } },
      { t: 'Пусть сливает', sub: 'Может, блефует?', f: c => { if (rnd() < 0.5) return 'Блефовал — ничего не произошло'; c.t.prac = c.t.prac.map(v => cl(v - 15, 10, 100)); return 'Слил! Подготовка ко всем картам −15'; } },
    ],
  },
  {
    id: 'meetup', ic: '🎉', title: 'Встреча с фанатами',
    text: c => `Фан-клуб предлагает устроить автограф-сессию в торговом центре. Аренда и мерч — ${$(1500)}.`,
    opts: [
      { t: 'Устроить', sub: 'Фанаты и мораль', f: c => { S.money -= 1500; const f = ri(500, 1200); S.fans += f; all(c).forEach(p => mor(p, 4)); return `−$1 500, +${f} фанатов, мораль команды +4`; } },
      { t: 'Не сейчас', sub: '', f: c => { S.fans = Math.max(0, S.fans - 80); return 'Фанаты немного разочарованы (−80)'; } },
    ],
  },
  {
    id: 'noise', ic: '🌙', title: 'Жалоба соседей',
    text: c => 'Соседи геймхауса жалуются: игроки орут в голосовой до 4 утра. Грозятся вызвать полицию и выписать штраф.',
    opts: [
      { t: 'Звукоизоляция ($2 500)', sub: 'Решить раз и навсегда', f: c => { S.money -= 2500; return '−$2 500. Тишина и покой'; } },
      { t: 'Ввести отбой в 1:00', sub: 'Режим полезен, но бесит', f: c => { all(c).forEach(p => { mor(p, -5); form(p, 2); }); return 'Мораль команды −5, форма +2'; } },
      { t: 'Игнорировать', sub: 'Может, обойдётся', f: c => { if (rnd() < 0.5) { S.money -= 4000; return 'Пришёл штраф −$4 000'; } return 'Соседи успокоились'; } },
    ],
  },
  {
    id: 'doc', ic: '🎬', title: 'Документалка о команде',
    text: c => `Известный блогер хочет снять сериал о сезоне ${S.org.name}. Камеры везде, даже на тренировках.`,
    opts: [
      { t: 'Да, это слава', sub: 'Фанаты +, химия −', f: c => { const f = ri(1200, 2500); S.fans += f; chem(c.t, -4); S.rep = cl(S.rep + 1); return `+${f} фанатов, репутация +1, химия −4`; } },
      { t: 'Нет, только игра', sub: '', f: c => { chem(c.t, 1); return 'Химия +1'; } },
    ],
  },
  {
    id: 'bootcamp', ic: '✈️', title: 'Приглашение на буткемп',
    pre: c => { c.fee = 4000 + c.t.tier * -1000 + 1000; },
    text: c => `Топ-команда зовёт на совместный буткемп в Европе: неделя скримов с сильнейшими. Перелёт и отель — ${$(c.fee)}.`,
    opts: [
      { t: c => `Ехать (${$(c.fee)})`, sub: 'Химия и подготовка, риск выгорания', f: c => { S.money -= c.fee; chem(c.t, 6); c.t.prac = c.t.prac.map(v => cl(v + 5, 10, 100)); if (rnd() < 0.3) { all(c).forEach(p => form(p, -2)); return `Химия +6, подготовка +5, но команда устала (форма −2)`; } return 'Химия +6, подготовка ко всем картам +5'; } },
      { t: 'Тренируемся дома', sub: '', f: c => 'Остаёмся в геймхаусе' },
    ],
  },
  {
    id: 'tilt', ic: '😤', title: 'Игрок в тильте',
    text: c => `${pnick(c.p)} сорвался на стриме: разбил клавиатуру и вышел из игры. Чат в восторге, а игрок — в раздрае.`,
    opts: [
      { t: 'Сессия с психологом ($1 000)', sub: 'Восстановит мораль', f: c => { S.money -= 1000; mor(c.p, 12); form(c.p, 1); return `−$1 000, ${pnick(c.p)} мораль +12`; } },
      { t: 'Строгий разговор', sub: 'Может собраться, может обидеться', f: c => { if (rnd() < 0.5) { form(c.p, 4); return `${pnick(c.p)} собрался: форма +4`; } mor(c.p, -10); return `${pnick(c.p)} обиделся: мораль −10`; } },
      { t: 'Пусть стримит клипы', sub: 'Хайп!', f: c => { const f = ri(200, 600); S.fans += f; form(c.p, -3); return `+${f} фанатов, форма ${pnick(c.p)} −3`; } },
    ],
  },
  {
    id: 'rookie', ic: '🌱', title: 'Новичок просит шанс',
    cond: c => !!c.bench,
    text: c => `${pnick(c.bench)} со скамейки говорит, что готов и хочет сыграть. Тренер считает, что ${pnick(c.p)} в основе выглядит устало.`,
    opts: [
      { t: c => `Дать шанс ${pnick(c.bench)}`, sub: 'Поменять местами', f: c => { const b = c.bench; b.bench = false; c.p.bench = true; mor(b, 12); mor(c.p, -6); return `${pnick(b)} в основе (мораль +12), ${pnick(c.p)} на скамейке`; } },
      { t: 'Пусть ждёт', sub: '', f: c => { mor(c.bench, -8); return `${pnick(c.bench)} мораль −8`; } },
    ],
  },
  {
    id: 'charity', ic: '💙', title: 'Благотворительный стрим',
    text: c => 'Фонд предлагает провести благотворительный марафон с командой. Денег не принесёт, но о вас заговорят.',
    opts: [
      { t: 'Провести', sub: 'Репутация и фанаты', f: c => { S.rep = cl(S.rep + 2); const f = ri(300, 800); S.fans += f; all(c).forEach(p => mor(p, 3)); return `Репутация +2, +${f} фанатов, мораль +3`; } },
      { t: 'Не в этот раз', sub: '', f: c => 'Пропустили' },
    ],
  },
];

// ---- генерация ----
export function rollEvent(force) {
  if (!S || !Object.keys(S.divs).length) return null;
  S.evq = S.evq || [];
  if (S.evq.length >= 2) return null;
  if (!force && rnd() > 0.5) return null;
  const recent = (S.evHist || []).slice(-5);
  const d = pick(Object.keys(S.divs)); const t = userTeam(d); const sp = starters(t); if (sp.length < 2) return null;
  const sh = sp.slice().sort(() => rnd() - 0.5); const p = sh[0], p2 = sh[1];
  const bench = t.roster.map(i => S.players[i]).filter(x => x && x.bench && x.role === p.role)[0] || null;
  const ctx = { d, t, p, p2, bench, psych: staffSk('psych') };
  const cand = EVENT_DEFS.filter(e => !recent.includes(e.id) && (!e.cond || e.cond(ctx)));
  if (!cand.length) return null;
  const e = pick(cand);
  const rec = { id: e.id, d, p: p.id, p2: p2.id, b: bench ? bench.id : null, w: S.week, s: S.season };
  if (e.pre) e.pre(ctx); rec.fee = ctx.fee; rec.raise = ctx.raise;
  S.evq.push(rec); S.evHist = recent.concat(e.id);
  return rec;
}
export function eventCtx(rec) {
  const t = userTeam(rec.d); if (!t) return null;
  const p = S.players[rec.p], p2 = S.players[rec.p2]; if (!p || !p2 || p.team !== t.id || p2.team !== t.id) return null;
  const bench = rec.b ? S.players[rec.b] : null;
  const def = EVENT_DEFS.find(e => e.id === rec.id); if (!def) return null;
  return { def, c: { d: rec.d, t, p, p2, bench: bench && bench.team === t.id ? bench : null, fee: rec.fee, raise: rec.raise, psych: staffSk('psych') } };
}
export function optLabel(o, c) { const s = typeof o.t === 'function' ? o.t(c) : o.t; return s.replace('{p}', pnick(c.p)); }
export function resolveEvent(rec, i) {
  S.evq = (S.evq || []).filter(x => x !== rec);
  const x = eventCtx(rec); if (!x) return null;
  const o = x.def.opts[i]; const res = o.f(x.c);
  news(x.def.ic + ' ' + x.def.title + ': ' + optLabel(o, x.c).toLowerCase() + ' — ' + res);
  return res;
}
export function pendingEvents() { S.evq = (S.evq || []).filter(r => eventCtx(r)); return S.evq; }
