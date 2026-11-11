// Персонал: слева все должности, справа — что делает должность, кто на ней и кандидаты.
import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { S, STAFF_TYPES, staffOf, hireStaff, pack, fmt, FAKE } from '../core/game';
import { UI, bump, toast, save, openModal, closeModal } from '../ui/store';
import { T, H, Panel, Btn, Row, Flag, Tag, GameIcon } from '../ui/kit';
import { C, F, alpha } from '../ui/theme';
import { Ico } from '../ui/icons';

const money = n => (n < 0 ? '−$' : '$') + fmt(Math.abs(n));
const lvl = sk => Math.round(sk);
// Конкретный эффект при уровне sk (0–20)
export function staffEffect(type, sk) {
  switch (type) {
    case 'coach': return [`+${Math.round(sk * 3)}% к росту игроков на тренировках`, `+${(sk * 0.4).toFixed(1)} к силе команды в матче`];
    case 'analyst': return [`+${(sk * 0.25).toFixed(1)} к знанию карт/героев в фокусе каждую неделю`, 'Лучше подсказки в вето и драфте'];
    case 'psych': return [`Мораль восстанавливается быстрее (+${Math.round(sk * 2)}%)`, sk >= 10 ? 'Игроки довольны: +настроение' : 'С уровня 10 — бонус к настроению'];
    case 'scout': return [`Ошибка оценки потенциала ±${Math.max(1, Math.round(14 - sk * 0.7))}`, `Таланты в академии: +${(sk * 0.5).toFixed(0)} к потенциалу`];
    case 'media': return [`+${Math.round(sk * 3)} фанатов в неделю`, `+${Math.round(sk * 2)}% к медиа-доходу`];
    case 'biz': return [`Спонсоры предлагают на ${Math.round(sk * 4)}% больше`];
    case 'fitness': return ['Ветераны (29+) медленнее теряют навыки', `Сила эффекта: ${Math.round(sk * 5)}%`];
    case 'youth': return [`+${Math.round(sk * 5)}% к росту молодёжного состава`];
    case 'agent': return [`Покупки и аренды дешевле на ${(sk * 1.5).toFixed(0)}%`, 'Продажи дороже'];
    default: return [];
  }
}
export function positions(onlyDiv) {
  const out = [];
  Object.entries(STAFF_TYPES).forEach(([k, t]) => {
    if (t.div) Object.keys(S.divs).forEach(d => { if (!onlyDiv || onlyDiv === d) out.push({ type: k, d }); });
    else if (!onlyDiv) out.push({ type: k, d: null });
  });
  return out;
}
const posKey = p => p.type + ':' + (p.d || '');
function Stars({ sk }) { const n = Math.max(1, Math.round(sk / 4)); return <Text style={{ color: C.gold, fontSize: 11 }}>{'★'.repeat(n)}<Text style={{ opacity: 0.2 }}>{'★'.repeat(5 - n)}</Text></Text>; }

