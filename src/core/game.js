// ===== DATA: fictional default pack =====
const DISC_ORDER = ['cs', 'dota', 'dl', 'rl', 'fc'];
const H = (n, r, s) => ({ n, r, s });
const FAKE = {
  cs: {
    game: 'Strike Ops', kind: 'fps', size: 5, color: '#ff8a1f', icon: '🎯',
    roles: ['IGL', 'AWP', 'Entry', 'Rifler', 'Support'],
    maps: ['Dustline', 'Ironworks', 'Harborside', 'Sunken Temple', 'Reactor', 'Citadel', 'Old Town'],
    leagues: ['Strike Pro League', 'Strike Challenger', 'Strike Open Circuit'],
    major: 'Strike Ops Major', unlock: 100000
  },
  dota: {
    game: 'Ancients Clash', kind: 'moba', size: 5, bossAt: 15, color: '#e8433a', icon: '⚔️',
    roles: ['Carry', 'Mid', 'Offlane', 'Soft Sup', 'Hard Sup'],
    boss: 'Колосс', base: 'Древний', towers: 11,
    heroes: [
      H('Ashblade', [0], 'l'), H('Duskreaver', [0], 'l'), H('Ironfang', [0, 2], 'm'), H('Gloomstalker', [0], 'l'),
      H('Sunlancer', [0, 1], 'm'), H('Mirrorknight', [0], 'l'), H('Bloodhowl', [0, 2], 'e'), H('Riftwalker', [0, 1], 'l'),
      H('Storm Arcanist', [1], 'm'), H('Emberlord', [1], 'm'), H('Voidseer', [1, 0], 'l'), H('Shadowjester', [1, 3], 'e'),
      H('Frostsinger', [1], 'm'), H('Plaguebinder', [1, 2], 'm'), H('Thunderpriest', [1, 3], 'e'), H('Glasswitch', [1], 'm'),
      H('Ironhide', [2], 'm'), H('Stonebreaker', [2], 'e'), H('Warhulk', [2], 'm'), H('Thornwarden', [2, 3], 'm'),
      H('Ravager', [2], 'e'), H('Brinekeeper', [2], 'm'), H('Doomforge', [2], 'l'), H('Wildcaller', [2, 3], 'm'),
      H('Mistweaver', [3], 'e'), H('Gale Hunter', [3, 4], 'e'), H('Hexdancer', [3], 'm'), H('Spiritfox', [3], 'e'),
      H('Bonecaller', [3, 4], 'm'), H('Skybinder', [3], 'm'), H('Lanternwisp', [3, 4], 'e'), H('Ripplemage', [3, 1], 'm'),
      H('Dawnmender', [4], 'm'), H('Frostmother', [4], 'e'), H('Oathkeeper', [4, 3], 'm'), H('Moonsage', [4], 'e'),
      H('Rootshaper', [4], 'm'), H('Lifeweaver', [4], 'l'), H('Shieldbearer', [4, 3], 'e'), H('Soulchime', [4], 'm')
    ],
    leagues: ['Ancients Pro Circuit', 'Ancients Division II', 'Ancients Open Ladder'],
    major: 'The Ancient Championship', unlock: 150000
  },
  dl: {
    game: 'Shadow Precinct', kind: 'moba', size: 6, color: '#c9a25c', icon: '🌃',
    roles: ['Gun Carry', 'Tank', 'Spirit Carry', 'Assassin', 'Support', 'Initiator'],
    boss: 'Страж Перекрёстка', base: 'Покровитель', towers: 11, bossAt: 12, lanes: 3,
    heroes: [
      H('Mistblade', [0], 'l'), H('Powderkeg', [0], 'm'), H('Dunewisp', [0, 3], 'm'), H('Huntsman Vor', [0], 'm'), H('Ravenwing', [0], 'l'), H('Serpentine', [0], 'm'), H('Cardshark', [0, 2], 'l'),
      H('Bulwark', [1], 'm'), H('Burrower Duo', [1, 5], 'e'), H('Sewer Monarch', [1], 'm'), H('Galvanic', [1], 'm'), H('Ironwatch', [1], 'm'),
      H('Starlet', [2], 'm'), H('Gravecaller', [2], 'm'), H('Skyarrow', [2, 0], 'l'), H('Bloodmist', [2], 'm'), H('Nocturna', [2, 3], 'l'), H('Stormvolt', [2], 'l'),
      H('Sunblade', [3], 'm'), H('Shadecat', [3], 'm'), H('Nightdrift', [3], 'm'), H('Satchel', [3, 2], 'e'), H('Razorback', [3, 0], 'm'), H('Quicksilver', [3], 'm'), H('Crimson Edge', [3], 'm'),
      H('Singularis', [4, 5], 'm'), H('Stonebloom', [4], 'e'), H('Frostbinder', [4], 'm'), H('Turretmaster', [4, 0], 'm'), H('Inkknight', [4], 'm'), H('Dreamweaver', [4], 'm'), H('Goo Golem', [4, 1], 'm'), H('Field Medic', [4], 'm'),
      H('Gearhook', [5, 1], 'e'), H('Chainfist', [5], 'e'), H('Wraithwalker', [5], 'm'), H('Cinderman', [5, 0], 'm'), H('Skylash', [5], 'e'), H('Hexmother', [5], 'm'), H('Gatekeeper', [5, 4], 'm'), H('Timesplitter', [5], 'm'), H('Illusionist', [5], 'm'), H('Pharaoh', [5], 'm'), H('Chromacaster', [5], 'm')
    ],
    leagues: ['Precinct Pro Circuit', 'Precinct Contenders', 'Precinct Open'],
    major: 'Precinct Invitational', unlock: 120000
  },
  rl: {
    game: 'Turbo Strikers', kind: 'ball', size: 3, color: '#2fb6ff', icon: '🚗',
    roles: ['Striker', 'Playmaker', 'Anchor'],
    maps: ['Neon Dome', 'Sky Harbor', 'Rust Yard', 'Aurora Park', 'Cobalt Bay', 'Solar Pit', 'Frost Arena'],
    leagues: ['Turbo Pro Series', 'Turbo Challenger', 'Turbo Open'],
    major: 'Turbo World Finals', unlock: 80000
  },
  fc: {
    game: 'Ultimate Pitch 27', kind: 'duel', size: 2, color: '#3ddc84', icon: '⚽',
    roles: ['Атакующий', 'Тактик'],
    maps: ['Стадион А', 'Стадион Б', 'Стадион В', 'Стадион Г', 'Стадион Д', 'Стадион Е', 'Стадион Ж'],
    leagues: ['Pitch Pro League', 'Pitch Division Two', 'Pitch Open'],
    major: 'Pitch World Cup', unlock: 60000
  }
};

const COUNTRIES = [
  ['UA', '🇺🇦', 'Украина'], ['PL', '🇵🇱', 'Польша'], ['DE', '🇩🇪', 'Германия'], ['FR', '🇫🇷', 'Франция'], ['SE', '🇸🇪', 'Швеция'],
  ['DK', '🇩🇰', 'Дания'], ['FI', '🇫🇮', 'Финляндия'], ['BR', '🇧🇷', 'Бразилия'], ['US', '🇺🇸', 'США'], ['CA', '🇨🇦', 'Канада'],
  ['KZ', '🇰🇿', 'Казахстан'], ['CN', '🇨🇳', 'Китай'], ['KR', '🇰🇷', 'Корея'], ['PH', '🇵🇭', 'Филиппины'], ['PE', '🇵🇪', 'Перу'],
  ['TR', '🇹🇷', 'Турция'], ['ES', '🇪🇸', 'Испания'], ['PT', '🇵🇹', 'Португалия'], ['CZ', '🇨🇿', 'Чехия'], ['SK', '🇸🇰', 'Словакия'],
  ['BA', '🇧🇦', 'Босния'], ['RS', '🇷🇸', 'Сербия'], ['LV', '🇱🇻', 'Латвия'], ['EE', '🇪🇪', 'Эстония'], ['IL', '🇮🇱', 'Израиль'],
  ['MN', '🇲🇳', 'Монголия'], ['AU', '🇦🇺', 'Австралия'], ['JP', '🇯🇵', 'Япония'], ['AR', '🇦🇷', 'Аргентина'], ['GB', '🇬🇧', 'Британия'],
  ['NO', '🇳🇴', 'Норвегия'], ['BE', '🇧🇪', 'Бельгия'], ['NL', '🇳🇱', 'Нидерланды'], ['MY', '🇲🇾', 'Малайзия'], ['ID', '🇮🇩', 'Индонезия'],
  ['BG', '🇧🇬', 'Болгария'], ['RO', '🇷🇴', 'Румыния'], ['HU', '🇭🇺', 'Венгрия'], ['LT', '🇱🇹', 'Литва'], ['GE', '🇬🇪', 'Грузия'],
  ['VN', '🇻🇳', 'Вьетнам'], ['TH', '🇹🇭', 'Таиланд'], ['SG', '🇸🇬', 'Сингапур'], ['CL', '🇨🇱', 'Чили'], ['IT', '🇮🇹', 'Италия'],
  ['RU', '🇷🇺', 'Россия'], ['BY', '🇧🇾', 'Беларусь'], ['UZ', '🇺🇿', 'Узбекистан'], ['MK', '🇲🇰', 'Сев. Македония'], ['JO', '🇯🇴', 'Иордания'], ['XK', '🇽🇰', 'Косово'], ['BO', '🇧🇴', 'Боливия'], ['MA', '🇲🇦', 'Марокко'], ['SA', '🇸🇦', 'Сауд. Аравия'], ['PK', '🇵🇰', 'Пакистан'], ['NZ', '🇳🇿', 'Нов. Зеландия']
];
const FLAG = {}; COUNTRIES.forEach(c => FLAG[c[0]] = c[1]);
const CC_WEIGHTED = ['UA','UA','UA','PL','PL','DE','FR','FR','SE','DK','DK','FI','BR','BR','US','US','CA','KZ','CN','CN','KR','KR','PH','PE','TR','ES','PT','CZ','SK','BA','RS','LV','EE','IL','MN','AU','JP','AR','GB','NO','BE','NL','MY','ID','BG','RO','HU','LT','GE','VN','TH','SG','CL','IT','UZ','MK','JO'];

const NICK_A = ['vex','kra','zyn','lumo','nox','kito','shade','frost','blitz','raze','jinx','tox','pyro','echo','dusk','fang','glitch','hex','ion','juno','kai','lynx','mako','nero','onyx','pix','quill','rift','sly','tek','umbra','volt','wisp','xeno','yuki','zed','arc','bolt','crux','drift','ember','flux','grim','haze','iris','jolt','kode','loki','mint','nyx','orb','prime','rune','sonic','tidal','vandal','warp','zeph','bane','cobra','dex','fizz','gale','hydra','ice','jett0','kraken','lazr','mirth','neo','opal','punk','rogue','spark','trix','vibe','wolf','yeti','ziggy','ronin','sniper','skye','storm','tank','viper','wraith','zero','hawk','mamba','cypher','reaper','bandit','ghost','chill','razor','stark','jaxx','fury','pulse','nova','orion','titan','axel','boris','fenix','kuro','sora','taro','miko','yami','rei'];
const NICK_SUF = ['', '', '', '', '', 'x', 'z', '1', '0', 'o', 'y', 'ix', 'er', '_', 'ka', 'ty', 'ex', 'on', '7', '9'];
const FIRST = ['Олег','Дмитро','Максим','Артем','Іван','Андрій','Богдан','Кирило','Микита','Владислав','Lucas','Mateus','Jonas','Erik','Mads','Oskar','Kevin','Ryan','Tyler','Jake','Wei','Hao','Min-jun','Ji-ho','Pedro','Diego','Mehmet','Emre','Paweł','Kacper','Tomáš','Jan','Nikola','Marko','Aleks','Timur','Daniel','Leon','Felix','Hugo','Mathis','Arnav','Kenji','Haruto','Bilal','Omar','Luca','Matteo','Sergio','Nils'];
const LAST = ['Kovalenko','Shevchenko','Bondar','Melnyk','Tkachenko','Kowalski','Nowak','Müller','Schmidt','Martin','Bernard','Larsen','Nielsen','Lindqvist','Virtanen','Silva','Santos','Smith','Johnson','Brown','Wang','Li','Kim','Park','Garcia','Lopez','Yılmaz','Kaya','Novák','Horvat','Petrović','Ivanov','Dubois','Rossi','Costa','Tanaka','Sato','Lee','Nguyen','Popescu'];

const TEAM_A = ['Neon','Iron','Shadow','Crimson','Void','Arctic','Solar','Nova','Rogue','Apex','Titan','Phantom','Storm','Obsidian','Quantum','Vortex','Royal','Wild','Cyber','Ember','Static','Lunar','Silent','Rapid','Golden','Frost','Scarlet','Hyper','Black','Electric','Atomic','Savage','Mystic','Primal','Stellar','Toxic'];
const TEAM_B = ['Wolves','Esports','Gaming','Syndicate','Reapers','Dynasty','Legion','Raptors','Vipers','Collective','Five','Unit','Clan','Owls','Hydra','Pulse','Squad','Kings','Ronin','Comets','Sharks','Bears','Order','Union','Rebels','Monarchs','Knights','Spectres','Panthers','Foxes','Ravens','Titans','Hornets','Cobras','Dragons','Lions'];
const TEAM_COLORS = ['#ff3b5c','#ffb020','#2ecc71','#3fa9f5','#a66cff','#ff6b2b','#00d4c8','#f5e663','#ff5fa2','#7cf75c','#5c7cff','#e8e8e8','#c0392b','#16a085','#d35400','#8e44ad','#2980b9','#f39c12','#1abc9c','#e84393'];

const SPONSOR_NAMES = ['VoltByte Energy','Nebula Peripherals','Kraken Seats','ArcLight Bank','Pixel Pizza','Zenith Mobile','Quantum PCs','SkyRoute Airlines','Frostbyte Drinks','Monolith Mice','Raven Audio','Hexa Hosting','Orbit Monitors','Blaze Noodles','Titan Tires','Lumen VPN','Granite Insurance','Pulse Fitness','Echo Headsets','Comet Couriers','Nimbus Cloud','Vanta Apparel','Stellar Snacks','Crux Keyboards'];

const STAFF_TYPES = {
  coach:   { n: 'Главный тренер', i: '🧠', div: true,  d: 'Рост игроков на тренировках и бонус к силе в матче' },
  analyst: { n: 'Аналитик', i: '📊', div: true,  d: 'Прокачка карт/героев, лучше вето и драфт' },
  psych:   { n: 'Психолог', i: '🧘', div: false, d: 'Мораль и стабильность формы всех игроков' },
  scout:   { n: 'Скаут', i: '🔭', div: false, d: 'Точная оценка потенциала, находит таланты в академию' },
  media:   { n: 'Медиа-менеджер', i: '📸', div: false, d: 'Рост фанатов и доход со стримов' },
  biz:     { n: 'Бизнес-менеджер', i: '💼', div: false, d: 'Более щедрые спонсорские предложения' },
  fitness: { n: 'Тренер по физподготовке', i: '💪', div: false, d: 'Замедляет спад формы с возрастом, меньше усталость' },
  youth:   { n: 'Тренер молодёжки', i: '🌱', div: false, d: 'Быстрее растут игроки молодёжного состава' },
  agent:   { n: 'Трансферный директор', i: '🤝', div: false, d: 'Дешевле покупки и аренды, дороже продажи' }
};

const FACILITIES = {
  house:   { n: 'Геймхаус', i: '🏠', base: 8000,  d: 'Больше очков тренировок за неделю и рост игроков' },
  studio:  { n: 'Стрим-студия', i: '🎥', base: 6000,  d: 'Больше медиа-дохода за неделю' },
  analytics:{ n: 'Аналитический центр', i: '🖥️', base: 10000, d: 'Быстрее растёт знание карт и героев' },
  marketing:{ n: 'Медиа-отдел', i: '📣', base: 7000,  d: 'Больше новых фанатов за победы' },
  wellness:{ n: 'Wellness-зона', i: '🧖', base: 9000,  d: 'Мораль быстрее восстанавливается' },
  server:  { n: 'Скрим-сервера', i: '🗄️', base: 5000,  d: 'Быстрее растёт знание карт и героев на скримах' },
  academy: { n: 'Академия', i: '🎓', base: 15000, d: 'Талантливее молодёжь, быстрее растёт молодёжный состав' },
  office:  { n: 'Офис', i: '🏢', base: 20000, d: 'Больше дивизионов (1 + 1 за каждые 2 уровня), +1 слот спонсора за 3 уровня, рост репутации' }
};

// Season calendar
const SEASON_WEEKS = 20;
// хуки для модулей прогресса (рейтинги, ачивки, карьера)
const HOOKS = { match: [], week: [], season: [] };
function onHook(k, f) { HOOKS[k].push(f); }
function fire(k, ...a) { HOOKS[k].forEach(f => { try { f(...a); } catch (e) { } }); }
// Свободные агенты: в основном середняки; сильные — редкость, чаще возрастные ветераны
function faPlayer(d) { const vet = rnd() < 0.07; const lvl = vet ? ri(58, 66) : Math.round(38 + 20 * Math.pow(rnd(), 1.6)); return genPlayer(d, ri(0, FAKE[d].size - 1), lvl, vet ? [28, 33] : [17, 27]); }
function phaseOf(w) {
  if (w <= 14) return { k: 'league', n: 'Регулярный сезон', r: w };
  if (w === 15) return { k: 'po', n: 'Плей-офф · полуфиналы', r: 1 };
  if (w === 16) return { k: 'po', n: 'Плей-офф · финал', r: 2 };
  if (w === 17) return { k: 'wc', n: 'Мейджор · четвертьфиналы', r: 1 };
  if (w === 18) return { k: 'wc', n: 'Мейджор · полуфиналы', r: 2 };
  if (w === 19) return { k: 'wc', n: 'Мейджор · гранд-финал', r: 3 };
  return { k: 'off', n: 'Межсезонье', r: 0 };
}

