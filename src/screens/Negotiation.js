// Экран переговоров: этап «Клуб» (сумма трансфера) → этап «Игрок» (контракт с агентом).
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { S, FAKE, T as TT, ovr, pnick, pcc, potView, tname, fmt, pack, starters, userTeam } from '../core/game';
import { persona, agentName, demands, ROLE, CLAUSE, BONUS_W, WINB, newOffer, interest, costs, askFee, clubRespond, playerRespond, finalize, PRIO } from '../core/negotiation';
import { UI, bump, toast, save } from '../ui/store';
import { T, H, Panel, Btn, Seg, Row, Bar, Ovr, Flag, Stars, Tag, Role, TeamLogo } from '../ui/kit';
import { C, F, alpha } from '../ui/theme';

const money = n => (n < 0 ? '−$' : '$') + fmt(Math.abs(n));
const Step = ({ value, onMinus, onPlus, label }) => (
  <Row gap={6}>
    <Pressable onPress={onMinus} style={st.stepB}><Text style={st.stepT}>−</Text></Pressable>
    <View style={{ minWidth: 110, alignItems: 'center' }}><Text style={{ fontFamily: F.hx, fontSize: 17, color: C.tx }}>{value}</Text>{label ? <T mu s={9.5}>{label}</T> : null}</View>
    <Pressable onPress={onPlus} style={st.stepB}><Text style={st.stepT}>+</Text></Pressable>
  </Row>
);
const Line = ({ title, sub, children }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.line }}>
    <View style={{ width: 150 }}><T h s={12.5}>{title}</T>{sub ? <T mu s={10} n={2}>{sub}</T> : null}</View>
    <View style={{ flex: 1 }}>{children}</View>
  </View>
);

export function openNegotiation(p) { UI.neg = { pid: p.id, stage: p.team && !TT(p.team).user ? 'club' : 'player', clubPat: 3, patience: 3, fee: p.team ? askFee(p) : 0, log: [] }; bump(); }

