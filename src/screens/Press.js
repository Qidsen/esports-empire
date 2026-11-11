// Пресс-конференция: два вопроса, по три ответа, итог.
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { S, FAKE, tname } from '../core/game';
import { questionText, answerText, applyAnswer, pressDone } from '../core/press';
import { openModal, closeModal, save, bump } from '../ui/store';
import { T, Btn, Row, TeamLogo } from '../ui/kit';
import { Ico } from '../ui/icons';
import { sfx } from '../ui/audio';
import { C, F, alpha } from '../ui/theme';

function Body({ P, then }) {
  const [qi, setQi] = useState(0); const [res, setRes] = useState(null); const [log, setLog] = useState([]);
  const c = P.c; const ac = FAKE[c.d].color; const q = P.qs[qi]; const done = qi >= P.qs.length;
  const finish = () => { pressDone(P, log); save(); bump(); closeModal(); then && then(); };
  return (
    <View>
      <LinearGradient colors={[alpha(ac, 0.22), 'rgba(0,0,0,0)']} style={{ position: 'absolute', left: -16, right: -16, top: -16, height: 110 }} />
      <Row gap={10} style={{ marginBottom: 10 }}>
        <View style={{ width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: alpha(ac, 0.2), borderWidth: 1, borderColor: alpha(ac, 0.5) }}><Ico n="mic" size={26} color={ac} /></View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: F.h, fontSize: 10, letterSpacing: 1.6, color: C.mu }}>ПРЕСС-КОНФЕРЕНЦИЯ · {c.kind === 'pre' ? 'ПЕРЕД МАТЧЕМ' : 'ПОСЛЕ МАТЧА'}</Text>
          <Text style={{ fontFamily: F.hx, fontSize: 18, color: C.tx }}>{tname(c.ut)} vs {tname(c.opp)}</Text>
        </View>
        <TeamLogo t={c.opp} size={36} />
      </Row>
      {!done ? <>
        <T mu s={11} style={{ marginBottom: 2 }}>{P.jour} · вопрос {qi + 1} из {P.qs.length}</T>
        <T s={16} h style={{ marginBottom: 10, lineHeight: 22 }}>«{questionText(q, c)}»</T>
        {res === null ? <View style={{ gap: 7 }}>{q.a.map((a, i) => (
          <Pressable key={i} onPress={() => { sfx('ui_select'); const r = applyAnswer(P, qi, i); setRes(r); setLog(l => l.concat(r)); }} style={({ pressed }) => ({ padding: 11, borderRadius: 11, borderWidth: 1.5, borderColor: pressed ? ac : C.line2, backgroundColor: pressed ? alpha(ac, 0.15) : 'rgba(255,255,255,0.03)' })}>
            <Text style={{ fontFamily: F.hm, fontSize: 13.5, color: C.tx }}>{answerText(a, c)}</Text>
          </Pressable>))}</View> : <View>
          <View style={{ padding: 10, borderRadius: 10, backgroundColor: alpha(ac, 0.12), borderWidth: 1, borderColor: alpha(ac, 0.4) }}><T s={13}>{res}</T></View>
          <Btn kind="pri" ac={S.org.c1} style={{ marginTop: 10 }} title={qi + 1 < P.qs.length ? 'Следующий вопрос' : 'Завершить'} onPress={() => { setRes(null); setQi(qi + 1); }} />
        </View>}
      </> : <View>
        <T h s={15} style={{ marginBottom: 6 }}>Итоги</T>
        {log.map((l, i) => <Row key={i} gap={6} style={{ paddingVertical: 2 }}><Ico n="chat" size={14} color={ac} /><T s={12.5} style={{ flex: 1 }}>{l}</T></Row>)}
        <Btn kind="pri" ac={S.org.c1} style={{ marginTop: 10 }} title="Дальше" onPress={finish} />
      </View>}
    </View>
  );
}
export function showPress(P, then) { if (!P) { then && then(); return; } sfx('ui_open'); openModal(() => <Body P={P} then={then} />); }
