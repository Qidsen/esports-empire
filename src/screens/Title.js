// Главное меню: продолжить карьеру, новая карьера, настройки.
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { S, DISC_ORDER, pack, userTeam } from '../core/game';
import { UI, bump, save, wipe, openModal, closeModal } from '../ui/store';
import { T, Btn, Row, OrgLogo, GameIcon } from '../ui/kit';
import { C, F, alpha } from '../ui/theme';

export function confirmNewCareer() {
  openModal(() => (
    <View>
      <T h s={18}>Новая карьера?</T>
      <T style={{ marginVertical: 10 }}>Текущее сохранение «{S.org.name}» будет удалено без возможности восстановления.</T>
      <Row><Btn style={{ flex: 1 }} title="Отмена" onPress={closeModal} /><Btn style={{ flex: 1 }} kind="bad" title="Удалить и начать заново" onPress={async () => { closeModal(); await wipe(); UI.title = false; UI.tab = 'home'; bump(); }} /></Row>
    </View>
  ));
}
export function openGameMenu() {
  openModal(() => (
    <View style={{ gap: 8 }}>
      <T h s={18}>Меню</T>
      <Btn kind="pri" ac={S.org.c1} title="Продолжить" onPress={closeModal} />
      <Btn title="Главное меню" onPress={() => { save(); closeModal(); UI.title = true; bump(); }} />
      <Btn title="Настройки, патч и сохранение" onPress={() => { closeModal(); UI.tab = 'org'; UI.org = 'set'; UI.sel = null; bump(); }} />
      <Btn kind="bad" title="Новая карьера" onPress={() => { closeModal(); setTimeout(confirmNewCareer, 250); }} />
    </View>
  ));
}

export default function Title() {
  const ins = useSafeAreaInsets();
  const divs = Object.keys(S.divs);
  return (
    <View style={{ flex: 1, backgroundColor: C.bg0 }}>
      <LinearGradient colors={[alpha(S.org.c1, 0.28), 'rgba(5,7,11,0)', 'rgba(5,7,11,1)']} locations={[0, 0.55, 1]} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: Math.max(ins.left, 20) + 10, paddingRight: Math.max(ins.right, 20) + 10, paddingVertical: Math.max(ins.top, 14), gap: 28 }}>
        <View style={{ flex: 1.1 }}>
          <T mu s={10} style={{ fontFamily: F.h, letterSpacing: 3 }}>ESPORTS MANAGER SIMULATOR</T>
          <Text style={{ fontFamily: F.hx, fontSize: 40, color: C.tx, letterSpacing: 1 }}>ESPORTS EMPIRE</Text>
          <View style={{ height: 3, width: 90, backgroundColor: S.org.c1, marginVertical: 12, borderRadius: 2 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: C.line }}>
            <OrgLogo size={58} />
            <View style={{ flex: 1 }}>
              <T h s={18} n={1}>{S.org.name}</T>
              <T mu s={11}>Сезон {S.season} · неделя {S.week} · {divs.length} {divs.length === 1 ? 'дивизион' : 'дивизиона'}</T>
              <Row gap={6} style={{ marginTop: 6 }}>{divs.map(d => <GameIcon key={d} d={d} size={22} />)}</Row>
            </View>
          </View>
        </View>
        <View style={{ width: 280, gap: 10 }}>
          <Btn kind="pri" ac={S.org.c1} title="Продолжить карьеру" onPress={() => { UI.title = false; bump(); }} />
          <Btn title="Настройки и патч" onPress={() => { UI.title = false; UI.tab = 'org'; UI.org = 'set'; bump(); }} />
          <Btn kind="bad" title="Новая карьера" onPress={confirmNewCareer} />
          <T mu s={10} style={{ textAlign: 'center', marginTop: 4 }}>Прогресс сохраняется автоматически</T>
        </View>
      </View>
    </View>
  );
}
