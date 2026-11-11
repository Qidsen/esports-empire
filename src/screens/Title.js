// Главное меню: логотип игры, продолжить / новая игра / настройки / об игре.
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, useWindowDimensions } from 'react-native';
const LOGO = require('../../assets/logo.png');
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SG, RadialGradient, Stop, Circle, G, Line } from 'react-native-svg';
import { S, DISC_ORDER } from '../core/game';
import { UI, bump, save, wipe, openModal, closeModal } from '../ui/store';
import { T, Btn, Row, Seg, OrgLogo, GameIcon } from '../ui/kit';
import { C, F, alpha } from '../ui/theme';
import { SET, LANGS, GFX_OPTS, saveSettings } from '../ui/settings';
import { sfx, buzz, applyMusicVolume, TRACKS, restartMusic } from '../ui/audio';

// Логотип игры: щит с крыльями, короной-клинками и объёмной «E»
export function GameLogo({ size = 120 }) {
  return (
    <Svg width={size * 240 / 220} height={size} viewBox="0 0 240 220">
<Defs>
<SG id="gl_rim" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#ffe0a0"/><Stop offset="0.35" stopColor="#ff9a2e"/><Stop offset="1" stopColor="#a3123a"/></SG>
<SG id="gl_rim2" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#7a2a10"/><Stop offset="1" stopColor="#3a0716"/></SG>
<SG id="gl_core" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#222b40"/><Stop offset="1" stopColor="#06080f"/></SG>
<SG id="gl_blade" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#fff1cf"/><Stop offset="0.5" stopColor="#ffb347"/><Stop offset="1" stopColor="#ff5a2b"/></SG>
<SG id="gl_ext" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#b8461a"/><Stop offset="1" stopColor="#5c0d1f"/></SG>
<SG id="gl_f1" x1="1" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#ffb347"/><Stop offset="1" stopColor="#c2183d"/></SG>
<RadialGradient id="gl_glow" cx="0.5" cy="0.45" r="0.5"><Stop offset="0" stopColor="#ff7a2b" stopOpacity="0.45"/><Stop offset="1" stopColor="#ff7a2b" stopOpacity="0"/></RadialGradient>
</Defs>
<G stroke="#05070b" strokeWidth="3" strokeLinejoin="round">

<Path d="M66 60 L8 30 L30 70 L60 88 Z" fill="url(#gl_f1)"/>
<Path d="M64 92 L2 82 L28 110 L62 118 Z" fill="url(#gl_f1)"/>
<Path d="M66 124 L14 134 L40 152 L72 150 Z" fill="url(#gl_f1)"/>

<Path d="M174 60 L232 30 L210 70 L180 88 Z" fill="url(#gl_f1)"/>
<Path d="M176 92 L238 82 L212 110 L178 118 Z" fill="url(#gl_f1)"/>
<Path d="M174 124 L226 134 L200 152 L168 150 Z" fill="url(#gl_f1)"/>
</G>

<Path d="M120 2 L131 28 L146 14 L150 36 L190 46 L188 128 C184 168 152 196 120 212 C88 196 56 168 52 128 L50 46 L90 36 L94 14 L109 28 Z" fill="url(#gl_rim)" stroke="#05070b" strokeWidth="5" strokeLinejoin="round"/>
<Path d="M120 40 L176 56 L174 126 C170 158 146 180 120 194 C94 180 70 158 66 126 L64 56 Z" fill="url(#gl_rim2)"/>
<Path d="M120 46 L170 60 L168 125 C165 154 143 174 120 187 C97 174 75 154 72 125 L70 60 Z" fill="url(#gl_core)"/>
<Path d="M120 46 L170 60 L168 125 C165 154 143 174 120 187 C97 174 75 154 72 125 L70 60 Z" fill="url(#gl_glow)"/>

<G transform="translate(4,5)" fill="url(#gl_ext)">
<Path d="M88 74 H156 L146 92 H108 V108 H140 L131 124 H108 V140 H150 L160 158 H88 Z"/>
</G>

<Path d="M88 74 H156 L146 92 H108 V108 H140 L131 124 H108 V140 H150 L160 158 H88 Z" fill="url(#gl_blade)" stroke="#05070b" strokeWidth="3" strokeLinejoin="round"/>
<Path d="M92 78 H149 L144 86 H92 Z" fill="#ffffff" opacity="0.35"/>

<Path d="M120 12 L125 24 L120 34 L115 24 Z" fill="#fff4d6" stroke="#05070b" strokeWidth="2" strokeLinejoin="round"/>

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
function TrackPick({ label, k, up }) {
  const items = [['rand', 'Случайно'], ...TRACKS.map(([id, n]) => [id, n.split(' — ')[1]])];
  return <View><T mu s={11} style={{ marginBottom: 4 }}>{label}</T><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>{items.map(([id, n]) => { const on = SET[k] === id; return <Pressable key={id} onPress={() => { SET[k] = id; up(); restartMusic(); }} style={{ paddingHorizontal: 11, height: 30, borderRadius: 8, justifyContent: 'center', borderWidth: 1, borderColor: on ? '#ff8a1f' : C.line, backgroundColor: on ? 'rgba(255,138,31,0.18)' : 'rgba(255,255,255,0.03)' }}><Text style={{ fontFamily: F.hm, fontSize: 11.5, color: on ? C.tx : C.mu }}>{n}</Text></Pressable>; })}</ScrollView></View>;
}
function SettingsBody() {
  const [, f] = useState(0); const up = () => { saveSettings(); f(x => x + 1); };
  return (
    <View style={{ gap: 10 }}>
      <T h s={18}>Настройки</T>
      <View><T mu s={11} style={{ marginBottom: 4 }}>Язык</T><Seg ac="#ff8a1f" value={SET.lang} onChange={v => { if (LANGS.find(l => l[0] === v)[2]) { SET.lang = v; up(); bump(); } }} items={LANGS.map(([k, n, ok]) => [k, ok ? n : n + ' · скоро'])} /></View>
      <View><T mu s={11} style={{ marginBottom: 4 }}>Качество 3D-трансляций</T><Seg ac="#ff8a1f" value={SET.gfx} onChange={v => { SET.gfx = v; up(); }} items={GFX_OPTS} /><T mu s={10} style={{ marginTop: 3 }}>Низкое — без теней и тонмаппинга, если телефон греется или 3D не показывается.</T></View>
      <Row gap={10}>
        <View style={{ flex: 1 }}><T mu s={11} style={{ marginBottom: 4 }}>Музыка</T><Seg ac="#ff8a1f" value={SET.music} onChange={v => { SET.music = v; up(); applyMusicVolume(); }} items={[[0, 'Выкл'], [0.3, 'Тихо'], [0.6, 'Норм'], [1, 'Громко']]} /></View>
        <View style={{ flex: 1 }}><T mu s={11} style={{ marginBottom: 4 }}>Звуки</T><Seg ac="#ff8a1f" value={SET.sfx} onChange={v => { SET.sfx = v; up(); sfx('ui_click'); }} items={[[0, 'Выкл'], [0.45, 'Тихо'], [0.9, 'Норм'], [1.3, 'Громко']]} /></View>
        <View style={{ width: 130 }}><T mu s={11} style={{ marginBottom: 4 }}>Вибрация</T><Seg ac="#ff8a1f" value={SET.haptics ? 1 : 0} onChange={v => { SET.haptics = !!v; up(); buzz('light'); }} items={[[1, 'Вкл'], [0, 'Выкл']]} /></View>
      </Row>
      <View><T mu s={11} style={{ marginBottom: 4 }}>Скорость матчей по умолчанию</T><Seg ac="#ff8a1f" value={SET.speed} onChange={v => { SET.speed = v; up(); }} items={[[1, '1×'], [2, '2×'], [4, '4×']]} /></View>
      {S ? <Btn title="Показать подсказки снова" onPress={() => { S.tips = {}; S.tipsOff = false; save(); closeModal(); }} /> : null}
      {S ? <Btn title="Патч реальных данных и сохранение" onPress={() => { closeModal(); UI.title = false; UI.tab = 'org'; UI.org = 'set'; bump(); }} /> : null}
      <Btn kind="pri" ac="#ff8a1f" title="Готово" onPress={closeModal} />
    </View>
  );
}
function openAbout() {
  openModal(() => (
    <View style={{ gap: 6 }}>
      <Row gap={12}><Image source={LOGO} style={{ width: 64, height: 64 }} resizeMode="contain" /><View style={{ flex: 1 }}><T h s={18}>Esports Empire</T><T mu s={11}>Симулятор киберспортивного менеджера · 5 дисциплин</T></View></Row>
      <T s={12}>CS2, Dota 2, Deadlock, Rocket League и EA SPORTS FC 27: собери организацию, нанимай игроков и персонал, веди переговоры, выигрывай лиги и мейджоры.</T>
      <T mu s={10.5}>3D-модели: Quaternius (CC0). Музыка написана для Esports Empire. Звуки: Kenney (CC0) и синтезированные для игры. Иконки: game-icons.net (CC BY 3.0) — Lorc, Delapouite, Skoll, Sbed, Carl Olsen, DarkZaitzev, Zeromancer. Логотипы игр и команд принадлежат их владельцам и используются только в патче реальных данных.</T>
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
  const ins = useSafeAreaInsets(); const { height: H } = useWindowDimensions();
  const divs = S ? Object.keys(S.divs) : [];
  return (
    <View style={{ flex: 1, backgroundColor: '#05070c' }}>
      <Backdrop />
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: Math.max(ins.left, 20) + 16, paddingRight: Math.max(ins.right, 20) + 16, paddingVertical: Math.max(ins.top, 12), gap: 30 }}>
        <View style={{ flex: 1.15, alignItems: 'flex-start' }}>
          <Image source={LOGO} resizeMode="contain" style={{ width: Math.min(H * 0.5, 230) * 1.006, height: Math.min(H * 0.5, 230) }} />
          <Text style={{ fontFamily: F.h, fontSize: 9.5, color: C.mu, letterSpacing: 3.5, marginTop: 6 }}>ESPORTS MANAGER SIMULATOR</Text>
          <Row gap={8} style={{ marginTop: 10 }}>{DISC_ORDER.map(d => <GameIcon key={d} d={d} size={26} />)}</Row>
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
