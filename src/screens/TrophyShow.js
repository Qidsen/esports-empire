// Кат-сцена трофея: вращающийся кубок, лучи, конфетти, состав чемпионов.
import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, Modal, Animated, Easing, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SG, Stop, Polygon } from 'react-native-svg';
import { S, userTeam, starters, pnick, pcc, pack, FAKE, tname } from '../core/game';
import { UI, bump } from '../ui/store';
import { Flag, OrgLogo, Btn } from '../ui/kit';
import { PATHS } from '../ui/iconPaths';
import { sfx, buzz } from '../ui/audio';
import { C, F } from '../ui/theme';

const CONF = ['#ffd24d', '#ffffff', '#ff5a6a', '#4da3ff', '#3ddc84', '#b98cff', '#ff8a1f'];
function Confetti({ w, h, ac }) {
  const parts = useMemo(() => Array.from({ length: 70 }, (_, i) => ({ x: Math.random() * w, d: 2600 + Math.random() * 2600, delay: Math.random() * 2400, s: 5 + Math.random() * 7, c: i % 5 === 0 ? ac : CONF[i % CONF.length], sway: (Math.random() - 0.5) * 80, a: new Animated.Value(0) })), [w, h]);
  useEffect(() => { parts.forEach(p => Animated.loop(Animated.timing(p.a, { toValue: 1, duration: p.d, delay: p.delay, easing: Easing.linear, useNativeDriver: true })).start()); }, []);
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{parts.map((p, i) => (
    <Animated.View key={i} style={{ position: 'absolute', left: p.x, top: -20, width: p.s, height: p.s * 0.45, backgroundColor: p.c, borderRadius: 1.5,
      transform: [{ translateY: p.a.interpolate({ inputRange: [0, 1], outputRange: [0, h + 40] }) }, { translateX: p.a.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, p.sway, 0] }) }, { rotate: p.a.interpolate({ inputRange: [0, 1], outputRange: ['0deg', (720 + i * 37) + 'deg'] }) }] }} />))}</View>;
}
export default function TrophyShow() {
  const tr = UI.trophy; const { width: w, height: h } = useWindowDimensions();
  const spin = useRef(new Animated.Value(0)).current; const rays = useRef(new Animated.Value(0)).current; const intro = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!tr) return; sfx('trophy'); buzz('success'); setTimeout(() => sfx('cheer', 0.8), 900);
    intro.setValue(0); Animated.spring(intro, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }).start();
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 4200, easing: Easing.linear, useNativeDriver: true })).start();
    Animated.loop(Animated.timing(rays, { toValue: 1, duration: 22000, easing: Easing.linear, useNativeDriver: true })).start();
  }, [tr]);
  if (!tr) return null;
  const ut = userTeam(tr.d); const ac = FAKE[tr.d].color; const sp = ut ? starters(ut) : [];
  const close = () => { UI.trophy = null; bump(); setTimeout(showTrophies, 200); };
  const sz = Math.min(h * 0.46, 210);
  // «3D» вращение: сжатие по X через косинус + блик
  const scaleX = spin.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [1, 0.12, -1, -0.12, 1] });
  const shine = spin.interpolate({ inputRange: [0, 0.2, 0.3, 0.5, 0.7, 0.8, 1], outputRange: [0.15, 0.15, 0.7, 0.15, 0.15, 0.7, 0.15] });
  const ray = Array.from({ length: 14 }, (_, i) => { const a1 = (i / 14) * Math.PI * 2, a2 = a1 + Math.PI / 28; const R = 600; return `0,0 ${Math.cos(a1) * R},${Math.sin(a1) * R} ${Math.cos(a2) * R},${Math.sin(a2) * R}`; });
  return (
    <Modal transparent animationType="fade" visible supportedOrientations={['landscape', 'landscape-left', 'landscape-right']} onRequestClose={close}>
      <View style={{ flex: 1, backgroundColor: '#05070c', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <LinearGradient colors={['rgba(255,190,60,0.22)', 'rgba(5,7,12,0)']} style={{ position: 'absolute', width: w, height: h * 0.9, top: 0 }} />
        <Animated.View pointerEvents="none" style={{ position: 'absolute', left: w * 0.3 - 600, top: h * 0.45 - 600, width: 1200, height: 1200, opacity: 0.22, transform: [{ rotate: rays.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
          <Svg width={1200} height={1200} viewBox="-600 -600 1200 1200">{ray.map((p, i) => <Polygon key={i} points={p} fill={i % 2 ? '#ffd24d' : ac} />)}</Svg>
        </Animated.View>
        <Confetti w={w} h={h} ac={ac} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 34, paddingHorizontal: 30 }}>
          <Animated.View style={{ alignItems: 'center', transform: [{ scale: intro.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }, { translateY: intro.interpolate({ inputRange: [0, 1], outputRange: [120, 0] }) }] }}>
            <Animated.View style={{ transform: [{ scaleX }] }}>
              <Svg width={sz} height={sz} viewBox="0 0 512 512">
                <Defs><SG id="g" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#fff3b0" /><Stop offset="0.35" stopColor="#ffd24d" /><Stop offset="0.7" stopColor="#d18a12" /><Stop offset="1" stopColor="#8a5200" /></SG></Defs>
                <Path d={PATHS.trophy} fill="url(#g)" />
              </Svg>
              <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: sz, height: sz, opacity: shine }}>
                <Svg width={sz} height={sz} viewBox="0 0 512 512"><Path d={PATHS.trophy} fill="#ffffff" opacity={0.35} /></Svg>
              </Animated.View>
            </Animated.View>
            <View style={{ width: sz * 0.8, height: 14, borderRadius: 7, backgroundColor: 'rgba(0,0,0,0.5)', marginTop: 6 }} />
          </Animated.View>
          <Animated.View style={{ maxWidth: w * 0.48, opacity: intro, transform: [{ translateX: intro.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }] }}>
            <Text style={{ fontFamily: F.h, fontSize: 12, letterSpacing: 3, color: '#ffd24d' }}>{pack(tr.d).game.toUpperCase()} · СЕЗОН {tr.s}</Text>
            <Text style={{ fontFamily: F.hx, fontSize: 40, color: '#fff', lineHeight: 44 }}>ЧЕМПИОНЫ</Text>
            <Text style={{ fontFamily: F.h, fontSize: 19, color: '#ffe7a3', marginBottom: 10 }}>{tr.n}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}><OrgLogo size={40} /><Text style={{ fontFamily: F.h, fontSize: 18, color: C.tx }}>{ut ? tname(ut) : S.org.name}</Text></View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>{sp.map(p => <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: 'rgba(255,210,77,0.12)', borderWidth: 1, borderColor: 'rgba(255,210,77,0.4)' }}><Flag cc={pcc(p)} s={12} /><Text style={{ fontFamily: F.hm, fontSize: 12.5, color: '#fff' }}>{pnick(p)}</Text></View>)}</View>
            <Btn kind="pri" ac="#ffb020" title="Поднять кубок и дальше" onPress={close} />
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}
export function showTrophies() { if (UI.live || UI.trophy) return; const q = S && S.trophyQ; if (q && q.length) { UI.trophy = q.shift(); bump(); } }
