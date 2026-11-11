import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { S, ovr, potView, pnick, pcc, FAKE, T as TT, tname, ttag, pack, heroName, heroMeta, ATTRS, upCost, doUp, isUserPlayer, starters, signDemand, feeFor, fmt, extendDemand, talk, releasePlayer, moodFactors, loanOut, loanOutTarget, promoteYouth, releaseYouth, isLoanable, loanIn, loanInCost, buyWithBid, acceptCounter, signYouth, salaryFor, agentDisc, buyChance, answerRaise } from '../core/game';
import { UI, bump, toast, save, openModal, closeModal } from '../ui/store';
import { T, H, Panel, Btn, Seg, Row, Stat, Bar, Ovr, Flag, Tag, Role, Stars, Sep } from '../ui/kit';
import { C, F, ovrColor } from '../ui/theme';
import { openNegotiation } from './Negotiation';

const money = n => (n < 0 ? '−$' : '$') + fmt(Math.abs(n));
function confirm(text, yes, fn) { openModal(() => <View><T h s={18}>Подтверждение</T><T style={{ marginVertical: 10 }}>{text}</T><Row><Btn style={{ flex: 1 }} title="Отмена" onPress={closeModal} /><Btn style={{ flex: 1 }} kind="pri" ac={S.org.c1} title={yes} onPress={() => { closeModal(); fn(); }} /></Row></View>); }
function statLbl(d) { const k = FAKE[d].kind; if (k === 'ball') return ['Голы', 'Сейвы', 'Пасы']; if (k === 'duel') return ['Голы', 'Пропущ.', '']; return ['Убийства', 'Смерти', 'Ассисты']; }

