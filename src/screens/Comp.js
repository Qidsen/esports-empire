import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { S, userTeam, standings, teamOf, tname, teamOvr, pack, FAKE, seriesBo, PRIZE, fmt } from '../core/game';
import { UI, bump, openModal } from '../ui/store';
import { T, H, Panel, Seg, Row, TeamLogo, Ovr, Tag } from '../ui/kit';
import { C, F, alpha } from '../ui/theme';
import { DiscChips, PRow } from './Roster';

const money = n => '$' + fmt(n);
function teamModal(t) { openModal(() => <View><Row style={{ marginBottom: 10 }}><TeamLogo t={t} size={50} /><View style={{ flex: 1 }}><T h s={20}>{tname(t)}</T><T mu>{pack(t.d).leagues[t.tier]} · OVR {teamOvr(t)} · {t.rec.w}-{t.rec.l}</T></View></Row>{t.roster.map(i => S.players[i] && <PRow key={i} p={S.players[i]} d={t.d} onPress={() => { }} />)}</View>); }
function Match({ d, m }) {
  const a = teamOf(d, m.a), b = teamOf(d, m.b); const r = m.res;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 7, marginBottom: 5, borderWidth: 1, borderColor: a.user || b.user ? alpha(S.org.c1, 0.5) : C.line }}>
      <TeamLogo t={a} size={22} /><T s={12} n={1} style={{ flex: 1, color: r && r.win !== a.id ? C.mu : C.tx }}>{tname(a)}</T>
      <T h s={13}>{r ? r.sa + ':' + r.sb : 'BO' + seriesBo(d, m.bo)}</T>
      <T s={12} n={1} style={{ flex: 1, textAlign: 'right', color: r && r.win !== b.id ? C.mu : C.tx }}>{tname(b)}</T><TeamLogo t={b} size={22} />
    </View>
  );
}
export default function Comp() {
  const d = UI.d && S.divs[UI.d] ? UI.d : Object.keys(S.divs)[0]; UI.d = d; const W = S.world[d]; const ut = userTeam(d); const ac = FAKE[d].color;
  if (UI.tier === null || UI.tier === undefined) UI.tier = ut.tier;
  const st = standings(d, UI.tier);
  const mine = []; W.sched.forEach((wk, wi) => wk.forEach(m => { if (m.a === ut.id || m.b === ut.id) mine.push([wi + 1, m]); }));
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <DiscChips />
      <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
        <ScrollView style={{ flex: 1.1 }}>
          <Seg ac={ac} value={UI.tier} onChange={v => { UI.tier = v; bump(); }} items={[[0, 'Высшая'], [1, 'Вторая'], [2, 'Открытая']]} style={{ marginBottom: 8 }} />
          <Panel>
            <H>{pack(d).leagues[UI.tier]}</H>
            <Row style={{ paddingVertical: 4 }}><T mu s={10} style={{ flex: 1 }}>#  КОМАНДА</T><T mu s={10} style={{ width: 44, textAlign: 'right' }}>В-П</T><T mu s={10} style={{ width: 36, textAlign: 'right' }}>±</T><T mu s={10} style={{ width: 40, textAlign: 'right' }}>ОЧКИ</T><T mu s={10} style={{ width: 36, textAlign: 'right' }}>OVR</T></Row>
            {st.map((t, i) => (
              <Pressable key={t.id} onPress={() => teamModal(t)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: t.user ? alpha(S.org.c1, 0.12) : 'transparent', borderLeftWidth: 3, borderLeftColor: UI.tier > 0 && i < 2 ? C.good : UI.tier < 2 && i >= 6 ? C.bad : 'transparent', paddingLeft: 4 }}>
                <T num s={12} mu style={{ width: 18 }}>{i + 1}</T><TeamLogo t={t} size={22} /><T s={12.5} n={1} style={{ flex: 1, marginLeft: 6 }}>{tname(t)}</T>
                <T num s={12} style={{ width: 44, textAlign: 'right' }}>{t.rec.w}-{t.rec.l}</T><T num s={12} style={{ width: 36, textAlign: 'right' }}>{t.rec.md > 0 ? '+' : ''}{t.rec.md}</T><T h s={13} style={{ width: 40, textAlign: 'right' }}>{t.rec.pts}</T><Ovr o={teamOvr(t)} s={13} style={{ width: 36, minWidth: 0 }} />
              </Pressable>
            ))}
            <T mu s={10.5} style={{ marginTop: 6 }}>Зелёные — повышение, красные — вылет. Топ-4 — плей-офф. Топ-6 высшей и топ-2 второй лиги едут на {pack(d).major}.</T>
          </Panel>
        </ScrollView>
        <ScrollView style={{ flex: 1 }}>
          <Seg ac={ac} value={UI.cmp} onChange={v => { UI.cmp = v; bump(); }} items={[['table', 'Календарь'], ['po', 'Плей-офф'], ['wc', 'Мейджор'], ['hist', 'История']]} style={{ marginBottom: 8 }} />
          {UI.cmp === 'table' ? <Panel><H>Календарь {S.org.tag}</H>{mine.map(([w, m]) => { const opp = teamOf(d, m.a === ut.id ? m.b : m.a); const r = m.res; return <Row key={w} style={{ paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: C.line }}><T mu s={10.5} style={{ width: 30, fontFamily: F.hm }}>Н{w}</T><TeamLogo t={opp} size={20} /><T s={12} n={1} style={{ flex: 1 }}>{tname(opp)}</T>{r ? <Tag t={m.a === ut.id ? r.sa + ':' + r.sb : r.sb + ':' + r.sa} c={r.win === ut.id ? C.good : C.bad} /> : w === S.week ? <Tag t="сейчас" c={ac} /> : <T mu s={11}>—</T>}</Row>; })}</Panel> : null}
          {UI.cmp === 'po' ? ([0, 1, 2].some(t => W.po[t]) ? [0, 1, 2].map(t => W.po[t] ? <Panel key={t}><H>{pack(d).leagues[t]}</H><T mu s={10} style={{ marginBottom: 4 }}>ПОЛУФИНАЛЫ</T>{W.po[t].semis.map((m, i) => <Match key={i} d={d} m={m} />)}{W.po[t].final ? <><T mu s={10} style={{ marginVertical: 4 }}>ФИНАЛ</T>{W.po[t].final.map((m, i) => <Match key={i} d={d} m={m} />)}</> : null}{W.po[t].champ ? <T s={12} style={{ color: C.gold, marginTop: 4 }}>🏆 {tname(teamOf(d, W.po[t].champ))}</T> : null}</Panel> : null) : <Panel><T mu>Плей-офф начнётся на 15-й неделе.</T></Panel>) : null}
          {UI.cmp === 'wc' ? (W.wc ? <Panel><H>{pack(d).major}</H>{W.wc.rounds.map((r, ri) => <View key={ri}><T mu s={10} style={{ marginVertical: 4 }}>{['1/4 ФИНАЛА', 'ПОЛУФИНАЛЫ', 'ГРАНД-ФИНАЛ'][ri]}</T>{r.map((m, i) => <Match key={i} d={d} m={m} />)}</View>)}{W.wc.champ ? <T s={13} style={{ color: C.gold, marginTop: 6 }}>🏆 Чемпион: {tname(teamOf(d, W.wc.champ))}</T> : null}<T mu s={10.5} style={{ marginTop: 6 }}>Призовые: {money(PRIZE.wc[0])} чемпиону, {money(PRIZE.wc[1])} финалисту.</T></Panel> : <Panel><T mu>{pack(d).major} стартует на 17-й неделе: 8 команд, плей-офф на вылет.</T></Panel>) : null}
          {UI.cmp === 'hist' ? <Panel><H>Чемпионы {pack(d).major}</H>{W.champs.length ? W.champs.map((c, i) => <Row key={i} style={{ paddingVertical: 4 }}><T mu s={11} style={{ width: 30 }}>С{c.s}</T><T s={12.5} style={{ flex: 1 }}>{teamOf(d, c.id) ? tname(teamOf(d, c.id)) : c.t}</T>{teamOf(d, c.id) && teamOf(d, c.id).user ? <T>🏆</T> : null}</Row>) : <T mu>Пока пусто.</T>}</Panel> : null}
        </ScrollView>
      </View>
    </View>
  );
}
