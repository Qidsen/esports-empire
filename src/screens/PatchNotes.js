// Экран патча меты: кого усилили, кого ослабили, какие карты сместились.
import React from 'react';
import { View, Text } from 'react-native';
import { S, FAKE, pack, heroName, mapName, META_TAGS } from '../core/game';
import { openModal, closeModal, save } from '../ui/store';
import { T, Btn, Row, GameIcon } from '../ui/kit';
import { Ico } from '../ui/icons';
import { sfx } from '../ui/audio';
import { C, F, alpha } from '../ui/theme';

function Body({ then }) {
  const P = S.patchNew; const ds = Object.keys(S.divs).filter(d => FAKE[d].kind === 'moba' || FAKE[d].kind === 'fps');
  return (
    <View>
      <Row gap={10} style={{ marginBottom: 8 }}><View style={{ width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(77,163,255,0.15)', borderWidth: 1, borderColor: 'rgba(77,163,255,0.5)' }}><Ico n="flask" size={26} color={C.blue} /></View>
        <View style={{ flex: 1 }}><Text style={{ fontFamily: F.h, fontSize: 10, letterSpacing: 1.6, color: C.mu }}>{P.major ? 'КРУПНЫЙ ПАТЧ СЕЗОНА' : 'ВЫШЕЛ ПАТЧ'}</Text><Text style={{ fontFamily: F.hx, fontSize: 20, color: C.tx }}>Обновление {P.v}</Text><T mu s={11}>{P.major ? (P.shake ? 'Мета перевёрнута — многое придётся перестраивать.' : 'Тренды сместились, но часть сильных героев осталась в игре.') : 'Точечные правки: тренды прежние, поменялись отдельные герои.'}</T></View></Row>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {ds.map(d => { const ac = FAKE[d].color;
          if (FAKE[d].kind === 'fps') { const mm = S.mapMeta || {}; return <View key={d} style={{ flex: 1, padding: 10, borderRadius: 12, backgroundColor: alpha(ac, 0.08), borderWidth: 1, borderColor: alpha(ac, 0.35) }}><Row gap={6} style={{ marginBottom: 6 }}><GameIcon d={d} size={20} /><T h s={13}>{pack(d).game}</T></Row>{Object.entries(mm).map(([i, sd]) => <T key={i} s={12}><Text style={{ fontFamily: F.h }}>{mapName(d, +i)}</Text>: сильнее {sd === 'ct' ? 'защита (CT)' : 'атака (T)'}</T>)}<T mu s={10.5} style={{ marginTop: 4 }}>На этой карте команда с сильной стороной получает бонус. Учти в вето.</T></View>; }
          const M = S.meta[d] || {}; const up = Object.entries(M).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 8); const dn = Object.entries(M).filter(x => x[1] < 0).sort((a, b) => a[1] - b[1]).slice(0, 8);
          return <View key={d} style={{ flex: 1, padding: 10, borderRadius: 12, backgroundColor: alpha(ac, 0.08), borderWidth: 1, borderColor: alpha(ac, 0.35) }}><Row gap={6} style={{ marginBottom: 6 }}><GameIcon d={d} size={20} /><T h s={13}>{pack(d).game}</T></Row>
            {(() => { const W = (S.metaW || {})[d] || {}; const ks = Object.keys(META_TAGS).sort((a, b) => W[b] - W[a]); return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>{ks.filter(k => Math.abs(W[k]) >= 0.6).map(k => <View key={k} style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: W[k] > 0 ? 'rgba(61,220,132,0.14)' : 'rgba(255,90,106,0.12)' }}><T s={10.5} style={{ color: W[k] > 0 ? C.good : C.bad }}>{W[k] > 0 ? '▲ ' : '▼ '}{META_TAGS[k]}</T></View>)}</View>; })()}
            <Row style={{ alignItems: 'flex-start', gap: 10 }}>
              <View style={{ flex: 1 }}><T s={10.5} style={{ color: C.good, fontFamily: F.h, letterSpacing: 1 }}>▲ УСИЛЕНЫ</T>{up.map(([h, v]) => <T key={h} s={12} n={1}>{heroName(d, +h)} <T s={10.5} style={{ color: C.good }}>+{v}</T></T>)}</View>
              <View style={{ flex: 1 }}><T s={10.5} style={{ color: C.bad, fontFamily: F.h, letterSpacing: 1 }}>▼ ОСЛАБЛЕНЫ</T>{dn.map(([h, v]) => <T key={h} s={12} n={1}>{heroName(d, +h)} <T s={10.5} style={{ color: C.bad }}>{v}</T></T>)}</View>
            </Row></View>; })}
      </View>
      <T mu s={10.5} style={{ marginTop: 8 }}>Усиленные герои сильнее в драфте и в игре. Игрокам с коронными героями не из меты тяжелее — переучивай их в профиле игрока. Соперники тоже подстраиваются.</T>
      <Btn kind="pri" ac={S.org.c1} style={{ marginTop: 10 }} title="Понятно" onPress={() => { S.patchNew = null; save(); closeModal(); then && then(); }} />
    </View>
  );
}
export function showPatch(then) {
  const P = S && S.patchNew; const ds = S ? Object.keys(S.divs).filter(d => FAKE[d].kind === 'moba' || FAKE[d].kind === 'fps') : [];
  if (!P || !ds.length) { if (S) S.patchNew = null; then && then(); return; }
  sfx('ui_open'); openModal(() => <Body then={then} />);
}
