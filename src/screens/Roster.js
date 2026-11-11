import React from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { S, userTeam, starters, ovr, pnick, pcc, FAKE, DISC_ORDER, pack, teamOvr, standings, staffOf, STAFF_TYPES, mapName, heroName, heroMeta, fmt, divCost, divRep, buyDivision, maxDivs, tname, ATTRS, TRAITS, traitOf, pairVal, teamPairs } from '../core/game';
import { UI, bump, toast, save, openModal, closeModal } from '../ui/store';
import { T, H, Panel, Btn, Seg, Chips, Row, Stat, Bar, Ovr, Flag, Tag, Role, TeamLogo, GameIcon, SubTabs } from '../ui/kit';
import { C, F, alpha, ovrColor } from '../ui/theme';
import PlayerPanel, { PlayerScreen, swap } from './PlayerPanel';
import Staff from './Staff';

const money = n => (n < 0 ? '−$' : '$') + fmt(Math.abs(n));
export function DiscChips({ all }) { return <Chips ac={UI.d && FAKE[UI.d].color} value={UI.d} onChange={d => { UI.d = d; UI.sel = null; UI.tier = null; bump(); }} items={DISC_ORDER.filter(d => all || S.divs[d]).map(d => [d, `${pack(d).game}${S.divs[d] ? '' : ' 🔒'}`, !S.divs[d], d])} />; }
export function PRow({ p, d, right, onPress }) {
  const sel = UI.sel === p.id;
  return (
    <Pressable onPress={onPress || (() => { UI.sel = p.id; bump(); })} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, paddingHorizontal: 6, borderRadius: 9, backgroundColor: sel ? alpha(FAKE[d].color, 0.16) : 'transparent', borderBottomWidth: 1, borderBottomColor: C.line }}>
      <Role t={FAKE[d].roles[p.role]} />
      <Flag cc={pcc(p)} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Row gap={5}><T h s={13} n={1} style={{ flexShrink: 1 }}>{pnick(p)}</T><T s={11}>{TRAITS[traitOf(p)].i}</T>{p.standin ? <Tag t="стенд-ин" c={C.bad} /> : null}{p.loanIn ? <Tag t="аренда" c={C.blue} /> : null}{p.transferReq ? <Tag t="!" c={C.bad} /> : null}</Row>
        <T mu s={10} n={1}>{p.age} л. · форма {p.form > 0 ? '+' : ''}{p.form} · мораль {p.mor}</T>
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
function TeamSide({ d, only }) {
  const t = userTeam(d); const dv = S.divs[d]; const ac = FAKE[d].color;
  const co = staffOf('coach', d)[0], an = staffOf('analyst', d)[0];
  const styles = FAKE[d].kind === 'moba' ? [['agr', 'Давление'], ['bal', 'Баланс'], ['farm', 'Фарм']] : FAKE[d].kind === 'ball' ? [['agr', 'Прессинг'], ['bal', 'Ротации'], ['pas', 'Оборона']] : FAKE[d].kind === 'duel' ? [['agr', 'Атака'], ['bal', 'Баланс'], ['pas', 'Контратаки']] : [['agr', 'Агрессия'], ['bal', 'Стандарт'], ['pas', 'Осторожно']];
  return (
    <View>
      {only === 'tactics' ? <Panel>
        <H>Тактика и тренировки</H>
        <T mu s={11} style={{ marginBottom: 4 }}>Стиль игры</T>
        <Seg ac={ac} value={dv.style} onChange={v => { dv.style = v; save(); bump(); }} items={styles} />
        <T mu s={11} style={{ marginVertical: 4 }}>Фокус недели</T>
        <Seg ac={ac} value={dv.train} onChange={v => { dv.train = v; save(); bump(); }} items={[['bal', 'Баланс'], ['mech', 'Механика'], ['tac', 'Тактика'], ['rest', 'Отдых']]} />
        <T mu s={10.5} style={{ marginTop: 4 }}>{{ bal: 'Ровный рост всех навыков.', mech: 'Механика и клатч растут быстрее.', tac: 'IQ и командная игра + химия.', rest: 'Слабый рост, но мораль быстро восстанавливается.' }[dv.train]}</T>
      </Panel> : null}
      {only === 'pool' && FAKE[d].kind === 'fps' ? (
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
      {only === 'pool' && FAKE[d].kind === 'moba' ? (
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
const SHORT_ATTR = { mech: 'МЕХ', iq: 'IQ', tw: 'КОМ', cl: 'КЛЧ', con: 'СТБ' };
function subModal(t, d, p, starter, any) {
  // Замены по позиции: starter=true — кто выйдет вместо p; иначе — p в основу вместо игрока той же роли
  const st = starters(t); const bench = t.roster.map(i => S.players[i]).filter(x => x && !st.includes(x) && !x.loanOut);
  const pool = starter ? bench : st;
  const same = pool.filter(x => x.role === p.role).sort((a, b) => ovr(b) - ovr(a));
  if (!starter && same.length === 1 && !any) { swap(t, p, same[0]); save(); toast('🔁 ' + pnick(p) + ' вместо ' + pnick(same[0]) + ' (' + FAKE[d].roles[p.role] + ')'); bump(); return; }
  const list = any ? pool.filter(x => x.role !== p.role).sort((a, b) => ovr(b) - ovr(a)) : same;
  openModal(() => (
    <View>
      <T h s={17}>{starter ? 'Замена · ' + FAKE[d].roles[p.role] : pnick(p) + ' в основу'}</T>
      <T mu s={11} style={{ marginBottom: 8 }}>{any ? 'Игроки других позиций: на чужой роли они играют слабее.' : starter ? 'Запасные на позиции «' + FAKE[d].roles[p.role] + '». Замена немного снижает химию.' : 'Кого заменить на позиции «' + FAKE[d].roles[p.role] + '».'}</T>
      {list.length ? list.map(x => { const dlt = ovr(starter ? x : p) - ovr(starter ? p : x); return (
        <Pressable key={x.id} onPress={() => { if (starter) swap(t, x, p); else swap(t, p, x); save(); closeModal(); toast('🔁 ' + pnick(starter ? x : p) + ' в основе'); bump(); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: C.line, marginBottom: 6 }}>
          <Role t={FAKE[d].roles[x.role]} /><Flag cc={pcc(x)} />
          <View style={{ flex: 1 }}><T h s={14}>{pnick(x)}</T><T mu s={11}>{x.age} л. · мораль {x.mor} · форма {x.form > 0 ? '+' : ''}{x.form}</T></View>
          <T num s={12} style={{ color: dlt > 0 ? C.good : dlt < 0 ? C.bad : C.mu }}>{dlt > 0 ? '+' : ''}{dlt}</T>
          <Ovr o={ovr(x)} s={20} />
        </Pressable>); }) : <T mu s={12} style={{ marginBottom: 8 }}>{starter ? 'В запасе нет игрока на позицию «' + FAKE[d].roles[p.role] + '». Купи его на Рынке.' : 'Нет игрока для замены.'}</T>}
      {!any && pool.some(x => x.role !== p.role) ? <Btn small style={{ marginBottom: 6 }} title="Показать игроков других позиций" onPress={() => { closeModal(); setTimeout(() => subModal(t, d, p, starter, true), 250); }} /> : null}
      <Btn title="Отмена" onPress={closeModal} />
    </View>
  ));
}
function PCard({ p, d, t, canSub }) {
  const ac = FAKE[d].color; const o = ovr(p); const rt = p.st.mp ? (p.st.rt / p.st.mp).toFixed(2) : '—';
  return (
    <View style={{ flex: 1, minWidth: 0 }}>
      <Pressable onPress={() => { UI.sel = p.id; bump(); }}>
        <LinearGradient colors={[alpha(ac, 0.22), 'rgba(14,20,34,0.92)']} style={{ borderRadius: 12, borderWidth: 1, borderColor: alpha(ac, 0.45), padding: 9 }}>
          <Row gap={6}><Role t={FAKE[d].roles[p.role]} /><View style={{ flex: 1 }} /><Ovr o={o} s={22} /></Row>
          <Row gap={5} style={{ marginTop: 4 }}><Flag cc={pcc(p)} /><T h s={14.5} n={1} style={{ flexShrink: 1 }}>{pnick(p)}</T></Row>
          <T s={10} n={1} style={{ color: C.gold }}>{TRAITS[traitOf(p)].i} {TRAITS[traitOf(p)].n}</T>
          <T mu s={10} n={1}>{p.age} л. · рейт. {rt} · {p.st.mp} игр</T>
          <View style={{ marginTop: 6, gap: 2 }}>
            {ATTRS.map(([k]) => <Row key={k} gap={5}><T mu s={8.5} style={{ width: 24, fontFamily: F.h }}>{SHORT_ATTR[k]}</T><Bar v={p[k]} ac={ovrColor(p[k])} h={4} style={{ flex: 1 }} /><T num s={9.5} style={{ width: 18, textAlign: 'right' }}>{p[k]}</T></Row>)}
          </View>
          <Row style={{ marginTop: 6 }}><T mu s={9.5} style={{ flex: 1 }}>Мораль {p.mor}</T><T s={9.5} style={{ color: p.form > 0 ? C.good : p.form < 0 ? C.bad : C.mu }}>форма {p.form > 0 ? '+' : ''}{p.form}</T></Row>
          <Bar v={p.mor} ac={p.mor >= 60 ? C.good : p.mor >= 35 ? C.gold : C.bad} h={3} />
          {p.wantRaise || p.transferReq ? <T s={9.5} n={1} style={{ color: C.bad, marginTop: 3 }}>{p.transferReq ? '⚠ хочет уйти' : '⚠ просит повышения'}</T> : null}
        </LinearGradient>
      </Pressable>
      {canSub ? <Pressable onPress={() => subModal(t, d, p, true)} style={{ marginTop: 5, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: C.line }}><T s={11} style={{ fontFamily: F.h }}>⇄ Замена</T></Pressable> : null}
    </View>
  );
}
function BenchRow({ p, d, t, canIn }) {
  return (
    <Row gap={6}>
      <View style={{ flex: 1 }}><PRow p={p} d={d} /></View>
      {canIn ? <Pressable onPress={() => subModal(t, d, p, false)} style={{ paddingHorizontal: 10, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: alpha(FAKE[d].color, 0.18), borderWidth: 1, borderColor: alpha(FAKE[d].color, 0.5) }}><T s={11} style={{ fontFamily: F.h }}>В основу</T></Pressable> : null}
    </Row>
  );
}
export default function Roster() {
  const { width: WW } = useWindowDimensions(); const narrow = WW < 1100;
  const d = UI.d; if (!d) return null;
  if (!S.divs[d]) return <View style={{ flex: 1, padding: 10 }}><DiscChips all /><View style={{ width: 420, alignSelf: 'center' }}><UnlockCard d={d} /></View></View>;
  const t = userTeam(d); const dv = S.divs[d]; const st = starters(t); const bench = t.roster.map(i => S.players[i]).filter(p => p && !st.includes(p));
  const youth = (dv.youth || []).map(i => S.players[i]).filter(Boolean); const out = (dv.out || []).map(i => S.players[i]).filter(Boolean);
  const pos = standings(d, t.tier).findIndex(x => x.id === t.id) + 1; const mor = Math.round(st.reduce((a, p) => a + p.mor, 0) / st.length);
  const sel = UI.sel && S.players[UI.sel] && S.players[UI.sel].d === d ? S.players[UI.sel] : null;
  if (sel) return <PlayerScreen p={sel} back="К составу" />;
  const sec = UI.rsec || 'players'; const ac = FAKE[d].color;
  const kind = FAKE[d].kind;
  const tabs = [['players', 'Игроки', '👥'], ['tactics', 'Тактика', '🎯'], ['chem', 'Связки', '🤝'], ...(kind === 'fps' ? [['pool', 'Маппул', '🗺️']] : kind === 'moba' ? [['pool', 'Герои', '🦸']] : []), ['staff', 'Штаб', '🧠']];
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <SubTabs ac={ac} value={sec} onChange={v => { UI.rsec = v; bump(); }} items={tabs} right={<DiscPick />} />
      {sec === 'players' ? (
        <ScrollView style={{ flex: 1 }}>
          <Row gap={10} style={{ marginBottom: 8 }}>
            <TeamLogo t={t} size={38} />
            <View style={{ flex: 1 }}><T h s={15} n={1}>{tname(t)} · {pack(d).game}</T><T mu s={11}>{pack(d).leagues[t.tier]} · {pos}-е место · OVR {teamOvr(t)}</T></View>
            <View style={{ width: 120 }}><Row><T mu s={10} style={{ flex: 1 }}>Химия</T><T num s={10.5}>{Math.round(t.chem)}</T></Row><Bar v={t.chem} ac={ac} h={5} /></View>
            <View style={{ width: 120 }}><Row><T mu s={10} style={{ flex: 1 }}>Мораль</T><T num s={10.5}>{mor}</T></Row><Bar v={mor} ac={C.good} h={5} /></View>
          </Row>
          <T mu s={10} style={{ fontFamily: F.h, letterSpacing: 1.4, marginBottom: 5 }}>ОСНОВА · {FAKE[d].size}</T>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>{st.map(p => <PCard key={p.id} p={p} d={d} t={t} canSub={bench.length > 0} />)}</View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Panel pad={8} style={{ flex: 1 }}><H style={{ marginLeft: 4 }} right={<T mu s={10}>в составе до 7</T>}>{`Запас · ${bench.length}`}</H>{bench.length ? bench.map(p => <BenchRow key={p.id} p={p} d={d} t={t} canIn={!p.loanOut} />) : <T mu s={11} style={{ margin: 4 }}>Пусто — купи игрока на Рынке.</T>}</Panel>
            <Panel pad={8} style={{ flex: 1 }}><H style={{ marginLeft: 4 }} right={<T mu s={10}>до 6</T>}>{`Молодёжка · ${youth.length}`}</H>{youth.length ? youth.map(p => <PRow key={p.id} p={p} d={d} />) : <T mu s={11} style={{ margin: 4 }}>Таланты — на Рынке → Академия.</T>}{out.length ? <><H style={{ marginLeft: 4, marginTop: 6 }}>{`В аренде · ${out.length}`}</H>{out.map(p => <PRow key={p.id} p={p} d={d} />)}</> : null}</Panel>
          </View>
        </ScrollView>
      ) : sec === 'staff' ? <Staff onlyDiv={d} /> : sec === 'chem' ? <Chem t={t} d={d} st={st} bench={bench} /> : (
        <ScrollView style={{ flex: 1 }}><TeamSide d={d} only={sec} /></ScrollView>
      )}
    </View>
  );
}
function Chem({ t, d, st, bench }) {
  const ac = FAKE[d].color; const avg = teamPairs(t); const cell = 54;
  const col = v => v > 2 ? alpha(C.good, Math.min(0.85, 0.2 + v / 25)) : v < -2 ? alpha(C.bad, Math.min(0.85, 0.2 - v / 25)) : 'rgba(255,255,255,0.05)';
  const pairs = []; for (let i = 0; i < st.length; i++) for (let j = i + 1; j < st.length; j++) pairs.push([st[i], st[j], pairVal(st[i], st[j])]); pairs.sort((a, b) => b[2] - a[2]);
  const pl = (a, b, v) => <Row key={a.id + '-' + b.id} gap={6} style={{ paddingVertical: 3 }}><T s={12} n={1} style={{ flex: 1 }}>{TRAITS[traitOf(a)].i} {pnick(a)} + {TRAITS[traitOf(b)].i} {pnick(b)}</T><T num s={12} style={{ color: v > 2 ? C.good : v < -2 ? C.bad : C.mu }}>{v > 0 ? '+' : ''}{Math.round(v)}</T></Row>;
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Panel style={{ flex: 1.2 }}>
          <H right={<T s={11} style={{ color: avg >= 0 ? C.good : C.bad, fontFamily: F.h }}>средняя {avg >= 0 ? '+' : ''}{avg.toFixed(1)} · {avg >= 0 ? '+' : ''}{(avg * 0.12).toFixed(1)} к силе</T>}>Связки основы</H>
          <View style={{ flexDirection: 'row' }}><View style={{ width: 92 }} />{st.map(p => <View key={p.id} style={{ width: cell, alignItems: 'center' }}><T s={14}>{TRAITS[traitOf(p)].i}</T><T s={9.5} n={1} mu>{pnick(p)}</T></View>)}</View>
          {st.map((a, i) => <View key={a.id} style={{ flexDirection: 'row', alignItems: 'center' }}><T s={11} n={1} style={{ width: 92 }}>{TRAITS[traitOf(a)].i} {pnick(a)}</T>{st.map((b, j) => { const v = i === j ? null : pairVal(a, b); return <View key={b.id} style={{ width: cell - 4, height: 26, margin: 2, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: v === null ? 'transparent' : col(v) }}>{v === null ? <T mu s={10}>—</T> : <T num s={11.5}>{v > 0 ? '+' : ''}{Math.round(v)}</T>}</View>; })}</View>)}
          <T mu s={10.5} style={{ marginTop: 6 }}>Каждую неделю в основе пары сыгрываются. Лидер ускоряет, токсик и два вспыльчивых — портят. Земляки ладят чуть лучше.</T>
        </Panel>
        <View style={{ flex: 1, gap: 10 }}>
          <Panel><H>Лучшие и худшие пары</H>{pairs.slice(0, 3).map(x => pl(...x))}{pairs.length > 3 ? <View style={{ height: 1, backgroundColor: C.line, marginVertical: 4 }} /> : null}{pairs.slice(-2).reverse().filter(x => pairs.indexOf(x) >= 3).map(x => pl(...x))}</Panel>
          <Panel><H>Характеры</H>{Object.entries(TRAITS).map(([k, v]) => <Row key={k} gap={6} style={{ paddingVertical: 2, alignItems: 'flex-start' }}><T s={13}>{v.i}</T><T s={11} style={{ flex: 1 }}><Text style={{ fontFamily: F.h }}>{v.n}</Text> — {v.d}</T></Row>)}</Panel>
        </View>
      </View>
    </ScrollView>
  );
}
function DiscPick() {
  const ds = Object.keys(S.divs); if (ds.length < 2) return null;
  return <Row gap={4}>{ds.map(d => <Pressable key={d} onPress={() => { UI.d = d; UI.sel = null; bump(); }} style={{ padding: 3, borderRadius: 9, borderWidth: 1, borderColor: UI.d === d ? FAKE[d].color : 'transparent' }}><GameIcon d={d} size={26} /></Pressable>)}</Row>;
}
