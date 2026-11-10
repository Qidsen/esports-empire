import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { S, passiveRate, tpRate, offlineCapH, scrim, stream, fmt, userTeam, weekMatches, standings, teamOf, tname, teamOvr, seriesBo, pack, FAKE, DISC_ORDER, divCost, weeklySponsor, weeklyCosts, phaseOf, maxDivs, pnick } from '../core/game';
import { UI, bump, toast, save } from '../ui/store';
import { T, H, Panel, Btn, Seg, Row, Stat, TeamLogo, Tag } from '../ui/kit';
import { C, F, alpha } from '../ui/theme';

const money = n => (n < 0 ? '−$' : '$') + fmt(Math.abs(n));
function CdBtn({ k, dur, title, icon, onPress }) {
  const [, set] = useState(0);
  useEffect(() => { const i = setInterval(() => set(v => v + 1), 500); return () => clearInterval(i); }, []);
  const left = Math.max(0, (S.cd[k] || 0) - Date.now());
  return (
    <View style={{ flex: 1 }}>
      <Btn small icon={icon} title={left ? `${Math.ceil(left / 1000)}с` : title} disabled={left > 0} onPress={onPress} />
      <View style={{ height: 3, marginTop: 4, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.06)' }}><View style={{ width: `${100 - left / dur * 100}%`, height: 3, borderRadius: 3, backgroundColor: S.org.c1 }} /></View>
    </View>
  );
}
export default function Home() {
  const [, set] = useState(0);
  useEffect(() => { const i = setInterval(() => set(v => v + 1), 1000); return () => clearInterval(i); }, []);
  const divs = Object.keys(S.divs); const locked = DISC_ORDER.filter(d => !S.divs[d]);
  return (
    <View style={{ flex: 1, flexDirection: 'row', padding: 10, gap: 10 }}>
      <ScrollView style={{ flex: 1 }}>
        <Panel>
          <H right={<Tag t={'+$' + passiveRate().toFixed(2) + '/с'} c={C.good} />}>⚡ Пассивный доход</H>
          <Row style={{ marginBottom: 8 }}><Stat label="Очки трен." value={'+' + (tpRate() * 60).toFixed(0) + '/мин'} color={C.blue} /><Stat label="Копилка офлайн" value={offlineCapH() + ' ч'} /></Row>
          <Row>
            <CdBtn k="scrim" dur={25000} icon="🎮" title="Скрим" onPress={() => { const g = scrim(); if (g) { toast('🎮 Скрим: +' + g + ' очков тренировок'); bump(); } }} />
            <CdBtn k="stream" dur={45000} icon="📡" title="Стрим" onPress={() => { const r = stream(); if (r) { toast(`📡 Стрим: +${r.f} фанатов, +$${fmt(r.m)}`); bump(); } }} />
          </Row>
          <T mu s={10.5} style={{ marginTop: 6 }}>Скрим даёт очки тренировок и практику карт, стрим — фанатов и деньги.</T>
        </Panel>
        <Panel>
          <H>Авто-сезон (idle)</H>
          <Seg ac={S.org.c1} value={!!S.auto} onChange={v => { S.auto = v; save(); bump(); }} items={[[false, 'Выкл'], [true, 'Вкл: неделя раз в 30 с']]} />
        </Panel>
        <Panel>
          <H>Финансы в неделю</H>
          <Row><Stat label="Спонсоры" value={'+' + fmt(weeklySponsor())} color={C.good} /><Stat label="Расходы" value={'−' + fmt(weeklyCosts())} color={C.bad} /><Stat label="Трофеи" value={S.trophies.length} color={C.gold} /></Row>
        </Panel>
      </ScrollView>
      <ScrollView style={{ flex: 1.25 }}>
        <Panel>
          <H right={<T mu s={10.5}>{divs.length}/{maxDivs()} по офису</T>}>Дивизионы</H>
          {divs.map(d => {
            const ut = userTeam(d); const mm = weekMatches(d).find(m => m.a === ut.id || m.b === ut.id);
            const pos = standings(d, ut.tier).findIndex(t => t.id === ut.id) + 1; const opp = mm && teamOf(d, mm.a === ut.id ? mm.b : mm.a);
            return (
              <Pressable key={d} onPress={() => { UI.d = d; UI.tab = 'roster'; bump(); }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, marginBottom: 8, borderRadius: 12, backgroundColor: alpha(FAKE[d].color, 0.08), borderWidth: 1, borderColor: alpha(FAKE[d].color, 0.35) }}>
                  <Text style={{ fontSize: 22 }}>{FAKE[d].icon}</Text>
                  <View style={{ flex: 1, minWidth: 90 }}>
                    <T h s={14} n={1}>{pack(d).game}</T>
                    <T mu s={10.5} n={1}>{pack(d).leagues[ut.tier]} · {pos}-е · {ut.rec.w}-{ut.rec.l} · OVR {teamOvr(ut)}</T>
                  </View>
                  {opp ? (mm.res ? <Tag t={mm.a === ut.id ? mm.res.sa + ':' + mm.res.sb : mm.res.sb + ':' + mm.res.sa} c={mm.res.win === ut.id ? C.good : C.bad} /> :
                    <Row gap={6}><T mu s={10} style={{ fontFamily: F.h }}>VS</T><TeamLogo t={opp} size={28} /><View style={{ maxWidth: 110 }}><T s={11.5} n={1}>{tname(opp)}</T><T mu s={10}>OVR {teamOvr(opp)} · BO{seriesBo(d, mm.bo)}</T></View></Row>) : <T mu s={11}>Нет матча</T>}
                </View>
              </Pressable>
            );
          })}
          {locked.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{locked.map(d => <Pressable key={d} onPress={() => { UI.tab = 'org'; UI.org = 'divs'; bump(); }} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: C.line, opacity: 0.7 }}><T s={11.5} mu>🔒 {FAKE[d].icon} {pack(d).game} · {money(divCost(d))}</T></Pressable>)}</View> : null}
        </Panel>
        {S.tOffers.length ? (
          <Panel ac={C.gold} onPress={() => { UI.tab = 'market'; UI.mk = 'offers'; bump(); }}>
            <H>📨 Предложения за твоих игроков · {S.tOffers.length}</H>
            {S.tOffers.slice(0, 3).map(o => { const p = S.players[o.pid]; return p ? <T key={o.id} s={12}>{pnick(p)} — {money(o.fee)} от {tname(teamOf(p.d, o.team))}</T> : null; })}
          </Panel>
        ) : null}
      </ScrollView>
      <ScrollView style={{ flex: 1.15 }}>
        <Panel>
          <H>Новости</H>
          {S.news.slice(0, 22).map((n, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 8, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: C.line }}>
              <T mu s={9.5} style={{ fontFamily: F.hm, width: 38 }}>С{n.s}Н{n.w}</T>
              <T s={12} style={{ flex: 1, color: n.c === 'good' ? '#c6f7da' : n.c === 'bad' ? '#ffd0d5' : n.c === 'gold' ? C.gold : C.tx }}>{n.t}</T>
            </View>
          ))}
        </Panel>
      </ScrollView>
    </View>
  );
}
