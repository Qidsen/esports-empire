import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, ScrollView, Platform, AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFonts, Exo2_500Medium, Exo2_600SemiBold, Exo2_700Bold, Exo2_800ExtraBold } from '@expo-google-fonts/exo-2';
import { S, idleTick, offlineCapH, fmt, phaseOf, FAKE, userMatchesThisWeek, quickSeries, applyResult, finishWeek, offlineGain } from './src/core/game';
import { C, F, alpha } from './src/ui/theme';
import { Logo, T, Btn } from './src/ui/kit';
import { UI, bump, useBump, useToasts, registerModal, closeModal, openModal, save, load, toast } from './src/ui/store';
import Start from './src/screens/Start';
import Home from './src/screens/Home';
import Roster from './src/screens/Roster';
import Market from './src/screens/Market';
import Comp from './src/screens/Comp';
import Org from './src/screens/Org';
import Live from './src/live/Live';
import { playWeek } from './src/screens/flow';

import * as G from './src/core/game';
if (Platform.OS === 'web') globalThis.__APP = { G, UI, bump: () => bump() };
const TABS = [['home', '◆', 'Штаб'], ['roster', '◎', 'Состав'], ['market', '⇄', 'Рынок'], ['comp', '♛', 'Турниры'], ['org', '▣', 'Клуб']];
export const money = n => (n < 0 ? '−$' : '$') + fmt(Math.abs(n));