// Полноэкранная карточка игрока для телефона: список → профиль → назад.
export function PlayerScreen({ p, back = 'Назад' }) {
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 16 }}><PlayerPanel p={p} back={back} /></ScrollView>
    </View>
  );
}
const Mini = ({ l, v, c, sub }) => <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: C.line, minWidth: 64 }}><T mu s={9} style={{ fontFamily: F.h, letterSpacing: 1 }}>{l}</T>{typeof v === 'string' || typeof v === 'number' ? <T num s={15} style={c ? { color: c } : null}>{v}</T> : v}{sub ? <T mu s={9}>{sub}</T> : null}</View>;
export default function PlayerPanel({ p, compact, back }) {
  const [bid, setBid] = useState(1.0); const [sal, setSal] = useState(1.0); const [yrs, setYrs] = useState(2); const [counter, setCounter] = useState(null);
  if (!p) return null;
  const d = p.d; const ac = FAKE[d].color; const o = ovr(p); const [lo, hi] = potView(p); const mine = isUserPlayer(p) || (p.loanOut && S.divs[d] && p.loanOut.owner === S.divs[d].team);
  const t = p.team && TT(p.team); const lb = statLbl(d);
  const ut = S.divs[d] && TT(S.divs[d].team);
  const done = (e, ok) => { if (e) toast(e); else { toast(ok); save(); } bump(); };
  return (
    <View>
      <Row gap={10} style={{ marginBottom: 10 }}>
        {back ? <Btn small title={'‹ ' + back} onPress={() => { UI.sel = null; bump(); }} /> : null}
        <Ovr o={o} s={34} style={{ minWidth: 50 }} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Row gap={6}><Flag cc={pcc(p)} s={16} /><T h s={19} n={1} style={{ flexShrink: 1 }}>{pnick(p)}</T>{p.youth ? <Tag t="молодёжка" c={C.good} /> : null}{p.loanIn ? <Tag t="аренда" c={C.blue} /> : null}{p.loanOut ? <Tag t="в аренде" c={C.gold} /> : null}{p.transferReq ? <Tag t="хочет уйти" c={C.bad} /> : null}</Row>
          <T mu s={11} n={1}>{FAKE[d].roles[p.role]} · {p.age} лет · {t ? tname(t) : 'свободный агент'}</T>
        </View>
        <Row gap={6}>
          <Mini l="ПОТЕНЦ." v={<Stars lo={lo} hi={hi} />} sub={lo === hi ? String(hi) : lo + '–' + hi} />
          <Mini l="ФОРМА" v={(p.form > 0 ? '+' : '') + p.form} c={p.form >= 0 ? C.good : C.bad} />
          <Mini l="МОРАЛЬ" v={p.mor} c={p.mor >= 60 ? C.good : p.mor >= 35 ? C.gold : C.bad} />
          <Mini l="ЗАРПЛАТА" v={'$' + fmt(p.sal)} />
        </Row>
      </Row>
      <View style={{ flexDirection: compact ? 'column' : 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Panel>
            <H right={mine ? <T s={11} style={{ color: C.blue, fontFamily: F.hm }}>{fmt(S.tp)} очков</T> : null}>Навыки</H>
            {ATTRS.map(([a, n]) => (
              <Row key={a} style={{ paddingVertical: 4 }}>
                <T s={12} style={{ width: 104 }}>{n}</T>
                <Bar v={p[a]} ac={ovrColor(p[a])} style={{ flex: 1 }} h={7} />
                <T num s={13} style={{ width: 26, textAlign: 'right' }}>{p[a]}</T>
                {mine && !p.loanOut ? <Btn small title={'+' + upCost(p, a)} disabled={S.tp < upCost(p, a) || (o >= p.pot && p[a] >= p.pot)} onPress={() => { if (doUp(p, a)) { save(); bump(); } }} /> : null}
              </Row>
            ))}
            {mine ? <T mu s={10.5} style={{ marginTop: 4 }}>Прокачка за очки тренировок. Выше потенциала не растёт.</T> : null}
          </Panel>
          {p.pool && p.pool.length ? <Panel><H>Герои</H><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>{p.pool.slice().sort((a, b) => b[1] - a[1]).map(([h, pr]) => <View key={h} style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.06)' }}><T s={11.5}>{heroName(d, h)}</T><T num s={11} style={{ color: ovrColor(pr) }}>{pr}</T>{heroMeta(d, h) > 0 ? <T s={10} style={{ color: C.good }}>▲</T> : heroMeta(d, h) < 0 ? <T s={10} style={{ color: C.bad }}>▼</T> : null}</View>)}</View></Panel> : null}
        </View>
        <View style={{ flex: 1 }}>
          {!mine && ut ? (
            <Panel ac={ac}>
              <H>{p.team && !TT(p.team).user ? 'Трансфер' : UI.mk === 'acad' ? 'Академия' : 'Свободный агент'}</H>
              {UI.mk !== 'acad' ? <>
                {p.team && !TT(p.team).user ? <T mu s={11.5}>Оценка клуба: {money(feeFor(p))}</T> : null}
                <T mu s={11.5}>Ожидает зарплату около ${fmt(signDemand(p).sal)}/нед{signDemand(p).mult > 1.05 ? ' (наценка за малоизвестный клуб)' : ''}</T>
                <Btn style={{ marginTop: 8 }} kind="pri" ac={ac} disabled={signDemand(p).refuse || S.negot[p.id + ':' + S.season + ':' + S.week] === 'no'} title={signDemand(p).refuse ? 'Не пойдёт в ваш клуб' : S.negot[p.id + ':' + S.season + ':' + S.week] === 'no' ? 'Отказ на этой неделе' : '📝 Начать переговоры'} onPress={() => openNegotiation(p)} />
              </> : <Btn style={{ marginTop: 8 }} kind="pri" ac={ac} title={`В молодёжку · ${money(feeFor(p))}`} onPress={() => done(signYouth(p), '🌱 ' + pnick(p) + ' в молодёжке!')} />}
              {isLoanable(p) ? <Btn style={{ marginTop: 8 }} title={`Аренда до конца сезона · ${money(loanInCost(p))}`} onPress={() => done(loanIn(p), '🔄 Аренда оформлена')} /> : null}
            </Panel>
          ) : null}
          {mine ? <Panel><H>Настроение</H>{moodFactors(p).map(([txt, v], i) => <Row key={i} style={{ paddingVertical: 2 }}><T s={12} style={{ width: 18, color: v > 0 ? C.good : v < 0 ? C.bad : C.mu }}>{v > 0 ? '▲' : v < 0 ? '▼' : '•'}</T><T s={12} style={{ flex: 1 }}>{txt}</T></Row>)}</Panel> : null}
          <Panel>
            <H>Статистика сезона</H>
            <Row><Stat label="Игр" value={p.st.mp} /><Stat label="Рейтинг" value={p.st.mp ? (p.st.rt / p.st.mp).toFixed(2) : '—'} /><Stat label="MVP" value={p.st.mvp} /></Row>
            <T mu s={11} style={{ marginTop: 6 }}>{lb[0]} {p.st.k} · {lb[1]} {p.st.d}{lb[2] ? ' · ' + lb[2] + ' ' + p.st.a : ''} · Карьера: {p.car.mp} игр</T>
          </Panel>
          {mine && !p.loanOut ? <MineActions p={p} done={done} /> : null}
        </View>
      </View>
    </View>
  );
}
function MineActions({ p, done }) {
  const d = p.d; const t = TT(p.team); const st = starters(t); const isSt = st.includes(p); const ac = FAKE[d].color;
  if (p.youth) {
    return (
      <Panel ac={C.good}>
        <H>Молодёжный состав</H>
        <T mu s={11.5} style={{ marginBottom: 8 }}>Растёт быстрее (академия + тренер молодёжки). В 20 лет покинет молодёжку — переведи в основу заранее.</T>
        <Row><Btn style={{ flex: 1 }} kind="pri" ac={ac} title="В основной состав" onPress={() => done(promoteYouth(p), '⬆️ Переведён в основу')} /><Btn style={{ flex: 1 }} title="В аренду" disabled={!loanOutTarget(p)} onPress={() => done(loanOut(p), '✈️ Отправлен в аренду')} /></Row>
        <Btn style={{ marginTop: 6 }} kind="bad" title="Отчислить" onPress={() => confirm('Отчислить ' + pnick(p) + ' из молодёжки?', 'Отчислить', () => { releaseYouth(p); save(); UI.sel = null; bump(); })} />
      </Panel>
    );
  }
  return (
    <>
      {p.wantRaise ? <Panel ac={C.gold}>
        <H>Просит повышения</H>
        <T mu s={11.5} style={{ marginBottom: 8 }}>Сейчас ${fmt(p.sal)}/нед, рынок ${fmt(salaryFor(p))}/нед. Отказ ударит по морали.</T>
        <Row><Btn small style={{ flex: 1 }} kind="good" title={`Поднять до $${fmt(salaryFor(p))}`} onPress={() => { toast(answerRaise(p, 'accept')); save(); bump(); }} /><Btn small style={{ flex: 1 }} kind="bad" title="Отказать" onPress={() => { toast(answerRaise(p, 'reject')); save(); bump(); }} /></Row>
      </Panel> : null}
      <Panel>
        <H>Контракт</H>
        <Row><T style={{ flex: 1 }}>${fmt(p.sal)}/нед · ещё {p.ctr} сез.{p.loanIn ? ' · аренда' : ''}</T>{!p.loanIn ? <Btn small title="Продлить" onPress={() => { const sal = extendDemand(p); confirm(`${pnick(p)} готов продлить на 2 сезона за $${fmt(sal)}/нед (сейчас $${fmt(p.sal)}).`, 'Продлить', () => { p.sal = sal; p.ctr += 2; p.wantRaise = false; p.raiseCD = 12; p.mor = Math.min(100, p.mor + 6); p.wantRaise = false; save(); bump(); toast('📝 Контракт продлён'); }); }} /> : null}</Row>
      </Panel>
      <Panel>
        <H>Разговор</H>
        <Row>{[['praise', 'Похвалить'], ['demand', 'Потребовать'], ['promise', 'Обещать трофей']].map(([k, n]) => <Btn key={k} small style={{ flex: 1 }} title={n} onPress={() => { toast(talk(p, k)); save(); bump(); }} />)}</Row>
      </Panel>
      <Panel>
        <H>Состав</H>
        {isSt ? (t.roster.length > FAKE[d].size ? <Btn small title="⬇ В запас" onPress={() => { const sub = t.roster.map(i => S.players[i]).find(x => !st.includes(x)); if (sub) { swap(t, sub, p); done(null, 'Замена сделана'); } }} /> : <T mu s={11}>Это игрок основы.</T>) :
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{st.map(x => <Btn key={x.id} small title={`↔ ${pnick(x)} (${ovr(x)})`} onPress={() => { swap(t, p, x); done(null, pnick(p) + ' в основе'); }} />)}</View>}
        <Row style={{ marginTop: 8 }}>
          {!p.loanIn ? <Btn small style={{ flex: 1 }} title="В аренду" disabled={!loanOutTarget(p)} onPress={() => done(loanOut(p), '✈️ Отправлен в аренду')} /> : null}
          {!p.loanIn ? <Btn small style={{ flex: 1 }} kind="bad" title={`Расторгнуть (${money(p.sal * 6)})`} onPress={() => confirm(`Расторгнуть контракт с ${pnick(p)}? Компенсация ${money(p.sal * 6)}.`, 'Расторгнуть', () => { releasePlayer(p); UI.sel = null; save(); bump(); })} /> : null}
        </Row>
      </Panel>
    </>
  );
}
export function swap(t, inP, outP) { inP.bench = false; outP.bench = true; const a = t.roster.indexOf(inP.id), b = t.roster.indexOf(outP.id); t.roster[a] = outP.id; t.roster[b] = inP.id; t.chem = Math.max(0, t.chem - 3); }
