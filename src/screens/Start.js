import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { newCareer, DISC_ORDER, FAKE, S, pack } from '../core/game';
import { REAL_PATCH } from '../core/realPatch';
import { UI, bump, save, openModal, closeModal } from '../ui/store';
import { T, H, Panel, Btn, Seg, Logo, Row } from '../ui/kit';
import { C, F, alpha } from '../ui/theme';

const COLORS = ['#ff8a1f', '#ff3b5c', '#3fa9f5', '#3ddc84', '#a66cff', '#ffc94d', '#00d4c8', '#ff5fa2', '#e8e8e8', '#7cf75c'];
const KIND = { fps: 'Тактический шутер', moba: 'MOBA', ball: 'Авто-футбол', duel: 'Футбол 1×1' };
export default function Start() {
  const [name, setName] = useState(''); const [tag, setTag] = useState(''); const [c1, setC1] = useState('#ff8a1f'); const [disc, setDisc] = useState('cs'); const [real, setReal] = useState(true);
  const gameName = d => real && REAL_PATCH.disciplines[d] ? REAL_PATCH.disciplines[d].game : FAKE[d].game;
  const go = () => {
    const nm = name.trim() || 'Kyiv Phantoms'; const tg = (tag.trim() || nm.replace(/[^A-Za-zА-Яа-яІіЇїЄє]/g, '').slice(0, 3) || 'ORG').toUpperCase().slice(0, 4);
    newCareer({ name: nm, tag: tg, c1, c2: '#05070b', disc, patchOn: real, patchData: real ? REAL_PATCH : null });
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
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', padding: 18, gap: 16 }}>
      <View style={{ width: 300 }}>
        <T mu s={10} style={{ letterSpacing: 3, fontFamily: F.hm }}>ESPORTS MANAGER SIMULATOR</T>
        <Text style={{ color: C.tx, fontFamily: F.hx, fontSize: 34, letterSpacing: 1 }}>ESPORTS EMPIRE</Text>
        <T mu s={12} style={{ marginBottom: 12 }}>Своя киберспортивная организация · 5 дисциплин · матчи в 3D</T>
        <Row style={{ marginBottom: 12 }} gap={14}>
          <Logo c1={c1} c2="#05070b" tag={(tag || 'ORG').toUpperCase()} size={96} />
          <View style={{ flex: 1, gap: 8 }}>
            <TextInput value={name} onChangeText={setName} placeholder="Название организации" placeholderTextColor={C.mu2} maxLength={24} style={inp} />
            <TextInput value={tag} onChangeText={t => setTag(t.toUpperCase())} placeholder="Тег (2–4 буквы)" placeholderTextColor={C.mu2} maxLength={4} autoCapitalize="characters" style={inp} />
          </View>
        </Row>
        <H>Цвет организации</H>
        <Row gap={8} style={{ flexWrap: 'wrap', marginBottom: 14 }}>{COLORS.map(c => <Pressable key={c} onPress={() => setC1(c)} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c, borderWidth: 2, borderColor: c1 === c ? '#fff' : 'transparent' }} />)}</Row>
        <H>Данные мира</H>
        <Seg ac={c1} value={real} onChange={setReal} items={[[false, 'Вымышленный'], [true, 'Реальный (патч 2026)']]} />
        <T mu s={11} style={{ marginTop: 6 }}>{real ? 'Реальные игры, карты, герои, команды и игроки (сверено 11.11.2026).' : 'Случайные названия. Патч можно включить позже в разделе «Клуб».'}</T>
      </View>
      <View style={{ flex: 1 }}>
        <H>Стартовая дисциплина</H>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {DISC_ORDER.map(d => {
            const on = disc === d; const col = FAKE[d].color;
            return (
              <Pressable key={d} onPress={() => setDisc(d)} style={{ width: '31.5%', minWidth: 150 }}>
                <LinearGradient colors={on ? [alpha(col, 0.35), alpha(col, 0.08)] : ['rgba(30,38,58,0.7)', 'rgba(16,22,36,0.7)']} style={{ borderRadius: 14, padding: 12, borderWidth: 1, borderColor: on ? col : C.line, height: 108 }}>
                  <Text style={{ fontSize: 26 }}>{FAKE[d].icon}</Text>
                  <T h s={15} style={{ marginTop: 4 }} n={1}>{gameName(d)}</T>
                  <T mu s={11}>{FAKE[d].size}×{FAKE[d].size} · {KIND[FAKE[d].kind]}</T>
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>
        <T mu s={11} style={{ marginVertical: 10 }}>Остальные дисциплины открываются позже, когда расширишь офис.</T>
        <Btn kind="pri" ac={c1} title="Основать организацию" onPress={go} style={{ marginTop: 'auto' }} />
      </View>
    </ScrollView>
  );
}
const inp = { backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 1, borderColor: C.line2, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, color: C.tx, fontSize: 14 };
