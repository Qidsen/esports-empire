import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { newCareer, DISC_ORDER, FAKE, S, pack } from '../core/game';
import { REAL_PATCH } from '../core/realPatch';
import { pickImageDataUri } from '../ui/pick';
import { UI, bump, save, openModal, closeModal, toast } from '../ui/store';
import { T, H, Panel, Btn, Seg, Logo, Row, GameIcon, ImgLogo } from '../ui/kit';
import { C, F, alpha } from '../ui/theme';

const COLORS = ['#ff8a1f', '#ff3b5c', '#3fa9f5', '#3ddc84', '#a66cff', '#ffc94d', '#00d4c8', '#ff5fa2', '#e8e8e8', '#7cf75c'];
const KIND = { fps: 'Шутер', moba: 'MOBA', ball: 'Авто-футбол', duel: 'Футбол' };
export default function Start() {
  const [name, setName] = useState(''); const [tag, setTag] = useState(''); const [c1, setC1] = useState('#ff8a1f'); const [disc, setDisc] = useState('cs'); const [real, setReal] = useState(true); const [logo, setLogo] = useState(null);
  const gameName = d => real && REAL_PATCH.disciplines[d] ? REAL_PATCH.disciplines[d].game : FAKE[d].game;
  const go = () => {
    const nm = name.trim() || 'Kyiv Phantoms'; const tg = (tag.trim() || nm.replace(/[^A-Za-zА-Яа-яІіЇїЄє]/g, '').slice(0, 3) || 'ORG').toUpperCase().slice(0, 4);
    newCareer({ name: nm, tag: tg, c1, c2: '#05070b', disc, patchOn: real, patchData: real ? REAL_PATCH : null, logo });
    UI.d = disc; UI.tab = 'home'; save(); bump();
    setTimeout(() => openModal(() => (
      <View>
        <T h s={22}>Добро пожаловать, менеджер!</T>
        <T mu style={{ marginVertical: 8 }}>Ты основал {S.org.name} и стартуешь в низшей лиге: {pack(disc).leagues[2]}.</T>
        {['Деньги и очки тренировок копятся сами, даже когда игра закрыта.', 'Прокачивай игроков, бери в аренду, растите молодёжь в академии.', 'Нанимай персонал, строй офис и базу, подписывай спонсоров.', 'Расширяй офис, чтобы открыть до 5 дисциплин: CS2, Dota 2, Deadlock, Rocket League, EA FC 27.', 'Смотри матчи в 3D и управляй командой по ходу игры.'].map((t, i) => <T key={i} s={13} style={{ marginBottom: 4 }}>• {t}</T>)}
        <Btn kind="pri" ac={c1} title="Поехали" onPress={closeModal} style={{ marginTop: 10 }} />
      </View>
    )), 300);
  };
  const ins = useSafeAreaInsets(); const { height: H0 } = useWindowDimensions();
  const k = Math.max(0.78, Math.min(1.15, H0 / 400)); // scale to screen height
  const cardH = Math.round(62 * k);
  return (
    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: Math.max(ins.left, 14) + 4, paddingRight: Math.max(ins.right, 14) + 4, paddingTop: Math.max(ins.top, 10), paddingBottom: Math.max(ins.bottom, 10), gap: 18 }}>
      <View style={{ width: 290 * Math.min(1, k + 0.1), justifyContent: 'space-between' }}>
        <View>
          <T mu s={9} style={{ letterSpacing: 2.5, fontFamily: F.hm }}>ESPORTS MANAGER SIMULATOR</T>
          <Text style={{ color: C.tx, fontFamily: F.hx, fontSize: Math.round(26 * k), letterSpacing: 0.5, lineHeight: Math.round(30 * k) }}>ESPORTS EMPIRE</Text>
          <T mu s={11} n={1}>Своя организация · 5 дисциплин · матчи в 3D</T>
        </View>
        <Row gap={10}>
          <Pressable onPress={async () => { try { const u = await pickImageDataUri(300000); if (u) setLogo(u); } catch (e) { toast('⚠️ ' + e); } }} onLongPress={() => setLogo(null)} style={{ alignItems: 'center' }}>{logo ? <ImgLogo uri={logo} size={Math.round(64 * k)} /> : <Logo c1={c1} c2="#05070b" tag={(tag || 'ORG').toUpperCase()} size={Math.round(64 * k)} />}<T mu s={9} style={{ marginTop: 2 }}>{logo ? 'сменить' : '+ свой логотип'}</T></Pressable>
          <View style={{ flex: 1, gap: 6 }}>
            <TextInput value={name} onChangeText={setName} placeholder="Название организации" placeholderTextColor={C.mu2} maxLength={24} style={inp} />
            <TextInput value={tag} onChangeText={t => setTag(t.toUpperCase())} placeholder="Тег (2–4 буквы)" placeholderTextColor={C.mu2} maxLength={4} autoCapitalize="characters" style={inp} />
          </View>
        </Row>
        <View>
          <T mu s={10} style={{ fontFamily: F.h, letterSpacing: 1.4, marginBottom: 5 }}>ЦВЕТ</T>
          <Row gap={6}>{COLORS.map(c => <Pressable key={c} onPress={() => setC1(c)} style={{ flex: 1, aspectRatio: 1, maxWidth: 26, borderRadius: 13, backgroundColor: c, borderWidth: 2, borderColor: c1 === c ? '#fff' : 'transparent' }} />)}</Row>
        </View>
        <View>
          <Seg ac={c1} value={real} onChange={setReal} items={[[false, 'Вымышленный мир'], [true, 'Реальный (патч 2026)']]} />
          <T mu s={10} n={2} style={{ marginTop: 4 }}>{real ? 'Реальные игры, карты, герои, команды и игроки (сверено 11.11.2026).' : 'Случайные названия. Патч можно включить позже в «Клубе».'}</T>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <T mu s={10} style={{ fontFamily: F.h, letterSpacing: 1.4 }}>СТАРТОВАЯ ДИСЦИПЛИНА</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {DISC_ORDER.map(d => {
            const on = disc === d; const col = FAKE[d].color;
            return (
              <Pressable key={d} onPress={() => setDisc(d)} style={{ width: '48.5%' }}>
                <LinearGradient colors={on ? [alpha(col, 0.35), alpha(col, 0.08)] : ['rgba(30,38,58,0.7)', 'rgba(16,22,36,0.7)']} style={{ borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: on ? col : C.line, height: cardH, justifyContent: 'center' }}>
                  <Row gap={8}><GameIcon d={d} size={Math.round(30 * k)} uri={real ? (REAL_PATCH.disciplines[d] && REAL_PATCH.disciplines[d].icon) || null : null} /><View style={{ flex: 1 }}><T h s={13.5} n={1}>{SHORT[d]}</T><T mu s={10.5} n={1}>{FAKE[d].kind==='duel'?'1×1':FAKE[d].size+'×'+FAKE[d].size} · {KIND[FAKE[d].kind]}</T></View></Row>
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>
        <T mu s={10.5} n={1}>Остальные дисциплины откроются, когда расширишь офис.</T>
        <Btn kind="pri" ac={c1} title="Основать организацию" onPress={go} />
      </View>
    </View>
  );
}
const SHORT = { cs: 'CS2', dota: 'Dota 2', dl: 'Deadlock', rl: 'Rocket League', fc: 'EA FC 27' };
const inp = { backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 1, borderColor: C.line2, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 7, color: C.tx, fontSize: 13 };
