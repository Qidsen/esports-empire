// Штаб: крупно и по делу — следующий матч, план недели, финансы, новости.
import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { S, mediaWeekly, tpWeekly, leagueWeekly, fmt, userTeam, weekMatches, standings, teamOf, tname, teamOvr, seriesBo, pack, FAKE, weeklySponsor, weeklyCosts, phaseOf, pnick } from '../core/game';
import { UI, bump, save, openModal, closeModal } from '../ui/store';
import { T, Btn, Row, TeamLogo, Tag, GameIcon } from '../ui/kit';
import { C, F, alpha } from '../ui/theme';

const money = n => (n < 0 ? '−$' : '$') + fmt(Math.abs(n));
const Card = ({ children, style, ac }) => <View style={[{ backgroundColor: 'rgba(14,20,34,0.85)', borderRadius: 16, borderWidth: 1, borderColor: ac ? alpha(ac, 0.45) : C.line, padding: 14 }, style]}>{children}</View>;
const Cap = ({ children, right }) => <Row style={{ marginBottom: 8 }}><Text style={{ flex: 1, fontFamily: F.h, fontSize: 11, letterSpacing: 1.6, color: C.mu }}>{children}</Text>{right || null}</Row>;
const PLANS = [['scrim', 'Скримы', '🎮', 'Химия, карты, +25% очков'], ['stream', 'Стрим-марафон', '📡', 'Фанаты и деньги, −химия'], ['rest', 'Отдых', '🌴', '+5 морали всем']];

