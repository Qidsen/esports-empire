import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { S, userTeam, starters, ovr, pnick, pcc, FAKE, DISC_ORDER, pack, teamOvr, standings, staffOf, STAFF_TYPES, mapName, heroName, heroMeta, fmt, divCost, divRep, buyDivision, maxDivs } from '../core/game';
import { UI, bump, toast, save } from '../ui/store';
import { T, H, Panel, Btn, Seg, Chips, Row, Stat, Bar, Ovr, Flag, Tag, Role, TeamLogo, GameIcon } from '../ui/kit';
import { C, F, alpha } from '../ui/theme';
import PlayerPanel from './PlayerPanel';

const money = n => (n < 0 ? '−$' : '$') + fmt(Math.abs(n));
export function DiscChips({ all }) { return <Chips ac={UI.d && FAKE[UI.d].color} value={UI.d} onChange={d => { UI.d = d; UI.sel = null; UI.tier = null; bump(); }} items={DISC_ORDER.filter(d => all || S.divs[d]).map(d => [d, `${pack(d).game}${S.divs[d] ? '' : ' 🔒'}`, !S.divs[d], d])} />; }
export function PRow({ p, d, right, onPress }) {
  const sel = UI.sel === p.id;
  return (
    <Pressable onPress={onPress || (() => { UI.sel = p.id; bump(); })} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, paddingHorizontal: 6, borderRadius: 9, backgroundColor: sel ? alpha(FAKE[d].color, 0.16) : 'transparent', borderBottomWidth: 1, borderBottomColor: C.line }}>
      <Role t={FAKE[d].roles[p.role]} />
      <Flag cc={pcc(p)} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Row gap={5}><T h s={13} n={1} style={{ flexShrink: 1 }}>{pnick(p)}</T>{p.standin ? <Tag t="стенд-ин" c={C.bad} /> : null}{p.loanIn ? <Tag t="аренда" c={C.blue} /> : null}{p.transferReq ? <Tag t="!" c={C.bad} /> : null}</Row>
        <T mu s={10}>{p.age} л. · форма {p.form > 0 ? '+' : ''}{p.form} · мораль {p.mor}</T>
      </View>
      {right}
      <Ovr o={ovr(p)} s={19} />
    </Pressable>
  );
}
export function UnlockCard({ d }) {
  const ok = S.rep >= divRep(d); const slots = Object.keys(S.divs).length < maxDivs();
  return (
    <Panel ac={FAKE[d].color} style={{ alignItems: 'center' }}>
      <GameIcon d={d} size={48} />
      <T h s={20}>{pack(d).game}</T>
      <T mu s={12} style={{ textAlign: 'center', marginVertical: 6 }}>{FAKE[d].size}×{FAKE[d].size} · старт в {pack(d).leagues[2]}{'\n'}Нужно: {money(divCost(d))}, репутация {divRep(d)} (у тебя {Math.round(S.rep)}), свободный слот офиса ({Object.keys(S.divs).length}/{maxDivs()})</T>
      <Btn kind="pri" ac={FAKE[d].color} disabled={!ok || !slots || S.money < divCost(d)} title="Открыть дивизион" onPress={() => { const e = buyDivision(d); if (e) toast(e); else { save(); toast('🎉 Новый дивизион!'); UI.d = d; } bump(); }} />
    </Panel>
  );
}
function TeamSide({ d }) {
  const t = userTeam(d); const dv = S.divs[d]; const ac = FAKE[d].color;
  const co = staffOf('coach', d)[0], an = staffOf('analyst', d)[0];
  const styles = FAKE[d].kind === 'moba' ? [['agr', 'Давление'], ['bal', 'Баланс'], ['farm', 'Фарм']] : FAKE[d].kind === 'ball' ? [['agr', 'Прессинг'], ['bal', 'Ротации'], ['pas', 'Оборона']] : FAKE[d].kind === 'duel' ? [['agr', 'Атака'], ['bal', 'Баланс'], ['pas', 'Контратаки']] : [['agr', 'Агрессия'], ['bal', 'Стандарт'], ['pas', 'Осторожно']];
  return (
    <View>
      <Panel>
        <H>Тактика и тренировки</H>
        <T mu s={11} style={{ marginBottom: 4 }}>Стиль игры</T>
        <Seg ac={ac} value={dv.style} onChange={v => { dv.style = v; save(); bump(); }} items={styles} />
        <T mu s={11} style={{ marginVertical: 4 }}>Фокус недели</T>
        <Seg ac={ac} value={dv.train} onChange={v => { dv.train = v; save(); bump(); }} items={[['bal', 'Баланс'], ['mech', 'Механика'], ['tac', 'Тактика'], ['rest', 'Отдых']]} />
        <T mu s={10.5} style={{ marginTop: 4 }}>{{ bal: 'Ровный рост всех навыков.', mech: 'Механика и клатч растут быстрее.', tac: 'IQ и командная игра + химия.', rest: 'Слабый рост, но мораль быстро восстанавливается.' }[dv.train]}</T>
      </Panel>
      <Panel>
        <H>Штаб дивизиона</H>
        {[['coach', co], ['analyst', an]].map(([k, s]) => (
          <Pressable key={k} onPress={() => { UI.tab = 'org'; UI.org = 'staff'; bump(); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 }}>
            <Text style={{ fontSize: 20 }}>{STAFF_TYPES[k].i}</Text>
            <View style={{ flex: 1 }}><T h s={13}>{s ? s.name : 'Вакансия'}</T><T mu s={10.5}>{STAFF_TYPES[k].n}{s ? ' · $' + fmt(s.sal) + '/нед' : ' · нажми, чтобы нанять'}</T></View>
            {s ? <Ovr o={s.sk * 5} s={16} style={{ minWidth: 20 }} /> : <Tag t="нанять" c={ac} />}
          </Pressable>
        ))}
      </Panel>
      {FAKE[d].kind === 'fps' ? (
        <Panel>
          <H right={<T mu s={10}>фокус: до 2 карт</T>}>Маппул</H>
          {t.prac.map((v, i) => (
            <Pressable key={i} onPress={() => { const f = dv.focus; if (f.includes(i)) f.splice(f.indexOf(i), 1); else { if (f.length >= 2) f.shift(); f.push(i); } save(); bump(); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 }}>
              <T s={13} style={{ width: 16, color: dv.focus.includes(i) ? ac : C.mu2 }}>{dv.focus.includes(i) ? '★' : '·'}</T>
              <T s={12} style={{ width: 92 }} n={1}>{mapName(d, i)}</T>
              <Bar v={v} ac={ac} style={{ flex: 1 }} />
              <T num s={12} style={{ width: 26, textAlign: 'right' }}>{Math.round(v)}</T>
            </Pressable>
          ))}
        </Panel>
      ) : null}
      {FAKE[d].kind === 'moba' ? (
        <Panel>
          <H>Пулы героев · мета</H>
          {starters(t).map(p => (
            <View key={p.id} style={{ paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: C.line }}>
              <T s={11.5} style={{ marginBottom: 3 }}><Text style={{ fontFamily: F.h }}>{pnick(p)}</Text> <Text style={{ color: C.mu }}>{FAKE[d].roles[p.role]}</Text></T>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>{p.pool.slice().sort((a, b) => b[1] - a[1]).slice(0, 5).map(([h, pr]) => <T key={h} s={10.5} style={{ paddingHorizontal: 6, paddingVertical: 2, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 6 }}>{heroName(d, h)} {pr}{heroMeta(d, h) > 0 ? ' ▲' : heroMeta(d, h) < 0 ? ' ▼' : ''}</T>)}</View>
            </View>
          ))}
        </Panel>
      ) : null}
    </View>
  );
}
export default function Roster() {
  const d = UI.d; if (!d) return null;
  if (!S.divs[d]) return <View style={{ flex: 1, padding: 10 }}><DiscChips all /><View style={{ width: 420, alignSelf: 'center' }}><UnlockCard d={d} /></View></View>;
  const t = userTeam(d); const dv = S.divs[d]; const st = starters(t); const bench = t.roster.map(i => S.players[i]).filter(p => p && !st.includes(p));
  const youth = (dv.youth || []).map(i => S.players[i]).filter(Boolean); const out = (dv.out || []).map(i => S.players[i]).filter(Boolean);
  const pos = standings(d, t.tier).findIndex(x => x.id === t.id) + 1; const mor = Math.round(st.reduce((a, p) => a + p.mor, 0) / st.length);
  const sel = UI.sel && S.players[UI.sel] && S.players[UI.sel].d === d ? S.players[UI.sel] : null;
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <DiscChips all />
      <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
        <ScrollView style={{ width: 340, flexGrow: 0 }}>
          <Panel ac={FAKE[d].color}>
            <Row gap={10}><TeamLogo t={t} size={46} /><View style={{ flex: 1 }}><T h s={16} n={1}>{pack(d).game}</T><T mu s={11}>{pack(d).leagues[t.tier]} · {pos}-е место</T></View><View style={{ alignItems: 'flex-end' }}><Ovr o={teamOvr(t)} s={28} /><T mu s={9}>OVR</T></View></Row>
            <Row style={{ marginTop: 8 }}>
              <View style={{ flex: 1 }}><Row><T mu s={10.5} style={{ flex: 1 }}>Химия</T><T num s={11}>{Math.round(t.chem)}</T></Row><Bar v={t.chem} ac={FAKE[d].color} /></View>
              <View style={{ flex: 1 }}><Row><T mu s={10.5} style={{ flex: 1 }}>Мораль</T><T num s={11}>{mor}</T></Row><Bar v={mor} ac={C.good} /></View>
            </Row>
          </Panel>
          <Panel pad={8}><H style={{ marginLeft: 4 }}>{`Основа · ${FAKE[d].size}`}</H>{st.map(p => <PRow key={p.id} p={p} d={d} />)}</Panel>
          <Panel pad={8}><H style={{ marginLeft: 4 }} right={<T mu s={10}>всего до 7</T>}>{`Запас · ${bench.length}`}</H>{bench.length ? bench.map(p => <PRow key={p.id} p={p} d={d} />) : <T mu s={11} style={{ margin: 4 }}>Пусто — подпиши игроков на Рынке</T>}</Panel>
          <Panel pad={8}><H style={{ marginLeft: 4 }} right={<T mu s={10}>до 6 · академия ур.{S.fac.academy}</T>}>{`🌱 Молодёжка · ${youth.length}`}</H>{youth.length ? youth.map(p => <PRow key={p.id} p={p} d={d} />) : <T mu s={11} style={{ margin: 4 }}>Таланты 15–17 лет — Рынок → Академия</T>}</Panel>
          {out.length ? <Panel pad={8}><H style={{ marginLeft: 4 }}>{`✈️ В аренде · ${out.length}`}</H>{out.map(p => <PRow key={p.id} p={p} d={d} />)}</Panel> : null}
        </ScrollView>
        <ScrollView style={{ flex: 1 }}>
          {sel ? <Panel><Row style={{ marginBottom: 4 }}><View style={{ flex: 1 }} /><Btn small title="✕ Закрыть" onPress={() => { UI.sel = null; bump(); }} /></Row><PlayerPanel p={sel} /></Panel> : <TeamSide d={d} />}
        </ScrollView>
      </View>
    </View>
  );
}