export default function Negotiation() {
  const n = UI.neg; const p = S.players[n.pid]; const d = p.d; const ac = FAKE[d].color;
  const [o, setO] = useState(() => newOffer(p)); const [sellOn, setSellOn] = useState(0); const [, force] = useState(0);
  const set = (k, v) => setO(x => ({ ...x, [k]: v }));
  const dm = demands(p); const w = persona(p); const it = interest(p, o); const fee = n.agreedFee || 0;
  const c = costs(p, o, fee); const [lo, hi] = potView(p); const t = p.team && TT(p.team);
  const close = () => { UI.neg = null; bump(); };
  const say = (who, msg) => { n.log.unshift({ who, msg }); if (n.log.length > 4) n.log.length = 4; force(x => x + 1); };
  const clubStage = n.stage === 'club';
  const ask = p.team ? askFee(p) : 0;
  return (
    <View style={{ flex: 1, padding: 10, flexDirection: 'row', gap: 10 }}>
      {/* левая колонка: игрок, агент, интерес */}
      <View style={{ width: 270 }}>
        <Panel ac={ac}>
          <Row gap={10}>
            <Ovr o={ovr(p)} s={30} style={{ minWidth: 44 }} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Row gap={5}><Flag cc={pcc(p)} /><T h s={16} n={1} style={{ flexShrink: 1 }}>{pnick(p)}</T></Row>
              <T mu s={10.5} n={1}>{FAKE[d].roles[p.role]} · {p.age} лет · {t ? tname(t) : 'свободный агент'}</T>
              <Stars lo={lo} hi={hi} />
            </View>
          </Row>
          <View style={{ height: 1, backgroundColor: C.line, marginVertical: 8 }} />
          <T mu s={10} style={st.cap}>АГЕНТ · {agentName(p).toUpperCase()}</T>
          <T mu s={10} style={[st.cap, { marginTop: 6 }]}>ЧТО ВАЖНО ИГРОКУ</T>
          {Object.keys(w).sort((a, b) => w[b] - w[a]).map(k => (
            <Row key={k} gap={6} style={{ marginTop: 3 }}><T s={11} style={{ width: 104 }}>{PRIO[k]}</T><Bar v={w[k] * 250} ac={ac} h={5} style={{ flex: 1 }} />{!clubStage ? <T s={10} style={{ width: 16, color: it.sc[k] > 0.75 ? C.good : it.sc[k] > 0.45 ? C.gold : C.bad }}>{it.sc[k] > 0.75 ? '✓' : it.sc[k] > 0.45 ? '~' : '✕'}</T> : null}</Row>
          ))}
          {!clubStage ? <>
            <T mu s={10} style={[st.cap, { marginTop: 10 }]}>ИНТЕРЕС К ПРЕДЛОЖЕНИЮ</T>
            <Row gap={8}><Bar v={it.v} ac={it.v >= 70 ? C.good : it.v >= 50 ? C.gold : C.bad} h={9} style={{ flex: 1 }} /><T num s={15} style={{ color: it.v >= 70 ? C.good : it.v >= 50 ? C.gold : C.bad }}>{it.v}</T></Row>
            <T mu s={9.5}>70+ — согласится. Терпение агента: {'●'.repeat(Math.max(0, n.patience))}{'○'.repeat(Math.max(0, 3 - n.patience))}</T>
          </> : <T mu s={10.5} style={{ marginTop: 8 }}>Сначала договорись с клубом о сумме трансфера, потом — с игроком о контракте.</T>}
        </Panel>
        <Btn title="‹ Выйти из переговоров" onPress={close} />
      </View>
      {/* правая колонка: предложение */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 10 }}>
        <Row gap={6} style={{ marginBottom: 8 }}>
          {p.team ? <Tag t={'1 · Клуб' + (n.agreedFee ? ' ✓' : '')} c={clubStage ? ac : C.good} /> : null}
          <Tag t={(p.team ? '2' : '1') + ' · Контракт'} c={!clubStage ? ac : C.mu} />
        </Row>
        {clubStage ? (
          <Panel>
            <Row gap={10} style={{ marginBottom: 6 }}><TeamLogo t={t} size={34} /><View style={{ flex: 1 }}><T h s={15}>Переговоры с {tname(t)}</T><T mu s={11}>Оценка клуба: {money(ask)} · терпение {'●'.repeat(n.clubPat)}{'○'.repeat(3 - n.clubPat)}</T></View></Row>
            <Line title="Сумма трансфера" sub={Math.round(n.fee / ask * 100) + '% от оценки'}><Step value={money(n.fee)} onMinus={() => { n.fee = Math.max(Math.round(ask * 0.6 / 100) * 100, n.fee - Math.round(ask * 0.05 / 100) * 100); force(x => x + 1); }} onPlus={() => { n.fee = n.fee + Math.round(ask * 0.05 / 100) * 100; force(x => x + 1); }} /></Line>
            <Line title="Процент с перепродажи" sub="Клуб получит долю, если вы продадите игрока"><Seg ac={ac} value={sellOn} onChange={setSellOn} items={[[0, 'Нет'], [0.1, '10%'], [0.2, '20%']]} /></Line>
            {n.counter ? <Row style={{ marginTop: 8 }} gap={8}><T s={12} style={{ flex: 1, color: C.gold }}>Встречное: {money(n.counter)}</T><Btn small kind="good" title="Принять встречное" onPress={() => { n.agreedFee = n.counter; n.stage = 'player'; n.sellOn = sellOn; say('club', 'Сделка с клубом: ' + money(n.counter)); }} /></Row> : null}
            <Btn style={{ marginTop: 10 }} kind="pri" ac={ac} disabled={S.money < n.fee} title={S.money < n.fee ? 'Не хватает денег' : 'Отправить предложение · ' + money(n.fee)} onPress={() => { const r = clubRespond(p, n, n.fee, sellOn); say('club', r.msg); if (r.ok) { n.agreedFee = n.fee; n.sellOn = sellOn; n.stage = 'player'; } else if (r.end) { toast(r.msg); close(); } else n.counter = r.counter; }} />
          </Panel>
        ) : (
          <Panel>
            <H right={fee ? <T mu s={10.5}>трансфер {money(fee)} согласован</T> : null}>Контракт</H>
            <Line title="Зарплата в неделю" sub={'Ожидает ≈ ' + money(dm.sal) + ' · рынок ' + money(Math.round(dm.sal / 10) * 10)}><Step value={money(o.sal)} onMinus={() => set('sal', Math.max(100, Math.round(o.sal * 0.95 / 10) * 10))} onPlus={() => set('sal', Math.round(o.sal * 1.05 / 10) * 10)} /></Line>
            <Line title="Срок" sub={'Хочет ' + dm.years + ' сез.'}><Seg ac={ac} value={o.years} onChange={v => set('years', v)} items={[[1, '1 сезон'], [2, '2 сезона'], [3, '3 сезона']]} /></Line>
            <Line title="Роль в команде" sub={'Ждёт: ' + ROLE[dm.role].toLowerCase() + '. Нарушенное обещание бьёт по морали.'}><Seg ac={ac} value={o.role} onChange={v => set('role', v)} items={[['start', 'Основа'], ['rot', 'Ротация'], ['bench', 'Запас']]} /></Line>
            <Line title="Бонус за подпись" sub="Разовая выплата сейчас"><Seg ac={ac} value={o.bonusW} onChange={v => set('bonusW', v)} items={BONUS_W.map(([k, l]) => [k, k ? k + '×' : 'Нет'])} /></Line>
            <Line title="Премия за победу" sub="Выплачивается из призовых за каждую победу"><Seg ac={ac} value={o.winB} onChange={v => set('winB', v)} items={WINB.map(([k, l]) => [k, k ? Math.round(k * 100) + '%' : 'Нет'])} /></Line>
            <Line title="Отступные" sub="Сумма, за которую другой клуб может забрать игрока"><Seg ac={ac} value={o.clause} onChange={v => set('clause', v)} items={CLAUSE.map(([k, l]) => [k, l])} /></Line>
            <View style={{ flexDirection: 'row', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
              <View><T mu s={10}>ЗАПЛАТИТЬ СЕЙЧАС</T><T num s={16} style={{ color: S.money >= c.now ? C.tx : C.bad }}>{money(c.now)}</T><T mu s={9.5}>{fee ? 'трансфер ' + money(fee) + ' + ' : ''}агент {money(c.agent)}{c.bonus ? ' + бонус ' + money(c.bonus) : ''}</T></View>
              <View><T mu s={10}>В НЕДЕЛЮ</T><T num s={16}>{money(c.weekly)}</T></View>
              <View><T mu s={10}>БЮДЖЕТ</T><T num s={16}>{money(S.money)}</T></View>
            </View>
            <Btn style={{ marginTop: 10 }} kind="pri" ac={ac} disabled={S.money < c.now} title={S.money < c.now ? 'Не хватает денег' : 'Предложить контракт'} onPress={() => {
              const r = playerRespond(p, n, o); say('agent', r.msg);
              if (r.ok) { const e = finalize(p, o, fee); if (e) { toast('⚠️ ' + e); return; } save(); toast('✍️ ' + pnick(p) + ' подписал контракт!'); UI.neg = null; UI.sel = null; UI.tab = 'roster'; UI.d = d; bump(); }
              else if (r.end) { toast(r.msg); close(); }
            }} />
          </Panel>
        )}
        {n.log.length ? <Panel>{n.log.map((m, i) => <T key={i} s={11.5} style={{ opacity: 1 - i * 0.22, marginBottom: 3, color: m.who === 'club' ? '#cfe3ff' : '#ffe2b8' }}>{m.msg}</T>)}</Panel> : null}
      </ScrollView>
    </View>
  );
}
const st = {
  stepB: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: C.line2 },
  stepT: { color: C.tx, fontSize: 18, fontFamily: F.h },
  cap: { fontFamily: F.h, letterSpacing: 1.2 },
};
