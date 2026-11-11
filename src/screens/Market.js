import React from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { S, userTeam, ovr, pnick, FAKE, potView, feeFor, signDemand, fmt, T as TT, ttag, tname, teamOf, isLoanable, loanInCost, respondOffer, refreshAcademy, pack } from '../core/game';
import { UI, bump, toast, save } from '../ui/store';
import { T, H, Panel, Btn, Seg, Chips, Row, Stars, Tag } from '../ui/kit';
import { C } from '../ui/theme';
import { DiscChips, PRow } from './Roster';
import PlayerPanel, { PlayerScreen } from './PlayerPanel';

const money = n => (n < 0 ? '−$' : '$') + fmt(Math.abs(n));
export default function Market() {
  const { width: WW } = useWindowDimensions(); const narrow = WW < 1100;
  const d = UI.d; if (!d || !S.divs[d]) { UI.d = Object.keys(S.divs)[0]; }
  const dd = UI.d; const W = S.world[dd]; const ut = userTeam(dd); const ac = FAKE[dd].color;
  let list = [];
  if (UI.mk === 'fa') list = W.fa.map(i => S.players[i]);
  else if (UI.mk === 'acad') { if (!W.academy || W.academy.length < 2) refreshAcademy(dd); list = W.academy.map(i => S.players[i]); }
  else if (UI.mk === 'teams' || UI.mk === 'loan') W.teams.filter(t => !t.user).forEach(t => t.roster.forEach(i => list.push(S.players[i])));
  if (UI.mk === 'loan') list = list.filter(p => p && isLoanable(p));
  list = list.filter(p => p && (UI.mkRole < 0 || p.role === UI.mkRole)).sort((a, b) => ovr(b) - ovr(a)).slice(0, 50);
  const sel = UI.sel && S.players[UI.sel] && S.players[UI.sel].d === dd ? S.players[UI.sel] : null;
  const offers = S.tOffers.filter(o => S.players[o.pid]);
  if (narrow && sel && UI.mk !== 'offers') return <PlayerScreen p={sel} back="К рынку" />;
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <DiscChips />
      <Row style={{ marginBottom: 8 }}>
        <Seg ac={ac} style={{ flex: 1 }} value={UI.mk} onChange={v => { UI.mk = v; UI.sel = null; bump(); }} items={[['fa', 'Свободные'], ['teams', 'Трансферы'], ['loan', 'Аренда'], ['acad', 'Академия'], ['offers', `Предложения${offers.length ? ' · ' + offers.length : ''}`]]} />
        <T mu s={11}>Состав {ut.roster.length}/7 · молодёжка {(S.divs[dd].youth || []).length}/6</T>
      </Row>
      {UI.mk === 'offers' ? (
        <ScrollView>
          {offers.length ? offers.map(o => {
            const p = S.players[o.pid]; const tm = teamOf(p.d, o.team);
            return (
              <Panel key={o.id} ac={FAKE[p.d].color}>
                <Row>
                  <View style={{ flex: 1 }}>
                    <T h s={15}>{pnick(p)} <T mu s={11}>· {FAKE[p.d].roles[p.role]} · OVR {ovr(p)} · {pack(p.d).game}</T></T>
                    <T mu s={12}>{tname(tm)} предлагают <T h s={14} style={{ color: C.gold }}>{money(o.fee)}</T> · истекает через {o.weeks} нед.{p.transferReq ? ' · игрок хочет уйти' : ''}</T>
                  </View>
                  <Btn small kind="good" title="Продать" onPress={() => { const r = respondOffer(o.id, 'accept'); if (r) toast(r); else toast('💰 Сделка закрыта'); save(); bump(); }} />
                  <Btn small title="Торг +20%" disabled={o.countered} onPress={() => { toast(respondOffer(o.id, 'counter')); save(); bump(); }} />
                  <Btn small kind="bad" title="Отказать" onPress={() => { respondOffer(o.id, 'reject'); save(); bump(); }} />
                </Row>
              </Panel>
            );
          }) : <Panel><T mu>Пока предложений нет. Сильные игроки и высокая репутация привлекают покупателей; трансферный директор поднимает цены.</T></Panel>}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
          <View style={narrow ? { flex: 1 } : { width: 380 }}>
            <Chips ac={ac} value={UI.mkRole} onChange={v => { UI.mkRole = v; bump(); }} items={[[-1, 'Все'], ...FAKE[dd].roles.map((r, i) => [i, r])]} />
            {UI.mk === 'acad' ? <T mu s={10.5} style={{ marginBottom: 6 }}>Таланты 15–17 лет: дёшево, высокий потенциал. Подписываются в молодёжку. Обновление раз в 4 недели.</T> : null}
            {UI.mk === 'loan' ? <T mu s={10.5} style={{ marginBottom: 6 }}>Аренда до конца сезона: платишь взнос и зарплату, игрок возвращается в клуб в межсезонье.</T> : null}
            <Panel pad={6} style={{ flex: 1 }}>
              <ScrollView>
                {list.map(p => {
                  const [lo, hi] = potView(p); const dm = signDemand(p);
                  const price = UI.mk === 'loan' ? loanInCost(p) : feeFor(p);
                  return <PRow key={p.id} p={p} d={dd} right={<View style={{ alignItems: 'flex-end', width: 92 }}><Stars lo={lo} hi={hi} /><T s={10.5}>{price ? money(price) : 'бесплатно'}{p.team ? ' · ' + ttag(TT(p.team)) : ''}</T><T s={10} style={{ color: dm.refuse ? C.bad : C.mu }}>{dm.refuse ? 'отказ' : '$' + fmt(dm.sal) + '/нед'}</T></View>} />;
                })}
                {!list.length ? <T mu style={{ padding: 8 }}>Никого нет</T> : null}
              </ScrollView>
            </Panel>
          </View>
          {narrow ? null : <ScrollView style={{ flex: 1 }}>
            {sel ? <Panel><PlayerPanel p={sel} /></Panel> : <Panel><T mu>Выбери игрока слева, чтобы посмотреть профиль, торговаться о цене и зарплате, взять в аренду или подписать в молодёжку.</T></Panel>}
          </ScrollView>}
        </View>
      )}
    </View>
  );
}
