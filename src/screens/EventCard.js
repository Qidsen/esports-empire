// Карточка события с выбором: описание, 2–3 ответа, итог.
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { S, pack, pnick, FAKE } from '../core/game';
import { eventCtx, optLabel, resolveEvent, pendingEvents } from '../core/events';
import { openModal, closeModal, save, bump } from '../ui/store';
import { T, Btn, Row, GameIcon } from '../ui/kit';
import { C, F, alpha } from '../ui/theme';
import { Ico } from '../ui/icons';

function Card({ rec, onDone }) {
  const [res, setRes] = useState(null);
  const x = eventCtx(rec); if (!x) { return <View><T mu>Событие устарело.</T><Btn style={{ marginTop: 10 }} title="Дальше" onPress={onDone} /></View>; }
  const { def, c } = x; const ac = FAKE[c.d].color;
  return (
    <View>
      <LinearGradient colors={[alpha(ac, 0.25), 'rgba(0,0,0,0)']} style={{ position: 'absolute', left: -16, right: -16, top: -16, height: 120 }} />
      <Row gap={10} style={{ marginBottom: 8 }}>
        <View style={{ width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: alpha(ac, 0.18), borderWidth: 1, borderColor: alpha(ac, 0.5) }}><Ico n={def.ic} size={32} color={ac} /></View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: F.h, fontSize: 10, letterSpacing: 1.6, color: C.mu }}>СОБЫТИЕ · {pack(c.d).game.toUpperCase()}</Text>
          <Text style={{ fontFamily: F.hx, fontSize: 21, color: C.tx }}>{def.title}</Text>
        </View>
        <GameIcon d={c.d} size={26} />
      </Row>
      <T s={14.5} style={{ lineHeight: 21, marginBottom: 12 }}>{def.text(c)}</T>
      {res === null ? (
        <View style={{ gap: 8 }}>
          {def.opts.map((o, i) => (
            <Pressable key={i} onPress={() => { const r = resolveEvent(rec, i); save(); bump(); setRes(r || '—'); }} style={({ pressed }) => ({ padding: 12, borderRadius: 12, borderWidth: 1.5, borderColor: pressed ? ac : C.line2, backgroundColor: pressed ? alpha(ac, 0.15) : 'rgba(255,255,255,0.03)' })}>
              <Text style={{ fontFamily: F.h, fontSize: 14.5, color: C.tx }}>{optLabel(o, c)}</Text>
              {o.sub ? <Text style={{ fontFamily: F.b, fontSize: 11.5, color: C.mu, marginTop: 2 }}>{o.sub}</Text> : null}
            </Pressable>
          ))}
        </View>
      ) : (
        <View>
          <View style={{ padding: 12, borderRadius: 12, backgroundColor: alpha(ac, 0.12), borderWidth: 1, borderColor: alpha(ac, 0.45) }}>
            <Text style={{ fontFamily: F.h, fontSize: 10, letterSpacing: 1.4, color: C.mu, marginBottom: 3 }}>ИТОГ</Text>
            <T s={14}>{res}</T>
          </View>
          <Btn kind="pri" ac={S.org.c1} title="Дальше" onPress={onDone} style={{ marginTop: 12 }} />
        </View>
      )}
    </View>
  );
}
// Показать все ждущие события по очереди, затем then()
export function showEvents(then) {
  const q = pendingEvents();
  if (!q.length) { closeModal(); then && then(); return; }
  const rec = q[0];
  openModal(() => <Card key={rec.id + rec.w + rec.p} rec={rec} onDone={() => { if (S.evq && S.evq.includes(rec)) S.evq = S.evq.filter(r => r !== rec); showEvents(then); }} />);
}