export default function Staff({ onlyDiv }) {
  const list = positions(onlyDiv);
  const key = UI.staffPos && list.some(p => posKey(p) === UI.staffPos) ? UI.staffPos : posKey(list[0]);
  const pos = list.find(p => posKey(p) === key);
  const t = STAFF_TYPES[pos.type]; const cur = staffOf(pos.type, pos.d)[0];
  const cands = S.staffMarket.filter(s => s.type === pos.type && (!t.div || s.d === pos.d)).sort((a, b) => b.sk - a.sk);
  const payroll = Object.values(S.staff).reduce((a, s) => a + s.sal, 0);
  return (
    <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
      <Panel pad={6} style={{ width: 250 }}>
        {!onlyDiv ? <T mu s={10.5} style={{ marginHorizontal: 6, marginBottom: 4 }}>Зарплаты персонала: {money(payroll)}/нед</T> : null}
        <ScrollView>
          {list.map(p => { const st = STAFF_TYPES[p.type]; const h = staffOf(p.type, p.d)[0]; const on = posKey(p) === key; return (
            <Pressable key={posKey(p)} onPress={() => { UI.staffPos = posKey(p); bump(); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 7, borderRadius: 9, backgroundColor: on ? alpha(S.org.c1, 0.16) : 'transparent' }}>
              <Ico n={st.i} size={20} color={C.gold} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <T h s={12} n={1}>{st.n}{p.d ? '' : ''}</T>
                <T s={10.5} n={1} style={{ color: h ? C.mu : C.bad }}>{h ? h.name : 'Вакансия'}</T>
              </View>
              {p.d ? <GameIcon d={p.d} size={18} plain /> : null}
              {h ? <Stars sk={h.sk} /> : <Tag t="!" c={C.bad} />}
            </Pressable>); })}
        </ScrollView>
      </Panel>
      <ScrollView style={{ flex: 1 }}>
        <Panel ac={S.org.c1}>
          <Row gap={10}>
            <Ico n={t.i} size={34} color={C.gold} />
            <View style={{ flex: 1 }}><T h s={17}>{t.n}{pos.d ? ' · ' + pack(pos.d).game : ''}</T><T mu s={11.5}>{t.d}</T></View>
          </Row>
          <View style={{ marginTop: 8, padding: 8, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <T mu s={10} style={{ fontFamily: F.h, letterSpacing: 1, marginBottom: 3 }}>{cur ? 'ЭФФЕКТ СЕЙЧАС' : 'БЕЗ СПЕЦИАЛИСТА ЭФФЕКТА НЕТ'}</T>
            {staffEffect(pos.type, cur ? cur.sk : 0).map((x, i) => <T key={i} s={12} style={{ color: cur ? C.tx : C.mu }}>• {x}</T>)}
          </View>
          {cur ? (
            <Row style={{ marginTop: 10 }} gap={10}>
              <View style={{ flex: 1 }}><Row gap={6}><T h s={14}>{cur.name}</T><Flag cc={cur.cc} /></Row><T mu s={11}>Уровень {lvl(cur.sk)}/20 · {cur.age} лет · {money(cur.sal)}/нед</T></View>
              <Btn small kind="bad" title={'Уволить · ' + money(cur.sal * 2)} onPress={() => openModal(() => <View><T h s={17}>Уволить {cur.name}?</T><T style={{ marginVertical: 8 }}>Выходное пособие {money(cur.sal * 2)}. Должность останется пустой, пока не наймёшь замену.</T><Row><Btn style={{ flex: 1 }} title="Отмена" onPress={closeModal} /><Btn style={{ flex: 1 }} kind="bad" title="Уволить" onPress={() => { S.money -= cur.sal * 2; delete S.staff[cur.id]; save(); closeModal(); bump(); }} /></Row></View>)} />
            </Row>
          ) : null}
        </Panel>
        <Panel>
          <H right={<T mu s={10}>новые кандидаты раз в 3 недели</T>}>Кандидаты</H>
          {cands.length ? cands.map(s => { const better = !cur || s.sk > cur.sk; return (
            <Row key={s.id} gap={10} style={{ paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.line }}>
              <View style={{ flex: 1 }}>
                <Row gap={6}><T h s={13}>{s.name}</T><Flag cc={s.cc} /><Stars sk={s.sk} /></Row>
                <T mu s={10.5}>Уровень {lvl(s.sk)}/20{cur ? (s.sk > cur.sk ? ' · сильнее текущего' : ' · слабее текущего') : ''} · {money(s.sal)}/нед</T>
                <T s={10.5} style={{ color: better ? C.good : C.mu }} n={1}>{staffEffect(s.type, s.sk)[0]}</T>
              </View>
              <Btn small kind="pri" ac={S.org.c1} disabled={S.money < s.sal * 4} title={'Нанять · ' + money(s.sal * 4)} onPress={() => { const e = hireStaff(s); if (e) toast(e); else { save(); toast('🤝 ' + s.name + ' в команде'); } bump(); }} />
            </Row>); }) : <T mu s={12}>Сейчас нет свободных кандидатов на эту должность. Загляни через пару недель.</T>}
          <T mu s={10.5} style={{ marginTop: 6 }}>При найме платится подписной бонус (4 недельные зарплаты). Новый специалист заменяет прежнего.</T>
        </Panel>
      </ScrollView>
    </View>
  );
}