// ===== ENGINE =====
export let S = null;
export function setS(x) { S = x; }
const rnd = Math.random;
const ri = (a, b) => Math.floor(a + rnd() * (b - a + 1));
const pick = a => a[Math.floor(rnd() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
const sig = x => 1 / (1 + Math.exp(-x));
function wpick(arr, wf) { let t = 0; const w = arr.map(x => { const v = Math.max(0.0001, wf(x)); t += v; return v; }); let r = rnd() * t; for (let i = 0; i < arr.length; i++) { r -= w[i]; if (r <= 0) return arr[i]; } return arr[arr.length - 1]; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const nid = () => ++S.nextId;

// ---- pack / naming (patch-aware) ----
function pack(d) { const f = FAKE[d]; const p = S && S.patchOn && S.patchData && S.patchData.disciplines && S.patchData.disciplines[d]; if (!p) return f; return Object.assign({}, f, { game: p.game || f.game, maps: p.maps && p.maps.length >= 7 ? p.maps : f.maps, leagues: p.leagues || f.leagues, major: p.major || f.major, boss: p.boss || f.boss, base: p.base || f.base }); }
function heroList(d) { const f = FAKE[d].heroes || []; const p = S && S.patchOn && S.patchData && S.patchData.disciplines[d]; const ph = p && p.heroes; if (!ph) return f; const n = Math.max(f.length, ph.length); const out = []; for (let i = 0; i < n; i++) { const h = f[i] || { r: [0], s: 'm' }; out.push(ph[i] ? { n: ph[i].n, r: ph[i].r || h.r, s: ph[i].s || h.s } : h); } return out; }
function heroName(d, i) { const l = heroList(d); return l[i] ? l[i].n : '?'; }
function mapName(d, i) { return pack(d).maps[i]; }
function tname(t) { return S.patchOn && t.real ? t.real.name : t.fake.name; }
function ttag(t) { return S.patchOn && t.real ? t.real.tag : t.fake.tag; }
function pnick(p) { return S.patchOn && p.rn ? p.rn : p.nk; }
function pcc(p) { return S.patchOn && p.rcc ? p.rcc : p.cc; }

// ---- generation ----
function genNick() { let n = pick(NICK_A) + pick(NICK_SUF); if (rnd() < 0.15) n = n.replace(/o/g, '0').replace(/i/g, '1'); if (rnd() < 0.35) n = n[0].toUpperCase() + n.slice(1); return n; }
function genTeamName(used) { for (let k = 0; k < 200; k++) { const a = pick(TEAM_A), b = pick(TEAM_B); const n = b === 'Five' || b === 'Esports' || b === 'Gaming' ? a + ' ' + b : a + ' ' + b; if (!used.has(n)) { used.add(n); let tag = (a.slice(0, 2) + b[0]).toUpperCase(); return { name: n, tag }; } } return { name: 'Team ' + ri(100, 999), tag: 'T' + ri(10, 99) }; }

function genPlayer(d, role, level, ageR) {
  const age = ageR ? ri(ageR[0], ageR[1]) : ri(17, 29);
  const b = level + gauss() * 5;
  const st = () => clamp(Math.round(b + gauss() * 7), 25, 97);
  const p = { id: nid(), d, nk: genNick(), rn: null, cc: pick(CC_WEIGHTED), rcc: null, role, age, mech: st(), iq: st(), tw: st(), cl: st(), con: st(), form: 0, mor: 70, ctr: ri(1, 3), team: null, xp: {}, st: newStats(), car: newStats(), chem: 0, talked: 0, bench: false, trophies: 0 };
  if (role === 1 && FAKE[d].kind === 'fps' && d === 'cs') p.mech = clamp(p.mech + 4, 25, 97);
  if (role === 0 && d === 'cs') p.iq = clamp(p.iq + 6, 25, 97);
  const youth = age <= 19 ? 14 : age <= 22 ? 9 : age <= 25 ? 4 : 0;
  p.pot = clamp(Math.round(ovr(p) + youth + Math.abs(gauss()) * 10), ovr(p), 99);
  genPool(p);
  p.sal = salaryFor(p);
  return p;
}
function genPool(p) {
  const list = heroList(p.d);
  p.pool = [];
  if (!list.length) { return; }
  const fit = list.map((h, i) => [i, h]).filter(([i, h]) => h.r.includes(p.role));
  const other = list.map((h, i) => [i, h]).filter(([i, h]) => !h.r.includes(p.role));
  shuffle(fit); shuffle(other);
  const n = FAKE[p.d].kind === 'moba' ? ri(4, 6) : ri(2, 3);
  fit.slice(0, n).forEach(([i]) => p.pool.push([i, clamp(Math.round(ovr(p) + gauss() * 12), 30, 99)]));
  if (rnd() < 0.5 && other.length) p.pool.push([other[0][0], clamp(Math.round(ovr(p) - 10 + gauss() * 10), 25, 95)]);
}
function newStats() { return { mp: 0, k: 0, d: 0, a: 0, rt: 0, mvp: 0, w: 0 }; }
function ovr(p) { return Math.round(p.mech * 0.35 + p.iq * 0.25 + p.tw * 0.15 + p.cl * 0.12 + p.con * 0.13); }
// Ответ на просьбу о повышении: 'accept' — до рыночной, 'reject' — отказ.
function answerRaise(p, how) {
  if (!p.wantRaise) return null;
  if (how === 'accept') { p.sal = raiseTarget(p); p.wantRaise = false; p.raiseCD = 12; p.mor = clamp(p.mor + 12, 0, 100); return pnick(p) + ': новая зарплата $' + fmt(p.sal) + '/нед, игрок доволен'; }
  p.wantRaise = false; p.raiseCD = 8; p.mor = clamp(p.mor - 10, 0, 100); return pnick(p) + ' расстроен отказом (−мораль), вернётся к вопросу позже';
}
function salaryFor(p) { const o = ovr(p); return Math.max(150, Math.round(Math.pow(Math.max(1, (o - 35) / 10), 2.5) * 80 / 10) * 10); }
function valueOf(p) { const af = p.age <= 20 ? 1.6 : p.age <= 23 ? 1.35 : p.age <= 26 ? 1.1 : p.age <= 29 ? 0.8 : 0.5; const pf = 1 + Math.max(0, p.pot - ovr(p)) / 40; return Math.round(salaryFor(p) * 30 * af * pf / 100) * 100; }
function alignOvr(p, target) { for (let k = 0; k < 40; k++) { const o = ovr(p); if (Math.abs(o - target) < 1) break; const dlt = target > o ? 1 : -1;['mech', 'iq', 'tw', 'cl', 'con'].forEach(a => p[a] = clamp(p[a] + dlt, 25, 99)); } p.pot = Math.min(99, ovr(p) + (p.age < 21 ? 5 : p.age < 24 ? 3 : 1)); p.pool.forEach(x => x[1] = clamp(Math.round(ovr(p) + gauss() * 8), 30, 99)); p.sal = salaryFor(p); }

function genStaff(type, d, lvl) {
  const sk = clamp(Math.round(lvl + gauss() * 4), 1, 20);
  return { id: nid(), type, d: STAFF_TYPES[type].div ? d : null, name: pick(FIRST) + ' ' + pick(LAST), cc: pick(CC_WEIGHTED), sk, sal: Math.round((80 + sk * sk * 9) / 10) * 10, age: ri(26, 55) };
}

function teamColor() { return pick(TEAM_COLORS); }

function newCareer(opts) {
  S = { v: 3, nextId: 1, org: { name: opts.name, tag: opts.tag.toUpperCase().slice(0, 4), c1: opts.c1, c2: opts.c2, logo: opts.logo || null }, money: 60000, fans: 800, rep: 5, season: 1, week: 1, created: Date.now(), lastTick: Date.now(), tp: 50, patchOn: !!opts.patchOn, patchData: opts.patchData || null,
    divs: {}, world: {}, players: {}, staff: {}, fac: { house: 0, studio: 0, analytics: 0, marketing: 0, wellness: 0, server: 0, academy: 0, office: 1 }, tOffers: [], inbox: [], negot: {}, sponsors: [], offers: [], staffMarket: [], news: [], trophies: [], fin: [], auto: false, cd: { scrim: 0, stream: 0 }, creators: [], events: [], weekLog: null, meta: {}, stats: { wins: 0, losses: 0, maps: 0 } };
  DISC_ORDER.forEach(d => buildWorld(d));
  unlockDivision(opts.disc, true);
  genOffers(); genStaffMarket();
  news('🏁 Организация ' + S.org.name + ' основана. Цель — мировой титул!');
  if (S.patchOn && S.patchData) applyPatchNames();
  metaMajor(true); S.patchNew = null;
  return S;
}

function buildWorld(d) {
  const used = new Set();
  const W = { d, teams: [], tiers: [[], [], []], sched: [], po: [null, null, null], wc: null, champs: [], fa: [], academy: [], season: 1 };
  const lv = [74, 63, 53];
  for (let t = 0; t < 3; t++) {
    for (let k = 0; k < 8; k++) {
      const nm = genTeamName(used);
      const tl = lv[t] + (t === 0 ? (7 - k) * 1.3 - 4 : gauss() * 3);
      const team = { id: nid(), d, fake: nm, real: null, color: teamColor(), roster: [], user: false, tier: t, coach: clamp(Math.round(6 + (2 - t) * 4 + gauss() * 3), 1, 20), prac: [], rec: { w: 0, l: 0, md: 0, pts: 0 }, chem: ri(40, 80), str: 'bal' };
      for (let r = 0; r < FAKE[d].size; r++) { const p = genPlayer(d, r, tl); p.team = team.id; S.players[p.id] = p; team.roster.push(p.id); }
      if (rnd() < 0.5) { const p = genPlayer(d, ri(0, FAKE[d].size - 1), tl - 5, [17, 20]); p.team = team.id; p.bench = true; S.players[p.id] = p; team.roster.push(p.id); }
      team.prac = Array.from({ length: 7 }, () => clamp(Math.round(55 + gauss() * 20 + (2 - t) * 5), 20, 95));
      W.teams.push(team); W.tiers[t].push(team.id);
    }
  }
  // free agents
  for (let k = 0; k < 18; k++) { const p = faPlayer(d); p.role = k % FAKE[d].size; S.players[p.id] = p; W.fa.push(p.id); }
  S.world[d] = W;
  S.meta[d] = {};
  makeSchedule(d);
}

function T(id) { for (const d of DISC_ORDER) { const t = S.world[d].teams.find(x => x.id === id); if (t) return t; } return null; }
function teamOf(d, id) { return S.world[d].teams.find(x => x.id === id); }
function userTeam(d) { const v = S.divs[d]; return v ? teamOf(d, v.team) : null; }
function starters(t) { const r = t.roster.map(i => S.players[i]).filter(Boolean); const n = FAKE[t.d].size; const s = r.filter(p => !p.bench).slice(0, n); if (s.length < n) r.filter(p => p.bench).slice(0, n - s.length).forEach(p => s.push(p)); return s; }
function teamOvr(t) { const s = starters(t); if (!s.length) return 0; return Math.round(s.reduce((a, p) => a + ovr(p), 0) / s.length); }

function unlockDivision(d, free) {
  const W = S.world[d];
  // replace the weakest tier-3 team with the user's org
  const ids = W.tiers[2]; let weakest = ids.map(i => teamOf(d, i)).sort((a, b) => teamOvr(a) - teamOvr(b))[0];
  // release its players to FA
  weakest.roster.forEach(pid => { const p = S.players[pid]; p.team = null; p.bench = false; W.fa.push(pid); });
  weakest.fake = { name: S.org.name, tag: S.org.tag }; weakest.real = null; weakest.user = true; weakest.color = S.org.c1; weakest.coach = 0; weakest.roster = []; weakest.chem = 30;
  weakest.prac = Array.from({ length: 7 }, () => ri(35, 55));
  for (let r = 0; r < FAKE[d].size; r++) { const p = genPlayer(d, r, 51, [17, 24]); p.team = weakest.id; p.sal = Math.round(p.sal * 0.9 / 10) * 10; p.ctr = 2; p.raiseCD = 8; S.players[p.id] = p; weakest.roster.push(p.id); }
  S.divs[d] = { team: weakest.id, style: 'bal', train: 'bal', focus: [], since: S.season, youth: [], out: [] };
  // starter staff
  const c = genStaff('coach', d, 5); S.staff[c.id] = c;
  if (!free) news('🆕 Открыт новый дивизион: ' + pack(d).game + '!');
  W.academy = []; refreshAcademy(d);
}

// round robin schedule for each tier (double)
function makeSchedule(d) {
  const W = S.world[d]; W.sched = [];
  for (let t = 0; t < 3; t++) {
    const ids = W.tiers[t].slice(); shuffle(ids);
    const n = ids.length; const rounds = [];
    const arr = ids.slice();
    for (let r = 0; r < n - 1; r++) {
      const m = [];
      for (let i = 0; i < n / 2; i++) m.push([arr[i], arr[n - 1 - i]]);
      rounds.push(m);
      arr.splice(1, 0, arr.pop());
    }
    const all = rounds.concat(rounds.map(r => r.map(([a, b]) => [b, a])));
    all.forEach((r, wi) => { W.sched[wi] = W.sched[wi] || []; r.forEach(([a, b]) => W.sched[wi].push({ a, b, tier: t, res: null, bo: 3 })); });
  }
  W.teams.forEach(t => t.rec = { w: 0, l: 0, md: 0, pts: 0 });
}
function standings(d, tier) {
  const W = S.world[d];
  return W.tiers[tier].map(i => teamOf(d, i)).sort((a, b) => b.rec.pts - a.rec.pts || b.rec.md - a.rec.md || teamOvr(b) - teamOvr(a));
}

// matches for current week, for a discipline
function weekMatches(d) {
  const W = S.world[d]; const ph = phaseOf(S.week);
  if (ph.k === 'league') return W.sched[S.week - 1] || [];
  if (ph.k === 'po') { const out = []; for (let t = 0; t < 3; t++) { const P = W.po[t]; if (!P) continue; const r = ph.r === 1 ? P.semis : P.final; (r || []).forEach(m => out.push(m)); } return out; }
  if (ph.k === 'wc') { const C = W.wc; if (!C) return []; return C.rounds[ph.r - 1] || []; }
  return [];
}
function setupPlayoffs(d) {
  const W = S.world[d];
  for (let t = 0; t < 3; t++) { const st = standings(d, t); W.po[t] = { semis: [{ a: st[0].id, b: st[3].id, tier: t, res: null, bo: 3, po: 1 }, { a: st[1].id, b: st[2].id, tier: t, res: null, bo: 3, po: 1 }], final: null, champ: null }; }
}
function setupFinals(d) { const W = S.world[d]; for (let t = 0; t < 3; t++) { const P = W.po[t]; const w = P.semis.map(m => m.res.win); P.final = [{ a: w[0], b: w[1], tier: t, res: null, bo: 5, po: 2 }]; } }
function setupWC(d) {
  const W = S.world[d];
  const q = standings(d, 0).slice(0, 6).map(t => t.id).concat(standings(d, 1).slice(0, 2).map(t => t.id));
  // seed: champion of tier1 playoffs first
  const ch = W.po[0] && W.po[0].champ; if (ch) { q.splice(q.indexOf(ch), 1); q.unshift(ch); }
  const pairs = [[0, 7], [3, 4], [1, 6], [2, 5]];
  W.wc = { teams: q, rounds: [pairs.map(([a, b]) => ({ a: q[a], b: q[b], tier: -1, res: null, bo: 3, wc: 1 }))], champ: null };
}
function advanceWC(d) { const C = S.world[d].wc; const last = C.rounds[C.rounds.length - 1]; const w = last.map(m => m.res.win); if (w.length === 1) { C.champ = w[0]; return; } const nr = []; for (let i = 0; i < w.length; i += 2) nr.push({ a: w[i], b: w[i + 1], tier: -1, res: null, bo: w.length === 2 ? 5 : 3, wc: C.rounds.length + 1 }); C.rounds.push(nr); }

// ---- prize & economy ----
const PRIZE = { win: [22000, 8000, 3000], po: [[60000, 25000], [20000, 8000], [7000, 2500]], wc: [500000, 200000, 80000, 30000] };
// Еженедельные доходы (никакого пассивного дохода в реальном времени — только игровые недели)
const LEAGUE_PAY = [9000, 4000, 2200];
function leagueWeekly() { return Object.keys(S.divs).reduce((a, d) => a + LEAGUE_PAY[userTeam(d).tier], 0); }
// Выплата лиги зависит от места в таблице: 1-е место ×1.4 … последнее ×0.7
function leaguePosFactor() { const ds = Object.keys(S.divs); if (!ds.length) return 1; let f = 0; ds.forEach(d => { const ut = userTeam(d); const st = standings(d, ut.tier); const pos = st.findIndex(t => t.id === ut.id); f += 1.4 - 0.7 * pos / Math.max(1, st.length - 1); }); return f / ds.length; }
function weeksToPayday() { return 4 - ((S.week - 1) % 4) - 1 + 1; }
// ---- спонсорские задачи ----
function makeGoal(sp) {
  const kinds = ['wins', 'fans', 'top', 'wins'];
  const k = kinds[Math.floor(rnd() * kinds.length)];
  const lvl = sp.lvl || 1;
  if (k === 'wins') { const n = 2 + Math.min(2, Math.floor((lvl - 1) / 2)); return { k, n, base: S.stats.wins, left: 4, t: 'Выиграть ' + n + ' матча за 4 недели' }; }
  if (k === 'fans') { const n = Math.round(S.fans * (1.08 + 0.03 * lvl) / 50) * 50; return { k, n, left: 5, t: 'Набрать ' + fmt(n) + ' фанатов за 5 недель' }; }
  const n = Math.max(1, 5 - lvl); return { k, n, left: 4, t: 'Быть в топ-' + n + ' своей лиги через 4 недели' };
}
function goalProgress(g) {
  if (g.k === 'wins') return [Math.min(g.n, S.stats.wins - g.base), g.n];
  if (g.k === 'fans') return [Math.min(g.n, S.fans), g.n];
  const best = Math.min(...Object.keys(S.divs).map(d => { const ut = userTeam(d); return standings(d, ut.tier).findIndex(t => t.id === ut.id) + 1; }));
  return [best <= g.n ? 1 : 0, 1, best];
}
function sponsorGoalsTick() {
  S.sponsors.forEach(sp => {
    if (!sp.goal) { sp.lvl = sp.lvl || 1; sp.goal = makeGoal(sp); return; }
    const g = sp.goal; g.left--; const [a, b] = goalProgress(g);
    const done = g.k === 'top' ? (g.left <= 0 && a >= b) : a >= b;
    if (done) {
      const bonus = Math.round(sp.weekly * 3 * sp.lvl / 50) * 50; S.money += bonus; sp.lvl++; sp.weekly = Math.round(sp.weekly * 1.2 / 50) * 50; sp.win = Math.round(sp.win * 1.2 / 50) * 50; sp.weeks += 4;
      news('🏅 ' + sp.name + ': задача выполнена! Бонус $' + fmt(bonus) + ', контракт улучшен до ур. ' + sp.lvl, 'gold'); sp.goal = makeGoal(sp);
    } else if (g.left <= 0) { news('📉 ' + sp.name + ': задача «' + g.t + '» не выполнена', 'bad'); sp.goal = makeGoal(sp); }
  });
}
function mediaWeekly() { let m = 400 + S.fans * 0.5 * (1 + 0.3 * S.fac.studio) * (1 + staffSk('media') * 0.02); S.creators.forEach(c => m += c.inc * 2500); return Math.round(m / 10) * 10; }
function tpWeekly() { const ndiv = Object.keys(S.divs).length; return Math.round(60 * (1 + 0.35 * S.fac.house) * (1 + 0.15 * (ndiv - 1))); }
function passiveRate() { let r = 0.5 + S.fans * 0.00012 * (1 + 0.3 * S.fac.studio) * (1 + staffSk('media') * 0.02); S.creators.forEach(c => r += c.inc); return r; }
function tpRate() { const ndiv = Object.keys(S.divs).length; return 0.15 * (1 + 0.35 * S.fac.house) * (1 + 0.15 * (ndiv - 1)); }
function offlineCapH() { return 2 + S.fac.server; }
function staffOf(type, d) { return Object.values(S.staff).filter(s => s.type === type && (!STAFF_TYPES[type].div || s.d === d)); }
function staffSk(type, d) { const l = staffOf(type, d); return l.length ? Math.max(...l.map(s => s.sk)) : 0; }
function weeklyCosts() { let c = 0; Object.keys(S.divs).forEach(d => { const t = userTeam(d); const dv = S.divs[d]; t.roster.forEach(i => c += S.players[i].sal); (dv.youth || []).forEach(i => { const p = S.players[i]; if (p) c += p.sal; }); (dv.out || []).forEach(i => { const p = S.players[i]; if (p) c += Math.round(p.sal * 0.3); }); }); Object.values(S.staff).forEach(s => c += s.sal); const fl = Object.values(S.fac).reduce((a, b) => a + b, 0); c += fl * 250; return c; }
function weeklySponsor() { return Math.round(S.sponsors.reduce((a, s) => a + s.weekly, 0) * (mgrLv() >= 3 ? 1.1 : 1)); }
function mgrLv() { const x = (S.mgr && S.mgr.xp) || 0; return x >= 5000 ? 5 : x >= 2500 ? 4 : x >= 1200 ? 3 : x >= 500 ? 2 : x >= 150 ? 1 : 0; }
function sponsorSlots() { return Math.min(8, 2 + Math.floor(S.rep / 20) + Math.floor((S.fac.office || 0) / 3)); }
function genOffers() {
  S.offers = [];
  const best = Math.min(...Object.keys(S.divs).map(d => userTeam(d).tier));
  const bz = 1 + staffSk('biz') * 0.04;
  for (let k = 0; k < 3; k++) {
    const used = S.sponsors.map(s => s.name).concat(S.offers.map(s => s.name));
    const nm = pick(SPONSOR_NAMES.filter(n => !used.includes(n)));
    const base = (400 + S.rep * 90 + S.fans * 0.02 + (2 - best) * 1500) * (0.7 + rnd() * 0.6) * bz;
    S.offers.push({ id: nid(), name: nm, weekly: Math.round(base / 50) * 50, win: Math.round(base * 0.25 / 50) * 50, weeks: ri(12, 40), sign: Math.round(base * ri(2, 5) / 100) * 100 });
  }
}
function genStaffMarket() {
  S.staffMarket = [];
  const lvl = 4 + S.rep / 9 + S.fac.academy * 0.3;
  Object.keys(STAFF_TYPES).forEach(type => {
    const ds = STAFF_TYPES[type].div ? Object.keys(S.divs) : [pick(Object.keys(S.divs))];
    ds.forEach(d => { for (let k = 0; k < 3; k++) S.staffMarket.push(genStaff(type, d, lvl + ri(-3, 4))); });
  });
}
function refreshAcademy(d) {
  const W = S.world[d]; W.academy = W.academy.filter(id => S.players[id] && !S.players[id].team);
  while (W.academy.length < 4) { const p = genPlayer(d, ri(0, FAKE[d].size - 1), 40 + S.fac.academy * 2.5, [15, 17]); p.pot = clamp(p.pot + 6 + S.fac.academy * 2 + staffSk('scout') * 0.5, 50, 99); p.sal = Math.max(120, Math.round(p.sal * 0.5 / 10) * 10); S.players[p.id] = p; W.academy.push(p.id); }
}
function potView(p) {
  const sc = staffSk('scout'); const err = Math.max(1, 14 - sc * 0.7);
  if (S.divs[p.d] && userTeam(p.d) && p.team === userTeam(p.d).id) return [p.pot, p.pot];
  const seed = (p.id * 9301 + 49297) % 233280 / 233280;
  const c = p.pot + (seed - 0.5) * err;
  return [Math.round(clamp(c - err / 2, ovr(p), 99)), Math.round(clamp(c + err / 2, ovr(p), 99))];
}

function news(t, cls) { S.news.unshift({ t, w: S.week, s: S.season, c: cls || '' }); if (S.news.length > 60) S.news.length = 60; }

// ---- idle tick ----
function idleTick(sec) {
  const m = passiveRate() * sec; S.money += m; S.tp += tpRate() * sec; return m;
}
function offlineGain() {
  const now = Date.now(); const el = Math.min((now - (S.lastTick || now)) / 1000, offlineCapH() * 3600);
  S.lastTick = now; if (el < 60) { idleTick(Math.max(0, el)); return null; }
  const before = S.money, tb = S.tp; idleTick(el); return { sec: el, money: S.money - before, tp: S.tp - tb };
}

// ---- training ----
// ---- миграция сохранений: роли героев из реального патча и пулы игроков под свою позицию ----
function migrateHeroRoles(real) {
  if (!S || S.heroFix === 4) return;
  if (S.patchOn && S.patchData && S.patchData.disciplines && real && real.disciplines) ['dota', 'dl'].forEach(d => { const P = S.patchData.disciplines[d], R = real.disciplines[d]; if (!P || !P.heroes || !R || !R.heroes) return; P.heroes.forEach(h => { const r = R.heroes.find(x => x.n === h.n); if (r && r.r) h.r = r.r; }); R.heroes.forEach(r => { if (!P.heroes.some(h => h.n === r.n)) P.heroes.push(Object.assign({}, r)); }); });
  Object.values(S.players).forEach(p => { if (p && FAKE[p.d] && FAKE[p.d].kind === 'moba') { const keep = p.pool && p.pool.length ? Math.max(...p.pool.map(x => x[1])) : null; genPool(p); if (keep !== null && p.pool.length) { const top = p.pool.slice().sort((a, b) => b[1] - a[1])[0]; top[1] = Math.max(top[1], Math.min(99, keep)); } } });
  S.heroFix = 4;
}
function ensureMeta() { if (S && !S.metaW) { metaMajor(true); S.patchNew = null; } }
// ---- изучение нового героя: медленно, с потолком и ржавчиной остальных ----
function learnCap(p, h) { const hr = heroList(p.d)[h]; return Math.min(95, ovr(p) + (hr && hr.r.includes(p.role) ? 4 : -6)); }
function learnRate(p, h) { const e = (p.pool || []).find(x => x[0] === h); const cur = e ? e[1] : 0; const cap = learnCap(p, h); if (cur >= cap) return 0; const wp = S.weekPlan || 'scrim'; const plan = wp === 'scrim' ? 1 : wp === 'rest' ? 0.35 : 0.6; return Math.max(0.5, (cap - cur) / 5) * plan * (1 + staffSk('coach', p.d) * 0.03 + S.fac.server * 0.04) * (traitOf(p) === 'work' ? 1.2 : 1); }
function setLearn(p, h) { p.learn = h; if (!(p.pool || []).some(x => x[0] === h)) { p.pool = p.pool || []; p.pool.push([h, Math.max(25, ovr(p) - 22)]); } }
function learnTick(p, d, an) {
  if (p.learn === undefined || p.learn === null) return; const e = p.pool.find(x => x[0] === p.learn); if (!e) { p.learn = null; return; }
  const before = e[1]; const g = learnRate(p, p.learn) * (0.7 + rnd() * 0.6); e[1] = Math.min(learnCap(p, p.learn), Math.round((e[1] + g) * 10) / 10);
  // пока учит нового — остальные (кроме коронного) чуть ржавеют
  const sig = sigHero(p); p.pool.forEach(x => { if (x !== e && x[0] !== sig) x[1] = Math.max(25, x[1] - 0.4); });
  if (Math.floor(before / 10) < Math.floor(e[1] / 10) && e[1] >= 60) news('📚 ' + pnick(p) + ' осваивает ' + heroName(d, p.learn) + ': владение ' + Math.round(e[1]));
  if (e[1] >= learnCap(p, p.learn)) { news('🎓 ' + pnick(p) + ' освоил ' + heroName(d, p.learn) + ' (' + Math.round(e[1]) + ')', 'good'); p.learn = null; }
}
// мета давит на игрока, если его коронные герои ослаблены
function metaComfort(p) { if (!p.pool || FAKE[p.d].kind !== 'moba') return 0; const top = p.pool.slice().sort((a, b) => b[1] - a[1]).slice(0, 3); return top.reduce((a, x) => a + heroMeta(p.d, x[0]), 0) / 3; }
// ---- сигнатурные карты и герои ----
function sigMap(p) { if (FAKE[p.d].kind !== 'fps') return -1; return Math.floor(Math.abs(Math.sin(p.id * 17.31 + 1.7) * 43758.5453) % 1 * 7); }
function sigHero(p) { if (!p.pool || !p.pool.length) return null; const L = heroList(p.d); const on = p.pool.filter(x => L[x[0]] && L[x[0]].r.includes(p.role)); const src = on.length ? on : p.pool; return src.slice().sort((a, b) => b[1] - a[1])[0][0]; }
// ---- живой трансферный рынок: слухи, переходы между клубами, звонки агентов ----
function marketWeek() {
  S.rumors = (S.rumors || []).filter(r => r.s === S.season);
  // разрешаем созревшие слухи
  S.rumors.forEach(r => { if (r.done || r.at > S.week) return; r.done = true; const p = S.players[r.pid]; const to = T(r.to); if (!p || !to || !p.team || p.team === r.to || T(p.team).user) { r.res = 'off'; return; }
    if (rnd() < r.prob) { const from = T(p.team); from.roster = from.roster.filter(i => i !== p.id); const rep = starters(to).filter(x => x.role === p.role).sort((a, b) => ovr(a) - ovr(b))[0];
      if (rep) { to.roster = to.roster.filter(i => i !== rep.id); rep.team = from.id; from.roster.push(rep.id); } to.roster.push(p.id); p.team = to.id; p.bench = false; r.res = 'yes';
      S.tlog = [{ d: r.d, pid: p.id, from: from.id, to: to.id, fee: Math.round(valueOf(p) * (1 + rnd() * 0.5)), w: S.week, s: S.season }].concat(S.tlog || []).slice(0, 40);
      if (S.divs[r.d]) news('🔁 Трансфер: ' + pnick(p) + ' переходит из ' + tname(from) + ' в ' + tname(to)); }
    else { r.res = 'no'; } });
  // новые слухи: топ-команды присматриваются к звёздам послабее клубов
  DISC_ORDER.forEach(d => { if (rnd() > 0.45) return; const W = S.world[d]; const buyer = pick(W.teams.filter(t => !t.user && t.tier <= 1)); if (!buyer) return;
    const cands = W.teams.filter(t => !t.user && t !== buyer && t.tier >= buyer.tier).flatMap(t => starters(t)).filter(p => ovr(p) >= teamOvr(buyer) - 1).sort((a, b) => ovr(b) - ovr(a)).slice(0, 6); const p = pick(cands); if (!p || S.rumors.some(r => r.pid === p.id && !r.done)) return;
    const prob = 0.25 + rnd() * 0.55; S.rumors.push({ id: nid(), pid: p.id, to: buyer.id, from: p.team, d, prob, at: S.week + ri(1, 3), s: S.season, w: S.week });
    if (S.divs[d]) news('📰 Слух: ' + tname(buyer) + ' хотят ' + pnick(p) + ' из ' + tname(T(p.team)) + ' (' + (prob > 0.6 ? 'надёжный источник' : prob > 0.4 ? 'говорят в кулуарах' : 'сомнительный инсайд') + ')'); });
  // звонок агента: игрок другого клуба хочет к вам — скидка на трансфер на 2 недели
  S.calls = (S.calls || []).filter(c => c.s === S.season && c.w + 2 >= S.week);
  if (rnd() < (mgrLv() >= 5 ? 0.5 : 0.3)) { const d = pick(Object.keys(S.divs)); const ut = userTeam(d); const W = S.world[d];
    const cands = W.teams.filter(t => !t.user).flatMap(t => t.roster.map(i => S.players[i])).filter(p => p && !signDemand(p).refuse && ovr(p) >= teamOvr(ut) - 3 && ovr(p) <= teamOvr(ut) + 6);
    const p = pick(cands); if (p) { const mul = (mgrLv() >= 5 ? 0.5 : 0.6) + rnd() * 0.2; p.deal = { s: S.season, w: S.week + 2, mul }; S.calls.push({ pid: p.id, d, s: S.season, w: S.week, mul, why: pick(['мало игрового времени', 'конфликт с тренером', 'хочет сменить обстановку', 'клуб задерживает зарплату', 'мечтает играть за вас']) }); news('📞 Агент ' + pnick(p) + ' (' + tname(T(p.team)) + '): клиент хочет к вам, клуб отдаст со скидкой ' + Math.round((1 - mul) * 100) + '% — 2 недели'); } }
}
// ---- характеры и связки игроков ----
const TRAITS = {
  leader: { n: 'Лидер', i: '👑', d: 'Сплачивает команду: +1 химии в неделю, связки с ним растут быстрее, в матче +сила всем' },
  work: { n: 'Трудяга', i: '💪', d: 'Растёт на 25% быстрее' },
  quiet: { n: 'Тихоня', i: '🤫', d: 'Почти ни с кем не конфликтует, мораль стабильнее' },
  show: { n: 'Шоумен', i: '🎤', d: 'Приводит фанатов каждую неделю, но форма скачет сильнее' },
  hot: { n: 'Вспыльчивый', i: '🔥', d: 'В хорошем настроении сильнее, в плохом — слабее; мораль скачет' },
  toxic: { n: 'Токсик', i: '☠️', d: 'Сам по себе сильнее (+2), но портит связки и химию' },
};
const TRAIT_W = [['quiet', 3], ['work', 3], ['leader', 1.1], ['show', 1.6], ['hot', 1.6], ['toxic', 1.1]];
function traitOf(p) { if (!p) return 'quiet'; if (!p.tr) { const h = Math.abs(Math.sin(p.id * 91.7 + 3.3) * 43758.5453) % 1; let r = h * TRAIT_W.reduce((a, x) => a + x[1], 0); p.tr = TRAIT_W[TRAIT_W.length - 1][0]; for (const [k, w] of TRAIT_W) { r -= w; if (r <= 0) { p.tr = k; break; } } } return p.tr; }
function pairKey(a, b) { const x = a.id || a, y = b.id || b; return x < y ? x + '-' + y : y + '-' + x; }
function pairVal(a, b) { return (S.pairs && S.pairs[pairKey(a, b)]) || 0; }
function pairAdd(a, b, n) { S.pairs = S.pairs || {}; const k = pairKey(a, b); S.pairs[k] = clamp((S.pairs[k] || 0) + n, -20, 20); }
// насколько хорошо двое сыгрываются за неделю вместе
function pairDelta(a, b) {
  const ta = traitOf(a), tb = traitOf(b); let v = 0.6;
  if (ta === 'leader' || tb === 'leader') v += 0.6;
  if (ta === 'toxic') v -= tb === 'quiet' ? 0.4 : 1.3; if (tb === 'toxic') v -= ta === 'quiet' ? 0.4 : 1.3;
  if (ta === 'hot' && tb === 'hot') v -= 0.9; if ((ta === 'hot' && tb === 'toxic') || (tb === 'hot' && ta === 'toxic')) v -= 0.6;
  if (ta === 'show' && tb === 'show') v -= 0.5;
  if (a.cc === b.cc) v += 0.4;
  return v;
}
function teamPairs(t) { const sp = starters(t); let sum = 0, n = 0; for (let i = 0; i < sp.length; i++) for (let j = i + 1; j < sp.length; j++) { sum += pairVal(sp[i], sp[j]); n++; } return n ? sum / n : 0; }
function pairsWeekly() {
  Object.keys(S.divs).forEach(d => { const t = userTeam(d); const sp = starters(t);
    for (let i = 0; i < sp.length; i++) for (let j = i + 1; j < sp.length; j++) pairAdd(sp[i], sp[j], pairDelta(sp[i], sp[j]) * (0.6 + rnd() * 0.8));
    sp.forEach(p => { const tr = traitOf(p); if (tr === 'leader') t.chem = clamp(t.chem + 1, 0, 100); if (tr === 'toxic') t.chem = clamp(t.chem - 1, 0, 100); if (tr === 'show') S.fans += Math.round(25 + S.fans * 0.002); });
  });
}
const ATTRS = [['mech', 'Механика'], ['iq', 'Игровой IQ'], ['tw', 'Командная игра'], ['cl', 'Клатч'], ['con', 'Стабильность']];
function upCost(p, a) { return Math.round(6 * Math.pow(1.075, p[a] - 40)); }
function canUp(p, a) { return p[a] < 99 && ovr(p) < p.pot + 1 && S.tp >= upCost(p, a); }
function doUp(p, a) { const c = upCost(p, a); if (S.tp < c) return false; if (ovr(p) >= p.pot && p[a] >= p.pot) return false; S.tp -= c; p[a] = Math.min(99, p[a] + 1); return true; }
function weeklyGrowth(p, d, isUser) {
  const coach = isUser ? staffSk('coach', d) : (teamOf(d, p.team) || { coach: 8 }).coach;
  const house = isUser ? S.fac.house : 3;
  const tr = isUser ? S.divs[d].train : 'bal';
  const gap = p.pot - ovr(p); const trt = traitOf(p);
  let g = 0;
  if (p.age <= 23) g = 0.55; else if (p.age <= 26) g = 0.3; else if (p.age <= 28) g = 0.05; else g = -0.25 + staffSk('fitness') * 0.01;
  g *= (1 + coach * 0.04 + house * 0.04);
  if (gap <= 0 && g > 0) g *= 0.1;
  if (tr === 'rest') g *= 0.4;
  if (trt === 'work' && g > 0) g *= 1.25;
  const focus = tr === 'mech' ? ['mech', 'cl'] : tr === 'tac' ? ['iq', 'tw'] : tr === 'rest' ? [] : ['mech', 'iq', 'tw', 'cl', 'con'];
  ATTRS.forEach(([a]) => {
    let inc = g * (focus.includes(a) ? (tr === 'bal' ? 1 : 1.8) : (tr === 'bal' ? 1 : 0.4)) * (0.5 + rnd());
    p.xp[a] = (p.xp[a] || 0) + inc;
    while (p.xp[a] >= 1) { p.xp[a] -= 1; if (p[a] < 99) p[a]++; }
    while (p.xp[a] <= -1) { p.xp[a] += 1; p[a] = Math.max(20, p[a] - 1); }
  });
  // pool proficiency
  if (p.pool) p.pool.forEach(x => { x[1] = clamp(x[1] + (rnd() < 0.5 ? 1 : 0) * (p.age < 25 ? 1 : 0.5), 20, 99); });
  // form & morale
  const psy = isUser ? staffSk('psych') : 8;
  const fstab = (p.con - 50) / 100 + psy * 0.01;
  p.form = clamp(Math.round(p.form * 0.6 + gauss() * (6 - fstab * 4) * (trt === 'show' ? 1.3 : 1)), -10, 10);
  const target = 65 + psy + (isUser ? S.fac.wellness * 2 : 5);
  p.mor = clamp(Math.round(p.mor + (target - p.mor) * (0.15 + (tr === 'rest' ? 0.2 : 0)) + gauss() * 3 * (trt === 'quiet' ? 0.5 : trt === 'hot' ? 1.7 : 1)), 5, 100);
}

// ---- strength for match ----
function ensureFive(t, d) { let n = 0; const sz = FAKE[d].size; while (starters(t).length < sz) { const roles = starters(t).map(p => p.role); let r = [...Array(sz).keys()].find(x => !roles.includes(x)); if (r === undefined) r = 0; const p = genPlayer(d, r, t.user ? 42 : 50 + (2 - t.tier) * 10, [17, 21]); p.team = t.id; p.ctr = 1; p.sal = Math.max(150, Math.round(p.sal * 0.5 / 10) * 10); p.standin = true; S.players[p.id] = p; t.roster.push(p.id); n++; } if (n && t.user) news('🩹 ' + pack(d).game + ': не хватало игроков — подписаны ' + n + ' стенд-ин(а) на 1 сезон', 'bad'); }
function teamCtx(t, d) {
  ensureFive(t, d);
  const isU = t.user; const sp = starters(t);
  return {
    t, d, players: sp, user: isU,
    coach: isU ? staffSk('coach', d) : t.coach,
    analyst: isU ? staffSk('analyst', d) : Math.round(t.coach * 0.7),
    chem: t.chem, style: isU ? S.divs[d].style : t.str || 'bal', prac: t.prac,
    mor: sp.reduce((a, p) => a + p.mor, 0) / Math.max(1, sp.length),
    press: t.press || 0, pair: isU ? teamPairs(t) + (mgrLv() >= 4 ? 8 : 0) : 4, lead: sp.some(p => traitOf(p) === 'leader') ? 1 : 0
  };
}
function baseMod(c) { return (c.coach - 8) * 0.25 + (c.chem - 50) * 0.05 + (c.mor - 60) * 0.04 + (c.pair || 0) * 0.12 + (c.lead || 0) * 0.8 + (c.press || 0) * 0.6; }
function pSkill(p) { const tr = traitOf(p); return ovr(p) + p.form * 0.6 + (tr === 'toxic' ? 2 : 0) + (tr === 'hot' ? (p.mor - 60) * 0.06 : 0); }

// ---- weekly flow ----
function userMatchesThisWeek() { const out = []; Object.keys(S.divs).forEach(d => { const ut = userTeam(d); weekMatches(d).forEach(m => { if (!m.res && (m.a === ut.id || m.b === ut.id)) out.push({ d, m }); }); }); return out; }
function finishWeek() {
  const ph = phaseOf(S.week); const log = { money0: S.money, inc: 0, cost: 0, prize: 0, spons: 0, res: [] };
  // sim remaining matches
  DISC_ORDER.forEach(d => { weekMatches(d).forEach(m => { if (!m.res) { m.res = quickSeries(d, m); applyResult(d, m); } }); });
  // economy
  // экономика: начисления копятся весь месяц, выплата — раз в 4 недели (день выплат)
  const L0 = S.ledger || (S.ledger = { cost: 0, spons: 0, media: 0, league: 0 });
  L0.cost += weeklyCosts(); L0.spons += weeklySponsor(); L0.media += mediaWeekly(); L0.league += leagueWeekly();
  const tpg = tpWeekly(); S.tp += tpg; log.tp = tpg;
  sponsorGoalsTick();
  if (S.week % 4 === 0) {
    const pf = leaguePosFactor(); const league = Math.round(L0.league * pf);
    const net = league + L0.spons + L0.media - L0.cost; S.money += net;
    log.payday = { league, pf, spons: L0.spons, media: L0.media, cost: L0.cost, net };
    news('🗓️ День выплат: ' + (net >= 0 ? '+$' : '−$') + fmt(Math.abs(net)) + ' (лига $' + fmt(league) + ', спонсоры $' + fmt(L0.spons) + ', медиа $' + fmt(L0.media) + ', расходы $' + fmt(L0.cost) + ')', net >= 0 ? 'good' : 'bad');
    S.ledger = { cost: 0, spons: 0, media: 0, league: 0 };
  }
  S.sponsors.forEach(s => s.weeks--); const ended = S.sponsors.filter(s => s.weeks <= 0); ended.forEach(s => news('📄 Контракт со спонсором ' + s.name + ' завершён'));
  S.sponsors = S.sponsors.filter(s => s.weeks > 0);
  // growth
  Object.values(S.players).forEach(p => { if (p.team) weeklyGrowth(p, p.d, isUserPlayer(p)); });
  weeklyManagement();
  pairsWeekly();
  marketWeek();
  // practice & chemistry
  Object.keys(S.divs).forEach(d => {
    const t = userTeam(d); const a = staffSk('analyst', d); const dv = S.divs[d];
    t.prac = t.prac.map((v, i) => clamp(v + (dv.focus.includes(i) ? 3 + a * 0.25 + S.fac.analytics * 0.4 + S.fac.server * 0.3 : -0.6 + a * 0.05), 10, 100));
    t.chem = clamp(t.chem + 2 + (dv.train === 'tac' ? 1.5 : 0), 0, 100);
    if (FAKE[d].kind === 'moba') starters(t).forEach(p => p.pool.forEach(x => x[1] = clamp(x[1] + (a * 0.06 + S.fac.analytics * 0.1) * rnd(), 20, 99)));
    if (FAKE[d].kind === 'moba') t.roster.forEach(i => { const p = S.players[i]; if (p) learnTick(p, d, a); });
  });
  DISC_ORDER.forEach(d => S.world[d].teams.forEach(t => { if (!t.user) { t.chem = clamp(t.chem + 1, 0, 95); t.prac = t.prac.map(v => clamp(v + gauss() * 2, 20, 98)); } }));
  // план недели: скримы / стрим-марафон / отдых
  const plan = S.weekPlan || 'scrim'; log.plan = plan;
  if (plan === 'scrim') { Object.keys(S.divs).forEach(d => { const t = userTeam(d); t.chem = clamp(t.chem + 2, 0, 100); const f = S.divs[d].focus; t.prac = t.prac.map((v, i) => clamp(v + (f.includes(i) ? 1.5 : 0.5), 10, 100)); }); S.tp += Math.round(tpWeekly() * 0.25); }
  else if (plan === 'stream') { const f = Math.round((40 + S.fans * 0.03) * (1 + S.fac.marketing * 0.15)); const m = Math.round(f * 4 * (1 + S.fac.studio * 0.2)); S.fans += f; S.money += m; log.stream = { f, m }; Object.keys(S.divs).forEach(d => { const t = userTeam(d); t.chem = clamp(t.chem - 1, 0, 100); }); }
  else if (plan === 'rest') { Object.keys(S.divs).forEach(d => userTeam(d).roster.forEach(i => { const p = S.players[i]; if (p) p.mor = clamp(p.mor + 5, 0, 100); })); }
  // fans organic
  S.fans += Math.round(S.fans * 0.004 * (1 + S.fac.marketing * 0.2) + staffSk('media') * 3);
  // meta patch
  if (S.week % 5 === 0 && S.week < 20) metaMinor();
  aiMetaAdapt();
  // random event
  if (rnd() < 0.15) randomEvent();
  // markets
  if (S.week % 2 === 0) genOffers();
  if (S.week % 3 === 0) genStaffMarket();
  DISC_ORDER.forEach(d => { const W = S.world[d]; if (rnd() < 0.5) { const p = faPlayer(d); S.players[p.id] = p; W.fa.push(p.id); } if (W.fa.length > 30) { const old = W.fa.shift(); delete S.players[old]; } if (Object.keys(S.divs).includes(d) && S.week % 4 === 0) refreshAcademy(d); aiTransfer(d); });
  // creators
  S.creators.forEach(cr => { S.fans += cr.fans; cr.weeks--; }); S.creators = S.creators.filter(c => c.weeks > 0);
  log.money1 = S.money;
  // phase transitions
  const prev = S.week;
  S.week++;
  if (S.week === 15) DISC_ORDER.forEach(setupPlayoffs);
  if (S.week === 16) DISC_ORDER.forEach(setupFinals);
  if (S.week === 17) DISC_ORDER.forEach(setupWC);
  if (S.week === 18 || S.week === 19) DISC_ORDER.forEach(advanceWC);
  if (S.week === 20) DISC_ORDER.forEach(d => { advanceWC(d); const C = S.world[d].wc; const ch = teamOf(d, C.champ); S.world[d].champs.unshift({ s: S.season, t: tname(ch), id: ch.id }); news('🏆 ' + tname(ch) + ' — чемпион ' + pack(d).major + ' ' + S.season + '!', ch.user ? 'gold' : ''); if (ch.user) { S.trophyQ = (S.trophyQ || []).concat({ d, n: pack(d).major, s: S.season, major: true }); S.trophies.push({ s: S.season, d, n: pack(d).major }); S.money += 0; } });
  if (S.week > SEASON_WEEKS) newSeason();
  if (S.money < -50000 && !S.debtWarn) { S.debtWarn = true; news('⚠️ Большие долги! Спонсоры и игроки нервничают.', 'bad'); }
  fire('week', log);
  S.weekLog = log;
  return log;
}
function isUserPlayer(p) { const t = p.team && T(p.team); return t && t.user; }

function applyResult(d, m) {
  const r = m.res; const A = teamOf(d, m.a), B = teamOf(d, m.b);
  const W = r.win === A.id ? A : B, L = r.win === A.id ? B : A; A.press = 0; B.press = 0;
  const wm = Math.max(r.sa, r.sb), lm = Math.min(r.sa, r.sb);
  W.last = (W.last || []).concat('W').slice(-5); L.last = (L.last || []).concat('L').slice(-5);
  if (!m.po && !m.wc) { W.rec.w++; L.rec.l++; W.rec.pts += 3; W.rec.md += wm - lm; L.rec.md -= wm - lm; }
  // stats into players
  (r.ps || []).forEach(x => { const p = S.players[x.id]; if (!p) return; ['mp', 'k', 'd', 'a', 'mvp', 'w'].forEach(k => { p.st[k] += x[k] || 0; p.car[k] += x[k] || 0; }); p.st.rt += x.rt || 0; p.car.rt += x.rt || 0; });
  // morale
  starters(W).forEach(p => p.mor = clamp(p.mor + 4, 0, 100)); starters(L).forEach(p => p.mor = clamp(p.mor - 5, 0, 100));
  // user econ
  [A, B].forEach(t => {
    if (!t.user) return;
    const won = t === W;
    if (won) { S.stats.wins++; S.fans += Math.round(40 + S.fans * 0.015 * (1 + S.fac.marketing * 0.2)); } else S.stats.losses++;
    let prize = 0;
    if (!m.po && !m.wc) { if (won) prize = PRIZE.win[t.tier]; }
    if (m.po === 2) prize = PRIZE.po[t.tier][won ? 0 : 1];
    if (m.wc) { const stage = m.wc; if (stage === 3) prize = won ? PRIZE.wc[0] : PRIZE.wc[1]; else if (!won) prize = stage === 2 ? PRIZE.wc[2] : PRIZE.wc[3]; }
    if (won) S.sponsors.forEach(s => prize += s.win);
    if (won) { const wb = t.roster.reduce((a, i) => { const p = S.players[i]; return a + (p && p.winB ? Math.round(p.sal * p.winB) : 0); }, 0); if (wb) { prize -= wb; } }
    S.money += prize;
    const fg = won ? Math.round((40 + (2 - t.tier) * 120 + (m.wc ? 1500 : 0) + (m.po ? 300 : 0)) * (1 + S.fac.marketing * 0.2)) : Math.round(10 + (2 - t.tier) * 20);
    S.fans += fg;
    S.rep = clamp(S.rep + (won ? 0.6 + (2 - t.tier) * 0.4 + (m.wc ? 3 : 0) + (m.po === 2 ? 2 : 0) : -0.2), 0, 100);
    const opp = t === A ? B : A;
    news((won ? '✅ ' : '❌ ') + pack(d).game + ': ' + tname(t) + ' ' + (t === A ? r.sa + ':' + r.sb : r.sb + ':' + r.sa) + ' ' + tname(opp) + (prize ? ' · +$' + fmt(prize) : ''), won ? 'good' : 'bad');
  });
  { const ea = A.elo || (A.elo = 1500 + (2 - A.tier) * 150), eb = B.elo || (B.elo = 1500 + (2 - B.tier) * 150); const exp = 1 / (1 + Math.pow(10, (eb - ea) / 400)); const sA = W === A ? 1 : 0; const K = m.wc ? 40 : m.po ? 32 : 24; A.elo = Math.round(ea + K * (sA - exp)); B.elo = Math.round(eb - K * (sA - exp)); }
  fire('match', d, m, W, L);
  if (m.po === 2) { const P = S.world[d].po[m.tier]; P.champ = W.id; if (W.user) { S.trophyQ = (S.trophyQ || []).concat({ d, n: pack(d).leagues[m.tier], s: S.season }); S.trophies.push({ s: S.season, d, n: pack(d).leagues[m.tier] }); news('🏆 Титул! ' + tname(W) + ' выигрывает ' + pack(d).leagues[m.tier] + '!', 'gold'); } }
}

// ---- мета: тренды (архетипы) меняются плавно, раз в сезон — крупный патч, в сезоне — точечные правки ----
const META_TAGS = { T: 'жирные герои', H: 'урон с руки', M: 'магический бёрст', F: 'тимфайты', G: 'пики и мобильность', P: 'пуш и сплит', S: 'сейвы и сустейн' };
const HERO_TAGS = {
  'Anti-Mage': 'HG', 'Phantom Assassin': 'HG', 'Faceless Void': 'HF', 'Medusa': 'HT', 'Juggernaut': 'HS', 'Terrorblade': 'HP', 'Troll Warlord': 'H', 'Morphling': 'HG', 'Invoker': 'MF', 'Storm Spirit': 'MG', 'Shadow Fiend': 'HM', 'Puck': 'MG', 'Ember Spirit': 'GH', 'Queen of Pain': 'MG', 'Void Spirit': 'MG', 'Templar Assassin': 'HG', 'Mars': 'TF', 'Axe': 'TF', 'Centaur Warrunner': 'TF', 'Dark Seer': 'FP', 'Tidehunter': 'TF', 'Beastmaster': 'PT', 'Underlord': 'TFP', 'Primal Beast': 'TF', 'Earthshaker': 'FM', 'Tusk': 'G', 'Rubick': 'M', 'Hoodwink': 'G', 'Clockwerk': 'GT', 'Mirana': 'G', 'Snapfire': 'MF', 'Pangolier': 'GF', 'Crystal Maiden': 'MF', 'Lion': 'MG', 'Shadow Shaman': 'MP', 'Witch Doctor': 'MS', 'Dazzle': 'S', 'Oracle': 'S', 'Treant Protector': 'ST', 'Warlock': 'FS',
  'Abaddon': 'ST', 'Alchemist': 'TH', 'Ancient Apparition': 'MF', 'Arc Warden': 'HP', 'Bane': 'M', 'Batrider': 'GF', 'Bloodseeker': 'HG', 'Bounty Hunter': 'G', 'Brewmaster': 'TF', 'Bristleback': 'T', 'Broodmother': 'PG', 'Chaos Knight': 'TH', 'Chen': 'SP', 'Clinkz': 'HP', 'Dark Willow': 'MG', 'Dawnbreaker': 'TS', 'Death Prophet': 'PM', 'Disruptor': 'MF', 'Doom': 'T', 'Dragon Knight': 'TP', 'Drow Ranger': 'HP', 'Elder Titan': 'F', 'Enchantress': 'SP', 'Enigma': 'F', 'Gyrocopter': 'HF', 'Grimstroke': 'MG', 'Huskar': 'HT', 'Io': 'S', 'Jakiro': 'MP', 'Keeper of the Light': 'M', 'Kez': 'HG', 'Kunkka': 'TF', 'Legion Commander': 'TG', 'Leshrac': 'MP', 'Lich': 'MS', 'Lifestealer': 'HT', 'Lina': 'M', 'Lone Druid': 'HP', 'Luna': 'HP', 'Lycan': 'HP', 'Magnus': 'F', 'Marci': 'G', 'Meepo': 'G', 'Monkey King': 'HG', 'Muerta': 'HM', 'Naga Siren': 'HP', "Nature's Prophet": 'P', 'Necrophos': 'TS', 'Night Stalker': 'GT', 'Nyx Assassin': 'GM', 'Ogre Magi': 'TS', 'Omniknight': 'S', 'Outworld Destroyer': 'M', 'Phantom Lancer': 'HP', 'Phoenix': 'FS', 'Pudge': 'TG', 'Pugna': 'MP', 'Razor': 'HT', 'Riki': 'G', 'Ringmaster': 'F', 'Sand King': 'F', 'Shadow Demon': 'S', 'Silencer': 'F', 'Skywrath Mage': 'M', 'Slardar': 'TG', 'Slark': 'HG', 'Sniper': 'HP', 'Spectre': 'HG', 'Spirit Breaker': 'G', 'Sven': 'HT', 'Techies': 'M', 'Timbersaw': 'TM', 'Tinker': 'MP', 'Tiny': 'MH', 'Undying': 'TS', 'Ursa': 'H', 'Vengeful Spirit': 'S', 'Venomancer': 'P', 'Viper': 'HT', 'Visage': 'P', 'Weaver': 'HG', 'Windranger': 'HG', 'Winter Wyvern': 'S', 'Wraith King': 'HT', 'Zeus': 'M', 'Largo': 'S', 'Earth Spirit': 'G',
  'Haze': 'HG', 'Holliday': 'H', 'Mirage': 'HG', 'Venator': 'H', 'Vindicta': 'H', 'Vyper': 'HG', 'Wraith': 'H', 'Abrams': 'T', 'Mo & Krill': 'TF', 'Rat King': 'TP', 'Victor': 'TS', 'Warden': 'TF', 'Celeste': 'M', 'Graves': 'MP', 'Grey Talon': 'HM', 'Lady Geist': 'MT', 'Mina': 'MG', 'Seven': 'MF', 'Apollo': 'G', 'Calico': 'G', 'Drifter': 'G', 'Pocket': 'MG', 'Shiv': 'HG', 'Silver': 'HG', 'Yamato': 'HG', 'Dynamo': 'FS', 'Ivy': 'S', 'Kelvin': 'SF', 'McGinnis': 'PH', 'Paige': 'S', 'Rem': 'S', 'Viscous': 'TS', 'Nurse Harrow': 'S', 'Bebop': 'G', 'Billy': 'GT', 'Deadman Danny': 'F', 'Infernus': 'MT', 'Lash': 'GF', 'Baba': 'F', 'The Doorman': 'F', 'Paradox': 'G', 'Sinclair': 'M', 'Solomon': 'F', 'Violet': 'F',
};
const ROLE_TAGS = { dota: ['HG', 'MG', 'TF', 'GF', 'SM'], dl: ['H', 'TF', 'M', 'G', 'S', 'F'] };
function heroTags(d, i) { const h = heroList(d)[i]; if (!h) return ''; return HERO_TAGS[h.n] || (ROLE_TAGS[d] || [])[h.r[0]] || ''; }
function rndW() { return Math.round((rnd() * 4 - 1.5) * 10) / 10; }
function computeMeta(d) { const W = (S.metaW || {})[d] || {}; const Tw = (S.metaTweak || {})[d] || {}; const M = {}; heroList(d).forEach((h, i) => { let v = 0; for (const t of heroTags(d, i)) v += (W[t] || 0) * 0.9; v += Tw[i] || 0; v = Math.max(-5, Math.min(5, Math.round(v))); if (v) M[i] = v; }); S.meta[d] = M; }
function patchVer(major) { S.pv = S.pv || (S.patchOn ? { a: 7, b: 41, c: 0 } : { a: 1, b: 0, c: 0 }); if (major) { S.pv.b++; S.pv.c = 0; } else S.pv.c++; return S.pv.a + '.' + S.pv.b + (S.pv.c ? 'abcdefghij'[Math.min(9, S.pv.c - 1)] : ''); }
function metaMajor(first) {
  S.metaW = S.metaW || {}; S.metaTweak = {}; const shake = first || rnd() < 0.25; const trend = {};
  ['dota', 'dl'].forEach(d => { const o = S.metaW[d] || {}; const W = {}; Object.keys(META_TAGS).forEach(t => { W[t] = shake ? rndW() : Math.round(((o[t] || 0) * 0.55 + rndW() * 0.45) * 10) / 10; }); S.metaW[d] = W; trend[d] = W; computeMeta(d); });
  S.mapMeta = {}; const mi = ri(0, 6); S.mapMeta[mi] = rnd() < 0.5 ? 'ct' : 't';
  const v = patchVer(true); S.patchNew = { s: S.season, w: S.week, v, major: true, shake };
  if (!first) news('🧪 Крупный патч ' + v + (shake ? ': мета перевёрнута' : ': тренды сместились') + ' — ' + trendText('dota'));
}
function metaMinor() {
  S.metaTweak = S.metaTweak || {};
  ['dota', 'dl'].forEach(d => { const W = (S.metaW || {})[d]; if (!W) return; Object.keys(W).forEach(t => { W[t] = Math.round((W[t] + (rnd() - 0.5) * 0.5) * 10) / 10; }); const Tw = S.metaTweak[d] = S.metaTweak[d] || {}; const n = heroList(d).length; for (let k = 0; k < 7; k++) { const i = ri(0, n - 1); Tw[i] = Math.max(-3, Math.min(3, (Tw[i] || 0) + (rnd() < 0.5 ? ri(1, 2) : -ri(1, 2)))); } computeMeta(d); });
  S.mapMeta = S.mapMeta || {}; if (rnd() < 0.4) { S.mapMeta = {}; S.mapMeta[ri(0, 6)] = rnd() < 0.5 ? 'ct' : 't'; }
  const v = patchVer(false); S.patchNew = { s: S.season, w: S.week, v, major: false };
  news('🧪 Патч ' + v + ': точечные правки баланса, тренды прежние');
}
function trendText(d) { const W = (S.metaW || {})[d] || {}; const k = Object.keys(W).sort((a, b) => W[b] - W[a]); return 'в моде ' + META_TAGS[k[0]] + ', ' + META_TAGS[k[1]]; }
function metaShift() { metaMinor(); }
function heroMeta(d, i) { return (S.meta[d] && S.meta[d][i]) || 0; }
// ИИ-команды тоже подстраиваются под мету: понемногу учат усиленных героев своей роли
function aiMetaAdapt() {
  ['dota', 'dl'].forEach(d => { const M = S.meta[d] || {}; const L = heroList(d); const top = Object.keys(M).map(Number).filter(i => M[i] > 0).sort((a, b) => M[b] - M[a]);
    if (!top.length) return; S.world[d].teams.forEach(t => { if (t.user) return; starters(t).forEach(p => { if (rnd() > 0.3) return; const cand = top.filter(i => L[i] && L[i].r.includes(p.role)).slice(0, 4); if (!cand.length) return; const h = pick(cand); const cap = Math.min(95, ovr(p) + 4); p.pool = p.pool || []; let e = p.pool.find(x => x[0] === h); if (!e) { e = [h, Math.max(25, ovr(p) - 15)]; p.pool.push(e); if (p.pool.length > 8) { p.pool.sort((a, b) => b[1] - a[1]); p.pool.length = 8; } } e[1] = Math.min(cap, e[1] + 2 + rnd() * 2); }); }); });
}

function aiTransfer(d) {
  if (rnd() > 0.25) return; const W = S.world[d];
  const teams = W.teams.filter(t => !t.user); const t = pick(teams);
  if (!W.fa.length) return;
  const st = starters(t); const worst = st.sort((a, b) => ovr(a) - ovr(b))[0];
  const cand = W.fa.map(i => S.players[i]).filter(p => p && p.role === worst.role && ovr(p) > ovr(worst) + 2).sort((a, b) => ovr(b) - ovr(a))[0];
  if (!cand) return;
  W.fa.splice(W.fa.indexOf(cand.id), 1); cand.team = t.id; t.roster[t.roster.indexOf(worst.id)] = cand.id; worst.team = null; worst.bench = false; W.fa.push(worst.id);
  if (t.tier === 0 || rnd() < 0.3) news('🔁 ' + pack(d).game + ': ' + tname(t) + ' подписывают ' + pnick(cand) + ' вместо ' + pnick(worst));
}

const EVENTS = [
  { t: 'Игрок {p} стримил до 5 утра — форма упала', f: p => { p.form = clamp(p.form - 4, -10, 10); } },
  { t: '{p} поймал стрик — разносит в рейтинге!', f: p => { p.form = clamp(p.form + 4, -10, 10); } },
  { t: 'Клип {p} завирусился, +фанаты', f: p => { S.fans += ri(200, 900); } },
  { t: '{p} поссорился с тиммейтом. Химия команды −5', f: (p, t) => { t.chem = clamp(t.chem - 5, 0, 100); } },
  { t: 'Командный буткемп удался: химия +6', f: (p, t) => { t.chem = clamp(t.chem + 6, 0, 100); } },
  { t: '{p} хочет повышения зарплаты, мораль −10', f: p => { p.mor = clamp(p.mor - 10, 0, 100); } },
  { t: 'Фанаты прислали {p} огромный торт. Мораль +8', f: p => { p.mor = clamp(p.mor + 8, 0, 100); } },
  { t: 'Сломался ПК в геймхаусе: ремонт −$1500', f: () => { S.money -= 1500; } },
  { t: 'Бренд прислал бесплатную периферию: +$2000', f: () => { S.money += 2000; } }
];
function randomEvent() {
  const ds = Object.keys(S.divs); const d = pick(ds); const t = userTeam(d); const p = pick(starters(t)); if (!p) return;
  const e = pick(EVENTS); e.f(p, t); news('⚡ ' + e.t.replace('{p}', pnick(p)));
}

function newSeason() {
  fire('season');
  metaMajor(false);
  // promotion / relegation
  DISC_ORDER.forEach(d => {
    const W = S.world[d];
    const st = [0, 1, 2].map(t => standings(d, t).map(x => x.id));
    const up1 = st[1].slice(0, 2), dn0 = st[0].slice(-2), up2 = st[2].slice(0, 2), dn1 = st[1].slice(-2);
    W.tiers[0] = st[0].filter(i => !dn0.includes(i)).concat(up1);
    W.tiers[1] = st[1].filter(i => !up1.includes(i) && !dn1.includes(i)).concat(dn0, up2);
    W.tiers[2] = st[2].filter(i => !up2.includes(i)).concat(dn1);
    W.tiers.forEach((l, ti) => l.forEach(i => teamOf(d, i).tier = ti));
    const ut = userTeam(d);
    if (ut) { if (up1.includes(ut.id) || up2.includes(ut.id)) news('⬆️ ' + pack(d).game + ': повышение в ' + pack(d).leagues[ut.tier] + '!', 'gold'); if (dn0.includes(ut.id) || dn1.includes(ut.id)) news('⬇️ ' + pack(d).game + ': вылет в ' + pack(d).leagues[ut.tier], 'bad'); }
    W.po = [null, null, null]; W.wc = null;
  });
  seasonManagement();
  // aging, contracts, retire
  Object.values(S.players).forEach(p => {
    p.age++; p.st = newStats(); if (!p.team) return;
    if (p.youth) return;
    p.ctr--;
    const t = T(p.team);
    if (p.ctr <= 0) {
      if (t && t.user && p.mor >= 45 && !p.transferReq) { p.ctr = 1; p.sal = raiseTarget(p); p.wantRaise = false; p.raiseCD = 10; news('📝 ' + pnick(p) + ' продлил контракт на сезон ($' + fmt(p.sal) + '/нед)'); }
      else if (t && t.user) { p.team = null; p.bench = false; t.roster = t.roster.filter(i => i !== p.id); S.world[p.d].fa.push(p.id); news('👋 Контракт ' + pnick(p) + ' истёк — он ушёл в свободные агенты', 'bad'); }
      else { p.ctr = ri(1, 3); p.sal = salaryFor(p); }
    }
    if (p.age >= 32 && rnd() < 0.3 && t && !t.user) { const np = genPlayer(p.d, p.role, ovr(p) - 3, [17, 20]); np.team = t.id; S.players[np.id] = np; t.roster[t.roster.indexOf(p.id)] = np.id; p.team = null; news('🎖️ ' + pnick(p) + ' завершает карьеру'); }
  });
  // AI teams fill to 5
  DISC_ORDER.forEach(d => S.world[d].teams.forEach(t => { if (!t.user) { const sz = FAKE[d].size; while (starters(t).length < sz) { const roles = starters(t).map(p => p.role); const r = [...Array(sz).keys()].find(x => !roles.includes(x)); const p = genPlayer(d, r === undefined ? 0 : r, 50 + (2 - t.tier) * 10); p.team = t.id; S.players[p.id] = p; t.roster.push(p.id); } } }));
  Object.keys(S.divs).forEach(d => fillUserLineup(d));
  S.season++; S.week = 1;
  DISC_ORDER.forEach(d => makeSchedule(d));
  news('📅 Стартует сезон ' + S.season + '!');
}

// ---- actions ----
function fmt(n) { n = Math.round(n); const a = Math.abs(n); if (a >= 1e6) return (n / 1e6).toFixed(a >= 1e7 ? 1 : 2).replace(/\.0+$/, '') + 'M'; if (a >= 1e4) return (n / 1e3).toFixed(a >= 1e5 ? 0 : 1).replace(/\.0$/, '') + 'k'; return n.toLocaleString('ru-RU'); }
function signDemand(p) {
  // сильные игроки не идут в слабые/безымянные команды: нужен уровень лиги и репутация
  const req = Math.max(0, (ovr(p) - 50) * 2.6);
  const ut = userTeam(p.d); const tierBonus = ut ? (2 - ut.tier) * 14 : 0;
  const ml = mgrLv(); const eff = S.rep + tierBonus + (ut ? Math.max(0, teamOvr(ut) - ovr(p) + 8) : 0) + (ml >= 1 ? 5 : 0);
  let mult = 1 + Math.max(0, req - eff) / 35;
  if (p.team === null && S.world[p.d].academy.includes(p.id)) mult = 1;
  return { sal: Math.round(salaryFor(p) * mult * (ml >= 2 ? 0.95 : 1) / 10) * 10, refuse: mult > 1.65, mult, need: Math.ceil(Math.max(0, req - 0.65 * 35 - tierBonus)) };
}
function feeFor(p) { if (!p.team) return S.world[p.d].academy.includes(p.id) ? Math.round(1500 + p.pot * 40) : 0; const deal = p.deal && p.deal.s === S.season && p.deal.w >= S.week ? p.deal.mul : 1; return Math.round(valueOf(p) * (T(p.team).tier === 0 ? 1.3 : 1) * deal); }
function signPlayer(p, years, feeOv, salOv) {
  const d = p.d; const ut = userTeam(d); if (!ut) return 'Нет дивизиона';
  if (ut.roster.length >= 7) return 'Состав полон (макс. 7)';
  const dm = signDemand(p); if (dm.refuse) return pnick(p) + ' не хочет играть за команду вашего уровня';
  const fee = feeOv !== undefined ? feeOv : feeFor(p); if (S.money < fee) return 'Не хватает денег';
  S.money -= fee;
  const W = S.world[d];
  if (p.team) { const ot = T(p.team); ot.roster = ot.roster.filter(i => i !== p.id); const np = genPlayer(d, p.role, ovr(p) - 6); np.team = ot.id; S.players[np.id] = np; ot.roster.push(np.id); }
  W.fa = W.fa.filter(i => i !== p.id); W.academy = W.academy.filter(i => i !== p.id);
  p.team = ut.id; p.sal = salOv || dm.sal; p.ctr = years; p.raiseCD = 10; p.wantRaise = false; p.bench = starters(ut).length >= 5; p.mor = 80; ut.roster.push(p.id);
  ut.chem = Math.max(0, ut.chem - 6);
  news('✍️ ' + S.org.tag + ' подписывает ' + pnick(p) + (fee ? ' за $' + fmt(fee) : ''));
  return null;
}
function releasePlayer(p) { const t = T(p.team); const comp = p.sal * 6; S.money -= comp; t.roster = t.roster.filter(i => i !== p.id); p.team = null; p.bench = false; S.world[p.d].fa.push(p.id); news('🚪 ' + pnick(p) + ' покидает ' + S.org.tag + ' (компенсация $' + fmt(comp) + ')'); }
function raiseTarget(p) { const mk = salaryFor(p); return Math.max(p.sal, Math.round(Math.min(mk, p.sal * 1.35, p.sal + (mk - p.sal) * 0.6) / 10) * 10); }
function extendDemand(p) { return Math.round(Math.max(p.sal * 1.05, raiseTarget(p) * (p.mor < 50 ? 1.1 : 1)) / 10) * 10; }
function hireStaff(s) { const exist = staffOf(s.type, s.d); const sign = s.sal * 4; if (S.money < sign) return 'Не хватает денег на подписной бонус'; exist.forEach(e => delete S.staff[e.id]); S.money -= sign; S.staff[s.id] = s; S.staffMarket = S.staffMarket.filter(x => x.id !== s.id); news('🤝 Нанят ' + STAFF_TYPES[s.type].n.toLowerCase() + ': ' + s.name + (s.d ? ' (' + pack(s.d).game + ')' : '')); return null; }
function facCost(k) { return Math.round(FACILITIES[k].base * Math.pow(1.85, S.fac[k]) / 100) * 100; }
function buildFac(k) { if (S.fac[k] >= 10) return 'Максимум'; const c = facCost(k); if (S.money < c) return 'Не хватает денег'; S.money -= c; S.fac[k]++; news('🏗️ ' + FACILITIES[k].n + ' → уровень ' + S.fac[k]); return null; }
function divCost(d) { return FAKE[d].unlock; }
function divRep(d) { return { cs: 5, dota: 10, dl: 8, rl: 4, fc: 0 }[d]; }
function maxDivs() { return 1 + Math.floor((S.fac.office || 0) / 2); }
function buyDivision(d) { if (S.divs[d]) return 'Уже открыт'; if (Object.keys(S.divs).length >= maxDivs()) return 'Нужен офис побольше: ур. ' + (Object.keys(S.divs).length * 2) + ' для ' + (Object.keys(S.divs).length + 1) + '-го дивизиона'; if (S.rep < divRep(d)) return 'Нужна репутация ' + divRep(d); const c = divCost(d); if (S.money < c) return 'Не хватает денег'; S.money -= c; unlockDivision(d); return null; }
function scrim() { const now = Date.now(); if (now < S.cd.scrim) return null; S.cd.scrim = now + 25000; const g = Math.round(15 + 10 * S.fac.house + Object.keys(S.divs).length * 5); S.tp += g; Object.keys(S.divs).forEach(d => { const t = userTeam(d); t.chem = clamp(t.chem + 0.5, 0, 100); const f = S.divs[d].focus; if (f.length) f.forEach(i => t.prac[i] = clamp(t.prac[i] + 0.4, 0, 100)); }); return g; }
function stream() { const now = Date.now(); if (now < S.cd.stream) return null; S.cd.stream = now + 45000; const f = Math.round((20 + S.fans * 0.01) * (1 + S.fac.marketing * 0.15) * (0.7 + rnd() * 0.6)); const m = Math.round(f * 2 * (1 + S.fac.studio * 0.2)); S.fans += f; S.money += m; return { f, m }; }
const CREATOR_TYPES = [{ n: 'Микро-стример', cost: 3000, inc: 0.4, fans: 40, weeks: 12 }, { n: 'Популярный ютубер', cost: 15000, inc: 1.6, fans: 180, weeks: 16 }, { n: 'Звезда стриминга', cost: 60000, inc: 5, fans: 700, weeks: 20 }];
function hireCreator(i) { const c = CREATOR_TYPES[i]; if (S.money < c.cost) return 'Не хватает денег'; if (S.creators.length >= 3) return 'Максимум 3 контент-мейкера'; S.money -= c.cost; S.creators.push({ n: genNick() + ' (' + c.n + ')', inc: c.inc, fans: c.fans, weeks: c.weeks }); news('🎙️ К организации присоединился контент-мейкер'); return null; }
function talk(p, kind) {
  if (p.talked === S.season * 100 + S.week) return 'Уже говорили на этой неделе';
  p.talked = S.season * 100 + S.week; let msg;
  const r = rnd() + (S.rep / 200) + staffSk('psych') * 0.02;
  if (kind === 'praise') { if (r > 0.35) { p.mor = clamp(p.mor + 8, 0, 100); msg = pnick(p) + ' доволен похвалой (+мораль)'; } else { msg = pnick(p) + ' пожал плечами'; } }
  else if (kind === 'demand') { if (r > 0.55) { p.form = clamp(p.form + 3, -10, 10); p.mor = clamp(p.mor - 3, 0, 100); msg = pnick(p) + ' собрался: форма растёт'; } else { p.mor = clamp(p.mor - 10, 0, 100); msg = pnick(p) + ' обиделся (−мораль)'; } }
  else { p.mor = clamp(p.mor + 12, 0, 100); p.promise = S.season; msg = pnick(p) + ' вдохновлён обещанием трофея. Не подведите!'; }
  return msg;
}

// ---- patch ----
function applyPatchNames() {
  const P = S.patchData; if (!P || !P.disciplines) return;
  DISC_ORDER.forEach(d => {
    const pd = P.disciplines[d]; if (!pd || !pd.teams) return;
    const W = S.world[d];
    const ai = W.tiers[0].concat(W.tiers[1], W.tiers[2]).map(i => teamOf(d, i)).filter(t => !t.user);
    const real = pd.teams.slice().sort((a, b) => avgR(b) - avgR(a));
    real.forEach((rt, k) => {
      const t = ai[k]; if (!t) return;
      if (rt.name && t.real && t.real.name === rt.name) return;
      if (rt.name) t.real = { name: rt.name, tag: rt.tag || rt.name.slice(0, 3).toUpperCase() };
      if (rt.color) t.color = rt.color;
      const used = new Set();
      (rt.players || []).forEach(rp => {
        let p = starters(t).find(x => x.role === rp.role && !used.has(x.id)) || starters(t).find(x => !used.has(x.id));
        if (!p) return; used.add(p.id);
        p.rn = rp.nick; p.rcc = rp.country || null; if (rp.role !== undefined) p.role = rp.role; p.age = rp.age || clamp(p.age, 20, 29);
        if (rp.r) alignOvr(p, rp.r);
        if (rp.pool && p.pool) { p.pool = rp.pool.map(h => [h, clamp(ovr(p) + ri(0, 8), 40, 99)]); }
      });
    });
  });
}
function avgR(t) { const l = (t.players || []).map(p => p.r || 70); return l.reduce((a, b) => a + b, 0) / Math.max(1, l.length); }
function validatePatch(P) { if (!P || typeof P !== 'object' || !P.disciplines) return 'В файле нет поля "disciplines"'; return null; }

// ===== MATCH SIMULATION =====
function newPS() { return { k: 0, d: 0, a: 0, mp: 0, rt: 0, mvp: 0, w: 0, nw: 0, h: null, ag: null }; }

// ---------- FPS ----------
const ENTRY_ROLE = { cs: 2, valo: 0 }, AWP_ROLE = { cs: 1, valo: -1 }, SUP_ROLE = { cs: 4, valo: 3 };
class FpsMap {
  constructor(d, cA, cB, map, opts) {
    this.d = d; this.cA = cA; this.cB = cB; this.map = map; this.opts = opts || {};
    this.sa = 0; this.sb = 0; this.round = 0; this.hist = []; this.done = false; this.winner = null;
    this.ctA = rnd() < 0.5; // A on CT side first
    this.monA = 800; this.monB = 800; this.lsA = 0; this.lsB = 0;
    this.stats = {}; [...cA.players, ...cB.players].forEach(p => this.stats[p.id] = newPS());
    this.boostA = 0; this.boostB = 0; this.toA = 4; this.toB = 4;
    this.otStart = null;
    // коллы менеджера и склонности ИИ (какой сайт любит атаковать, как часто стакает)
    this.call = { A: { buy: 'auto', tac: 'auto' }, B: { buy: 'auto', tac: 'auto' } }; this.tHist = [];
    this.bias = { A: 0.3 + rnd() * 0.4, B: 0.3 + rnd() * 0.4 }; this.read = { A: 0.3 + rnd() * 0.4, B: 0.3 + rnd() * 0.4 };
    // agents for valo
    if (d === 'valo') { [cA, cB].forEach(c => { const used = new Set(); c.players.forEach(p => { const best = (p.pool || []).filter(x => !used.has(x[0])).sort((a, b) => b[1] - a[1])[0]; if (best) { used.add(best[0]); this.stats[p.id].ag = best[0]; this.stats[p.id].agp = best[1]; } }); }); }
    this.modA = this.teamMod(cA) + gauss() * 3; this.modB = this.teamMod(cB) + gauss() * 3;
  }
  teamMod(c) { let m = baseMod(c) + ((c.prac[this.map] || 50) - 50) * 0.22 + c.players.filter(p => sigMap(p) === this.map).length * 0.9; if (this.d === 'valo') { const l = c.players.map(p => this.stats[p.id].agp || 50); m += (l.reduce((a, b) => a + b, 0) / l.length - 60) * 0.06; } return m; }
  buy(mon, ls, round) { if (round === 0 || round === 12 || (this.otStart !== null && (round - this.otStart) % 6 === 0)) return 'pistol'; if (mon >= 3900) return 'full'; if (mon >= 2000 && (ls >= 2 || round === 11 || round === 23)) return 'force'; if (mon >= 2600 && rnd() < 0.35) return 'force'; return 'eco'; }
  // бонус атаки: раш в стак — провал, раш мимо стака — открытый сайт, дефолт наказывает любой стак
  static tacMod(t, ct) { if (t === 'def') return ct === 'std' ? 0 : 3; if (ct === 'std') return 1; return t === ct ? -6 : 5; }
  pickTac(side, isCT) {
    const c = this.call[side].tac; if (c && c !== 'auto') return isCT && c === 'def' ? 'std' : c;
    if (!isCT) { if (rnd() < 0.35) return 'def'; return rnd() < this.bias[side] ? 'A' : 'B'; }
    // ИИ-защита читает последние раунды атаки и иногда стакает
    const last = this.tHist.slice(-4); if (last.length < 2 || rnd() > this.read[side]) return 'std';
    const a = last.filter(x => x === 'A').length; return a * 2 > last.length ? 'A' : a * 2 < last.length ? 'B' : 'std';
  }
  setCall(side, k, v) { this.call[side][k] = v; }
  timeout(side) { if (side === 'A' && this.toA > 0) { this.toA--; this.boostA = 3; return true; } if (side === 'B' && this.toB > 0) { this.toB--; this.boostB = 3; return true; } return false; }
  nextRound() {
    if (this.done) return null;
    const r = this.round; const cA = this.cA, cB = this.cB;
    // AI timeout logic
    if (!cB.user && this.lsB >= 3 && this.toB > 0 && rnd() < 0.6) this.timeout('B');
    if (!cA.user && this.lsA >= 3 && this.toA > 0 && rnd() < 0.6) this.timeout('A');
    // закуп: «авто» или ручной колл менеджера (действует на один раунд)
    const callBuy = (side, mon, ls) => { const auto = this.buy(mon, ls, r); const c = this.call[side].buy; if (!c || c === 'auto' || auto === 'pistol') return auto; if (c === 'full') return mon >= 3900 ? 'full' : mon >= 1500 ? 'force' : 'eco'; if (c === 'force') return mon >= 1500 ? 'force' : 'eco'; return 'eco'; };
    const bA = callBuy('A', this.monA, this.lsA), bB = callBuy('B', this.monB, this.lsB);
    this.call.A.buy = 'auto'; this.call.B.buy = 'auto';
    // тактика: атака (A/B раш или дефолт) против защиты (стак A/B или стандарт)
    const tSide = this.ctA ? 'B' : 'A', ctSide = this.ctA ? 'A' : 'B';
    const tT = this.pickTac(tSide, false), tCT = this.pickTac(ctSide, true);
    const tm = FpsMap.tacMod(tT, tCT); const site = tT === 'def' ? (rnd() < this.bias[tSide] ? 'A' : 'B') : tT;
    this.tHist.push(site);
    const BUY = { pistol: 0, full: 0, force: -4, eco: -10 };
    const cost = { pistol: 800, full: 3900, force: Math.min(this.monA, 2600), eco: 300 };
    const spend = (b, mon) => b === 'full' ? 3900 : b === 'force' ? Math.min(mon, 2700) : b === 'pistol' ? 800 : 250;
    this.monA -= spend(bA, this.monA); this.monB -= spend(bB, this.monB); const mA = this.monA, mB = this.monB;
    // survivors with weapons carry over? keep simple
    const aliveA = cA.players.slice(), aliveB = cB.players.slice();
    const ev = []; let first = true;
    const styleA = cA.style, styleB = cB.style;
    const mm = S.mapMeta && S.mapMeta[this.map]; const sideMod = (isA) => { const ct = isA ? this.ctA : !this.ctA; return (ct ? 0.6 : 0) + (mm === 'ct' && ct ? 2 : mm === 't' && !ct ? 2 : 0); };
    if (this.dayA === undefined) { this.dayA = gauss() * 4; this.dayB = gauss() * 4; }
    const swing = gauss() * 7;
    const extA = swing + this.dayA + this.modA + BUY[bA] + (this.boostA > 0 ? 3 : 0) + sideMod(true) + (this.opts.liveA || 0) + (tSide === 'A' ? tm : -tm);
    const extB = this.dayB + this.modB + BUY[bB] + (this.boostB > 0 ? 3 : 0) + sideMod(false) + (this.opts.liveB || 0) + (tSide === 'B' ? tm : -tm);
    const wsel = (alive, first, side) => wpick(alive, p => { let w = 1; if (first) { if (p.role === ENTRY_ROLE[this.d]) w = 2.4; else if (p.role === AWP_ROLE[this.d]) w = 1.5; else if (p.role === SUP_ROLE[this.d]) w = 0.6; } return w * (0.6 + p.mech / 120); });
    const sk = (p, alone, n, styl, isFirst) => { let s = pSkill(p) * 0.55 + p.mech * 0.25 + (alone ? p.cl * 0.3 : p.iq * 0.2); if (styl === 'agr') s += isFirst ? 3 : -1; if (styl === 'pas') s += isFirst ? -1.5 : 1.5; if (styl === 'bal') s += 0.5; s += (p.con - 60) * 0.03 * gauss() + gauss() * (8 - p.con / 20); return s; };
    while (aliveA.length && aliveB.length) {
      const a = wsel(aliveA, first, 'A'), b = wsel(aliveB, first, 'B');
      const sa = sk(a, aliveA.length === 1 && aliveB.length > 1, aliveA.length, styleA, first) + extA + (aliveA.length - aliveB.length) * 0.9;
      const sb = sk(b, aliveB.length === 1 && aliveA.length > 1, aliveB.length, styleB, first) + extB + (aliveB.length - aliveA.length) * 0.9;
      const pa = sig((sa - sb) / 55);
      const aWin = rnd() < pa;
      const killer = aWin ? a : b, victim = aWin ? b : a; const kAlive = aWin ? aliveA : aliveB, vAlive = aWin ? aliveB : aliveA;
      vAlive.splice(vAlive.indexOf(victim), 1);
      let assist = null; if (kAlive.length > 1 && rnd() < 0.38) { const others = kAlive.filter(x => x !== killer); assist = pick(others); this.stats[assist.id].a++; }
      this.stats[killer.id].k++; this.stats[victim.id].d++;
      ev.push({ k: killer.id, v: victim.id, as: assist ? assist.id : null, A: aWin, fk: first, hs: rnd() < 0.42 + killer.mech / 400, awp: killer.role === AWP_ROLE[this.d] && rnd() < 0.7 });
      first = false;
    }
    const aWon = aliveA.length > 0; const surv = aWon ? aliveA.length : aliveB.length;
    const winnerCT = aWon ? this.ctA : !this.ctA;
    let how = 'elim';
    if (!winnerCT && rnd() < 0.55) how = 'bomb'; else if (winnerCT && rnd() < 0.3) how = 'defuse';
    if (surv === 1 && (aWon ? cA : cB).players.length && ev.length >= 6) { const last = ev[ev.length - 1]; const clutcher = last.k; const kills = ev.filter(e => e.k === clutcher).length; if (kills >= 2) how = 'clutch'; }
    // econ
    if (aWon) { this.sa++; this.monA += 3250 + (how === 'bomb' ? 300 : 0); this.lsA = 0; this.lsB++; this.monB += 1400 + 500 * Math.min(this.lsB - 1, 4); }
    else { this.sb++; this.monB += 3250 + (how === 'bomb' ? 300 : 0); this.lsB = 0; this.lsA++; this.monA += 1400 + 500 * Math.min(this.lsA - 1, 4); }
    this.monA = Math.min(this.monA, 16000); this.monB = Math.min(this.monB, 16000);
    if (this.boostA > 0) this.boostA--; if (this.boostB > 0) this.boostB--;
    const rec = { n: r + 1, A: aWon, ev, how, bA, bB, surv, ctA: this.ctA, sa: this.sa, sb: this.sb, tT, tCT, site, tm, mA, mB };
    this.hist.push(rec);
    this.round++;
    // halves / end
    const lim = 13;
    if (this.otStart === null) {
      if (this.round === 12) { this.ctA = !this.ctA; this.tHist = []; this.monA = this.monB = 800; this.lsA = this.lsB = 0; rec.half = true; }
      if (this.sa >= lim || this.sb >= lim) this.finish();
      else if (this.sa === 12 && this.sb === 12) { this.otStart = this.round; this.monA = this.monB = 10000; this.lsA = this.lsB = 0; rec.ot = true; }
    } else {
      const k = this.round - this.otStart; const baseS = 12 + Math.floor((k - 1) / 6) * 3;
      const need = 12 + (Math.floor((k - 1) / 6) + 1) * 3 + 1;
      if (this.sa >= need || this.sb >= need) this.finish();
      else { if (k % 6 === 3) { this.ctA = !this.ctA; this.tHist = []; this.monA = this.monB = 10000; } if (k % 6 === 0) { this.monA = this.monB = 10000; rec.ot = true; } }
    }
    return rec;
  }
  finish() { this.done = true; this.winner = this.sa > this.sb ? 'A' : 'B'; const R = this.round; Object.entries(this.stats).forEach(([id, s]) => { s.mp = 1; s.rt = fpsRating(s, R); }); }
  run() { while (!this.done) this.nextRound(); return this; }
}
function fpsRating(s, R) { const kpr = s.k / R, dpr = s.d / R, apr = s.a / R; return Math.max(0.2, +(0.08 + kpr / 0.68 * 0.55 + (1 - dpr / 0.68) * 0.3 + apr * 0.7 + 0.2).toFixed(2)); }

function vetoOrder(bo) { if (bo === 1) return ['bA', 'bB', 'bA', 'bB', 'bA', 'bB']; if (bo === 5) return ['bA', 'bB', 'pA', 'pB', 'pA', 'pB']; return ['bA', 'bB', 'pA', 'pB', 'bA', 'bB']; }
function aiVetoChoice(step, avail, me, opp) {
  const sc = i => (me.prac[i] || 50) - (opp.prac[i] || 50) + gauss() * 6;
  if (step[0] === 'b') return avail.slice().sort((a, b) => sc(a) - sc(b))[0];
  return avail.slice().sort((a, b) => sc(b) - sc(a))[0];
}
function autoVeto(cA, cB, bo) {
  let avail = [0, 1, 2, 3, 4, 5, 6]; const picks = []; const log = [];
  vetoOrder(bo).forEach(st => { const me = st[1] === 'A' ? cA : cB, op = st[1] === 'A' ? cB : cA; const m = aiVetoChoice(st, avail, me, op); avail = avail.filter(x => x !== m); if (st[0] === 'p') picks.push(m); log.push([st, m]); });
  picks.push(avail[0]); log.push(['dec', avail[0]]);
  return { picks, log };
}

// ---------- MOBA ----------
const DRAFT_ORDER_5 = [['A', 'ban'], ['B', 'ban'], ['A', 'ban'], ['B', 'ban'], ['A', 'pick'], ['B', 'pick'], ['B', 'pick'], ['A', 'pick'], ['A', 'pick'], ['B', 'pick'], ['B', 'ban'], ['A', 'ban'], ['B', 'pick'], ['A', 'pick'], ['A', 'pick'], ['B', 'pick']];
const DRAFT_ORDER_6 = [['A', 'ban'], ['B', 'ban'], ['A', 'ban'], ['B', 'ban'], ['A', 'pick'], ['B', 'pick'], ['B', 'pick'], ['A', 'pick'], ['A', 'pick'], ['B', 'pick'], ['B', 'ban'], ['A', 'ban'], ['B', 'pick'], ['A', 'pick'], ['A', 'pick'], ['B', 'pick'], ['B', 'pick'], ['A', 'pick']];
function draftOrder(d) { return FAKE[d].size === 6 ? DRAFT_ORDER_6 : DRAFT_ORDER_5; }
function prof(p, h, d) { const e = (p.pool || []).find(x => x[0] === h); if (e) return e[1]; const hr = heroList(d)[h]; return hr && hr.r.includes(p.role) ? ovr(p) - 18 : ovr(p) - 32; }
function newDraft() { return { step: 0, bans: { A: [], B: [] }, picks: { A: [], B: [] } }; }
function draftTaken(dr) { return new Set([...dr.bans.A, ...dr.bans.B, ...dr.picks.A.map(x => x.h), ...dr.picks.B.map(x => x.h)]); }
function bestPlayerFor(c, dr, side, h, d) { const used = new Set(dr.picks[side].map(x => x.pid)); const hr = heroList(d)[h]; let best = null, bs = -1e9; c.players.forEach(p => { if (used.has(p.id)) return; const s = (hr.r.includes(p.role) ? 30 : 0) + prof(p, h, d); if (s > bs) { bs = s; best = p; } }); return best; }
function draftApply(d, dr, cA, cB, h) {
  const [side, kind] = draftOrder(d)[dr.step];
  if (kind === 'ban') dr.bans[side].push(h);
  else { const c = side === 'A' ? cA : cB; const p = bestPlayerFor(c, dr, side, h, d); dr.picks[side].push({ h, pid: p.id }); }
  dr.step++;
}
function aiDraftChoice(d, dr, cA, cB) {
  const [side, kind] = draftOrder(d)[dr.step]; const me = side === 'A' ? cA : cB, op = side === 'A' ? cB : cA; const oside = side === 'A' ? 'B' : 'A';
  const taken = draftTaken(dr); const list = heroList(d); let best = 0, bs = -1e9;
  if (kind === 'ban') {
    const oused = new Set(dr.picks[oside].map(x => x.pid));
    list.forEach((hr, h) => { if (taken.has(h)) return; let s = -1e9; op.players.forEach(p => { if (oused.has(p.id)) return; s = Math.max(s, (hr.r.includes(p.role) ? 20 : 0) + prof(p, h, d)); }); s += heroMeta(d, h) * 3 + gauss() * 4; if (s > bs) { bs = s; best = h; } });
  } else {
    const used = new Set(dr.picks[side].map(x => x.pid));
    list.forEach((hr, h) => { if (taken.has(h)) return; let s = -1e9; me.players.forEach(p => { if (used.has(p.id)) return; s = Math.max(s, (hr.r.includes(p.role) ? 30 : 0) + prof(p, h, d)); }); s += heroMeta(d, h) * 4 + gauss() * 5 + (me.analyst || 0) * 0.3; if (s > bs) { bs = s; best = h; } });
  }
  return best;
}
function autoDraft(d, cA, cB) { const dr = newDraft(); while (dr.step < draftOrder(d).length) draftApply(d, dr, cA, cB, aiDraftChoice(d, dr, cA, cB)); return dr; }
function draftValue(d, dr, side, c) {
  let v = 0; const list = heroList(d);
  dr.picks[side].forEach(({ h, pid }) => { const p = c.players.find(x => x.id === pid); const hr = list[h]; v += (hr.r.includes(p.role) ? 0 : -9) + (prof(p, h, d) - 60) * 0.15 + heroMeta(d, h) * 1.1; });
  return v / 5 + (c.analyst || 0) * 0.15;
}
function scaleCurve(d, dr, side, t) { let v = 0; const list = heroList(d); dr.picks[side].forEach(({ h }) => { const s = list[h].s || 'm'; if (s === 'e') v += t < 15 ? 1.3 : t > 35 ? -0.9 : 0.2; else if (s === 'l') v += t < 15 ? -0.9 : t > 35 ? 1.5 : 0.1; else v += t >= 14 && t <= 32 ? 0.8 : 0; }); return v; }

const KW = { dota: [1.5, 1.6, 1.1, 0.8, 0.5], dl: [1.6, 0.8, 1.4, 1.4, 0.6, 1.0] };
const DW = { dota: [0.7, 0.9, 1.1, 1.3, 1.4], dl: [0.9, 1.2, 1.0, 1.0, 1.3, 1.0] };
const NWS = { dota: [0.3, 0.25, 0.2, 0.14, 0.11], dl: [0.24, 0.14, 0.2, 0.18, 0.1, 0.14] };
class MobaGame {
  constructor(d, cA, cB, dr, opts) {
    this.d = d; this.cA = cA; this.cB = cB; this.dr = dr; this.opts = opts || {};
    this.t = 0; this.lead = 0; this.kA = 0; this.kB = 0; this.twA = 0; this.twB = 0; // towers destroyed BY A / B
    this.done = false; this.winner = null; this.leadHist = [0]; this.feed = [];
    this.buffA = 0; this.buffB = 0; this.bossAt = FAKE[d].bossAt || 15; this.dragA = 0; this.dragB = 0; this.nextDrag = 5;
    this.styleA = cA.style; this.styleB = cB.style;
    this.calls = { A: null, B: null }; this.cd = { A: { smoke: 0, push: 0, boss: 0 }, B: { smoke: 0, push: 0, boss: 0 } }; this.ovx = { A: 0, B: 0 };
    this.stats = {}; [cA, cB].forEach((c, ci) => c.players.forEach(p => { const s = newPS(); const pk = dr.picks[ci ? 'B' : 'A'].find(x => x.pid === p.id); s.h = pk ? pk.h : null; this.stats[p.id] = s; }));
    this.dvA = draftValue(d, dr, 'A', cA); this.dvB = draftValue(d, dr, 'B', cB);
    const avg = c => c.players.reduce((a, p) => a + pSkill(p), 0) / c.players.length;
    const mc = c => c.players.reduce((x, p) => x + metaComfort(p), 0) / c.players.length * 0.35;
    this.baseA = avg(cA) * 0.7 + baseMod(cA) + this.dvA + mc(cA) + gauss() * 3; this.baseB = avg(cB) * 0.7 + baseMod(cB) + this.dvB + mc(cB) + gauss() * 3;
  }
  // коллы: смок-ганк (внезапная драка с бонусом), пуш линии (башня, но риск перехода), босс (драка за Рошана)
  canCall(side, k) { if (this.done || this.calls[side]) return false; if (this.t < this.cd[side][k]) return false; if (k === 'boss') return this.t >= Math.max(10, this.bossAt - 1); if (k === 'smoke') return this.t >= 3; if (k === 'push') return this.t >= 5; return true; }
  callCD(side, k) { return Math.max(0, this.cd[side][k] - this.t); }
  doCall(side, k) { if (!this.canCall(side, k)) return false; this.calls[side] = k; this.cd[side][k] = this.t + { smoke: 6, push: 6, boss: 8 }[k]; return true; }
  aiCall(side) { if (this.calls[side] || rnd() > 0.1) return; const ld = side === 'A' ? this.lead : -this.lead; if (ld > 2500 && this.canCall(side, 'boss')) this.doCall(side, 'boss'); else if (ld > 1500 && this.canCall(side, 'push')) this.doCall(side, 'push'); else if (this.canCall(side, 'smoke') && rnd() < 0.5) this.doCall(side, 'smoke'); }
  styleAdj(st, t) { if (st === 'agr') return t < 25 ? 2.5 : -1.5; if (st === 'farm') return t < 20 ? -1.5 : 2.2; return 0.4; }
  power(side) { const t = this.t; const isA = side === 'A'; const c = isA ? this.cA : this.cB; return (this.mods ? this.mods[side] : 0) + (isA ? this.baseA : this.baseB) + scaleCurve(this.d, this.dr, side, t) + this.styleAdj(c.style, t) + ((isA ? this.buffA : this.buffB) > 0 ? 5 : 0) + ((isA ? this.dragA : this.dragB) >= 4 ? 3 : 0) + gauss() * 4 + (isA ? (this.opts.liveA || 0) : 0); }
  give(side, n, victimSide) {
    const c = side === 'A' ? this.cA : this.cB, v = side === 'A' ? this.cB : this.cA; const kw = KW[this.d], dw = DW[this.d];
    const ks = []; for (let i = 0; i < n; i++) { const k = wpick(c.players, p => kw[p.role] * (0.6 + p.mech / 150)); const vic = wpick(v.players, p => dw[p.role]); this.stats[k.id].k++; this.stats[vic.id].d++; c.players.forEach(p => { if (p !== k && rnd() < 0.5) this.stats[p.id].a++; }); ks.push([k, vic]); }
    return ks;
  }
  tick() {
    if (this.done) return [];
    this.t++; const t = this.t; const ev = [];
    if (!this.cA.user) this.aiCall('A'); if (!this.cB.user) this.aiCall('B');
    // применяем коллы этого хода
    const cl = { A: this.calls.A, B: this.calls.B }; this.calls = { A: null, B: null };
    this.mods = { A: 0, B: 0 }; let force = false, bossFight = null, pushSide = null;
    ['A', 'B'].forEach(s => { const k = cl[s]; if (!k) return; ev.push({ t, type: 'call', side: s, call: k });
      if (k === 'smoke') { force = true; this.mods[s] += cl[s === 'A' ? 'B' : 'A'] === 'smoke' ? 0 : rnd() < 0.35 ? -3 : 3.5; }
      if (k === 'push') { pushSide = s; this.mods[s] -= 3; }
      if (k === 'boss') { force = true; bossFight = s; const ld = s === 'A' ? this.lead : -this.lead; this.mods[s] += ld > 0 ? 1 : -3; } });
    const pA = this.power('A'), pB = this.power('B'); const diff = pA - pB;
    this.lead += diff * 7 + gauss() * 650;
    if (this.buffA > 0) this.buffA--; if (this.buffB > 0) this.buffB--;
    // fight
    const fp = 0.28 + Math.min(0.35, t * 0.007);
    let fightW = null;
    if (force || rnd() < fp) {
      const pw = sig(diff / 24 + this.lead / 16000);
      const aW = rnd() < pw; fightW = aW ? 'A' : 'B';
      const kw = ri(1, 2) + (t > 22 ? ri(0, 2) : 0) + (rnd() < 0.08 ? 2 : 0); const kl = ri(0, Math.max(0, kw - 1));
      const ws = this.give(fightW, Math.min(5, kw)); const ls = this.give(aW ? 'B' : 'A', Math.min(5, kl));
      if (aW) { this.kA += ws.length; this.kB += ls.length; } else { this.kB += ws.length; this.kA += ls.length; }
      this.lead += (aW ? 1 : -1) * (ws.length - ls.length) * 320;
      const big = ws.length >= 4;
      ev.push({ t, type: 'fight', side: fightW, kw: ws.length, kl: ls.length, big, killer: ws[0][0].id, victim: ws[0][1].id });
    }
    // towers
    if (t >= 6) {
      const ld = this.lead; const side = ld > 0 ? 'A' : 'B';
      const ch = 0.07 + Math.abs(ld) / 45000 + (fightW === side ? 0.25 : 0);
      const tot = FAKE[this.d].towers;
      if (pushSide && fightW !== (pushSide === 'A' ? 'B' : 'A') && rnd() < 0.45) { const ps = pushSide; if (ps === 'A' && this.twA < tot - 2) { this.twA++; this.lead += 250; ev.push({ t, type: 'tower', side: 'A', n: this.twA }); } else if (ps === 'B' && this.twB < tot - 2) { this.twB++; this.lead -= 250; ev.push({ t, type: 'tower', side: 'B', n: this.twB }); } }
      else if (rnd() < ch) { if (side === 'A' && this.twA < tot - 2) { this.twA++; this.lead += 450; ev.push({ t, type: 'tower', side: 'A', n: this.twA }); } else if (side === 'B' && this.twB < tot - 2) { this.twB++; this.lead -= 450; ev.push({ t, type: 'tower', side: 'B', n: this.twB }); } }
      else if (fightW && fightW !== side && rnd() < 0.2) { if (fightW === 'A' && this.twA < tot - 2) { this.twA++; ev.push({ t, type: 'tower', side: 'A', n: this.twA }); } else if (fightW === 'B' && this.twB < tot - 2) { this.twB++; ev.push({ t, type: 'tower', side: 'B', n: this.twB }); } }
    }
    // boss
    if (bossFight && fightW && t >= Math.max(10, this.bossAt - 1)) { if (fightW === 'A') this.buffA = 4; else this.buffB = 4; this.lead += (fightW === 'A' ? 1 : -1) * 800; ev.push({ t, type: 'boss', side: fightW, stolen: fightW !== bossFight }); this.bossAt = t + 8; }
    else if (t >= this.bossAt && fightW && rnd() < 0.45) { if (fightW === 'A') this.buffA = 4; else this.buffB = 4; this.lead += (fightW === 'A' ? 1 : -1) * 800; ev.push({ t, type: 'boss', side: fightW }); this.bossAt = t + 8; }
    // end
    const tot = FAKE[this.d].towers;
    const tryEnd = (side) => { const tw = side === 'A' ? this.twA : this.twB; const ld = side === 'A' ? this.lead : -this.lead; if (tw >= tot - 4 && fightW === side && (ld > 4000 || ev.some(e => e.big)) && rnd() < 0.55) return true; if (t >= 48 && fightW === side && ev.some(e => e.big) && rnd() < 0.5) return true; return false; };
    if (tryEnd('A')) this.end('A', ev); else if (tryEnd('B')) this.end('B', ev);
    else if (t >= 75) this.end(this.lead >= 0 ? 'A' : 'B', ev);
    // high ground push
    if (!this.done && fightW && t > 18) { const tw = fightW === 'A' ? this.twA : this.twB; if (tw >= tot - 4 && tw < tot - 2 && rnd() < 0.4) { if (fightW === 'A') this.twA++; else this.twB++; ev.push({ t, type: 'hg', side: fightW }); } }
    this.leadHist.push(Math.round(this.lead));
    this.feed.push(...ev);
    return ev;
  }
  end(side, ev) { this.done = true; this.winner = side; ev.push({ t: this.t, type: 'end', side }); const t = this.t; const gold = s => 600 * t + (s === 'A' ? Math.max(0, this.lead) : Math.max(0, -this.lead)); ['A', 'B'].forEach(s => { const c = s === 'A' ? this.cA : this.cB; const g = gold(s) * c.players.length; c.players.forEach(p => { const st = this.stats[p.id]; st.nw = Math.round(g * NWS[this.d][p.role] / 100) * 100; st.mp = 1; st.rt = mobaRating(st, s === side); }); }); }
  run() { while (!this.done) this.tick(); return this; }
}
function mobaRating(s, won) { return +Math.max(0.2, (0.55 + (s.k * 1.0 + s.a * 0.55 - s.d * 0.7) / 14 + (won ? 0.18 : 0))).toFixed(2); }


// ---- коллы в мячевых дисциплинах (RL, FC) ----
const BCALL = {
  ball: { allin: { dur: 60, cd: 90, own: 0.07, opp: 0.05, pow: 0 }, park: { dur: 60, cd: 90, own: -0.05, opp: -0.07, pow: 0 }, rot: { dur: 90, cd: 999, own: 0, opp: 0, pow: 3, once: true } },
  duel: { allin: { dur: 15, cd: 20, own: 0.02, opp: 0.012, pow: 0 }, park: { dur: 15, cd: 20, own: -0.02, opp: -0.025, pow: 0 }, rot: { dur: 200, cd: 999, own: 0, opp: 0, pow: 2.5, once: true } },
};
const ballCallMix = {
  initCalls() { this.calls = { A: null, B: null }; this.ccd = { A: {}, B: {} }; },
  canCall(side, k) { const C = BCALL[this.kindB][k]; if (this.done || !C) return false; const cd = this.ccd[side][k]; if (C.once) return cd === undefined; return cd === undefined || this.t >= cd; },
  callCD(side, k) { const C = BCALL[this.kindB][k]; const cd = this.ccd[side][k]; if (cd === undefined) return 0; if (C.once) return -1; return Math.max(0, Math.ceil((cd - this.t) / (this.kindB === 'ball' ? 10 : 1))); },
  doCall(side, k) { if (!this.canCall(side, k)) return false; const C = BCALL[this.kindB][k]; this.calls[side] = { k, until: this.t + C.dur }; this.ccd[side][k] = this.t + C.cd; this.feed.push({ t: this.t, type: 'bcall', side, call: k }); this.pendEv = (this.pendEv || []).concat({ t: this.t, type: 'bcall', side, call: k }); return true; },
  activeCall(side) { const c = this.calls[side]; return c && this.t < c.until ? c.k : null; },
  cmod(side) { const k = this.activeCall(side); return k ? BCALL[this.kindB][k] : { own: 0, opp: 0, pow: 0 }; },
  aiBall(side) { const c = side === 'A' ? this.cA : this.cB; if (c.user) return; const me = side === 'A' ? this.sa : this.sb, op = side === 'A' ? this.sb : this.sa; const late = this.kindB === 'ball' ? this.t >= 200 : this.t >= 70; if (late && me < op && this.canCall(side, 'allin') && rnd() < 0.5) this.doCall(side, 'allin'); else if (late && me > op && this.canCall(side, 'park') && rnd() < 0.4) this.doCall(side, 'park'); else if (me < op && this.canCall(side, 'rot') && rnd() < 0.08) this.doCall(side, 'rot'); },
};
// ---------- ROCKET LEAGUE-like (ball) ----------
const RL_SHOOT = [1.7, 1.1, 0.55], RL_KEEP = [0.45, 0.9, 1.7];
class BallGame {
  constructor(d, cA, cB, arena) {
    this.d = d; this.cA = cA; this.cB = cB; this.arena = arena; this.t = 0; this.sa = 0; this.sb = 0; this.ot = false; this.done = false; this.winner = null; this.feed = [];
    this.stats = {}; [...cA.players, ...cB.players].forEach(p => { const s = newPS(); s.sh = 0; s.dm = 0; this.stats[p.id] = s; });
    const avg = c => c.players.reduce((a, p) => a + pSkill(p), 0) / c.players.length;
    this.bA = avg(cA) * 0.7 + baseMod(cA) + gauss() * 3; this.bB = avg(cB) * 0.7 + baseMod(cB) + gauss() * 3;
    this.kindB = 'ball'; this.initCalls();
  }
  sk(p) { return pSkill(p) * 0.6 + p.mech * 0.3 + p.cl * 0.1 + gauss() * 6; }
  attack(side, ev) {
    const c = side === 'A' ? this.cA : this.cB, o = side === 'A' ? this.cB : this.cA;
    const sh = wpick(c.players, p => RL_SHOOT[p.role] * (0.5 + p.mech / 120)); const kp = wpick(o.players, p => RL_KEEP[p.role] * (0.5 + p.iq / 120));
    this.stats[sh.id].sh++;
    const pg = sig((this.sk(sh) - this.sk(kp)) / 18 - 0.55);
    if (rnd() < pg) {
      if (side === 'A') this.sa++; else this.sb++; this.stats[sh.id].k++;
      let as = null; if (rnd() < 0.6) { as = pick(c.players.filter(p => p !== sh)); this.stats[as.id].a++; }
      ev.push({ t: this.t, type: 'goal', side, p: sh.id, as: as ? as.id : null, ot: this.ot });
      return true;
    }
    this.stats[kp.id].d++; if (rnd() < 0.3) ev.push({ t: this.t, type: 'save', side: side === 'A' ? 'B' : 'A', p: kp.id });
    return false;
  }
  tick() {
    if (this.done) return [];
    this.t += 10; const ev = (this.pendEv || []).slice(); this.pendEv = [];
    this.aiBall('A'); this.aiBall('B'); const mA = this.cmod('A'), mB = this.cmod('B');
    const stA = this.cA.style, stB = this.cB.style;
    const diff = (this.bA + mA.pow + gauss() * 3) - (this.bB + mB.pow + gauss() * 3);
    const chA = 0.17 + diff / 160 + (stA === 'agr' ? 0.04 : stA === 'pas' ? -0.04 : 0) + (stB === 'agr' ? 0.02 : stB === 'pas' ? -0.03 : 0) + mA.own + mB.opp;
    const chB = 0.17 - diff / 160 + (stB === 'agr' ? 0.04 : stB === 'pas' ? -0.04 : 0) + (stA === 'agr' ? 0.02 : stA === 'pas' ? -0.03 : 0) + mB.own + mA.opp;
    let g = false;
    if (rnd() < chA) g = this.attack('A', ev);
    if (!(this.ot && g) && rnd() < chB) g = this.attack('B', ev) || g;
    if (rnd() < 0.12) { const sd = rnd() < 0.5 ? 'A' : 'B'; const c = sd === 'A' ? this.cA : this.cB, o = sd === 'A' ? this.cB : this.cA; const a = pick(c.players), v = pick(o.players); this.stats[a.id].dm++; ev.push({ t: this.t, type: 'demo', side: sd, p: a.id, v: v.id }); }
    if (this.ot && this.sa !== this.sb) this.end(ev);
    else if (!this.ot && this.t >= 300) { if (this.sa !== this.sb) this.end(ev); else { this.ot = true; ev.push({ t: this.t, type: 'ot' }); } }
    else if (this.t >= 720) { if (rnd() < 0.5) this.sa++; else this.sb++; this.end(ev); }
    this.feed.push(...ev); return ev;
  }
  end(ev) { this.done = true; this.winner = this.sa > this.sb ? 'A' : 'B'; ev.push({ t: this.t, type: 'end', side: this.winner }); Object.values(this.stats).forEach(s => { s.mp = 1; const sc = s.k * 100 + s.a * 50 + s.d * 50 + s.sh * 20 + s.dm * 10; s.score = sc; s.rt = +Math.max(0.2, sc / 330).toFixed(2); }); }
  run() { while (!this.done) this.tick(); return this; }
}

// ---------- EA FC-like (1v1 duel) ----------
class DuelGame {
  constructor(d, pA, pB, cA, cB, ko) {
    this.d = d; this.pA = pA; this.pB = pB; this.cA = cA; this.cB = cB; this.ko = ko !== false; this.t = 0; this.sa = 0; this.sb = 0; this.done = false; this.winner = null; this.feed = []; this.pens = null; this.et = false;
    this.stats = {}; [pA, pB].forEach(p => this.stats[p.id] = newPS());
    this.bA = pSkill(pA) * 0.75 + (cA.coach - 8) * 0.2 + gauss() * 3; this.bB = pSkill(pB) * 0.75 + (cB.coach - 8) * 0.2 + gauss() * 3;
    this.kindB = 'duel'; this.initCalls();
  }
  tick() {
    if (this.done) return [];
    this.t += 1; const ev = (this.pendEv || []).slice(); this.pendEv = [];
    this.aiBall('A'); this.aiBall('B'); const mA = this.cmod('A'), mB = this.cmod('B');
    const stA = this.cA.style, stB = this.cB.style;
    const diff = this.bA + mA.pow - this.bB - mB.pow + gauss() * 2;
    const ch = (st, ost, side) => 0.062 + (st === 'agr' ? 0.015 : st === 'pas' ? -0.02 : 0) + (ost === 'agr' ? 0.012 : ost === 'pas' ? -0.012 : 0) + (side === 'A' ? mA.own + mB.opp : mB.own + mA.opp);
    const goal = (side) => { const p = side === 'A' ? this.pA : this.pB, o = side === 'A' ? this.pB : this.pA; const pg = sig((side === 'A' ? diff : -diff) / 14 - 1.0 + (p.mech - o.iq) / 120); if (rnd() < pg) { if (side === 'A') this.sa++; else this.sb++; this.stats[p.id].k++; this.stats[o.id].d++; ev.push({ t: this.t, type: 'goal', side, p: p.id }); } else if (rnd() < 0.25) ev.push({ t: this.t, type: 'chance', side, p: p.id }); };
    if (rnd() < ch(stA, stB, 'A')) goal('A');
    if (rnd() < ch(stB, stA, 'B')) goal('B');
    if (this.t === 45) ev.push({ t: 45, type: 'ht' });
    if (this.t === 90 || this.t === 120) {
      if (this.sa !== this.sb) this.end(ev);
      else if (this.t === 90 && this.ko) { this.et = true; ev.push({ t: 90, type: 'et' }); }
      else if (this.t === 120 || !this.ko) { this.penalties(ev); }
    }
    this.feed.push(...ev); return ev;
  }
  penalties(ev) { let a = 0, b = 0; const pa = 0.74 + (this.pA.cl - this.pB.iq) / 500, pb = 0.74 + (this.pB.cl - this.pA.iq) / 500; for (let i = 0; i < 5; i++) { if (rnd() < pa) a++; if (rnd() < pb) b++; } while (a === b) { if (rnd() < pa) a++; if (rnd() < pb) b++; } this.pens = [a, b]; ev.push({ t: this.t, type: 'pens', a, b }); this.end(ev, a > b ? 'A' : 'B'); }
  end(ev, w) { this.done = true; this.winner = w || (this.sa > this.sb ? 'A' : 'B'); ev.push({ t: this.t, type: 'end', side: this.winner }); [['A', this.pA], ['B', this.pB]].forEach(([s, p]) => { const st = this.stats[p.id]; st.mp = 1; st.rt = +Math.max(0.3, (6 + st.k * 0.8 - st.d * 0.4 + (s === this.winner ? 0.8 : 0)) / 7).toFixed(2); }); }
  run() { while (!this.done) this.tick(); return this; }
}
Object.assign(BallGame.prototype, ballCallMix); Object.assign(DuelGame.prototype, ballCallMix);
function fcPair(cA, cB, g, sa, sb, need) {
  const best = c => c.players.slice().sort((a, b) => ovr(b) - ovr(a))[0];
  if (sa === need - 1 && sb === need - 1 && g >= 2) return [best(cA), best(cB)];
  const i = g % cA.players.length; return [cA.players[i] || cA.players[0], cB.players[i] || cB.players[0]];
}
function seriesBo(d, bo) { return FAKE[d].kind === 'ball' ? (bo >= 5 ? 7 : 5) : bo; }

// ---------- series ----------
function mergeStats(acc, stats, winSideIds) { Object.entries(stats).forEach(([id, s]) => { const a = acc[id] || (acc[id] = { id: +id, mp: 0, k: 0, d: 0, a: 0, rt: 0, w: 0, mvp: 0 }); a.mp += s.mp; a.k += s.k; a.d += s.d; a.a += s.a; a.rt += s.rt; if (winSideIds.has(+id)) a.w++; }); }
function seriesFinalize(acc, res, cA, cB) { const arr = Object.values(acc); const wIds = new Set((res.win === cA.t.id ? cA : cB).players.map(p => p.id)); let mvp = null; arr.forEach(x => { if (wIds.has(x.id) && (!mvp || x.rt / x.mp > mvp.rt / mvp.mp)) mvp = x; }); if (mvp) mvp.mvp = 1; res.ps = arr; res.mvp = mvp ? mvp.id : null; return res; }
function quickSeries(d, m) {
  const A = teamOf(d, m.a), B = teamOf(d, m.b); const cA = teamCtx(A, d), cB = teamCtx(B, d);
  const need = Math.ceil(m.bo / 2); let sa = 0, sb = 0; const maps = []; const acc = {};
  if (FAKE[d].kind === 'fps') {
    const v = autoVeto(cA, cB, m.bo);
    for (const mp of v.picks) { if (sa >= need || sb >= need) break; const g = new FpsMap(d, cA, cB, mp).run(); if (g.winner === 'A') sa++; else sb++; maps.push({ map: mp, sa: g.sa, sb: g.sb }); mergeStats(acc, g.stats, new Set((g.winner === 'A' ? cA : cB).players.map(p => p.id))); }
  } else if (FAKE[d].kind === 'ball') {
    const nd = Math.ceil(seriesBo(d, m.bo) / 2); const ar = shuffle([0, 1, 2, 3, 4, 5, 6]);
    while (sa < nd && sb < nd) { const g = new BallGame(d, cA, cB, ar[(sa + sb) % 7]).run(); if (g.winner === 'A') sa++; else sb++; maps.push({ map: g.arena, sa: g.sa, sb: g.sb, ot: g.ot }); mergeStats(acc, g.stats, new Set((g.winner === 'A' ? cA : cB).players.map(p => p.id))); }
  } else if (FAKE[d].kind === 'duel') {
    let g = 0;
    while (sa < need && sb < need) { const [pa, pb] = fcPair(cA, cB, g, sa, sb, need); const G = new DuelGame(d, pa, pb, cA, cB).run(); if (G.winner === 'A') sa++; else sb++; maps.push({ pa: pa.id, pb: pb.id, sa: G.sa, sb: G.sb, pens: G.pens }); mergeStats(acc, G.stats, new Set([G.winner === 'A' ? pa.id : pb.id])); g++; }
  } else {
    while (sa < need && sb < need) { const dr = autoDraft(d, cA, cB); const g = new MobaGame(d, cA, cB, dr).run(); if (g.winner === 'A') sa++; else sb++; maps.push({ t: g.t, kA: g.kA, kB: g.kB, w: g.winner }); mergeStats(acc, g.stats, new Set((g.winner === 'A' ? cA : cB).players.map(p => p.id))); }
  }
  const res = { win: sa > sb ? A.id : B.id, sa, sb, maps };
  return seriesFinalize(acc, res, cA, cB);
}

// ===== MANAGEMENT: loans, offers, youth, morale =====
function userTeamIds() { return Object.keys(S.divs).map(d => S.divs[d].team); }
function agentDisc() { return 1 - staffSk('agent') * 0.015; }
function isLoanable(p) { if (!p.team || p.loanIn || p.loanOut || p.youth) return false; const t = T(p.team); if (!t || t.user) return false; const top = starters(t).slice().sort((a, b) => ovr(b) - ovr(a)).slice(0, 2).map(x => x.id); return !top.includes(p.id); }
function loanInCost(p) { return Math.round(valueOf(p) * 0.12 * agentDisc() / 100) * 100; }
function loanIn(p) {
  const d = p.d, ut = userTeam(d); if (!ut) return 'Нет дивизиона'; if (ut.roster.length >= 7) return 'Состав полон (макс. 7)'; if (!isLoanable(p)) return 'Клуб не отдаёт этого игрока в аренду';
  const fee = loanInCost(p); if (S.money < fee) return 'Не хватает денег'; S.money -= fee;
  const from = T(p.team); from.roster = from.roster.filter(i => i !== p.id);
  const before = new Set(from.roster); ensureFive(from, d); from.roster.forEach(i => { if (!before.has(i)) S.players[i].tempFor = p.id; });
  p.loanIn = { from: from.id, until: S.season }; p.team = ut.id; p.bench = starters(ut).length >= FAKE[d].size; p.mor = clamp(p.mor + 5, 0, 100); ut.roster.push(p.id); ut.chem = Math.max(0, ut.chem - 4);
  news('🔄 ' + S.org.tag + ' арендует ' + pnick(p) + ' у ' + tname(from) + ' до конца сезона (−$' + fmt(fee) + ')'); return null;
}
function loanOutTarget(p) { const d = p.d; const ut = userTeam(d); const cands = S.world[d].teams.filter(t => !t.user && t.tier >= ut.tier).map(t => { const w = starters(t).filter(x => x.role === p.role).sort((a, b) => ovr(a) - ovr(b))[0]; return { t, w }; }).filter(x => x.w && ovr(x.w) < ovr(p) + (p.youth ? 16 : 4)).sort((a, b) => a.t.tier - b.t.tier || ovr(a.w) - ovr(b.w)); return cands[0] || null; }
function loanOut(p) {
  const d = p.d, ut = userTeam(d), dv = S.divs[d]; const tg = loanOutTarget(p); if (!tg) return 'Никто не готов взять игрока в аренду';
  if (!p.youth && starters(ut).includes(p) && ut.roster.length <= FAKE[d].size) return 'Некем заменить в основе';
  ut.roster = ut.roster.filter(i => i !== p.id); dv.youth = dv.youth.filter(i => i !== p.id);
  const t = tg.t; const idx = t.roster.indexOf(tg.w.id); t.roster[idx] = p.id; tg.w.bench = true; t.roster.push(tg.w.id); if (t.roster.length > 7) { const drop = t.roster.map(i => S.players[i]).filter(x => x.bench && x.id !== p.id).sort((a, b) => ovr(a) - ovr(b))[0]; if (drop) { t.roster = t.roster.filter(i => i !== drop.id); drop.team = null; drop.bench = false; S.world[d].fa.push(drop.id); } }
  p.loanOut = { owner: ut.id, team: t.id, until: S.season, youth: !!p.youth }; p.team = t.id; p.bench = false; dv.out.push(p.id);
  news('✈️ ' + pnick(p) + ' уходит в аренду в ' + tname(t) + ': игровая практика, зарплату платим на 30%'); return null;
}
function signYouth(p) {
  const d = p.d, ut = userTeam(d), dv = S.divs[d]; if (!ut) return 'Нет дивизиона'; if (dv.youth.length >= 6) return 'Молодёжка заполнена (макс. 6)';
  const fee = feeFor(p); if (S.money < fee) return 'Не хватает денег'; S.money -= fee;
  const W = S.world[d]; W.academy = W.academy.filter(i => i !== p.id); W.fa = W.fa.filter(i => i !== p.id);
  p.youth = true; p.team = ut.id; p.sal = Math.max(120, Math.round(salaryFor(p) * 0.35 / 10) * 10); p.ctr = 3; p.mor = 85; dv.youth.push(p.id);
  news('🌱 В молодёжку ' + S.org.tag + ' пришёл ' + pnick(p) + ' (' + p.age + ' лет)'); return null;
}
function promoteYouth(p) { const d = p.d, ut = userTeam(d), dv = S.divs[d]; if (ut.roster.length >= 7) return 'Основной состав полон (макс. 7)'; dv.youth = dv.youth.filter(i => i !== p.id); p.youth = false; p.bench = true; p.sal = Math.max(p.sal, Math.round(salaryFor(p) * 0.8 / 10) * 10); p.ctr = 2; p.mor = clamp(p.mor + 10, 0, 100); ut.roster.push(p.id); news('⬆️ ' + pnick(p) + ' переведён из молодёжки в основной состав'); return null; }
function releaseYouth(p) { const dv = S.divs[p.d]; dv.youth = dv.youth.filter(i => i !== p.id); p.youth = false; p.team = null; S.world[p.d].fa.push(p.id); }
// negotiation
function negKey(p) { return p.id + ':' + S.season + ':' + S.week; }
function buyChance(p, mult) { if (!p.team) return 1; const t = T(p.team); let c = 0.12 + (mult - 0.9) * 1.7; if (starters(t).slice().sort((a, b) => ovr(b) - ovr(a)).slice(0, 2).some(x => x.id === p.id)) c -= 0.18; if (t.tier < userTeam(p.d).tier) c -= 0.1; return clamp(c, 0.02, 0.97); }
function buyWithBid(p, mult, years, salMult) {
  if (S.negot[negKey(p)] === 'no') return { err: 'Клуб уже отказал на этой неделе. Попробуй позже.' };
  const fee = Math.round(feeFor(p) * mult * agentDisc() / 100) * 100;
  const dm = signDemand(p); if (dm.refuse) return { err: pnick(p) + ' не хочет переходить в команду вашего уровня' };
  const salC = salMult >= 1.15 ? 1 : salMult >= 1 ? 0.88 : 0.5; if (rnd() > salC) { S.negot[negKey(p)] = 'no'; p.mor = clamp(p.mor - 3, 0, 100); return { err: pnick(p) + ' отказался от зарплаты $' + fmt(dm.sal * salMult) + '/нед' }; }
  if (p.team && rnd() > buyChance(p, mult)) { S.negot[negKey(p)] = 'no'; const counter = mult < 1.45 ? Math.round(feeFor(p) * (mult + 0.2) * agentDisc() / 100) * 100 : null; return { err: tname(T(p.team)) + ' отклонили $' + fmt(fee) + '.', counter, counterMult: mult + 0.2 }; }
  const e = signPlayer(p, years, fee, Math.round(dm.sal * salMult / 10) * 10); return e ? { err: e } : { ok: true };
}
function acceptCounter(p, mult, years) { const fee = Math.round(feeFor(p) * mult * agentDisc() / 100) * 100; const dm = signDemand(p); delete S.negot[negKey(p)]; const e = signPlayer(p, years, fee, dm.sal); return e ? { err: e } : { ok: true }; }
function sellPlayer(p, team, fee) {
  const d = p.d, ut = userTeam(d); ut.roster = ut.roster.filter(i => i !== p.id); S.money += fee;
  team.roster.push(p.id); p.team = team.id; p.bench = false; p.ctr = ri(2, 3); p.sal = salaryFor(p); p.transferReq = false;
  const worst = starters(team).filter(x => x.role === p.role && x.id !== p.id).sort((a, b) => ovr(a) - ovr(b))[0]; if (worst) { worst.bench = true; } if (team.roster.length > 7) { const drop = team.roster.map(i => S.players[i]).filter(x => x.bench).sort((a, b) => ovr(a) - ovr(b))[0]; if (drop) { team.roster = team.roster.filter(i => i !== drop.id); drop.team = null; drop.bench = false; S.world[d].fa.push(drop.id); } }
  ensureFive(ut, d); news('💰 ' + pnick(p) + ' продан в ' + tname(team) + ' за $' + fmt(fee), 'good');
}
function respondOffer(id, action) {
  const o = S.tOffers.find(x => x.id === id); if (!o) return 'Предложение устарело'; const p = S.players[o.pid]; const team = teamOf(p.d, o.team);
  if (action === 'accept') { S.tOffers = S.tOffers.filter(x => x !== o); sellPlayer(p, team, o.fee); return null; }
  if (action === 'reject') { S.tOffers = S.tOffers.filter(x => x !== o); if (p.transferReq) p.mor = clamp(p.mor - 8, 0, 100); return 'Отклонено'; }
  if (action === 'counter') { if (o.countered) return 'Уже торговались'; o.countered = true; if (rnd() < 0.45) { o.fee = Math.round(o.fee * 1.2 / 100) * 100; return 'Согласны на $' + fmt(o.fee) + '! Подтверди продажу.'; } S.tOffers = S.tOffers.filter(x => x !== o); return tname(team) + ' отозвали предложение'; }
}
function moodFactors(p) {
  const f = []; const t = p.team && T(p.team);
  if (p.youth) { f.push(['Молодёжный состав — развивается', 1]); }
  else if (t && t.user) {
    const st = starters(t).includes(p); f.push([st ? 'Игровое время: в основе' : 'Мало игрового времени (запас)', st ? 1 : -2]);
    const last = (t.last || []).slice(-5); const w = last.filter(x => x === 'W').length; if (last.length) f.push(['Результаты команды: ' + w + '/' + last.length + ' побед', w >= 3 ? 1 : w <= 1 ? -2 : 0]);
  }
  if (p.loanOut) f.push(['В аренде: получает игровую практику', 1]);
  if (p.loanIn) f.push(['Аренда до конца сезона', 0]);
  const mk = salaryFor(p); if (p.sal < mk * 0.75 && !p.youth) f.push(['Зарплата ниже рыночной ($' + fmt(mk) + ')', -2]); else if (p.sal >= mk * 1.1) f.push(['Доволен зарплатой', 1]);
  if (p.promise === S.season) f.push(['Ждёт обещанный трофей в этом сезоне', 0]);
  if (S.fac.wellness >= 3) f.push(['Wellness-зона на базе', 1]); if (staffSk('psych') >= 10) f.push(['Хороший психолог', 1]);
  if (p.transferReq) f.push(['Хочет уйти из команды', -3]);
  return f;
}
function weeklyManagement() {
  Object.keys(S.divs).forEach(d => {
    const ut = userTeam(d), dv = S.divs[d]; dv.youth = dv.youth || []; dv.out = dv.out || [];
    const st = starters(ut); let raisedThisWeek = false;
    ut.roster.forEach(i => { const p = S.players[i]; if (p && p.promise === 'start' && !st.includes(p)) { p.mor = clamp(p.mor - 3, 0, 100); if (!p.promiseWarn) { p.promiseWarn = true; news('😠 ' + pnick(p) + ' напоминает: ему обещали место в основе', 'bad'); } } else if (p) p.promiseWarn = false; });
    ut.roster.forEach(i => { const p = S.players[i]; if (!p || p.standin) return; let dm = st.includes(p) ? 1 : (p.age <= 19 ? 0 : -2); if (p.raiseCD > 0) p.raiseCD--; const under = p.sal < salaryFor(p) * 0.7; if (!under) p.wantRaise = false; else if (p.wantRaise) dm -= 1; else if (!p.raiseCD && !p.loanIn && !raisedThisWeek && rnd() < 0.35) { p.wantRaise = true; raisedThisWeek = true; news('💬 ' + pnick(p) + ' вырос как игрок и просит пересмотреть зарплату', 'bad'); } p.mor = clamp(p.mor + dm, 0, 100); if (p.mor < 25 && !p.transferReq) { p.transferReq = true; news('📢 ' + pnick(p) + ' просит выставить его на трансфер!', 'bad'); } if (p.mor > 55) p.transferReq = false; if (p.ctr === 1 && S.week === 12 && !p.loanIn) news('⏳ У ' + pnick(p) + ' последний год контракта — продли, иначе уйдёт бесплатно', 'bad'); });
    const yb = S.fac.academy * 0.07 + staffSk('youth') * 0.05;
    dv.youth.forEach(i => { const p = S.players[i]; if (!p) return; ATTRS.forEach(([a]) => { p.xp[a] = (p.xp[a] || 0) + yb * (0.5 + rnd()); while (p.xp[a] >= 1) { p.xp[a] -= 1; if (ovr(p) < p.pot) p[a] = Math.min(99, p[a] + 1); } }); p.mor = clamp(p.mor + 1, 0, 100); });
    dv.out.forEach(i => { const p = S.players[i]; if (!p) return; ATTRS.forEach(([a]) => { p.xp[a] = (p.xp[a] || 0) + 0.25 * (0.5 + rnd()); while (p.xp[a] >= 1) { p.xp[a] -= 1; if (ovr(p) < p.pot) p[a] = Math.min(99, p[a] + 1); } }); p.mor = clamp(p.mor + 1, 0, 100); });
    // отступные: если сумма низкая (×2), сильный клуб может выкупить игрока — сначала предупреждение
    ut.roster.map(i => S.players[i]).filter(p => p && p.clause && !p.loanIn).forEach(p => {
      p.clauseW = (p.clauseW || 0) + 1; if (p.clauseW < 12 || p.clause > valueOf(p) * 2.5 || ut.roster.length <= FAKE[d].size) return;
      if (!p.clauseWarn && rnd() < 0.06) { p.clauseWarn = 3; news('👀 Клубы интересуются ' + pnick(p) + ': его отступные ($' + fmt(p.clause) + ') выглядят дёшево. Продли контракт, чтобы убрать отступные.', 'bad'); return; }
      if (p.clauseWarn) { p.clauseWarn--; if (p.clauseWarn === 0 && rnd() < 0.5) { const buyers = S.world[d].teams.filter(t => !t.user && t.tier <= ut.tier && t.roster.length < 7); if (buyers.length) { const tb = pick(buyers); news('💥 ' + tname(tb) + ' активировали отступные ' + pnick(p) + ' — +$' + fmt(p.clause), 'bad'); sellPlayer(p, tb, p.clause); p.clause = null; } } }
    });
    // incoming offers
    if (rnd() < 0.3 + S.rep / 400) {
      const cands = ut.roster.map(i => S.players[i]).filter(p => p && !p.loanIn && !p.standin && !S.tOffers.some(o => o.pid === p.id)); if (cands.length) {
        const p = wpick(cands, x => Math.pow(Math.max(1, ovr(x) - 40), 2) * (x.transferReq ? 3 : 1));
        const buyers = S.world[d].teams.filter(t => !t.user && t.tier <= ut.tier); const team = pick(buyers.length ? buyers : S.world[d].teams.filter(t => !t.user));
        const fee = Math.round(valueOf(p) * (0.85 + rnd() * 0.55) * (1 + staffSk('agent') * 0.02) / 100) * 100;
        S.tOffers.push({ id: nid(), pid: p.id, team: team.id, fee, weeks: 2 }); news('📨 ' + tname(team) + ' предлагают $' + fmt(fee) + ' за ' + pnick(p));
      }
    }
  });
  S.tOffers.forEach(o => o.weeks--); S.tOffers = S.tOffers.filter(o => o.weeks > 0 && S.players[o.pid] && isUserPlayer(S.players[o.pid]));
  if (S.fac.office) S.rep = clamp(S.rep + S.fac.office * 0.02, 0, 100);
}
// Если в составе не хватает игроков на позиции — подписываем лучшего доступного свободного агента на сезон
function fillUserLineup(d) {
  const ut = userTeam(d); const sz = FAKE[d].size;
  for (let role = 0; role < sz; role++) {
    if (ut.roster.some(i => S.players[i] && S.players[i].role === role)) continue;
    const W = S.world[d]; let cand = W.fa.map(i => S.players[i]).filter(p => p && p.role === role).sort((a, b) => ovr(b) - ovr(a))[0];
    if (!cand) { cand = genPlayer(d, role, 50); S.players[cand.id] = cand; W.fa.push(cand.id); }
    W.fa = W.fa.filter(i => i !== cand.id); cand.team = ut.id; cand.ctr = 1; cand.sal = Math.round(salaryFor(cand) * 0.9 / 10) * 10; cand.bench = false; cand.mor = 70; cand.raiseCD = 10; ut.roster.push(cand.id);
    news('🧩 На позицию ' + FAKE[d].roles[role] + ' временно подписан ' + pnick(cand) + ' (контракт на сезон)', 'bad');
  }
  ensureFive(ut, d);
}
function seasonManagement() {
  Object.keys(S.divs).forEach(d => {
    const ut = userTeam(d), dv = S.divs[d]; dv.youth = dv.youth || []; dv.out = dv.out || [];
    // loans in return
    ut.roster.slice().forEach(i => { const p = S.players[i]; if (!p || !p.loanIn) return; const from = teamOf(d, p.loanIn.from); ut.roster = ut.roster.filter(x => x !== p.id); from.roster.filter(x => S.players[x] && S.players[x].tempFor === p.id).forEach(x => { from.roster = from.roster.filter(y => y !== x); delete S.players[x]; }); from.roster.push(p.id); p.team = from.id; p.bench = false; delete p.loanIn; news('↩️ ' + pnick(p) + ' вернулся из аренды в ' + tname(from)); });
    // loans out return
    dv.out.slice().forEach(i => { const p = S.players[i]; if (!p) return; const t = teamOf(d, p.loanOut.team); if (t) { t.roster = t.roster.filter(x => x !== p.id); ensureFive(t, d); } const wasY = p.loanOut.youth; delete p.loanOut; p.team = ut.id; if (wasY && dv.youth.length < 6) { p.youth = true; dv.youth.push(p.id); } else { p.youth = false; p.bench = true; ut.roster.push(p.id); } news('🛬 ' + pnick(p) + ' вернулся из аренды (OVR ' + ovr(p) + ')'); });
    dv.out = [];
    while (ut.roster.length > 7) { const drop = ut.roster.map(i => S.players[i]).sort((a, b) => ovr(a) - ovr(b))[0]; ut.roster = ut.roster.filter(i => i !== drop.id); drop.team = null; drop.bench = false; S.world[d].fa.push(drop.id); news('🚪 Не хватило места: ' + pnick(drop) + ' ушёл в свободные агенты', 'bad'); }
    // youth aging
    dv.youth.slice().forEach(i => { const p = S.players[i]; if (!p) return; if (p.age >= 20) { releaseYouth(p); news('🎓 ' + pnick(p) + ' перерос молодёжку и ушёл свободным агентом', 'bad'); } else if (p.age === 19) news('🎓 ' + pnick(p) + ' — последний год в молодёжке. Переведи его в основу!'); });
    // promises
    [...ut.roster, ...dv.youth].forEach(i => { const p = S.players[i]; if (p && p.promise === S.season) { const won = S.trophies.some(t => t.s === S.season && t.d === d); if (!won) { p.mor = clamp(p.mor - 25, 0, 100); news('💔 ' + pnick(p) + ' разочарован: обещанного трофея нет', 'bad'); } else p.mor = clamp(p.mor + 10, 0, 100); delete p.promise; } });
  });
  S.tOffers = [];
}

export { answerRaise };
export { mediaWeekly, tpWeekly };
export { leagueWeekly };
export { leaguePosFactor, weeksToPayday, goalProgress, makeGoal };
export { raiseTarget };
export { META_TAGS, heroTags, trendText, ensureMeta, metaMajor, metaMinor, aiMetaAdapt };
export { sigMap, sigHero, marketWeek, onHook, migrateHeroRoles, learnCap, learnRate, setLearn, metaComfort };
export { TRAITS, traitOf, pairVal, pairAdd, pairDelta, teamPairs };
export { ATTRS,BallGame,CC_WEIGHTED,COUNTRIES,CREATOR_TYPES,DISC_ORDER,DRAFT_ORDER_5,DRAFT_ORDER_6,DW,DuelGame,ENTRY_ROLE,EVENTS,FACILITIES,FAKE,FIRST,FLAG,FpsMap,H,KW,LAST,MobaGame,NICK_A,NICK_SUF,NWS,PRIZE,RL_SHOOT,SEASON_WEEKS,SPONSOR_NAMES,STAFF_TYPES,T,TEAM_A,TEAM_B,TEAM_COLORS,acceptCounter,advanceWC,agentDisc,aiDraftChoice,aiTransfer,aiVetoChoice,alignOvr,applyPatchNames,applyResult,autoDraft,autoVeto,avgR,baseMod,bestPlayerFor,buildFac,buildWorld,buyChance,buyDivision,buyWithBid,canUp,clamp,divCost,divRep,doUp,draftApply,draftOrder,draftTaken,draftValue,ensureFive,extendDemand,facCost,fcPair,feeFor,finishWeek,fmt,fpsRating,gauss,genNick,genOffers,genPlayer,genPool,genStaff,genStaffMarket,genTeamName,heroList,heroMeta,heroName,hireCreator,hireStaff,idleTick,isLoanable,isUserPlayer,loanIn,loanInCost,loanOut,loanOutTarget,makeSchedule,mapName,maxDivs,mergeStats,metaShift,mobaRating,moodFactors,negKey,newCareer,newDraft,newPS,newSeason,newStats,news,nid,offlineCapH,offlineGain,ovr,pSkill,pack,passiveRate,pcc,phaseOf,pick,pnick,potView,prof,promoteYouth,quickSeries,randomEvent,refreshAcademy,releasePlayer,releaseYouth,respondOffer,ri,rnd,salaryFor,scaleCurve,scrim,seasonManagement,sellPlayer,seriesBo,seriesFinalize,setupFinals,setupPlayoffs,setupWC,shuffle,sig,signDemand,signPlayer,signYouth,sponsorSlots,staffOf,staffSk,standings,starters,stream,talk,teamColor,teamCtx,teamOf,teamOvr,tname,tpRate,ttag,unlockDivision,upCost,userMatchesThisWeek,userTeam,userTeamIds,validatePatch,valueOf,vetoOrder,weekMatches,weeklyCosts,weeklyGrowth,weeklyManagement,weeklySponsor,wpick };
