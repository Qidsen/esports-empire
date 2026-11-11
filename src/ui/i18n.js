// Перевод интерфейса без переписывания экранов: любые строки внутри <Text> прогоняются через словарь фрагментов.
import { Text, TextInput } from 'react-native';
import { SET } from './settings';
import { DICT } from './i18nDict';

const L = /[A-Za-zА-Яа-яЁёІіЇїЄєҐґ0-9]/;
const RX = {}; const CACHE = { uk: new Map(), en: new Map() };
function rx(lang) {
  if (RX[lang]) return RX[lang];
  const keys = Object.keys(DICT[lang] || {}).sort((a, b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  RX[lang] = new RegExp(keys.join('|'), 'g'); return RX[lang];
}
export function tr(s, lang = SET.lang) {
  if (typeof s !== 'string' || lang === 'ru' || !DICT[lang] || !/[А-Яа-яЁё]/.test(s)) return s;
  const C = CACHE[lang]; const hit = C.get(s); if (hit !== undefined) return hit;
  const dict = DICT[lang];
  const out = s.replace(rx(lang), (m, off, str) => {
    // границы слова: не переводим кусок внутри другого слова
    if (L.test(m[0]) && off > 0 && L.test(str[off - 1])) return m;
    const end = off + m.length; if (L.test(m[m.length - 1]) && end < str.length && L.test(str[end])) return m;
    return dict[m];
  });
  if (C.size > 4000) C.clear(); C.set(s, out); return out;
}
function trKids(c) { if (typeof c === 'string') return tr(c); if (Array.isArray(c)) { let ch = false; const r = c.map(x => { const y = typeof x === 'string' ? tr(x) : x; if (y !== x) ch = true; return y; }); return ch ? r : c; } return c; }
function wrap(f) { return function (type, props, ...rest) { if (type === TextInput && props && props.placeholder && SET.lang !== 'ru') props = Object.assign({}, props, { placeholder: tr(props.placeholder) }); if (type === Text && props && props.children != null && SET.lang !== 'ru') { const k = trKids(props.children); if (k !== props.children) props = Object.assign({}, props, { children: k }); } return f.call(this, type, props, ...rest); }; }
let done = false;
export function installI18n() {
  if (done) return; done = true;
  [() => require('react/jsx-runtime'), () => require('react/jsx-dev-runtime')].forEach(g => { try { const m = g(); ['jsx', 'jsxs', 'jsxDEV'].forEach(k => { if (typeof m[k] === 'function') { try { m[k] = wrap(m[k]); } catch (e) { } } }); } catch (e) { } });
  try { const R = require('react'); const ce = R.createElement; R.createElement = function (type, props, ...kids) { if (type === Text && SET.lang !== 'ru') kids = kids.map(trKids); return ce.call(this, type, props, ...kids); }; } catch (e) { }
}
