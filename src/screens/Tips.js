// Подсказки первого сезона: по одной на экран, показываются один раз.
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { S, FAKE } from '../core/game';
import { UI, bump, save } from '../ui/store';
import { Ico } from '../ui/icons';
import { C, F, alpha } from '../ui/theme';

const TIPS = {
  home: ['house', 'Штаб', 'Здесь главное: следующий матч, план недели и деньги. Выбери план (скримы, стрим или отдых) и жми «Играть неделю» вверху. Зарплаты и выплаты лиги приходят раз в 4 недели.'],
  roster: ['friends', 'Состав', 'Карточки основы: навыки, мораль, форма и характер. «Замена» меняет игрока той же позиции. Во вкладке «Связки» видно, кто с кем сыгрался, — это даёт силу в матче.'],
  market: ['trade', 'Рынок', 'Свободные агенты бесплатны, но сильные не пойдут в слабую команду. Во «Слухах» — звонки агентов со скидкой. Переговоры: сначала с клубом о сумме, потом с игроком о контракте.'],
  comp: ['trophy', 'Турниры', 'Таблица лиги: топ-2 поднимаются, последние 2 вылетают, топ-4 играют плей-офф. Во вкладке «Рейтинги» — мировой топ команд и игроков.'],
  org: ['castle', 'Клуб', 'База даёт бонусы: геймхаус — очки тренировок, офис — новые дивизионы и спонсоров. В «Витрине» — карьера менеджера и достижения.'],
  veto: ['map', 'Вето карт', 'Банить карты, где соперник сильнее, брать свои. Без аналитика подготовка соперника скрыта. ★ — любимые карты игроков, на них они сильнее.'],
  cs: ['target', 'Решения в CS', 'Панель внизу: закуп на следующий раунд (эко, форс, фулл) и тактика. Раш в стак проваливается, дефолт наказывает стак. Соперник читает твои привычки — меняй решения.'],
  moba: ['dragon', 'Решения в MOBA', 'Кнопки внизу: смок-ганк, пуш линии и босс. У каждой своя перезарядка. Идти на босса выгоднее, когда у тебя перевес.'],
  ball: ['ball', 'Решения в матче', 'Кнопки внизу: ва-банк, когда проигрываешь в конце, оборона, чтобы удержать счёт, и тайм-аут или подбадривание — один раз за игру.'],
};
export function tipKey() {
  if (!S || S.tipsOff || UI.title) return null;
  if (UI.live) { const k = FAKE[UI.live.d].kind; return UI.livePhase === 'veto' ? 'veto' : UI.livePhase === 'play' ? (k === 'fps' ? 'cs' : k === 'moba' ? 'moba' : 'ball') : null; }
  if (UI.neg) return 'market'; return UI.tab;
}
export default function Tip() {
  const k = tipKey(); if (!k || !TIPS[k] || (S.tips && S.tips[k])) return null;
  const [ic, title, text] = TIPS[k]; const live = !!UI.live;
  const close = off => { S.tips = S.tips || {}; S.tips[k] = 1; if (off) S.tipsOff = true; save(); bump(); };
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', right: 14, top: live ? 92 : undefined, bottom: live ? undefined : 14, width: 300 }}>
      <View style={{ backgroundColor: 'rgba(12,17,28,0.97)', borderRadius: 14, borderWidth: 1.5, borderColor: alpha(S.org.c1, 0.7), padding: 12, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 }}><Ico n={ic} size={20} color={S.org.c1} /><Text style={{ flex: 1, fontFamily: F.h, fontSize: 13.5, color: C.tx }}>Подсказка · {title}</Text></View>
        <Text style={{ fontFamily: F.b, fontSize: 12, color: C.tx, lineHeight: 17 }}>{text}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 9 }}>
          <Pressable onPress={() => close(false)} style={{ flex: 1, height: 30, borderRadius: 8, backgroundColor: S.org.c1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: F.h, fontSize: 12, color: '#0a0d14' }}>Понятно</Text></Pressable>
          <Pressable onPress={() => close(true)} style={{ paddingHorizontal: 10, height: 30, borderRadius: 8, borderWidth: 1, borderColor: C.line2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: F.hm, fontSize: 11, color: C.mu }}>Не показывать</Text></Pressable>
        </View>
      </View>
    </View>
  );
}