function NextMatch() {
  const divs = Object.keys(S.divs); const d = divs.includes(UI.homeD) ? UI.homeD : divs[0];
  const ut = userTeam(d); const mm = weekMatches(d).find(m => m.a === ut.id || m.b === ut.id);
  const opp = mm && teamOf(d, mm.a === ut.id ? mm.b : mm.a); const pos = standings(d, ut.tier).findIndex(t => t.id === ut.id) + 1; const ac = FAKE[d].color;
  return (
    <Card ac={ac} style={{ flex: 1 }}>
      <LinearGradient colors={[alpha(ac, 0.22), 'rgba(0,0,0,0)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 16 }} />
      <Cap right={divs.length > 1 ? <Row gap={5}>{divs.map(x => <Pressable key={x} onPress={() => { UI.homeD = x; bump(); }} style={{ padding: 2, borderRadius: 8, borderWidth: 1.5, borderColor: x === d ? FAKE[x].color : 'transparent' }}><GameIcon d={x} size={22} /></Pressable>)}</Row> : <GameIcon d={d} size={22} />}>СЛЕДУЮЩИЙ МАТЧ · {pack(d).game.toUpperCase()}</Cap>
      {opp ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Row gap={0} style={{ alignItems: 'center' }}>
            <View style={{ flex: 1, alignItems: 'center' }}><TeamLogo t={ut} size={62} /><Text numberOfLines={1} style={{ fontFamily: F.h, fontSize: 15, color: C.tx, marginTop: 6 }}>{tname(ut)}</Text><T mu s={11}>OVR {teamOvr(ut)} · {pos}-е место</T></View>
            <View style={{ alignItems: 'center', paddingHorizontal: 8 }}>
              {mm.res ? <Text style={{ fontFamily: F.hx, fontSize: 30, color: mm.res.win === ut.id ? C.good : C.bad }}>{mm.a === ut.id ? mm.res.sa + ':' + mm.res.sb : mm.res.sb + ':' + mm.res.sa}</Text> : <Text style={{ fontFamily: F.hx, fontSize: 26, color: C.mu }}>VS</Text>}
              <Tag t={'BO' + seriesBo(d, mm.bo)} c={ac} />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}><TeamLogo t={opp} size={62} /><Text numberOfLines={1} style={{ fontFamily: F.h, fontSize: 15, color: C.tx, marginTop: 6 }}>{tname(opp)}</Text><T mu s={11}>OVR {teamOvr(opp)} · {standings(d, ut.tier).findIndex(t => t.id === opp.id) + 1}-е место</T></View>
          </Row>
          <T mu s={11.5} style={{ textAlign: 'center', marginTop: 10 }}>{pack(d).leagues[ut.tier]} · {phaseOf(S.week).n} · неделя {S.week}</T>
        </View>
      ) : <View style={{ flex: 1, justifyContent: 'center' }}><T mu s={13} style={{ textAlign: 'center' }}>На этой неделе матчей нет — время тренироваться.</T></View>}
    </Card>
  );
}
function WeekPlan() {
  const plan = S.weekPlan || 'scrim';
  return (
    <Card>
      <Cap>ПЛАН НЕДЕЛИ</Cap>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {PLANS.map(([k, n, ic, dsc]) => { const on = plan === k; return (
          <Pressable key={k} onPress={() => { S.weekPlan = k; save(); bump(); }} style={{ flex: 1, padding: 10, borderRadius: 12, borderWidth: 1.5, borderColor: on ? S.org.c1 : C.line, backgroundColor: on ? alpha(S.org.c1, 0.14) : 'rgba(255,255,255,0.02)' }}>
            <Row gap={6}><Text style={{ fontSize: 18 }}>{ic}</Text><Text style={{ fontFamily: F.h, fontSize: 13.5, color: on ? C.tx : C.mu }}>{n}</Text></Row>
            <Text style={{ fontFamily: F.b, fontSize: 10.5, color: C.mu, marginTop: 4 }} numberOfLines={2}>{dsc}</Text>
          </Pressable>); })}
      </View>
    </Card>
  );
}
function Finance() {
  const rows = [['Выплаты лиги', leagueWeekly()], ['Спонсоры', weeklySponsor()], ['Медиа', mediaWeekly()], ['Зарплаты и база', -weeklyCosts()]];
  const net = rows.reduce((a, r) => a + r[1], 0);
  return (
    <Card>
      <Cap right={<Pressable onPress={() => { UI.tab = 'org'; UI.org = 'spons'; bump(); }}><T s={11} style={{ color: S.org.c1, fontFamily: F.h }}>Спонсоры ›</T></Pressable>}>ФИНАНСЫ ЗА НЕДЕЛЮ</Cap>
      <Row style={{ alignItems: 'flex-end', marginBottom: 6 }}>
        <View style={{ flex: 1 }}><T mu s={10.5}>Бюджет</T><Text style={{ fontFamily: F.hx, fontSize: 24, color: S.money < 0 ? C.bad : C.tx }}>{money(S.money)}</Text></View>
        <View style={{ alignItems: 'flex-end' }}><T mu s={10.5}>Итог недели</T><Text style={{ fontFamily: F.hx, fontSize: 20, color: net >= 0 ? C.good : C.bad }}>{(net >= 0 ? '+' : '−') + money(Math.abs(net)).replace('−', '')}</Text></View>
      </Row>
      {rows.map(([n, v]) => <Row key={n} style={{ paddingVertical: 2 }}><T s={12.5} style={{ flex: 1, color: C.mu }}>{n}</T><T num s={13} style={{ color: v >= 0 ? C.good : C.bad }}>{(v >= 0 ? '+' : '−') + money(Math.abs(v)).replace('−', '')}</T></Row>)}
      <Row style={{ marginTop: 6 }}><T s={12} style={{ flex: 1 }}>Очки тренировок</T><T num s={13} style={{ color: C.blue }}>{fmt(S.tp)} <Text style={{ color: C.mu, fontSize: 11 }}>(+{tpWeekly()}/нед)</Text></T></Row>
    </Card>
  );
}
function allNews() { openModal(() => <View><T h s={18} style={{ marginBottom: 8 }}>Новости</T>{S.news.slice(0, 40).map((n, i) => <Row key={i} style={{ alignItems: 'flex-start', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: C.line }}><T mu s={10.5} style={{ width: 44 }}>С{n.s}Н{n.w}</T><T s={13} style={{ flex: 1 }}>{n.t}</T></Row>)}<Btn style={{ marginTop: 10 }} title="Закрыть" onPress={closeModal} /></View>); }
function News() {
  return (
    <Card style={{ flex: 1 }}>
      <Cap right={<Pressable onPress={allNews}><T s={11} style={{ color: S.org.c1, fontFamily: F.h }}>Все ›</T></Pressable>}>НОВОСТИ</Cap>
      {S.tOffers.length ? <Pressable onPress={() => { UI.tab = 'market'; UI.mk = 'offers'; bump(); }} style={{ padding: 8, borderRadius: 10, backgroundColor: 'rgba(255,201,77,0.1)', borderWidth: 1, borderColor: 'rgba(255,201,77,0.4)', marginBottom: 6 }}><T s={12.5} style={{ color: C.gold, fontFamily: F.h }}>📨 Предложения за игроков: {S.tOffers.length} ›</T></Pressable> : null}
      {S.news.slice(0, 5).map((n, i) => <Text key={i} numberOfLines={2} style={{ fontFamily: F.b, fontSize: 13, color: n.c === 'good' ? '#c6f7da' : n.c === 'bad' ? '#ffd0d5' : n.c === 'gold' ? C.gold : C.tx, paddingVertical: 4, borderBottomWidth: i < 4 ? 1 : 0, borderBottomColor: C.line }}>{n.t}</Text>)}
    </Card>
  );
}
export default function Home() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10, gap: 10 }}>
      <View style={{ flexDirection: 'row', gap: 10, minHeight: 230 }}>
        <View style={{ flex: 1.25 }}><NextMatch /></View>
        <View style={{ flex: 1 }}><Finance /></View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1.25 }}><WeekPlan /></View>
        <View style={{ flex: 1 }}><News /></View>
      </View>
    </ScrollView>
  );
}
