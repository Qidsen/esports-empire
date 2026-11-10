import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SG, Stop, Text as ST } from 'react-native-svg';
import { C, F, ovrColor, shade, alpha } from './theme';
import { S, FLAG, ttag, ovr } from '../core/game';

export const T = ({ s, style, children, num, h, mu, n, ...rest }) => (
  <Text numberOfLines={n} style={[{ color: mu ? C.mu : C.tx, fontSize: s || 13, fontFamily: h ? F.h : num ? F.hm : F.b }, style]} {...rest}>{children}</Text>
);
export const H = ({ children, style, right }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
    <Text style={[{ color: C.mu, fontFamily: F.h, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', flex: 1 }, style]}>{children}</Text>
    {right}
  </View>
);
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
  const colors = pri ? [shade(accent, 1.15), shade(accent, 0.75)] : good ? ['#4ff09a', '#25b468'] : danger ? ['rgba(255,90,106,0.28)', 'rgba(255,90,106,0.14)'] : ['rgba(60,72,104,0.65)', 'rgba(36,44,66,0.65)'];
  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [{ opacity: disabled ? 0.35 : pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }, wide && { alignSelf: 'stretch' }, style]}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[st.btn, small && st.btnSm, pri && { shadowColor: accent, shadowOpacity: 0.6, shadowRadius: 12, shadowOffset: { width: 0, height: 0 } }, { borderColor: pri ? alpha('#ffffff', 0.25) : danger ? 'rgba(255,90,106,0.45)' : C.line2 }]}>
        {icon ? <Text style={{ fontSize: small ? 12 : 15, marginRight: 6 }}>{icon}</Text> : null}
        <Text numberOfLines={1} style={{ color: pri || good ? '#0a0d14' : danger ? '#ffd6db' : C.tx, fontFamily: F.h, fontSize: small ? 11 : 12.5, letterSpacing: 0.3, textTransform: 'uppercase' }}>{title}</Text>
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
      {items.map(([k, n, dim]) => {
        const on = k === value;
        return (
          <Pressable key={String(k)} onPress={() => onChange(k)} style={[st.chip, on && { backgroundColor: ac || C.blue, borderColor: 'transparent' }, dim && !on && { opacity: 0.5 }]}>
            <Text numberOfLines={1} style={{ color: on ? '#0a0d14' : C.mu, fontFamily: F.hm, fontSize: 12 }}>{n}</Text>
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
export const TeamLogo = ({ t, size }) => t.user ? <Logo c1={S.org.c1} c2={S.org.c2} tag={S.org.tag} size={size} /> : <Logo c1={t.color} c2="#05070b" tag={ttag(t)} size={size} />;
export function Stars({ lo, hi }) { const f = v => Math.max(1, Math.min(5, Math.round((v - 40) / 12))); const a = f(lo), b = f(hi); return <Text style={{ fontSize: 11, color: C.gold }}>{'★'.repeat(a)}<Text style={{ opacity: 0.45 }}>{'★'.repeat(b - a)}</Text><Text style={{ opacity: 0.15 }}>{'★'.repeat(5 - b)}</Text></Text>; }
export const Row = ({ children, style, gap = 8 }) => <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
export const Sep = () => <View style={{ height: 1, backgroundColor: C.line, marginVertical: 6 }} />;

const st = StyleSheet.create({
  panel: { backgroundColor: C.glass, borderRadius: 14, borderWidth: 1, borderColor: C.line, overflow: 'hidden', marginBottom: 10 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1 },
  btnSm: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  seg: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 3, gap: 3, borderWidth: 1, borderColor: C.line },
  segI: { flex: 1, alignItems: 'center', paddingVertical: 7, borderRadius: 7, borderWidth: 1, borderColor: 'transparent' },
  chip: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 999, backgroundColor: C.glass2, borderWidth: 1, borderColor: C.line },
  stat: { flex: 1, backgroundColor: 'rgba(0,0,0,0.22)', borderRadius: 10, borderWidth: 1, borderColor: C.line, paddingVertical: 7, paddingHorizontal: 9 },
  role: { paddingHorizontal: 5, paddingVertical: 3, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.07)', width: 62, alignItems: 'center' },
});
