import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SG, Stop, Text as ST, Circle, Rect, G } from 'react-native-svg';
import { C, F, ovrColor, shade, alpha } from './theme';
import { S, FLAG, ttag, ovr, FAKE } from '../core/game';
import { PATCH_ICONS } from '../core/patchIcons';
import { TEAM_LOGOS } from '../core/teamLogos';

export const T = ({ s, style, children, num, h, mu, n, ...rest }) => (
  <Text numberOfLines={n} style={[{ color: mu ? C.mu : C.tx, fontSize: s || 13, fontFamily: h ? F.h : num ? F.hm : F.b }, style]} {...rest}>{children}</Text>
);
export const H = ({ children, style, right }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
    <Text style={[{ color: C.mu, fontFamily: F.h, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', flex: 1 }, style]}>{children}</Text>
    {right}
  </View>
);
import { Ico, splitIcon, iconKey } from './icons';
export function Panel({ children, style, ac, pad = 12, onPress }) {
  const inner = (
    <View style={[st.panel, { padding: pad }, style]}>
      <LinearGradient colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.4 }} pointerEvents="none" />
      {ac ? <View style={{ position: 'absolute', left: 0, top: 10, bottom: 10, width: 3, borderRadius: 3, backgroundColor: ac }} /> : null}
      {children}
    </View>
  );
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>{inner}</Pressable> : inner;
}
export function Btn({ title, onPress, kind, ac, disabled, small, style, icon, wide }) {
  const accent = ac || C.blue;
  const pri = kind === 'pri', danger = kind === 'bad', good = kind === 'good';
  const [lk, tt] = splitIcon(title); const ik = iconKey(icon) || lk; const tc = pri || good ? '#0a0d14' : danger ? '#ffd6db' : C.tx;
  const colors = pri ? [shade(accent, 1.15), shade(accent, 0.75)] : good ? ['#4ff09a', '#25b468'] : danger ? ['rgba(255,90,106,0.28)', 'rgba(255,90,106,0.14)'] : ['rgba(60,72,104,0.65)', 'rgba(36,44,66,0.65)'];
  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [{ opacity: disabled ? 0.35 : pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }, wide && { alignSelf: 'stretch' }, style]}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[st.btn, small && st.btnSm, pri && { shadowColor: accent, shadowOpacity: 0.6, shadowRadius: 12, shadowOffset: { width: 0, height: 0 } }, { borderColor: pri ? alpha('#ffffff', 0.25) : danger ? 'rgba(255,90,106,0.45)' : C.line2 }]}>
        {ik ? <Ico n={ik} size={small ? 14 : 17} color={tc} style={{ marginRight: 6 }} /> : null}
        <Text numberOfLines={1} style={{ color: tc, fontFamily: F.h, fontSize: small ? 11 : 12.5, letterSpacing: 0.3, textTransform: 'uppercase' }}>{tt}</Text>
      </LinearGradient>
    </Pressable>
  );
}
export function Seg({ items, value, onChange, ac, style }) {
  return (
    <View style={[st.seg, style]}>
      {items.map(([k, n]) => {
        const on = k === value;
        return (
          <Pressable key={String(k)} onPress={() => onChange(k)} style={[st.segI, on && { backgroundColor: alpha(ac || C.blue, 0.22), borderColor: alpha(ac || C.blue, 0.6) }]}>
            <Text numberOfLines={1} style={{ color: on ? C.tx : C.mu, fontFamily: F.hm, fontSize: 11.5 }}>{n}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
export function Chips({ items, value, onChange, ac }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, flexShrink: 0, height: 36, marginBottom: 8 }} contentContainerStyle={{ gap: 6, alignItems: 'center' }}>
      {items.map(([k, n, dim, ic]) => {
        const on = k === value;
        return (
          <Pressable key={String(k)} onPress={() => onChange(k)} style={[st.chip, on && { backgroundColor: ac || C.blue, borderColor: 'transparent' }, dim && !on && { opacity: 0.5 }]}>
            {ic ? <View style={{ marginRight: 5 }}><GameIcon d={ic} size={16} plain /></View> : null}<Text numberOfLines={1} style={{ color: on ? '#0a0d14' : C.mu, fontFamily: F.hm, fontSize: 12 }}>{n}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
export const Bar = ({ v, ac, h = 6, style }) => (
  <View style={[{ height: h, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: h, overflow: 'hidden' }, style]}>
    <LinearGradient colors={[shade(ac || C.blue, 0.8), ac || C.blue]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: `${Math.max(0, Math.min(100, v))}%`, height: '100%', borderRadius: h }} />
  </View>
);
export const Stat = ({ label, value, color, style, sub }) => (
  <View style={[st.stat, style]}>
    <Text style={{ color: C.mu, fontSize: 9.5, letterSpacing: 1, textTransform: 'uppercase', fontFamily: F.hm }}>{label}</Text>
    <Text numberOfLines={1} style={{ color: color || C.tx, fontFamily: F.h, fontSize: 17, marginTop: 1 }}>{value}</Text>
    {sub ? <Text style={{ color: C.mu, fontSize: 10 }}>{sub}</Text> : null}
  </View>
);
export const Ovr = ({ o, s = 20, style }) => <Text style={[{ color: ovrColor(o), fontFamily: F.hx, fontSize: s, minWidth: s * 1.5, textAlign: 'right' }, style]}>{o}</Text>;
export const Flag = ({ cc, s = 14 }) => <Text style={{ fontSize: s }}>{FLAG[cc] || '🏳️'}</Text>;
export const Tag = ({ t, c, style }) => (
  <View style={[{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, backgroundColor: c ? alpha(c, 0.18) : 'rgba(255,255,255,0.08)' }, style]}>
    <Text numberOfLines={1} style={{ color: c || C.mu, fontFamily: F.h, fontSize: 9.5, letterSpacing: 0.6, textTransform: 'uppercase' }}>{t}</Text>
  </View>
);
export const Role = ({ t }) => <View style={st.role}><Text numberOfLines={1} style={{ color: C.mu, fontFamily: F.h, fontSize: 9, letterSpacing: 0.5, textTransform: 'uppercase' }}>{t}</Text></View>;
export function Logo({ c1, c2, tag, size = 40 }) {
  const t = String(tag || '?').slice(0, 4); const fs = t.length > 3 ? 25 : t.length > 2 ? 31 : 38; const id = 'g' + (c1 || '').replace('#', '') + size;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs><SG id={id} x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor={c1} /><Stop offset="1" stopColor={shade(c1, 0.4)} /></SG></Defs>
      <Path d="M50 3 L92 27 L92 73 L50 97 L8 73 L8 27 Z" fill={`url(#${id})`} stroke={c2 || '#05070b'} strokeWidth={5} />
      <Path d="M50 14 L82 32 L82 68 L50 86 L18 68 L18 32 Z" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={2} />
      <ST x="50" y={50 + fs * 0.36} textAnchor="middle" fontFamily="Exo2_800ExtraBold" fontSize={fs} fill="#fff" stroke="rgba(0,0,0,0.35)" strokeWidth={1.5}>{t}</ST>
    </Svg>
  );
}
// Картинка-логотип (круг) — для реальных команд и загруженного логотипа клуба.
export const ImgLogo = ({ uri, size }) => <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} resizeMode="contain" />;
let _pl = null, _plSrc = null;
function patchLogo(name) {
  const P = S && S.patchData; if (!P || !P.disciplines) return null;
  if (_plSrc !== P) { _plSrc = P; _pl = {}; Object.values(P.disciplines).forEach(dd => (dd.teams || []).forEach(t => { if (t.name && t.logo) _pl[t.name] = t.logo; })); }
  return _pl[name] || null;
}
export function teamKey(t) { return S.patchOn && t.real && t.real.name ? t.real.name : (t.fake && t.fake.name) || ''; }
export function teamLogoUri(t) { if (!t) return null; if (t.user) return S.org.logo || null; const cu = S.customLogos && S.customLogos[teamKey(t)]; if (cu) return cu; if (S.patchOn && t.real && t.real.name) return patchLogo(t.real.name) || TEAM_LOGOS[t.real.name] || null; return null; }
export const OrgLogo = ({ size = 40 }) => S.org.logo ? <ImgLogo uri={S.org.logo} size={size} /> : <Logo c1={S.org.c1} c2={S.org.c2} tag={S.org.tag} size={size} />;
export const TeamLogo = ({ t, size }) => { const u = teamLogoUri(t); if (u) return <ImgLogo uri={u} size={size} />; return t.user ? <Logo c1={S.org.c1} c2={S.org.c2} tag={S.org.tag} size={size} /> : <Logo c1={t.color} c2="#05070b" tag={ttag(t)} size={size} />; };
export function Stars({ lo, hi }) { const f = v => Math.max(1, Math.min(5, Math.round((v - 40) / 12))); const a = f(lo), b = f(hi); return <Text style={{ fontSize: 11, color: C.gold }}>{'★'.repeat(a)}<Text style={{ opacity: 0.45 }}>{'★'.repeat(b - a)}</Text><Text style={{ opacity: 0.15 }}>{'★'.repeat(5 - b)}</Text></Text>; }
export const Row = ({ children, style, gap = 8 }) => <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
export const Sep = () => <View style={{ height: 1, backgroundColor: C.line, marginVertical: 6 }} />;

const st = StyleSheet.create({
  panel: { backgroundColor: C.glass, borderRadius: 14, borderWidth: 1, borderColor: C.line, overflow: 'hidden', marginBottom: 10 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1 },
  btnSm: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  seg: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 3, gap: 3, borderWidth: 1, borderColor: C.line },
  segI: { flex: 1, alignItems: 'center', paddingVertical: 7, borderRadius: 7, borderWidth: 1, borderColor: 'transparent' },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, paddingVertical: 6, borderRadius: 999, backgroundColor: C.glass2, borderWidth: 1, borderColor: C.line },
  stat: { flex: 1, backgroundColor: 'rgba(0,0,0,0.22)', borderRadius: 10, borderWidth: 1, borderColor: C.line, paddingVertical: 7, paddingHorizontal: 9 },
  role: { paddingHorizontal: 5, paddingVertical: 3, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.07)', width: 62, alignItems: 'center' },
});

// Иконка дисциплины. С патчем берёт картинку из patch.disciplines[d].icon (URL или data:URI), иначе — свой векторный значок.
const GLYPH = {
  cs: (w) => <G stroke={w} strokeWidth={2.4} fill="none" strokeLinecap="round"><Circle cx={16} cy={16} r={9} /><Path d="M16 3v7M16 22v7M3 16h7M22 16h7" /><Circle cx={16} cy={16} r={1.6} fill={w} stroke="none" /></G>,
  dota: (w) => <G stroke={w} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round"><Path d="M16 4l10 4v7c0 6.5-4.3 11-10 13-5.7-2-10-6.5-10-13V8z" /><Path d="M16 9v13M12 17.5h8" /></G>,
  dl: (w) => <G stroke={w} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round"><Path d="M10 14v-3a6 6 0 0 1 12 0v3" /><Rect x={7.5} y={14} width={17} height={12} rx={2.5} /><Path d="M16 18.5v3.5" /></G>,
  rl: (w) => <G stroke={w} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"><Path d="M3 23v-3.5l4.5-1.2 3.5-4.3h7.5l4.5 4.3 5 1.2V23z" /><Circle cx={9} cy={23.5} r={2.6} fill={w} stroke="none" /><Circle cx={22.5} cy={23.5} r={2.6} fill={w} stroke="none" /><Circle cx={23.5} cy={8} r={4} /></G>,
  fc: (w) => <G stroke={w} strokeWidth={2.2} fill="none" strokeLinejoin="round"><Circle cx={16} cy={16} r={11} /><Path d="M16 11l4.3 3.1-1.6 5h-5.4l-1.6-5z" fill={w} /><Path d="M16 11V5M20.3 14.1l5.6-1.8M18.7 19.1l3.4 4.8M13.3 19.1l-3.4 4.8M11.7 14.1l-5.6-1.8" /></G>,
};
export function patchIcon(d) { const p = S && S.patchOn && S.patchData && S.patchData.disciplines && S.patchData.disciplines[d]; if (p && typeof p.icon === 'string' && p.icon) return p.icon; return S && S.patchOn ? PATCH_ICONS[d] || null : null; }
export function GameIcon({ d, size = 28, uri, plain }) {
  const src = uri !== undefined ? uri : patchIcon(d); const col = (FAKE[d] && FAKE[d].color) || C.ac;
  if (src) return <Image source={{ uri: src }} style={{ width: size, height: size, borderRadius: size * 0.22 }} resizeMode="contain" />;
  const g = GLYPH[d] || GLYPH.cs;
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.26, overflow: 'hidden', borderWidth: plain ? 0 : 1, borderColor: alpha(col, 0.6) }}>
      {plain ? null : <LinearGradient colors={[alpha(col, 0.45), alpha(col, 0.12)]} style={StyleSheet.absoluteFill} />}
      <Svg width={size} height={size} viewBox="0 0 32 32">{g(plain ? col : '#fff')}</Svg>
    </View>
  );
}

// Вкладки раздела: крупные, всегда видимые, с иконкой.
export function SubTabs({ items, value, onChange, ac, right }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 1, flexShrink: 1 }} contentContainerStyle={{ gap: 6 }}>
        {items.map(([k, n, ic]) => { const on = k === value; return (
          <Pressable key={k} onPress={() => onChange(k)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 34, borderRadius: 10, backgroundColor: on ? (ac || C.blue) : 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: on ? 'transparent' : C.line }}>
            {ic ? <Ico n={ic} size={16} color={on ? '#0a0d14' : C.tx} /> : null}
            <Text numberOfLines={1} style={{ color: on ? '#0a0d14' : C.tx, fontFamily: F.h, fontSize: 12.5 }}>{n}</Text>
          </Pressable>); })}
      </ScrollView>
      {right || null}
    </View>
  );
}
