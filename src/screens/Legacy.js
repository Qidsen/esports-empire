// Витрина клуба: карьера менеджера, трофеи, достижения, зал славы. И мировые рейтинги.
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { S, pack, FAKE, tname, ttag, pnick, pcc, ovr, fmt, T as TT } from '../core/game';
import { ACH, MGR_LV, MGR_PERK, mgr, mgrLevel, legends, records, teamRanking, playerRanking } from '../core/legacy';
import { T, H, Panel, Row, Bar, Flag, TeamLogo, GameIcon, Stat } from '../ui/kit';
import { Ico } from '../ui/icons';
import { C, F, alpha } from '../ui/theme';

export function Trophies() {
  const M = mgr(); const lv = mgrLevel(); const nx = MGR_LV[lv + 1]; const cur = MGR_LV[lv][0];
  const got = S.ach || {}; const leg = legends(); const rec = records();
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1, gap: 10 }}>
          <Panel ac={C.gold}><H right={<T s={11} style={{ color: C.gold, fontFamily: F.h }}>{fmt(M.xp)} XP</T>}>Карьера менеджера</H>
            <Row gap={10}><View style={{ width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: alpha(C.gold, 0.15), borderWidth: 1.5, borderColor: alpha(C.gold, 0.6) }}><Ico n={lv >= 5 ? 'laurel' : lv >= 3 ? 'crown' : 'star'} size={28} color={C.gold} /></View>
              <View style={{ flex: 1 }}><T h s={17}>{MGR_LV[lv][1]}</T><T mu s={11}>{M.m} матчей · {M.m ? Math.round(M.w / M.m * 100) : 0}% побед · {S.trophies.length} трофеев</T>
                {nx ? <><Bar v={(M.xp - cur) / (nx[0] - cur) * 100} ac={C.gold} h={6} style={{ marginTop: 5 }} /><T mu s={10}>до «{nx[1]}»: {fmt(nx[0] - M.xp)} XP</T></> : <T s={11} style={{ color: C.gold }}>Максимальный статус</T>}</View></Row>
            <View style={{ marginTop: 8, gap: 2 }}>{MGR_PERK.slice(1).map((p, i) => <Row key={i} gap={6}><Ico n={lv >= i + 1 ? 'check' : 'lock'} size={13} color={lv >= i + 1 ? C.good : C.mu} /><T s={11} style={{ flex: 1, color: lv >= i + 1 ? C.tx : C.mu }}>{MGR_LV[i + 1][1]}: {p}</T></Row>)}</View>
          </Panel>
          <Panel><H>Трофеи · {S.trophies.length}</H>{S.trophies.length ? S.trophies.map((t, i) => <Row key={i} style={{ paddingVertical: 4 }}><Ico n="trophy" size={22} color={C.gold} /><View><T h s={13}>{t.n}</T><T mu s={11}>{pack(t.d).game} · сезон {t.s}</T></View></Row>) : <T mu>Витрина пуста. Пора это исправить.</T>}</Panel>
        </View>
        <Panel style={{ flex: 1 }}><H right={<T mu s={11}>{Object.keys(got).length}/{ACH.length}</T>}>Достижения</H>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{ACH.map(([id, n, d, ic]) => { const g = got[id]; return (
            <View key={id} style={{ width: '48.5%', flexDirection: 'row', gap: 7, alignItems: 'center', padding: 7, borderRadius: 9, backgroundColor: g ? alpha(C.gold, 0.1) : 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: g ? alpha(C.gold, 0.45) : C.line, opacity: g ? 1 : 0.55 }}>
              <Ico n={g ? ic : 'lock'} size={22} color={g ? C.gold : C.mu} />
              <View style={{ flex: 1 }}><T h s={11.5} n={1}>{n}</T><T mu s={9.5} n={2}>{d}{g ? ' · С' + g.s + 'Н' + g.w : ''}</T></View>
            </View>); })}</View>
        </Panel>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Panel style={{ flex: 1.3 }}><H>Зал славы</H>{leg.length ? leg.slice(0, 10).map(h => <Row key={h.id} gap={8} style={{ paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: C.line }}><GameIcon d={h.d} size={18} /><T h s={12.5} style={{ flex: 1 }}>{h.nk}</T><T mu s={11}>{h.seasons} сез. · {h.mp} игр · {h.mvp} MVP{h.tr ? ' · ' : ''}</T>{h.tr ? <Row gap={2}><Ico n="trophy" size={13} color={C.gold} /><T s={11} style={{ color: C.gold }}>{h.tr}</T></Row> : null}</Row>) : <T mu s={11.5}>Легендами становятся игроки, отыгравшие за клуб 2+ сезона, выигравшие трофей или набравшие 10+ MVP.</T>}</Panel>
        <Panel style={{ flex: 1 }}><H>Рекорды клуба</H>{rec.length ? rec.map(([n, h, k]) => <Row key={n} gap={8} style={{ paddingVertical: 4 }}><Ico n="medal" size={16} color={C.gold} /><T s={12} style={{ flex: 1 }}>{n}</T><T h s={12}>{h.nk} · {h[k]}</T></Row>) : <T mu s={11.5}>Рекорды появятся после первых матчей.</T>}</Panel>
      </View>
    </View>
  );
}
export function Rankings({ d }) {
  const tr = teamRanking(d).slice(0, 20); const pr = playerRanking(d).slice(0, 20); const ac = FAKE[d].color;
  return (
    <View style={{ gap: 10 }}>
      <Panel><H right={<T mu s={10.5}>рейтинг Эло</T>}>Топ-20 команд мира</H>
        {tr.map((x, i) => <Row key={x.t.id} gap={8} style={{ paddingVertical: 3, borderRadius: 6, backgroundColor: x.t.user ? alpha(S.org.c1, 0.14) : 'transparent', paddingHorizontal: 4 }}><T num s={12} style={{ width: 22, color: i < 3 ? C.gold : C.mu }}>{i + 1}</T><TeamLogo t={x.t} size={20} /><T s={12.5} n={1} style={{ flex: 1, fontFamily: x.t.user ? F.h : F.b }}>{tname(x.t)}</T><T mu s={10.5}>{pack(d).leagues[x.t.tier].split(' ')[0]}</T><T num s={12} style={{ width: 42, textAlign: 'right' }}>{x.elo}</T></Row>)}
      </Panel>
      <Panel><H right={<T mu s={10.5}>рейтинг сезона</T>}>Топ-20 игроков</H>
        {pr.length ? pr.map((x, i) => { const mine = S.divs[d] && x.p.team === S.divs[d].team; return <Row key={x.p.id} gap={8} style={{ paddingVertical: 3, borderRadius: 6, backgroundColor: mine ? alpha(S.org.c1, 0.14) : 'transparent', paddingHorizontal: 4 }}><T num s={12} style={{ width: 22, color: i < 3 ? C.gold : C.mu }}>{i + 1}</T><Flag cc={pcc(x.p)} s={12} /><T s={12.5} n={1} style={{ flex: 1, fontFamily: mine ? F.h : F.b }}>{pnick(x.p)}</T><T mu s={10.5}>{x.p.team && TT(x.p.team) ? ttag(TT(x.p.team)) : '—'} · OVR {ovr(x.p)}</T><T num s={12} style={{ width: 38, textAlign: 'right', color: ac }}>{x.rt.toFixed(2)}</T></Row>; }) : <T mu s={11.5}>Рейтинг игроков появится после 4 сыгранных игр.</T>}
      </Panel>
    </View>
  );
}
