// Пресс-конференции: вопросы журналистов до и после матча, ответы влияют на фанатов, репутацию и настрой команд.
import { S, teamOf, userTeam, starters, tname, pnick, pack, ovr, teamOvr, clamp, rnd, pick, news } from './game';

const JOUR = ['HLTV.ru', 'Cybersport Daily', 'Esports Insider', 'Dust2 Weekly', 'The Spike', 'Liquipedia Talk', 'Game Pulse', 'Респаун'];
const mor = (t, n) => starters(t).forEach(p => { p.mor = clamp(p.mor + n, 0, 100); });
const fans = n => { S.fans = Math.max(0, S.fans + n); };
const rep = n => { S.rep = clamp(S.rep + n, 0, 100); };
const press = (t, n) => { t.press = clamp((t.press || 0) + n, -3, 3); };

function ctxFor(d, m, kind, won) {
  const ut = userTeam(d); const opp = teamOf(d, m.a === ut.id ? m.b : m.a);
  const sp = starters(ut); const star = sp.slice().sort((a, b) => ovr(b) - ovr(a))[0]; const weak = sp.slice().sort((a, b) => ovr(a) - ovr(b))[0];
  const last = ut.last || []; const streakW = last.slice(-3).every(x => x === 'W') && last.length >= 3; const streakL = last.slice(-3).every(x => x === 'L') && last.length >= 3;
  return { d, m, ut, opp, star, weak, kind, won, fav: teamOvr(ut) >= teamOvr(opp) + 2, under: teamOvr(opp) >= teamOvr(ut) + 3, streakW, streakL, final: !!(m.po || m.wc), score: m.res ? (m.a === ut.id ? m.res.sa + ':' + m.res.sb : m.res.sb + ':' + m.res.sa) : '' };
}

