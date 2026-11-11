// Главное меню: логотип игры, продолжить / новая игра / настройки / об игре.
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SG, RadialGradient, Stop, Circle, G, Line } from 'react-native-svg';
import { S, DISC_ORDER } from '../core/game';
import { UI, bump, save, wipe, openModal, closeModal } from '../ui/store';
import { T, Btn, Row, Seg, OrgLogo, GameIcon } from '../ui/kit';
import { C, F, alpha } from '../ui/theme';
import { SET, LANGS, GFX_OPTS, saveSettings } from '../ui/settings';

// Логотип игры: щит-корона с монограммой EE
export function GameLogo({ size = 120 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <SG id="lg1" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#ffb547" /><Stop offset="0.55" stopColor="#ff6a2b" /><Stop offset="1" stopColor="#c2183d" /></SG>
        <SG id="lg2" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#1b2233" /><Stop offset="1" stopColor="#0a0e17" /></SG>
        <RadialGradient id="lg3" cx="0.5" cy="0.35" r="0.6"><Stop offset="0" stopColor="#ffffff" stopOpacity="0.35" /><Stop offset="1" stopColor="#ffffff" stopOpacity="0" /></RadialGradient>
      </Defs>
      {/* корона */}
      <Path d="M52 46 L70 18 L86 40 L100 10 L114 40 L130 18 L148 46 Z" fill="url(#lg1)" stroke="#05070b" strokeWidth={4} strokeLinejoin="round" />
      <Circle cx="70" cy="18" r="5" fill="#ffd27a" /><Circle cx="100" cy="10" r="6" fill="#ffd27a" /><Circle cx="130" cy="18" r="5" fill="#ffd27a" />
      {/* щит */}
      <Path d="M100 44 L164 62 L160 120 C156 152 132 176 100 192 C68 176 44 152 40 120 L36 62 Z" fill="url(#lg1)" stroke="#05070b" strokeWidth={5} strokeLinejoin="round" />
      <Path d="M100 58 L150 72 L147 118 C144 144 126 163 100 176 C74 163 56 144 53 118 L50 72 Z" fill="url(#lg2)" />
      <Path d="M100 58 L150 72 L147 118 C144 144 126 163 100 176 C74 163 56 144 53 118 L50 72 Z" fill="url(#lg3)" />
      {/* монограмма EE */}
      <G fill="url(#lg1)">
        <Path d="M64 86 H96 V96 H76 V108 H92 V118 H76 V130 H96 V140 H64 Z" />
        <Path d="M104 86 H136 V96 H116 V108 H132 V118 H116 V130 H136 V140 H104 Z" />
      </G>
      <Path d="M70 152 L100 166 L130 152" stroke="#ffb547" strokeWidth={3} fill="none" strokeLinecap="round" />
    </Svg>
  );
}
function Backdrop() {
  return (
    <Svg style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }} width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <RadialGradient id="bg1" cx="0.28" cy="0.45" r="0.7"><Stop offset="0" stopColor="#ff6a2b" stopOpacity="0.32" /><Stop offset="1" stopColor="#04060a" stopOpacity="0" /></RadialGradient>
        <RadialGradient id="bg2" cx="0.9" cy="0.1" r="0.6"><Stop offset="0" stopColor="#2f6fd6" stopOpacity="0.22" /><Stop offset="1" stopColor="#04060a" stopOpacity="0" /></RadialGradient>
      </Defs>
      <Path d="M0 0 H800 V400 H0 Z" fill="#05070c" />
      <Path d="M0 0 H800 V400 H0 Z" fill="url(#bg1)" />
      <Path d="M0 0 H800 V400 H0 Z" fill="url(#bg2)" />
      {Array.from({ length: 14 }, (_, i) => <Line key={i} x1={-200 + i * 80} y1={400} x2={100 + i * 80} y2={0} stroke="#ffffff" strokeOpacity={0.03} strokeWidth={1} />)}
      {Array.from({ length: 9 }, (_, i) => <Line key={'h' + i} x1={0} y1={300 + i * 12} x2={800} y2={300 + i * 12} stroke="#ff8a1f" strokeOpacity={0.025 + i * 0.004} strokeWidth={1} />)}
    </Svg>
  );
}
const MenuBtn = ({ title, sub, onPress, pri, danger }) => (
  <Pressable onPress={onPress} style={({ pressed }) => ({ transform: [{ translateX: pressed ? 4 : 0 }] })}>
    <LinearGradient colors={pri ? ['#ff9a2e', '#ff5a2b'] : danger ? ['rgba(255,77,90,0.14)', 'rgba(255,77,90,0.04)'] : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ paddingVertical: 11, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1, borderColor: pri ? 'transparent' : danger ? 'rgba(255,77,90,0.35)' : C.line2 }}>
      <Text style={{ fontFamily: F.hx, fontSize: 15, letterSpacing: 1.5, color: pri ? '#140a04' : danger ? '#ff8a95' : C.tx }}>{title}</Text>
      {sub ? <Text numberOfLines={1} style={{ fontFamily: F.b, fontSize: 10.5, color: pri ? 'rgba(20,10,4,0.7)' : C.mu, marginTop: 1 }}>{sub}</Text> : null}
    </LinearGradient>
  </Pressable>
);

