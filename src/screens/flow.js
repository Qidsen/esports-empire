import React from 'react';
import { View } from 'react-native';
import { S, userMatchesThisWeek, finishWeek, quickSeries, applyResult, teamOf, pack, seriesBo, tname, teamOvr, userTeam, fmt, FAKE } from '../core/game';
import { UI, bump, openModal, closeModal, save, toast } from '../ui/store';
import { T, Btn, TeamLogo, Ovr, Row, Panel } from '../ui/kit';
import { C, F } from '../ui/theme';
import { rollEvent, pendingEvents } from '../core/events';
import { showEvents } from './EventCard';
import { IconText } from '../ui/icons';
import { sfx } from '../ui/audio';
import { rollPress } from '../core/press';
import { showPress } from './Press';
import { showTrophies } from './TrophyShow';
import { showPatch } from './PatchNotes';

const money = n => (n < 0 ? '−$' : '$') + fmt(Math.abs(n));
export function playWeek() {
  if (UI.live) return;
  if (pendingEvents().length) { showEvents(() => playWeek()); return; }
  UI.queue = userMatchesThisWeek(); UI.week0 = S.money; runQueue();
}
export function runQueue() {
  if (UI.queue.length) { const { d, m } = UI.queue.shift(); preMatch(d, m); return; }
  const wk = S.week, ss = S.season; const before = UI.week0 || S.money; const log = finishWeek(); rollEvent(); save(); if (log.payday) setTimeout(() => sfx('cash'), 250); UI.tier = null; bump();
  const res = S.news.filter(n => n.s === ss && n.w === wk && ['good', 'bad', 'gold'].includes(n.c));
  openModal(() => (
    <View>
      <T h s={20}>Итоги недели {wk}</T>
      <T mu style={{ marginBottom: 10 }}>Сезон {ss}</T>
      <Row style={{ marginBottom: 10 }}>
        {(log.payday ? [['Доходы месяца', '+' + fmt(log.payday.league + log.payday.spons + log.payday.media), C.good], ['Расходы месяца', '−' + fmt(log.payday.cost), C.bad], ['Итого за неделю', money(S.money - before), S.money - before >= 0 ? C.good : C.bad]] : [['Призовые и бонусы', money(S.money - before), S.money - before >= 0 ? C.good : C.bad], ['До дня выплат', (4 - ((S.week - 1) % 4)) + ' нед.', C.tx], ['Очки тренировок', '+' + fmt(log.tp || 0), C.blue]]).map(([l, v, c]) => (
          <View key={l} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 8, borderWidth: 1, borderColor: C.line }}><T mu s={9.5} style={{ fontFamily: F.hm, letterSpacing: 1 }}>{l.toUpperCase()}</T><T h s={18} style={{ color: c }}>{v}</T></View>
        ))}
      </Row>
      {res.length ? res.map((n, i) => <View key={i} style={{ paddingVertical: 4 }}><IconText text={n.t} size={15} iconColor={n.c === 'good' ? C.good : n.c === 'bad' ? C.bad : C.gold} style={{ fontFamily: F.b, fontSize: 12.5, color: n.c === 'good' ? '#c6f7da' : n.c === 'bad' ? '#ffd0d5' : C.gold }} /></View>) : <T mu>На этой неделе твоих матчей не было.</T>}
      <Btn kind="pri" ac={S.org.c1} title={pendingEvents().length ? 'Дальше · ⚡ событие' : 'Дальше'} onPress={() => showPatch(() => showEvents(() => showTrophies()))} style={{ marginTop: 12 }} />
    </View>
  ));
  UI.week0 = 0;
}
// после матча: иногда пресс-конференция, затем дальше по очереди
export function afterMatch(d, m) {
  const ut = userTeam(d); const won = m.res && m.res.win === ut.id;
  if (Math.random() < 0.35) { const P = rollPress(d, m, 'post', won); if (P) { showPress(P, runQueue); return; } }
  runQueue();
}
export function preMatch(d, m) {
  if (!m.press && Math.random() < 0.4) { m.press = 1; const P = rollPress(d, m, 'pre'); if (P) { showPress(P, () => preMatch(d, m)); return; } }
  const A = teamOf(d, m.a), B = teamOf(d, m.b);
  const lbl = m.wc ? pack(d).major : m.po ? pack(d).leagues[m.tier] + ' · плей-офф' : pack(d).leagues[m.tier];
  const side = t => (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <TeamLogo t={t} size={78} />
      <T h s={15} style={{ marginTop: 6, textAlign: 'center' }} n={1}>{tname(t)}</T>
      <Ovr o={teamOvr(t)} s={26} style={{ textAlign: 'center', minWidth: 0 }} />
      <T mu s={11}>{t.rec.w}-{t.rec.l} · {(t.last || []).join(' ')}</T>
    </View>
  );
  openModal(() => (
    <View>
      <T mu s={11} style={{ textAlign: 'center', letterSpacing: 2, fontFamily: F.hm }}>{pack(d).game.toUpperCase()}</T>
      <T s={12} mu style={{ textAlign: 'center' }}>{lbl} · BO{seriesBo(d, m.bo)}</T>
      <Row style={{ marginVertical: 14 }}>{side(A)}<T h s={26} mu>VS</T>{side(B)}</Row>
      <Row>
        <Btn wide style={{ flex: 1 }} kind="pri" ac={FAKE[d].color} icon="🎮" title="Смотреть в 3D и управлять" onPress={() => { closeModal(); UI.live = { d, m }; bump(); }} />
        <Btn style={{ flex: 1 }} icon="⚡" title="Быстрый результат" onPress={() => { closeModal(); m.res = quickSeries(d, m); applyResult(d, m); const ut = userTeam(d); toast(`${m.res.win === ut.id ? '✅ Победа' : '❌ Поражение'} ${m.a === ut.id ? m.res.sa + ':' + m.res.sb : m.res.sb + ':' + m.res.sa}`); setTimeout(() => afterMatch(d, m), 50); }} />
      </Row>
    </View>
  ));
}
