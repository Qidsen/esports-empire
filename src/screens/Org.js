import React from 'react';
import { View, Text, ScrollView, Platform, Pressable } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { S, FACILITIES, facCost, buildFac, STAFF_TYPES, staffOf, hireStaff, sponsorSlots, CREATOR_TYPES, hireCreator, DISC_ORDER, pack, FAKE, userTeam, teamOvr, fmt, news, applyPatchNames, validatePatch, maxDivs } from '../core/game';
import { REAL_PATCH } from '../core/realPatch';
import { PATCH_ICONS } from '../core/patchIcons';
import { pickImageDataUri } from '../ui/pick';
import { UI, bump, toast, save, wipe, openModal, closeModal } from '../ui/store';
import { T, H, Panel, Btn, Seg, Chips, Row, Stat, Bar, Ovr, Flag, Tag, GameIcon, OrgLogo } from '../ui/kit';
import { C, F, alpha } from '../ui/theme';
import { UnlockCard } from './Roster';

const money = n => (n < 0 ? '−$' : '$') + fmt(Math.abs(n));
async function readUri(asset) { if (Platform.OS === 'web') { if (asset.file) return await asset.file.text(); return await (await fetch(asset.uri)).text(); } const { File } = require('expo-file-system'); return await new File(asset.uri).text(); }
function mergePatch(old, P) { if (!old || !old.disciplines) return P; const out = Object.assign({}, P, { disciplines: Object.assign({}, P.disciplines) }); for (const d of Object.keys(old.disciplines)) { const o = old.disciplines[d] || {}; const n = out.disciplines[d]; if (!n) out.disciplines[d] = o; else if ((!n.icon || n.icon === PATCH_ICONS[d]) && o.icon) out.disciplines[d] = Object.assign({}, n, { icon: o.icon }); } return out; }
async function readDataUri(asset) { const mime = asset.mimeType || (/\.png$/i.test(asset.name || '') ? 'image/png' : /\.webp$/i.test(asset.name || '') ? 'image/webp' : /\.svg$/i.test(asset.name || '') ? 'image/svg+xml' : 'image/jpeg'); if (Platform.OS === 'web') { const blob = asset.file || await (await fetch(asset.uri)).blob(); return await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(blob); }); } const { File } = require('expo-file-system'); return 'data:' + mime + ';base64,' + await new File(asset.uri).base64(); }
async function pickIcon(d) { try { const uri = await pickImageDataUri(400000, 192); if (!uri) return; if (!S.patchData) S.patchData = { name: 'Свои иконки', disciplines: {} }; S.patchData = Object.assign({}, S.patchData, { disciplines: Object.assign({}, S.patchData.disciplines) }); S.patchData.disciplines[d] = Object.assign({}, S.patchData.disciplines[d], { icon: uri }); save(); toast('✅ Иконка обновлена'); bump(); } catch (e) { toast('⚠️ ' + (typeof e === 'string' ? e : 'Не удалось загрузить картинку')); } }
function clearIcon(d) { if (!S.patchData || !S.patchData.disciplines[d]) return; S.patchData.disciplines[d] = Object.assign({}, S.patchData.disciplines[d]); delete S.patchData.disciplines[d].icon; save(); bump(); }
function installPatch(P) { const e = validatePatch(P); if (e) return toast('⚠️ ' + e); S.patchData = mergePatch(S.patchData, P); S.patchOn = true; applyPatchNames(); news('🧩 Установлен патч: ' + (P.name || 'данные')); save(); toast('✅ Патч установлен'); bump(); }
function StaffRow({ s, hired }) {
  const t = STAFF_TYPES[s.type];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.line }}>
      <Text style={{ fontSize: 20 }}>{t.i}</Text>
      <View style={{ flex: 1 }}>
        <Row gap={5}><T h s={13} n={1}>{s.name}</T><Flag cc={s.cc} /></Row>
        <T mu s={10.5} n={1}>{t.n}{s.d ? ' · ' + pack(s.d).game : ''} · ${fmt(s.sal)}/нед</T>
        <T mu s={10} n={2}>{t.d}</T>
      </View>
      <Ovr o={s.sk * 5} s={17} style={{ minWidth: 24 }} />
      {hired ? <Btn small kind="bad" title="Уволить" onPress={() => { S.money -= s.sal * 2; delete S.staff[s.id]; save(); bump(); toast('Уволен (пособие ' + money(s.sal * 2) + ')'); }} /> :
        <Btn small kind="pri" ac={S.org.c1} disabled={S.money < s.sal * 4} title={money(s.sal * 4)} onPress={() => { const e = hireStaff(s); if (e) toast(e); else { save(); toast('🤝 Нанят!'); } bump(); }} />}
    </View>
  );
}
export default function Org() {
  const sec = UI.org;
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Chips ac={S.org.c1} value={sec} onChange={v => { UI.org = v; bump(); }} items={[['fac', '🏗️ База и офис'], ['staff', '🧑‍💼 Персонал'], ['spons', '🤝 Спонсоры'], ['media', '🎙️ Контент'], ['divs', '🎮 Дивизионы'], ['trophy', '🏆 Трофеи'], ['set', '⚙️ Патч и данные']]} />
      <ScrollView>
        {sec === 'fac' ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{Object.entries(FACILITIES).map(([k, f]) => { const l = S.fac[k] || 0; const c = facCost(k); return (
          <View key={k} style={{ width: '32%', minWidth: 220 }}><Panel ac={k === 'office' ? C.gold : null}>
            <Row><Text style={{ fontSize: 26 }}>{f.i}</Text><View style={{ flex: 1 }}><T h s={14}>{f.n}</T><T mu s={10.5}>Уровень {l}/10</T></View></Row>
            <T mu s={10.5} style={{ marginVertical: 6, minHeight: 28 }}>{f.d}</T>
            <Bar v={l * 10} ac={S.org.c1} style={{ marginBottom: 8 }} />
            <Btn kind={S.money >= c ? 'pri' : undefined} ac={S.org.c1} disabled={l >= 10 || S.money < c} title={l >= 10 ? 'MAX' : 'Улучшить · ' + money(c)} onPress={() => { const e = buildFac(k); if (e) toast(e); else save(); bump(); }} />
          </Panel></View>); })}</View> : null}
        {sec === 'staff' ? <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><Panel><H>Нанятые · ${fmt(Object.values(S.staff).reduce((a, s) => a + s.sal, 0))}/нед</H>{Object.values(S.staff).length ? Object.values(S.staff).map(s => <StaffRow key={s.id} s={s} hired />) : <T mu>Никого</T>}</Panel></View>
          <View style={{ flex: 1 }}><Panel><H right={<T mu s={10}>обновление раз в 3 недели</T>}>Рынок персонала</H>{S.staffMarket.map(s => <StaffRow key={s.id} s={s} />)}<T mu s={10.5} style={{ marginTop: 6 }}>Подписной бонус = 4 зарплаты. Новый специалист заменяет прежнего на этой должности.</T></Panel></View>
        </View> : null}
        {sec === 'spons' ? <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><Panel><H>Активные · {S.sponsors.length}/{sponsorSlots()}</H>{S.sponsors.length ? S.sponsors.map(s => <View key={s.id} style={{ paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.line }}><T h s={13}>{s.name}</T><T mu s={11}>+${fmt(s.weekly)}/нед · +${fmt(s.win)} за победу · ещё {s.weeks} нед.</T></View>) : <T mu>Нет спонсоров</T>}<T mu s={10.5} style={{ marginTop: 6 }}>Слоты: +1 за каждые 20 репутации и за каждые 3 уровня офиса.</T></Panel></View>
          <View style={{ flex: 1 }}><Panel><H>Предложения</H>{S.offers.map(o => <Row key={o.id} style={{ paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.line }}><View style={{ flex: 1 }}><T h s={13}>{o.name}</T><T mu s={11}>+${fmt(o.weekly)}/нед · +${fmt(o.win)}/победа · {o.weeks} нед. · бонус {money(o.sign)}</T></View><Btn small kind="pri" ac={S.org.c1} disabled={S.sponsors.length >= sponsorSlots()} title="Подписать" onPress={() => { S.sponsors.push(o); S.money += o.sign; S.offers = S.offers.filter(x => x !== o); news('🤝 Новый спонсор: ' + o.name); save(); toast('Контракт подписан! +' + money(o.sign)); bump(); }} /></Row>)}<T mu s={10.5} style={{ marginTop: 6 }}>Новые предложения каждые 2 недели. Бизнес-менеджер делает их щедрее.</T></Panel></View>
        </View> : null}
        {sec === 'media' ? <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><Panel><H>Контент-мейкеры · {S.creators.length}/3</H>{S.creators.length ? S.creators.map((c, i) => <View key={i} style={{ paddingVertical: 6 }}><T h s={13}>{c.n}</T><T mu s={11}>+${c.inc}/с · +{c.fans} фанатов/нед · ещё {c.weeks} нед.</T></View>) : <T mu>Стримеры приносят пассивный доход и фанатов.</T>}</Panel></View>
          <View style={{ flex: 1 }}><Panel><H>Нанять</H>{CREATOR_TYPES.map((c, i) => <Row key={i} style={{ paddingVertical: 6 }}><View style={{ flex: 1 }}><T h s={13}>{c.n}</T><T mu s={11}>+${c.inc}/с · +{c.fans} фанатов/нед · {c.weeks} нед.</T></View><Btn small kind="pri" ac={S.org.c1} disabled={S.money < c.cost || S.creators.length >= 3} title={money(c.cost)} onPress={() => { const e = hireCreator(i); if (e) toast(e); else save(); bump(); }} /></Row>)}</Panel></View>
        </View> : null}
        {sec === 'divs' ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{DISC_ORDER.map(d => <View key={d} style={{ width: '32%', minWidth: 220 }}>{S.divs[d] ? <Panel ac={FAKE[d].color} onPress={() => { UI.d = d; UI.tab = 'roster'; bump(); }}><GameIcon d={d} size={40} /><T h s={16}>{pack(d).game}</T><T mu s={11}>{pack(d).leagues[userTeam(d).tier]} · OVR {teamOvr(userTeam(d))}</T><Tag t="активен" c={C.good} style={{ alignSelf: 'flex-start', marginTop: 6 }} /></Panel> : <UnlockCard d={d} />}</View>)}<T mu s={11} style={{ width: '100%' }}>Дивизионов по офису: {Object.keys(S.divs).length}/{maxDivs()}. Каждые 2 уровня офиса — ещё один слот.</T></View> : null}
        {sec === 'trophy' ? <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><Panel><H>Трофеи</H>{S.trophies.length ? S.trophies.map((t, i) => <Row key={i} style={{ paddingVertical: 5 }}><Text style={{ fontSize: 20 }}>🏆</Text><View><T h s={13}>{t.n}</T><T mu s={11}>{pack(t.d).game} · сезон {t.s}</T></View></Row>) : <T mu>Витрина пуста. Пора это исправить.</T>}</Panel></View>
          <View style={{ flex: 1 }}><Panel><H>Статистика</H><Row><Stat label="Победы" value={S.stats.wins} color={C.good} /><Stat label="Поражения" value={S.stats.losses} color={C.bad} /><Stat label="Сезон" value={S.season} /></Row></Panel></View>
        </View> : null}
        {sec === 'set' ? <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><Panel>
            <H>Патч реальных данных</H>
            <T s={12} style={{ marginBottom: 4 }}>{S.patchData ? `Загружен: ${S.patchData.name || 'патч'} ${S.patchData.version || ''}` : 'Патч не установлен — все названия вымышленные.'}</T>
            <T mu s={11} style={{ marginBottom: 8 }}>Реальные игры, карты, герои, лиги, команды и ники игроков. Составы сверены на 11.11.2026. Прогресс сохраняется.</T>
            <Btn kind="pri" ac={S.org.c1} title="Установить реальный патч 2026" onPress={() => installPatch(REAL_PATCH)} />
            <Btn style={{ marginTop: 6 }} title="📂 Загрузить свой патч (.json)" onPress={async () => { try { const r = await DocumentPicker.getDocumentAsync({ type: ['application/json', 'text/plain', '*/*'], copyToCacheDirectory: true }); if (r.canceled || !r.assets?.length) return; let t = await readUri(r.assets[0]); t = t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1); installPatch(JSON.parse(t)); } catch (e) { toast('⚠️ Не удалось прочитать файл'); } }} />
            <T mu s={11} style={{ marginTop: 10, marginBottom: 6 }}>Логотипы игр (при реальных данных). Нажми — выбрать картинку из фото, долгое нажатие — вернуть стандартный.</T>
            <Row gap={10}>{DISC_ORDER.map(d => <Pressable key={d} onPress={() => pickIcon(d)} onLongPress={() => clearIcon(d)} style={{ alignItems: 'center', gap: 3 }}><GameIcon d={d} size={38} uri={(S.patchData && S.patchData.disciplines[d] && S.patchData.disciplines[d].icon) || PATCH_ICONS[d]} /><T mu s={9}>{({ cs: 'CS2', dota: 'Dota 2', dl: 'Deadlock', rl: 'RL', fc: 'FC 27' })[d]}</T></Pressable>)}</Row>
            {S.patchData ? <Seg ac={S.org.c1} style={{ marginTop: 8 }} value={!!S.patchOn} onChange={v => { S.patchOn = v; if (v) applyPatchNames(); save(); bump(); }} items={[[false, 'Вымышленные'], [true, 'Реальные']]} /> : null}
          </Panel></View>
          <View style={{ flex: 1 }}><Panel>
            <H>Логотип клуба</H>
            <Row gap={12}><OrgLogo size={56} /><View style={{ flex: 1, gap: 6 }}>
              <Btn small title="📷 Выбрать из фото" onPress={async () => { try { const u = await pickImageDataUri(300000); if (u) { S.org.logo = u; save(); toast('✅ Логотип обновлён'); bump(); } } catch (e) { toast('⚠️ ' + e); } }} />
              {S.org.logo ? <Btn small kind="bad" title="Вернуть стандартный" onPress={() => { S.org.logo = null; save(); bump(); }} /> : null}
            </View></Row>
            <T mu s={10.5} style={{ marginTop: 6 }}>Лучше квадратная картинка на прозрачном фоне. Показывается в меню, таблицах и на трансляции.</T>
          </Panel><Panel>
            <H>Сохранение</H>
            <T mu s={11} style={{ marginBottom: 8 }}>Игра сохраняется автоматически на этом телефоне.</T>
            <Btn kind="bad" title="Начать заново" onPress={() => openModal(() => <View><T h s={18}>Удалить карьеру?</T><T mu style={{ marginVertical: 8 }}>Весь прогресс будет потерян.</T><Row><Btn style={{ flex: 1 }} title="Отмена" onPress={closeModal} /><Btn style={{ flex: 1 }} kind="bad" title="Удалить" onPress={async () => { closeModal(); await wipe(); UI.tab = 'home'; bump(); }} /></Row></View>)} />
          </Panel></View>
        </View> : null}
      </ScrollView>
    </View>
  );
}