export function confirmNewCareer() {
  if (!S) { UI.title = false; UI.newGame = true; bump(); return; }
  openModal(() => (
    <View>
      <T h s={18}>Начать новую игру?</T>
      <T style={{ marginVertical: 10 }}>Текущая карьера «{S.org.name}» будет удалена без возможности восстановления.</T>
      <Row><Btn style={{ flex: 1 }} title="Отмена" onPress={closeModal} /><Btn style={{ flex: 1 }} kind="bad" title="Удалить и начать" onPress={async () => { closeModal(); await wipe(); UI.title = false; UI.newGame = true; UI.tab = 'home'; bump(); }} /></Row>
    </View>
  ));
}
export function openSettings() {
  openModal(() => <SettingsBody />);
}
function SettingsBody() {
  const [, f] = useState(0); const up = () => { saveSettings(); f(x => x + 1); };
  return (
    <View style={{ gap: 10 }}>
      <T h s={18}>Настройки</T>
      <View><T mu s={11} style={{ marginBottom: 4 }}>Язык</T><Seg ac="#ff8a1f" value={SET.lang} onChange={v => { if (LANGS.find(l => l[0] === v)[2]) { SET.lang = v; up(); } }} items={LANGS.map(([k, n, ok]) => [k, ok ? n : n + ' · скоро'])} /></View>
      <View><T mu s={11} style={{ marginBottom: 4 }}>Качество 3D-трансляций</T><Seg ac="#ff8a1f" value={SET.gfx} onChange={v => { SET.gfx = v; up(); }} items={GFX_OPTS} /><T mu s={10} style={{ marginTop: 3 }}>Низкое — без теней и тонмаппинга, если телефон греется или 3D не показывается.</T></View>
      <View><T mu s={11} style={{ marginBottom: 4 }}>Скорость матчей по умолчанию</T><Seg ac="#ff8a1f" value={SET.speed} onChange={v => { SET.speed = v; up(); }} items={[[1, '1×'], [2, '2×'], [4, '4×']]} /></View>
      {S ? <Btn title="Патч реальных данных и сохранение" onPress={() => { closeModal(); UI.title = false; UI.tab = 'org'; UI.org = 'set'; bump(); }} /> : null}
      <Btn kind="pri" ac="#ff8a1f" title="Готово" onPress={closeModal} />
    </View>
  );
}
function openAbout() {
  openModal(() => (
    <View style={{ gap: 6 }}>
      <Row gap={12}><GameLogo size={64} /><View style={{ flex: 1 }}><T h s={18}>Esports Empire</T><T mu s={11}>Симулятор киберспортивного менеджера · 5 дисциплин</T></View></Row>
      <T s={12}>CS2, Dota 2, Deadlock, Rocket League и EA SPORTS FC 27: собери организацию, нанимай игроков и персонал, веди переговоры, выигрывай лиги и мейджоры.</T>
      <T mu s={10.5}>3D-модели: Quaternius (CC0). Логотипы игр и команд принадлежат их владельцам и используются только в патче реальных данных.</T>
      <Btn kind="pri" ac="#ff8a1f" title="Закрыть" onPress={closeModal} />
    </View>
  ));
}
export function openGameMenu() {
  openModal(() => (
    <View style={{ gap: 8 }}>
      <T h s={18}>Меню</T>
      <Btn kind="pri" ac={S.org.c1} title="Продолжить" onPress={closeModal} />
      <Btn title="Главное меню" onPress={() => { save(); closeModal(); UI.title = true; bump(); }} />
      <Btn title="Настройки" onPress={() => { closeModal(); setTimeout(openSettings, 250); }} />
    </View>
  ));
}

export default function Title() {
  const ins = useSafeAreaInsets();
  const divs = S ? Object.keys(S.divs) : [];
  return (
    <View style={{ flex: 1, backgroundColor: '#05070c' }}>
      <Backdrop />
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: Math.max(ins.left, 20) + 16, paddingRight: Math.max(ins.right, 20) + 16, paddingVertical: Math.max(ins.top, 12), gap: 30 }}>
        <View style={{ flex: 1.15, alignItems: 'flex-start' }}>
          <Row gap={16}>
            <GameLogo size={118} />
            <View>
              <Text style={{ fontFamily: F.hx, fontSize: 38, color: C.tx, letterSpacing: 2, lineHeight: 40 }}>ESPORTS</Text>
              <Text style={{ fontFamily: F.hx, fontSize: 38, color: '#ff8a2e', letterSpacing: 2, lineHeight: 40 }}>EMPIRE</Text>
              <Text style={{ fontFamily: F.h, fontSize: 9.5, color: C.mu, letterSpacing: 3.5, marginTop: 4 }}>ESPORTS MANAGER SIMULATOR</Text>
            </View>
          </Row>
          <Row gap={8} style={{ marginTop: 18 }}>{DISC_ORDER.map(d => <GameIcon key={d} d={d} size={26} />)}</Row>
          {S ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16, padding: 10, paddingRight: 16, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: C.line }}>
              <OrgLogo size={40} />
              <View><T h s={14}>{S.org.name}</T><T mu s={10.5}>Сезон {S.season} · неделя {S.week} · дивизионов: {divs.length}</T></View>
            </View>
          ) : null}
        </View>
        <View style={{ width: 270, gap: 9 }}>
          {S ? <MenuBtn pri title="ПРОДОЛЖИТЬ" sub={S.org.name + ' · сезон ' + S.season} onPress={() => { UI.title = false; bump(); }} /> : null}
          <MenuBtn pri={!S} title="НОВАЯ ИГРА" sub="Основать организацию" onPress={confirmNewCareer} />
          <MenuBtn title="НАСТРОЙКИ" sub="Язык, графика, скорость матчей" onPress={openSettings} />
          <MenuBtn title="ОБ ИГРЕ" onPress={openAbout} />
        </View>
      </View>
      <Text style={{ position: 'absolute', bottom: Math.max(ins.bottom, 8), right: Math.max(ins.right, 20) + 16, fontFamily: F.b, fontSize: 9.5, color: C.mu2 }}>v0.4 · пилот 3D</Text>
    </View>
  );
}