function TopBar() {
  const [, set] = useState(0);
  useEffect(() => { const i = setInterval(() => set(v => v + 1), 1000); return () => clearInterval(i); }, []);
  const ph = phaseOf(S.week); const n = userMatchesThisWeek().length;
  return (
    <View style={st.top}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ color: C.tx, fontFamily: F.h, fontSize: 15 }}>{S.org.name}</Text>
        <Text numberOfLines={1} style={{ color: C.mu, fontSize: 10.5 }}>Сезон {S.season} · Неделя {Math.min(S.week, 20)} · {ph.n}{S.patchOn ? '  ·  ПАТЧ 2026' : ''}</Text>
      </View>
      {[['Бюджет', money(S.money), S.money < 0 ? C.bad : C.tx], ['Очки трен.', fmt(S.tp), C.blue], ['Фанаты', fmt(S.fans), C.tx], ['Репутация', Math.round(S.rep), C.gold]].map(([l, v, c]) => (
        <View key={l} style={st.res}><Text style={st.resL}>{l}</Text><Text numberOfLines={1} style={[st.resV, { color: c }]}>{v}</Text></View>
      ))}
      <Btn kind="pri" ac={S.org.c1} title={S.week === 20 ? 'Межсезонье ▶' : n ? `Играть неделю (${n}) ▶` : 'Следующая неделя ▶'} onPress={playWeek} style={{ marginLeft: 6 }} />
    </View>
  );
}
function SideNav() {
  return (
    <View style={st.side}>
      <View style={{ alignItems: 'center', marginBottom: 10 }}><Logo c1={S.org.c1} c2={S.org.c2} tag={S.org.tag} size={44} /></View>
      {TABS.map(([k, i, n]) => {
        const on = UI.tab === k;
        return (
          <Pressable key={k} onPress={() => { UI.tab = k; UI.sel = null; bump(); }} style={[st.nav, on && { backgroundColor: alpha(S.org.c1, 0.18), borderColor: alpha(S.org.c1, 0.5) }]}>
            <Text style={{ fontSize: 17, color: on ? S.org.c1 : C.mu }}>{i}</Text>
            <Text style={{ fontSize: 9.5, color: on ? C.tx : C.mu, fontFamily: F.hm, marginTop: 1 }}>{n}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
function ModalHost() {
  const [render, set] = useState(null);
  useEffect(() => { registerModal(f => set(f ? () => f : null)); }, []);
  if (!render) return null;
  const R = render();
  return (
    <Modal transparent animationType="fade" visible supportedOrientations={['landscape', 'landscape-left', 'landscape-right']} onRequestClose={closeModal}>
      <Pressable style={st.mback} onPress={closeModal}>
        <Pressable style={st.msheet} onPress={() => { }}>
          <LinearGradient colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0)']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.3 }} pointerEvents="none" />
          <ScrollView contentContainerStyle={{ padding: 16 }}>{typeof R === 'function' ? <R /> : R}</ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
function Toasts() {
  const list = useToasts();
  return <View pointerEvents="none" style={{ position: 'absolute', bottom: 14, left: 0, right: 0, alignItems: 'center', gap: 6 }}>{list.map(t => <View key={t.id} style={st.toast}><Text style={{ color: C.tx, fontSize: 12.5 }}>{t.t}</Text></View>)}</View>;
}
function Shell() {
  useBump();
  const ins = useSafeAreaInsets();
  if (!S) return <Start />;
  const Scr = { home: Home, roster: Roster, market: Market, comp: Comp, org: Org }[UI.tab];
  return (
    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: ins.left, paddingRight: ins.right }}>
      <SideNav />
      <View style={{ flex: 1 }}>
        <TopBar />
        <View style={{ flex: 1 }}><Scr /></View>
      </View>
    </View>
  );
}
function Main() {
  useBump();
  const autoRef = useRef(0);
  useEffect(() => {
    const iv = setInterval(() => {
      if (!S) return; const now = Date.now(); const el = Math.min((now - (S.lastTick || now)) / 1000, offlineCapH() * 3600); S.lastTick = now; if (el > 0) idleTick(el);
      if (S.auto && !UI.live && !UI.modalOpen) { autoRef.current++; if (autoRef.current >= 30) { autoRef.current = 0; userMatchesThisWeek().forEach(({ d, m }) => { m.res = quickSeries(d, m); applyResult(d, m); }); const wk = S.week; finishWeek(); save(); bump(); toast('⏩ Неделя ' + wk + ' сыграна автоматически'); } }
    }, 1000);
    const sv = setInterval(save, 15000);
    const sub = AppState.addEventListener('change', s => { if (s !== 'active') save(); });
    return () => { clearInterval(iv); clearInterval(sv); sub.remove(); };
  }, []);
  return (
    <View style={{ flex: 1 }}>
      {UI.live ? <Live /> : <Shell />}
      <ModalHost />
      <Toasts />
    </View>
  );
}
export default function App() {
  const [ready, setReady] = useState(false);
  const [fontsOk] = useFonts({ Exo2_500Medium, Exo2_600SemiBold, Exo2_700Bold, Exo2_800ExtraBold });
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => { });
    load().then(ok => {
      if (ok) {
        S.cd = S.cd || { scrim: 0, stream: 0 }; S.creators = S.creators || []; S.tOffers = S.tOffers || []; S.negot = S.negot || {}; S.fac.office = S.fac.office || 1;
        Object.values(S.divs).forEach(dv => { dv.youth = dv.youth || []; dv.out = dv.out || []; });
        UI.d = Object.keys(S.divs)[0];
        const g = offlineGain();
        if (g) setTimeout(() => openModal(() => (
          <View>
            <T h s={20}>С возвращением!</T>
            <T mu style={{ marginVertical: 8 }}>Пока тебя не было ({g.sec >= 3600 ? (g.sec / 3600).toFixed(1) + ' ч' : Math.round(g.sec / 60) + ' мин'}), организация заработала:</T>
            <T h s={26} style={{ color: C.good }}>+{money(g.money)}</T>
            <T s={14} style={{ color: C.blue, marginBottom: 12 }}>+{fmt(g.tp)} очков тренировок</T>
            <Btn kind="pri" ac={S.org.c1} title="Забрать" onPress={closeModal} />
          </View>
        )), 400);
      }
      setReady(true);
    });
  }, []);
  if (!ready || !fontsOk) return <View style={{ flex: 1, backgroundColor: C.bg0 }} />;
  return (
    <SafeAreaProvider>
      <StatusBar hidden style="light" />
      <LinearGradient colors={['#0b1220', '#06080d', '#04060a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
        <Main />
      </LinearGradient>
    </SafeAreaProvider>
  );
}
const st = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.line, backgroundColor: 'rgba(6,9,15,0.6)' },
  res: { backgroundColor: 'rgba(0,0,0,0.3)', borderWidth: 1, borderColor: C.line, borderRadius: 9, paddingHorizontal: 8, paddingVertical: 3, minWidth: 74 },
  resL: { color: C.mu, fontSize: 8.5, letterSpacing: 0.8, textTransform: 'uppercase', fontFamily: F.hm },
  resV: { fontFamily: F.h, fontSize: 14 },
  side: { width: 72, paddingVertical: 10, paddingHorizontal: 7, borderRightWidth: 1, borderRightColor: C.line, backgroundColor: 'rgba(4,6,10,0.55)' },
  nav: { alignItems: 'center', paddingVertical: 8, borderRadius: 11, marginBottom: 5, borderWidth: 1, borderColor: 'transparent' },
  mback: { flex: 1, backgroundColor: 'rgba(2,4,8,0.72)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  msheet: { width: '78%', maxWidth: 760, maxHeight: '92%', backgroundColor: '#101727', borderRadius: 18, borderWidth: 1, borderColor: C.line2, overflow: 'hidden' },
  toast: { backgroundColor: 'rgba(30,38,58,0.96)', borderWidth: 1, borderColor: C.line2, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
});