// Вопросы: when(c) → подходит ли, q(c) → текст, a: [текст, эффект]
const PRE = [
  { when: c => c.under, q: c => `${tname(c.opp)} — явные фавориты. Есть хоть какие-то шансы?`, a: [
    ['«Фавориты проигрывают каждый день. Мы приехали забирать.»', c => { fans(120); press(c.ut, 1); press(c.opp, 1); return 'Фанаты в восторге, но соперник завёлся'; }],
    ['«Они сильнее, но мы готовы удивить.»', c => { mor(c.ut, 3); return 'Команда спокойна и собрана'; }],
    ['«Для нас это опыт. Посмотрим, на что способны.»', c => { press(c.ut, -1); rep(0.3); return 'Звучит скромно — игроки немного расслабились'; }]] },
  { when: c => c.fav, q: c => `Вы фавориты против ${tname(c.opp)}. Не боитесь недооценить соперника?`, a: [
    ['«Честно? Это будет быстро.»', c => { fans(80); press(c.opp, 2); return 'Соперник получил мотивацию'; }],
    ['«Уважаем всех. Играем каждую карту как финал.»', c => { press(c.ut, 1); rep(0.5); return 'Правильные слова — команда сфокусирована'; }],
    ['«Фавориты — это для букмекеров.»', c => { rep(0.2); return 'Нейтрально'; }]] },
  { when: c => c.streakL, q: c => 'Три поражения подряд. В команде кризис?', a: [
    ['«Кризис — громкое слово. Мы работаем.»', c => { mor(c.ut, 2); return 'Игроки чувствуют поддержку'; }],
    ['«Да, мы недовольны. Будут выводы.»', c => { press(c.ut, 1); mor(c.ut, -3); return 'Давление выросло: собрались, но нервничают'; }],
    ['«Спросите у судей и пинга.»', c => { rep(-1); fans(-60); return 'Отговорки не понравились фанатам'; }]] },
  { when: c => c.streakW, q: c => 'Серия побед! Вы уже лучшая команда лиги?', a: [
    ['«Да. И это только начало.»', c => { fans(150); press(c.opp, 1); return 'Хайп! Но все хотят вас обыграть'; }],
    ['«Каждый матч с нуля. Голова холодная.»', c => { press(c.ut, 1); return 'Команда не зазнаётся'; }],
    ['«Спасибо фанатам, без них никак.»', c => { fans(90); rep(0.5); return 'Фанаты оценили'; }]] },
  { when: c => !!c.star, q: c => `${pnick(c.star)} в отличной форме. Это ваш главный козырь?`, a: [
    [c => `«${pnick(c.star)} — лучший на своей позиции. Точка.»`, c => { c.star.mor = clamp(c.star.mor + 8, 0, 100); mor(c.ut, -1); return `${pnick(c.star)} доволен, остальные чуть ревнуют`; }],
    ['«У нас пять козырей, а не один.»', c => { mor(c.ut, 3); return 'Команда оценила'; }],
    ['«Без комментариев о лицах — играет команда.»', c => 'Нейтрально'] ] },
  { when: c => c.final, q: c => 'Финал. Чувствуете давление?', a: [
    ['«Давление — это привилегия.»', c => { press(c.ut, 1); rep(0.6); return 'Хорошая фраза, её цитируют'; }],
    ['«Мы здесь, чтобы поднять трофей.»', c => { fans(200); press(c.opp, 1); return 'Громкое заявление'; }],
    ['«Стараемся не думать о ставках.»', c => { mor(c.ut, 2); return 'Игроки расслабились'; }]] },
  { when: c => true, q: c => `Ваш прогноз на матч с ${tname(c.opp)}?`, a: [
    [c => `«${c.m.bo === 1 || !c.m.bo ? 'Победа' : '2:0'}, без вариантов.»`, c => { fans(70); press(c.opp, 1); return 'Смело'; }],
    ['«Будет тяжёлая серия, но мы готовы.»', c => { press(c.ut, 1); return 'Команда настроена'; }],
    ['«Прогнозы оставлю аналитикам.»', c => 'Нейтрально']] },
  { when: c => true, q: c => 'Говорят, вы слабо готовились к этому матчу. Правда?', a: [
    ['«Слухи — это не наш уровень.»', c => { rep(0.3); return 'Тема закрыта'; }],
    ['«Мы готовили сюрприз. Увидите.»', c => { fans(60); press(c.opp, 1); return 'Соперник насторожился'; }],
    ['«Откуда у вас такая информация?!»', c => { rep(-0.8); mor(c.ut, -2); return 'Вспылили — в соцсетях мемы'; }]] },
];
const POST = [
  { when: c => c.won && c.under, q: c => `Сенсация! Как удалось обыграть ${tname(c.opp)}?`, a: [
    ['«Никакой сенсации. Мы просто лучше.»', c => { fans(250); rep(0.8); return 'Громко — фанаты в восторге'; }],
    ['«Ребята выложились на 200%. Горжусь.»', c => { mor(c.ut, 5); return 'Команда на подъёме'; }],
    ['«Удача тоже была на нашей стороне.»', c => { rep(0.5); return 'Скромность оценили'; }]] },
  { when: c => c.won, q: c => `Победа ${c.score}. Что было ключом?`, a: [
    ['«Подготовка. Мы разобрали их до винтика.»', c => { rep(0.4); return 'Звучит профессионально'; }],
    [c => `«${pnick(c.star)} сегодня был нереален.»`, c => { c.star.mor = clamp(c.star.mor + 6, 0, 100); return `${pnick(c.star)} доволен`; }],
    ['«Фанаты! Мы слышали каждый крик.»', c => { fans(120); return 'Фанаты оценили'; }]] },
  { when: c => !c.won && c.fav, q: c => `Неожиданное поражение ${c.score}. Что пошло не так?`, a: [
    ['«Беру ответственность на себя.»', c => { mor(c.ut, 4); rep(0.4); return 'Игроки благодарны за защиту'; }],
    [c => `«${pnick(c.weak)} сегодня подвёл.»`, c => { c.weak.mor = clamp(c.weak.mor - 15, 0, 100); mor(c.ut, -2); return `${pnick(c.weak)} раздавлен, в команде напряжение`; }],
    ['«Просто не наш день. Разберём ошибки.»', c => 'Нейтрально']] },
  { when: c => !c.won, q: c => `Поражение ${c.score}. Как настроение?`, a: [
    ['«Злые. Следующий соперник ответит за это.»', c => { press(c.ut, 1); fans(40); return 'Команда горит реваншем'; }],
    ['«Нормально. Это процесс, мы растём.»', c => { mor(c.ut, 2); return 'Спокойно'; }],
    ['«Без комментариев.»', c => { rep(-0.5); return 'Журналисты недовольны'; }]] },
  { when: c => !c.won && c.streakL, q: c => 'Фанаты требуют отставки тренера. Ваше слово?', a: [
    ['«Тренер остаётся. Я ему доверяю.»', c => { mor(c.ut, 3); fans(-80); return 'Команда сплотилась, часть фанатов против'; }],
    ['«Все варианты на столе.»', c => { mor(c.ut, -4); fans(60); return 'Давление на команду выросло'; }],
    ['«Решения принимаю я, а не твиттер.»', c => { rep(-0.5); return 'Резко, но по делу'; }]] },
];
export function rollPress(d, m, kind, won) {
  if (!S || !S.divs[d]) return null;
  const c = ctxFor(d, m, kind, won); const pool = (kind === 'pre' ? PRE : POST).filter(x => x.when(c));
  if (!pool.length) return null;
  const qs = []; const p = pool.slice(); while (qs.length < 2 && p.length) { const i = Math.floor(rnd() * Math.min(p.length, qs.length ? p.length : 3)); qs.push(p.splice(i, 1)[0]); }
  return { c, qs, jour: pick(JOUR) };
}
export function answerText(a, c) { return typeof a[0] === 'function' ? a[0](c) : a[0]; }
export function questionText(q, c) { return q.q(c); }
export function applyAnswer(P, qi, ai) { const a = P.qs[qi].a[ai]; const r = a[1](P.c); return r; }
export function pressDone(P, picks) { news('🎤 Пресс-конференция ' + (P.c.kind === 'pre' ? 'перед матчем' : 'после матча') + ' с ' + tname(P.c.opp) + ': ' + picks.join(' · ')); }
