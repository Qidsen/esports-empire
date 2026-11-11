import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { S, teamOf, teamCtx, FAKE, seriesBo, vetoOrder, aiVetoChoice, newDraft, draftOrder, draftApply, aiDraftChoice, draftTaken, autoDraft, heroList, heroMeta, prof, FpsMap, MobaGame, BallGame, DuelGame, fcPair, mergeStats, seriesFinalize, applyResult, tname, ttag, pnick, pcc, mapName, pack, fpsRating, fmt, shuffle, ovr, staffSk, heroName, mobaRating, sigMap, sigHero } from '../core/game';
import { UI, bump, save, toast, openModal, closeModal } from '../ui/store';
import { T, Btn, Seg, Row, TeamLogo, Flag, Tag } from '../ui/kit';
import { C, F, alpha } from '../ui/theme';
import Scene3D from './Scene3D';
import { runQueue, afterMatch } from '../screens/flow';
import { SET } from '../ui/settings';
import { Ico } from '../ui/icons';
import Tip from '../screens/Tips';
import { sfx, buzz, music } from '../ui/audio';

const SPEEDS = [1, 2, 4, 8];
const STEP = { fps: 16000, moba: 1000, ball: 1150, duel: 650 };
function styleOpts(d) { const k = FAKE[d].kind; if (k === 'moba') return [['agr', 'Давление'], ['bal', 'Баланс'], ['farm', 'Фарм']]; if (k === 'ball') return [['agr', 'Прессинг'], ['bal', 'Ротации'], ['pas', 'Оборона']]; if (k === 'duel') return [['agr', 'Атака'], ['bal', 'Баланс'], ['pas', 'Контратаки']]; return [['agr', 'Агрессия'], ['bal', 'Стандарт'], ['pas', 'Осторожно']]; }
function colorDist(a, b) { const p = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; const x = p(a), y = p(b); return Math.abs(x[0] - y[0]) + Math.abs(x[1] - y[1]) + Math.abs(x[2] - y[2]); }

// Хайлайты: эйсы, клатчи, большие тимфайты, голы в овертайме
function csHighlight(rec) {
  const cnt = {}; rec.ev.forEach(e => { if (e.A === rec.A) cnt[e.k] = (cnt[e.k] || 0) + 1; });
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0];
  let aliveW = 5, aliveL = 5, clutchN = 0; rec.ev.forEach(e => { if (e.A === rec.A) aliveL--; else { aliveW--; if (aliveW === 1 && !clutchN) clutchN = aliveL; } });
  if (rec.how === 'clutch' && clutchN >= 2) return { p: +rec.ev[rec.ev.length - 1].k, t: 'КЛАТЧ 1v' + clutchN, ic: 'frozen', side: rec.A ? 'A' : 'B', big: clutchN >= 3 };
  if (top && top[1] >= 5) return { p: +top[0], t: 'ЭЙС', ic: 'flame', side: rec.A ? 'A' : 'B', big: true };
  if (top && top[1] >= 4) return { p: +top[0], t: '4 УБИЙСТВА', ic: 'explosion', side: rec.A ? 'A' : 'B' };
  return null;
}
function mapMvp(L, g) {
  const ps = L.kind === 'duel' ? [g.pA, g.pB] : [...L.cA.players, ...L.cB.players]; const R = Math.max(1, g.round || 1);
  const sc = p => { const s = g.stats[p.id] || {}; const won = (L.cA.players.includes(p) || p === g.pA) === (g.winner === 'A'); if (L.kind === 'fps') return fpsRating(s, R) + (won ? 0.15 : 0); if (L.kind === 'moba') return mobaRating(s, won); return (s.k || 0) * 2 + (s.a || 0) + (won ? 1.5 : 0); };
  const best = ps.slice().sort((a, b) => sc(b) - sc(a))[0]; if (!best) return null; const s = g.stats[best.id] || {};
  const line = L.kind === 'fps' ? `${s.k}/${s.d} · рейтинг ${fpsRating(s, R).toFixed(2)}` : L.kind === 'moba' ? `${s.k}/${s.d}/${s.a}${s.h != null ? ' · ' + heroName(L.d, s.h) : ''}` : `${s.k || 0} гол.${s.a ? ' · ' + s.a + ' пас.' : ''}`;
  return { id: best.id, line };
}
export default function Live() {
  const [, setV] = useState(0); const rr = () => setV(v => v + 1);
  const Lr = useRef(null);
  if (!Lr.current) {
    const { d, m } = UI.live; const A = teamOf(d, m.a), B = teamOf(d, m.b); const cA = teamCtx(A, d), cB = teamCtx(B, d); const kind = FAKE[d].kind; const bo = seriesBo(d, m.bo);
    let ca = A.user ? S.org.c1 : A.color, cb = B.user ? S.org.c1 : B.color; if (colorDist(ca, cb) < 120) cb = colorDist(ca, '#e8e8e8') > 200 ? '#e8e8e8' : '#3fa9f5';
    const viz = { kind, d, ca, cb, us: A.user ? 'A' : 'B', pa: cA.players.map(p => ({ id: p.id, role: p.role })), pb: cB.players.map(p => ({ id: p.id, role: p.role })), map: 0, evSeq: 0, events: [] };
    Lr.current = { d, m, A, B, cA, cB, kind, bo, need: Math.ceil(bo / 2), us: A.user ? 'A' : 'B', sa: 0, sb: 0, maps: [], acc: {}, speed: SET.speed || 1, phase: '', feed: [], cur: null, g: 0, sel: null, hrole: -1, viz, ready: false, shown: [0, 0], board: false, tm: null, hls: [], mvps: [] };
  }
  const L = Lr.current;
  // музыка по фазе: вето/драфт — своя тема (в плей-офф и на мейджоре — напряжённее), в игре — только звук арены
  useEffect(() => { const pre = L.phase === 'veto' || L.phase === 'draft' || (L.phase === '' ); const ballish = L.kind === 'ball' || L.kind === 'duel'; music(pre && (L.kind === 'fps' || L.kind === 'moba') ? (L.m.po || L.m.wc ? 'm_draft_po' : 'm_draft') : ballish ? 'crowd_loop' : null); });
  const ins = useSafeAreaInsets(); const padL = Math.max(ins.left, 10), padR = Math.max(ins.right, 10);
  const clear = () => { if (L.tm) { clearTimeout(L.tm); L.tm = null; } };
  const sched = (fn, ms) => { clear(); L.tm = setTimeout(fn, ms / L.speed); };
  const usC = () => L.us === 'A' ? L.cA : L.cB;
  // --- flow ---
  const vetoNext = () => { const V = L.veto; if (V.step >= V.order.length) { V.picks.push(V.avail[0]); V.log.push(['dec', V.avail[0]]); L.ready = true; L.phase = 'between'; L.msg = 'Карты: ' + V.picks.slice(0, L.bo).map(i => mapName(L.d, i)).join(' → '); rr(); sched(startGame, 1800); return; } const st = V.order[V.step]; if (st[1] === L.us) { rr(); return; } rr(); sched(() => { const me = st[1] === 'A' ? L.cA : L.cB, op = st[1] === 'A' ? L.cB : L.cA; vetoApply(aiVetoChoice(st, V.avail, me, op)); }, 900); };
  const vetoApply = mp => { const V = L.veto; const st = V.order[V.step]; V.avail = V.avail.filter(x => x !== mp); if (st[0] === 'p') V.picks.push(mp); V.log.push([st, mp]); V.step++; vetoNext(); };
  const startDraft = () => { L.draft = newDraft(); L.phase = 'draft'; L.sel = null; L.autoD = false; draftNext(); };
  const draftNext = () => { const dr = L.draft; const ord = draftOrder(L.d); if (dr.step >= ord.length) { L.ready = true; L.phase = 'between'; L.msg = 'Драфт завершён — в бой!'; L.autoD = false; rr(); sched(startGame, 1500); return; } if (ord[dr.step][0] === L.us && !L.autoD) { rr(); return; } rr(); sched(() => { draftApply(L.d, dr, L.cA, L.cB, aiDraftChoice(L.d, dr, L.cA, L.cB)); draftNext(); }, 650); };
  const makeGame = () => { const d = L.d; if (L.kind === 'fps') return new FpsMap(d, L.cA, L.cB, L.veto.picks[L.sa + L.sb]); if (L.kind === 'moba') return new MobaGame(d, L.cA, L.cB, L.draft); if (L.kind === 'ball') { L.arena = L.arena || shuffle([0, 1, 2, 3, 4, 5, 6]); return new BallGame(d, L.cA, L.cB, L.arena[(L.sa + L.sb) % 7]); } const [pa, pb] = fcPair(L.cA, L.cB, L.g, L.sa, L.sb, L.need); L.viz.pa = [{ id: pa.id, role: pa.role }]; L.viz.pb = [{ id: pb.id, role: pb.role }]; return new DuelGame(d, pa, pb, L.cA, L.cB); };
  const startGame = () => { L.feed = []; L.cur = makeGame(); L.ready = false; L.phase = 'play'; L.shown = [0, 0]; const v = L.viz; v.game = L.cur; v.round = null; v.events = []; v.vg = { A: 0, B: 0 }; v.busy = false; if (L.kind === 'fps') v.map = L.cur.map; rr(); sched(step, 700); };
  const step = () => {
    if (L.phase !== 'play') return; const g = L.cur; const v = L.viz; const now = Date.now(); let delay = STEP[L.kind];
    // мяч/футбол: ждём, пока сцена доиграет текущий эпизод (гол, удар), чтобы счёт не убегал вперёд картинки
    if ((L.kind === 'duel' || L.kind === 'ball') && v.busy && (!v.busySince || now - v.busySince < 15000)) { if (!v.busySince) v.busySince = now; L.shown = [Math.min(g.sa, (v.vg || {}).A || 0), Math.min(g.sb, (v.vg || {}).B || 0)]; rr(); L.tm = setTimeout(step, 120); return; } v.busySince = 0;
    if (L.kind === 'fps') { const r = g.nextRound(); if (r) { const hl = csHighlight(r); r.hl = hl; if (hl) L.hls.push({ ...hl, g: L.g + 1, at: 'раунд ' + r.n }); L.feed.unshift(r); if (L.feed.length > 6) L.feed.length = 6; v.round = r; v.roundT0 = now; v.roundDur = STEP.fps / L.speed; } }
    else { const ev = g.tick(); v.events = ev; v.evSeq++; v.tickT0 = now; v.tickDur = STEP[L.kind] / L.speed; ev.forEach(e => { L.feed.unshift(e); if (e.type === 'fight' && e.kw >= 4 && e.kl <= 1) L.hls.push({ p: e.killer, t: 'ТИМФАЙТ ' + e.kw + ':' + e.kl, ic: 'swords', side: e.side, g: L.g + 1, at: e.t + ' мин' }); if (e.type === 'boss' && e.stolen) L.hls.push({ p: null, t: 'УКРАДЕН ' + pack(L.d).boss.toUpperCase(), ic: 'dragon', side: e.side, g: L.g + 1, at: e.t + ' мин' }); if (e.type === 'goal' && e.ot) L.hls.push({ p: e.p, t: 'ЗОЛОТОЙ ГОЛ', ic: 'trophy', side: e.side, g: L.g + 1, at: 'овертайм' }); }); if (L.feed.length > 8) L.feed.length = 8; if (ev.some(e => e.type === 'goal')) delay += 300; }
    if (L.kind === 'moba') L.shown = [g.kA, g.kB]; else if (L.kind !== 'fps') L.shown = [Math.min(g.sa, (v.vg || {}).A || 0), Math.min(g.sb, (v.vg || {}).B || 0)];
    rr();
    if (g.done) { const t0 = Date.now(); const fin = () => { if ((L.kind === 'duel' || L.kind === 'ball') && v.busy && Date.now() - t0 < 20000) { L.shown = [Math.min(g.sa, (v.vg || {}).A || 0), Math.min(g.sb, (v.vg || {}).B || 0)]; rr(); L.tm = setTimeout(fin, 150); return; } L.shown = [g.kA !== undefined ? g.kA : g.sa, g.kB !== undefined ? g.kB : g.sb]; mapDone(); }; L.tm = setTimeout(fin, (L.kind === 'fps' ? STEP.fps : 2500) / L.speed); return; }
    sched(() => { if (L.kind === 'fps') L.shown = [g.sa, g.sb]; step(); }, delay + (L.kind === 'fps' ? 250 : 0));
  };
  const recordGame = () => { const g = L.cur; const aW = g.winner === 'A'; if (aW) L.sa++; else L.sb++; const wset = L.kind === 'duel' ? new Set([aW ? g.pA.id : g.pB.id]) : new Set((aW ? L.cA : L.cB).players.map(p => p.id)); mergeStats(L.acc, g.stats, wset); L.maps.push(L.kind === 'fps' ? { map: g.map, sa: g.sa, sb: g.sb } : L.kind === 'moba' ? { t: g.t, kA: g.kA, kB: g.kB, w: g.winner } : L.kind === 'ball' ? { map: g.arena, sa: g.sa, sb: g.sb, ot: g.ot } : { pa: g.pA.id, pb: g.pB.id, sa: g.sa, sb: g.sb, pens: g.pens }); L.g++; L.cur = null; L.ready = false; };
  const over = () => L.sa >= L.need || L.sb >= L.need;
  const mapDone = () => { const g = L.cur; L.mapMvp = mapMvp(L, g); if (L.mapMvp) L.mvps.push(L.mapMvp.id); if (L.kind === 'ball' || L.kind === 'duel') Object.entries(g.stats).forEach(([id, st]) => { if ((st.k || 0) >= 3) L.hls.push({ p: +id, t: 'ХЕТ-ТРИК', ic: 'tophat', side: L.cA.players.some(x => x.id === +id) ? 'A' : 'B', g: L.g + 1, at: '' }); }); recordGame(); if (over()) { endSeries(); return; } L.phase = 'between'; const last = L.maps[L.maps.length - 1]; const aW = (last.w || (last.sa > last.sb ? 'A' : 'B')) === 'A'; L.msg = `${tname(aW ? L.A : L.B)} берёт ${L.kind === 'fps' ? 'карту ' + mapName(L.d, last.map) : 'игру'}${L.kind !== 'moba' ? ` (${last.sa}:${last.sb}${last.pens ? ', пен. ' + last.pens.join(':') : ''})` : ''}`; rr(); sched(() => { if (L.kind === 'moba') startDraft(); else startGame(); }, 2600); };
  const endSeries = () => { clear(); const { d, m, A, B, cA, cB } = L; const res = { win: L.sa > L.sb ? A.id : B.id, sa: L.sa, sb: L.sb, maps: L.maps }; seriesFinalize(L.acc, res, cA, cB); const m0 = S.money; m.res = res; applyResult(d, m); L.prize = S.money - m0; L.phase = 'end'; save(); const won = res.win === (L.us === 'A' ? A.id : B.id); sfx(won ? 'win' : 'lose'); buzz(won ? 'success' : 'error'); rr(); };
  const startGameSilent = () => { L.cur = makeGame(); };
  const finishFast = () => {
    clear();
    if (L.phase === 'veto') { const V = L.veto; while (V.step < V.order.length) { const st = V.order[V.step]; const me = st[1] === 'A' ? L.cA : L.cB, op = st[1] === 'A' ? L.cB : L.cA; const mp = aiVetoChoice(st, V.avail, me, op); V.avail = V.avail.filter(x => x !== mp); if (st[0] === 'p') V.picks.push(mp); V.log.push([st, mp]); V.step++; } V.picks.push(V.avail[0]); }
    if (L.phase === 'draft') { while (L.draft.step < draftOrder(L.d).length) draftApply(L.d, L.draft, L.cA, L.cB, aiDraftChoice(L.d, L.draft, L.cA, L.cB)); L.ready = true; }
    if (L.cur && !L.cur.done) { L.cur.run(); recordGame(); } else if (L.cur && L.cur.done) recordGame();
    while (!over()) { if (L.kind === 'moba' && !L.ready) L.draft = autoDraft(L.d, L.cA, L.cB); startGameSilent(); L.ready = false; L.cur.run(); recordGame(); }
    endSeries();
  };
  const skipGame = () => { if (!L.cur || L.phase !== 'play') return; clear(); L.cur.run(); L.shown = [L.cur.kA !== undefined ? L.cur.kA : L.cur.sa, L.cur.kB !== undefined ? L.cur.kB : L.cur.sb]; mapDone(); };
  const close = () => { clear(); const d = L.d, m = L.m; UI.live = null; bump(); setTimeout(() => afterMatch(d, m), 60); };
  useEffect(() => {
    if (L.kind === 'fps') { L.veto = { avail: [0, 1, 2, 3, 4, 5, 6], order: vetoOrder(L.bo), step: 0, picks: [], log: [] }; L.phase = 'veto'; vetoNext(); }
    else if (L.kind === 'moba') startDraft(); else startGame();
    return clear;
  }, []);
  // --- render ---
  const sub = L.phase === 'play' && L.cur ? (L.kind === 'fps' ? `Карта ${L.sa + L.sb + 1}: ${mapName(L.d, L.cur.map)} · раунд ${L.cur.round}` : L.kind === 'moba' ? `Игра ${L.sa + L.sb + 1} · ${L.cur.t}:00 · башни ${L.cur.twA}:${L.cur.twB}` : L.kind === 'ball' ? `Игра ${L.sa + L.sb + 1} · ${L.cur.ot ? 'ОВЕРТАЙМ' : (Math.floor(Math.max(0, 300 - L.cur.t) / 60) + ':' + String(Math.max(0, 300 - L.cur.t) % 60).padStart(2, '0'))}` : `Матч ${L.sa + L.sb + 1} · ${L.cur.t}'${L.cur.et ? ' доп. время' : ''}`) : `BO${L.bo} · ${pack(L.d).game}`;
  const showScene = L.phase === 'play' || L.phase === 'between' || L.phase === 'veto' || L.phase === 'draft';
  return (
    <View style={{ flex: 1, backgroundColor: '#04060a' }}>
      {showScene && L.phase !== 'veto' && L.phase !== 'draft' ? <Scene3D key={'g' + L.g} viz={L.viz} style={L.kind === 'moba' ? { position: 'absolute', left: padL + 232, right: padR + 232, top: 56, bottom: 62, borderRadius: 10, overflow: 'hidden' } : StyleSheet.absoluteFill} /> : <LinearGradient colors={[alpha(FAKE[L.d].color, 0.25), '#04060a']} style={StyleSheet.absoluteFill} />}
      <LinearGradient colors={['rgba(0,0,0,0.65)', 'rgba(0,0,0,0)']} style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 90 }} pointerEvents="none" />
      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 80 }} pointerEvents="none" />
      <LinearGradient colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.45)']} locations={[0, 0.18, 0.82, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} pointerEvents="none" />
      <View style={[StyleSheet.absoluteFill, { left: padL - 10, right: padR - 10 }]} pointerEvents="box-none">{L.kind === 'fps' && L.phase === 'play' ? <CsHud L={L} /> : L.kind === 'moba' && L.phase === 'play' && L.cur ? <MobaHud L={L} /> : <Scoreboard L={L} sub={sub} />}
      {L.phase === 'veto' ? <Veto L={L} onPick={mp => { clear(); vetoApply(mp); }} onSkip={finishFast} /> : null}
      {L.phase === 'draft' ? <Draft L={L} rr={rr} onPick={h => { clear(); draftApply(L.d, L.draft, L.cA, L.cB, h); L.sel = null; draftNext(); }} onAuto={() => { clear(); L.autoD = true; draftApply(L.d, L.draft, L.cA, L.cB, aiDraftChoice(L.d, L.draft, L.cA, L.cB)); L.sel = null; draftNext(); }} onSkip={finishFast} /> : null}
      {L.phase === 'between' ? <View pointerEvents="none" style={st.center}><View style={st.banner}><T h s={20} style={{ textAlign: 'center' }}>{L.msg || 'Подготовка…'}</T><T mu style={{ textAlign: 'center', marginTop: 4 }}>Серия {L.sa}:{L.sb}</T>{L.mapMvp && L.maps.length ? <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: C.line, alignItems: 'center' }}><Row gap={5}><Ico n="star" size={14} color={C.gold} /><Text style={{ fontFamily: F.h, fontSize: 10, letterSpacing: 1.6, color: C.gold }}>MVP КАРТЫ</Text></Row><Row gap={6}><Flag cc={pcc(S.players[L.mapMvp.id])} /><T h s={17}>{pnick(S.players[L.mapMvp.id])}</T></Row><T mu s={11.5}>{L.mapMvp.line}</T></View> : null}</View></View> : null}
      {L.phase === 'play' ? <>
        {L.kind !== 'fps' && L.kind !== 'moba' ? <Feed L={L} /> : null}
        {L.board ? <Board L={L} /> : null}
        {L.kind === 'fps' && L.cur ? <CsCalls L={L} rr={rr} /> : null}
        <View style={st.bottom}>
          <Seg ac={FAKE[L.d].color} style={{ width: 170 }} value={L.speed} onChange={v => { L.speed = v; rr(); }} items={SPEEDS.map(s => [s, s + '×'])} />
          {L.kind === 'moba' ? <MobaCalls L={L} rr={rr} /> : L.kind === 'fps' ? <View style={{ flex: 1 }} /> : <BallCalls L={L} rr={rr} />}
          {L.kind === 'fps' ? <Btn small title={`⏸ Тайм-аут ${L.us === 'A' ? L.cur.toA : L.cur.toB}`} disabled={(L.us === 'A' ? L.cur.toA : L.cur.toB) <= 0} onPress={() => { if (L.cur.timeout(L.us)) { toast('⏸ Тайм-аут: +сила на 3 раунда'); rr(); } }} /> : null}
          {L.kind !== 'moba' ? <Btn small title="Табло" onPress={() => { L.board = !L.board; rr(); }} /> : null}
          <Btn small title="⏭ Игра" onPress={skipGame} />
          <Btn small title="⏩ Серия" onPress={finishFast} />
        </View>
      </> : null}
      {L.phase !== 'end' ? <Pressable onPress={() => openModal(() => (
        <View style={{ gap: 8 }}>
          <T h s={18}>Пауза</T>
          <T mu s={12}>Матч нельзя бросить — можно досчитать результат и выйти.</T>
          <Btn kind="pri" ac={S.org.c1} title="Продолжить смотреть" onPress={closeModal} />
          <Btn title="Досчитать серию и показать итог" onPress={() => { closeModal(); finishFast(); }} />
          <Btn title="Досчитать и выйти в штаб" onPress={() => { closeModal(); finishFast(); close(); }} />
        </View>
      ))} style={st.menuBtn}><Ico n="menu" size={18} color="#fff" /></Pressable> : null}
      {L.phase === 'end' ? <End L={L} onClose={close} /> : null}
      {(() => { UI.livePhase = L.phase; return <Tip />; })()}
      </View>
    </View>
  );
}
// ===== Решения по ходу матча =====
const CALLS = [['smoke', 'smoke', 'Смок-ганк'], ['push', 'push', 'Пуш линии'], ['boss', 'dragon', null]];
function MobaCalls({ L, rr }) {
  const g = L.cur; if (!g || !g.canCall) return <View style={{ flex: 1 }} />; const us = L.us; const ac = FAKE[L.d].color; const pend = g.calls[us];
  return (
    <View style={{ flex: 1, flexDirection: 'row', gap: 5 }}>
      {CALLS.map(([k, ic, n]) => { const ok = g.canCall(us, k); const cd = g.callCD(us, k); const lbl = n || pack(L.d).boss; const on = pend === k; return (
        <Pressable key={k} disabled={!ok} onPress={() => { if (g.doCall(us, k)) { toast(lbl + ': команда выполняет'); rr(); } }} style={{ flex: 1, height: 34, borderRadius: 9, borderWidth: 1, borderColor: on ? ac : ok ? alpha(ac, 0.55) : C.line, backgroundColor: on ? alpha(ac, 0.35) : ok ? alpha(ac, 0.14) : 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4, opacity: ok || on ? 1 : 0.45 }}>
          <Ico n={ic} size={17} color={on ? '#fff' : ok ? ac : C.mu} />
          <Text numberOfLines={1} style={{ fontFamily: F.h, fontSize: 10.5, color: C.tx, textTransform: 'uppercase' }}>{lbl}{on ? ' …' : cd ? ' · ' + cd : ''}</Text>
        </Pressable>); })}
    </View>
  );
}
const BC = { ball: [['allin', 'rocket', 'Все вперёд'], ['park', 'shield', 'Закрыться'], ['rot', 'whistle', 'Тайм-аут']], duel: [['allin', 'run', 'Прессинг'], ['park', 'shield', 'Автобус'], ['rot', 'mic', 'Подбодрить']] };
function BallCalls({ L, rr }) {
  const g = L.cur; if (!g || !g.canCall) return <View style={{ flex: 1 }} />; const us = L.us; const ac = FAKE[L.d].color; const act = g.activeCall(us);
  return (
    <View style={{ flex: 1, flexDirection: 'row', gap: 5 }}>
      {BC[L.kind].map(([k, ic, n]) => { const ok = g.canCall(us, k); const cd = g.callCD(us, k); const on = act === k; return (
        <Pressable key={k} disabled={!ok} onPress={() => { if (g.doCall(us, k)) { sfx('ui_confirm'); buzz('medium'); toast(n + '!'); rr(); } }} style={{ flex: 1, height: 34, borderRadius: 9, borderWidth: 1, borderColor: on ? ac : ok ? alpha(ac, 0.55) : C.line, backgroundColor: on ? alpha(ac, 0.35) : ok ? alpha(ac, 0.14) : 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4, opacity: ok || on ? 1 : 0.45 }}>
          <Ico n={ic} size={16} color={on ? '#fff' : ok ? ac : C.mu} />
          <Text numberOfLines={1} style={{ fontFamily: F.h, fontSize: 10.5, color: C.tx, textTransform: 'uppercase' }}>{n}{on ? ' · активно' : cd > 0 ? ' · ' + cd : cd < 0 ? ' · исп.' : ''}</Text>
        </Pressable>); })}
    </View>
  );
}
const BUYS = [['auto', 'Авто'], ['eco', 'Эко'], ['force', 'Форс'], ['full', 'Фулл']];
const TAC_T = { A: 'Раш A', B: 'Раш B', def: 'Дефолт' }, TAC_CT = { A: 'Стак A', B: 'Стак B', def: 'Стандарт' };
function CsCalls({ L, rr }) {
  const g = L.cur; if (!g || !g.call) return null; const us = L.us, op = us === 'A' ? 'B' : 'A'; const ac = FAKE[L.d].color;
  const ct = (us === 'A') === g.ctA; const TT = ct ? TAC_CT : TAC_T; const cur = L.viz.round; const mon = cur ? (us === 'A' ? cur.mA : cur.mB) : 800; const c = g.call[us];
  const H = g.done ? g.hist : g.hist.slice(0, -1); const last = H[H.length - 1]; const sk = staffSk('analyst', L.d);
  // атаки соперника на этой карте — что видит аналитик
  const oppT = H.filter(r => (r.ctA ? 'B' : 'A') === op && r.site); const nA = oppT.filter(r => r.site === 'A').length;
  let hint = null;
  if (sk && oppT.length >= 2) { const err = Math.max(0, 12 - sk) * 2; const pa = Math.max(0, Math.min(100, Math.round(nA / oppT.length * 100 + (Math.sin(g.round * 7.1 + sk) * err)))); hint = `Аналитик: соперник в атаке — A ${pa}% · B ${100 - pa}%`; }
  else if (!sk) hint = 'Без аналитика не видно, куда чаще ходит соперник';
  let lastT = null; if (last && last.tT) { const usT = (last.ctA ? 'B' : 'A') === us; const mine = usT ? TAC_T[last.tT] : TAC_CT[last.tCT === 'std' ? 'def' : last.tCT]; const theirs = usT ? TAC_CT[last.tCT === 'std' ? 'def' : last.tCT] : TAC_T[last.tT]; const good = usT ? last.tm > 0 : last.tm < 0; const bad = usT ? last.tm < 0 : last.tm > 0; lastT = <Text style={cc.info}>Р{last.n}: мы {mine} · они {theirs} <Text style={{ color: good ? C.good : bad ? C.bad : C.mu }}>{good ? '✓ переиграли' : bad ? '✗ прочитали нас' : '='}</Text></Text>; }
  const seg = (items, val, on) => <View style={cc.seg}>{items.map(([k, n]) => { const a = val === k; return <Pressable key={k} onPress={() => on(k)} style={[cc.si, a ? { backgroundColor: alpha(ac, 0.3), borderColor: ac } : null]}><Text numberOfLines={1} style={[cc.st, a ? { color: '#fff' } : null]}>{n}</Text></Pressable>; })}</View>;
  return (
    <View style={cc.box}>
      <View style={cc.row}><Text style={cc.cap}>ЗАКУП</Text>{seg(BUYS, c.buy, v => { g.setCall(us, 'buy', v); rr(); })}<Text style={[cc.mon, { color: mon >= 3000 ? C.good : mon >= 1200 ? C.gold : C.bad }]}>${mon}</Text></View>
      <View style={cc.row}><Text style={cc.cap}>{ct ? 'ЗАЩИТА' : 'АТАКА'}</Text>{seg([['auto', 'Авто'], ['A', TT.A], ['B', TT.B], ['def', TT.def]], c.tac, v => { g.setCall(us, 'tac', v); rr(); })}</View>
      {lastT || <Text style={cc.info}>Коллы действуют со следующего раунда</Text>}{hint ? <Text style={cc.info}>{hint}</Text> : null}
    </View>
  );
}
const cc = StyleSheet.create({
  box: { position: 'absolute', bottom: 62, alignSelf: 'center', width: 330, backgroundColor: 'rgba(6,9,15,0.82)', borderRadius: 10, borderWidth: 1, borderColor: C.line2, padding: 5, gap: 3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  cap: { width: 48, fontFamily: F.h, fontSize: 8.5, letterSpacing: 1, color: 'rgba(255,255,255,0.6)' },
  seg: { flex: 1, flexDirection: 'row', gap: 3 },
  si: { flex: 1, height: 22, borderRadius: 6, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.03)' },
  st: { fontFamily: F.hm, fontSize: 9.5, color: 'rgba(255,255,255,0.7)' },
  mon: { width: 46, textAlign: 'right', fontFamily: F.hx, fontSize: 11 },
  info: { fontFamily: F.b, fontSize: 9, color: 'rgba(255,255,255,0.7)', paddingLeft: 2 },
});
// ===== HUD MOBA: счёт, нетворс, перевес, таблицы игроков, мини-карта =====
const FARM = { dota: [1.4, 1.2, 1.0, 0.72, 0.6], dl: [1.25, 0.95, 1.15, 1.1, 0.75, 0.9] };
function mobaRows(L) {
  const g = L.cur; const t = g.t; const fw = FARM[L.d] || FARM.dota;
  const mk = (c, side) => c.players.map(p => { const st = g.stats[p.id] || { k: 0, d: 0, a: 0 }; const nw = Math.max(600, Math.round(600 + t * 470 * (fw[p.role] || 1) + st.k * 260 + st.a * 90 - st.d * 70)); const lvl = Math.max(1, Math.min(30, Math.round(1 + t * 0.5 * (0.8 + (fw[p.role] || 1) * 0.2) + (st.k + st.a * 0.5) * 0.35 - st.d * 0.15))); return { p, st, nw, lvl, side, hero: st.h != null ? heroName(L.d, st.h) : '—' }; });
  const A = mk(L.cA, 'A'), B = mk(L.cB, 'B');
  // подгоняем общий перевес под «лид» симуляции
  const sum = r => r.reduce((a, x) => a + x.nw, 0); const diff = sum(A) - sum(B); const adj = (g.lead - diff) / 2;
  A.forEach(x => { x.nw = Math.max(600, Math.round(x.nw + adj * (fw[x.p.role] || 1) / fw.reduce((a, b) => a + b, 0) * fw.length / A.length)); });
  B.forEach(x => { x.nw = Math.max(600, Math.round(x.nw - adj * (fw[x.p.role] || 1) / fw.reduce((a, b) => a + b, 0) * fw.length / B.length)); });
  return { A, B, nwA: sum(A), nwB: sum(B) };
}
const k1 = n => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
function MiniMap({ L, size = 118 }) {
  const mm = L.viz.mm; if (!mm || !mm.lanes) return null; const sc = v => (v + 35) / 70 * size; const ca = L.viz.ca, cb = L.viz.cb; const now = Date.now();
  return (
    <View style={{ width: size, height: size, borderRadius: 8, overflow: 'hidden', backgroundColor: 'rgba(6,9,15,0.85)', borderWidth: 1, borderColor: C.line2 }}>
      {mm.lanes.map((l, i) => l.slice(0, -1).map((p, j) => { const q = l[j + 1]; const x1 = sc(p[0]), y1 = sc(p[1]), x2 = sc(q[0]), y2 = sc(q[1]); const len = Math.hypot(x2 - x1, y2 - y1); const ang = Math.atan2(y2 - y1, x2 - x1); return <View key={i + '-' + j} style={{ position: 'absolute', left: (x1 + x2) / 2 - len / 2, top: (y1 + y2) / 2 - 1.5, width: len, height: 3, backgroundColor: 'rgba(255,255,255,0.12)', transform: [{ rotate: ang + 'rad' }] }} />; }))}
      {mm.bases.map((b, i) => <View key={'b' + i} style={{ position: 'absolute', left: sc(b[0]) - 7, top: sc(b[1]) - 7, width: 14, height: 14, borderRadius: 3, backgroundColor: i ? cb : ca, opacity: 0.85 }} />)}
      {mm.towers.map((tw, i) => <View key={'t' + i} style={{ position: 'absolute', left: sc(tw.x) - 3, top: sc(tw.z) - 3, width: 6, height: 6, backgroundColor: tw.alive ? (tw.side === 'A' ? ca : cb) : 'rgba(255,255,255,0.15)', borderWidth: tw.alive ? 1 : 0, borderColor: '#000' }} />)}
      {mm.fights.filter(f => now - f.t0 < 5000).map((f, i) => <View key={'f' + i} style={{ position: 'absolute', left: sc(f.x) - 8, top: sc(f.z) - 8, width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#ff4d4d', opacity: 1 - (now - f.t0) / 5000 }} />)}
      {mm.heroes.map(h => <View key={'h' + h.id} style={{ position: 'absolute', left: sc(h.x) - 4, top: sc(h.z) - 4, width: 8, height: 8, borderRadius: 4, backgroundColor: h.dead ? 'rgba(120,120,120,0.6)' : (h.side === 'A' ? ca : cb), borderWidth: 1, borderColor: '#fff' }} />)}
    </View>
  );
}
function MobaHud({ L }) {
  useTicker(250);
  const g = L.cur; const ca = L.viz.ca, cb = L.viz.cb; const { A, B, nwA, nwB } = mobaRows(L); const lead = nwA - nwB;
  const nick = id => { const p = S.players[id]; return p ? pnick(p) : '?'; };
  const lastEv = L.feed.slice(0, 3);
  const table = (rows, side) => { const col = side === 'A' ? ca : cb; const right = side === 'B'; return (
    <View style={[mh.table, right ? { right: 10 } : { left: 10 }]} pointerEvents="none">
      <View style={[mh.row, mh.head]}><Text style={[mh.hc, { flex: 1 }]}>{ttag(side === 'A' ? L.A : L.B)}</Text><Text style={[mh.hc, mh.cLvl]}>УР</Text><Text style={[mh.hc, mh.cKda]}>K/D/A</Text><Text style={[mh.hc, mh.cNw]}>NW</Text></View>
      {rows.map(x => { const dead = (L.viz.mm && L.viz.mm.heroes.find(h => h.id === x.p.id) || {}).dead; return (
        <View key={x.p.id} style={[mh.row, dead ? { opacity: 0.45 } : null]}>
          <View style={{ width: 3, alignSelf: 'stretch', backgroundColor: col }} />
          <View style={{ flex: 1, minWidth: 0, paddingLeft: 5 }}><Text numberOfLines={1} style={mh.nick}>{pnick(x.p)}</Text><Text numberOfLines={1} style={mh.hero}>{x.hero}</Text></View>
          <Text style={[mh.v, mh.cLvl, { color: '#ffd27a' }]}>{x.lvl}</Text>
          <Text style={[mh.v, mh.cKda]}>{x.st.k}/{x.st.d}/{x.st.a}</Text>
          <Text style={[mh.v, mh.cNw, { color: '#ffd27a' }]}>{k1(x.nw)}</Text>
        </View>); })}
    </View>); };
  return (
    <>
      <View style={mh.top} pointerEvents="none">
        <LinearGradient colors={[alpha(ca, 0.85), alpha(ca, 0.15)]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[mh.tm]}><TeamLogo t={L.A} size={24} /><Text numberOfLines={1} style={mh.tn}>{tname(L.A)}</Text></LinearGradient>
        <View style={[mh.kills, { backgroundColor: alpha(ca, 0.95) }]}><Text style={mh.kt}>{g.kA}</Text></View>
        <View style={mh.clock}><Text style={mh.ct}>{g.t}:00</Text><Text style={mh.cs}>ИГРА {L.sa + L.sb + 1} · {L.sa}:{L.sb}</Text></View>
        <View style={[mh.kills, { backgroundColor: alpha(cb, 0.95) }]}><Text style={mh.kt}>{g.kB}</Text></View>
        <LinearGradient colors={[alpha(cb, 0.15), alpha(cb, 0.85)]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[mh.tm, { flexDirection: 'row-reverse' }]}><TeamLogo t={L.B} size={24} /><Text numberOfLines={1} style={[mh.tn, { textAlign: 'right' }]}>{tname(L.B)}</Text></LinearGradient>
      </View>
      <View style={mh.nwBar} pointerEvents="none">
        <Text style={[mh.nwT, { color: ca }]}>{k1(nwA)}</Text>
        <View style={{ width: 150, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden', flexDirection: 'row' }}><View style={{ flex: nwA, backgroundColor: ca }} /><View style={{ flex: nwB, backgroundColor: cb }} /></View>
        <Text style={[mh.nwT, { color: cb }]}>{k1(nwB)}</Text>
        <Text style={mh.lead}>{lead === 0 ? 'равенство' : 'перевес ' + ttag(lead > 0 ? L.A : L.B) + ' +' + k1(Math.abs(lead))}</Text>
        <Text style={mh.tw}>башни {g.twA}:{g.twB}</Text>
      </View>
      <View style={mh.mm} pointerEvents="none"><MiniMap L={L} size={104} /></View>
      <View style={mh.feed} pointerEvents="none">{lastEv.map((e, i) => <View key={i} style={{ opacity: 1 - i * 0.25, backgroundColor: 'rgba(6,9,15,0.7)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 2 }}>{evText(L, e)}</View>)}</View>
      {table(A, 'A')}{table(B, 'B')}
    </>
  );
}
const mh = StyleSheet.create({
  top: { position: 'absolute', top: 6, alignSelf: 'center', flexDirection: 'row', height: 36 },
  tm: { width: 170, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8 },
  tn: { flex: 1, fontFamily: F.h, fontSize: 12.5, color: '#fff' },
  kills: { width: 40, alignItems: 'center', justifyContent: 'center' },
  kt: { fontFamily: F.hx, fontSize: 21, color: '#fff' },
  clock: { width: 82, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(6,9,15,0.92)' },
  ct: { fontFamily: F.hx, fontSize: 15, color: '#fff' }, cs: { fontFamily: F.h, fontSize: 7.5, color: 'rgba(255,255,255,0.6)', letterSpacing: 1 },
  nwBar: { position: 'absolute', top: 44, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(6,9,15,0.75)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 4 },
  nwT: { fontFamily: F.hx, fontSize: 11 }, lead: { fontFamily: F.h, fontSize: 10, color: '#ffd27a' }, tw: { fontFamily: F.h, fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  mm: { position: 'absolute', right: 10, bottom: 66 },
  feed: { position: 'absolute', left: 10, bottom: 66, width: 222 },
  table: { position: 'absolute', top: 56, width: 222, backgroundColor: 'rgba(14,20,34,0.92)', borderRadius: 8, paddingVertical: 3, borderWidth: 1, borderColor: C.line },
  row: { flexDirection: 'row', alignItems: 'center', height: 24, paddingRight: 6 },
  head: { height: 15 }, hc: { fontFamily: F.h, fontSize: 8.5, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.8, paddingLeft: 8 },
  nick: { fontFamily: F.hm, fontSize: 10.5, color: '#fff' }, hero: { fontFamily: F.b, fontSize: 8.5, color: 'rgba(255,255,255,0.55)' },
  v: { fontFamily: F.hx, fontSize: 10, color: '#fff', textAlign: 'right' }, cLvl: { width: 22, textAlign: 'right' }, cKda: { width: 54, textAlign: 'right' }, cNw: { width: 40, textAlign: 'right' },
});
// ===== HUD трансляции CS2 =====
const HOW = { elim: 'зачистка', bomb: 'бомба взорвана', defuse: 'бомба обезврежена', clutch: 'клатч' };
function useTicker(ms) { const [, set] = useState(0); useEffect(() => { const i = setInterval(() => set(v => v + 1), ms); return () => clearInterval(i); }, []); }
function CsHud({ L }) {
  useTicker(150);
  const g = L.cur; const v = L.viz; const h = v.hud || {}; const rec = v.round;
  const ca = v.ca, cb = v.cb; const sc = L.shown;
  const u = rec ? Math.min(1, Math.max(0, (Date.now() - v.roundT0) / v.roundDur)) : 0;
  let clock = '1:55', red = false;
  if (h.planted && rec && h.n === rec.n) { const left = Math.max(0, Math.min(40, Math.round(40 * (1 - Math.min(1, (u - 0.66) / 0.29))))); clock = '0:' + String(left).padStart(2, '0'); red = true; }
  else { const sec = Math.max(0, Math.round(80 - u * 70)); clock = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }
  const sideOf = s => rec ? ((s === 'A') === rec.ctA ? 'CT' : 'T') : '';
  const nick = id => { const p = S.players[id]; return p ? pnick(p) : '?'; };
  const kills = (h.kills || []).slice(-5);
  const pend = { k: {}, d: {} }; if (rec && h.n === rec.n) rec.ev.slice((h.kills || []).length).forEach(e => { pend.k[e.k] = (pend.k[e.k] || 0) + 1; pend.d[e.v] = (pend.d[e.v] || 0) + 1; });
  const team = (s) => {
    const t = s === 'A' ? L.A : L.B; const col = s === 'A' ? ca : cb; const right = s === 'B';
    return (
      <LinearGradient colors={right ? [alpha(col, 0.15), alpha(col, 0.85)] : [alpha(col, 0.85), alpha(col, 0.15)]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[hs.team, right ? { flexDirection: 'row-reverse' } : null]}>
        <TeamLogo t={t} size={26} />
        <View style={{ flexShrink: 1, alignItems: right ? 'flex-end' : 'flex-start' }}>
          <Text numberOfLines={1} style={hs.tname}>{tname(t)}</Text>
          <Text style={[hs.side, { color: sideOf(s) === 'CT' ? '#8fc2ff' : '#ffd28a' }]}>{sideOf(s)}</Text>
        </View>
      </LinearGradient>
    );
  };
  const strips = (s) => {
    const ps = (s === 'A' ? L.cA : L.cB).players; const col = s === 'A' ? ca : cb; const right = s === 'B';
    return (
      <View style={[hs.strips, right ? { right: 10, alignItems: 'flex-end' } : { left: 10 }]} pointerEvents="none">
        {ps.map(p => { const dead = h.dead && h.dead[p.id]; const k = ((g && g.stats[p.id] && g.stats[p.id].k) || 0) - (pend.k[p.id] || 0); const d = ((g && g.stats[p.id] && g.stats[p.id].d) || 0) - (pend.d[p.id] || 0); return (
          <View key={p.id} style={[hs.strip, right ? [{ flexDirection: 'row-reverse' }, hs.stripR] : null, dead ? { opacity: 0.38 } : null]}>
            <View style={{ width: 3, alignSelf: 'stretch', backgroundColor: col }} />
            <Text numberOfLines={1} style={[hs.pn, { textAlign: right ? 'right' : 'left' }]}>{dead ? '✕ ' : ''}{pnick(p)}</Text>
            <Text style={hs.kd}>{k}-{d}</Text>
          </View>); })}
      </View>
    );
  };
  return (
    <>
      <View style={hs.top} pointerEvents="none">
        {team('A')}
        <View style={[hs.score, { backgroundColor: alpha(ca, 0.95) }]}><Text style={hs.scoreT}>{sc[0]}</Text></View>
        <View style={hs.clock}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>{h.planted ? <Ico n="bomb" size={14} color="#ff4d4d" /> : null}<Text style={[hs.clockT, red ? { color: '#ff4d4d' } : null]}>{clock}</Text></View>
          <Text style={hs.round}>РАУНД {g ? g.round : ''}</Text>
        </View>
        <View style={[hs.score, { backgroundColor: alpha(cb, 0.95) }]}><Text style={hs.scoreT}>{sc[1]}</Text></View>
        {team('B')}
      </View>
      <View style={hs.subWrap} pointerEvents="none"><Text style={hs.sub}>{mapName(L.d, g.map).toUpperCase()} · КАРТА {L.sa + L.sb + 1} · СЕРИЯ {L.sa}:{L.sb} · BO{L.bo}</Text></View>
      <View style={hs.feed} pointerEvents="none">
        {kills.map((k, i) => { const fresh = Date.now() - k.at < 2500; const kc = k.A ? ca : cb, vc = k.A ? cb : ca; return (
          <View key={i} style={[hs.kill, fresh ? { borderColor: 'rgba(255,255,255,0.35)' } : null]}>
            <Text numberOfLines={1} style={[hs.kn, { color: '#fff' }]}><Text style={{ color: kc }}>■ </Text>{nick(k.k)}</Text>
            <Text style={hs.wpn}>{k.awp ? 'AWP' : 'AK'}{k.hs ? ' ◎' : ''}</Text>
            <Text numberOfLines={1} style={[hs.kn, { color: 'rgba(255,255,255,0.75)' }]}>{nick(k.v)}<Text style={{ color: vc }}> ■</Text></Text>
            {k.place ? <Text numberOfLines={1} style={hs.place}>{k.place}</Text> : null}
          </View>); })}
      </View>
      {h.end && rec ? <View style={hs.banner} pointerEvents="none"><LinearGradient colors={[alpha(rec.A ? ca : cb, 0), alpha(rec.A ? ca : cb, 0.9), alpha(rec.A ? ca : cb, 0)]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={hs.bannerIn}>{rec.hl ? <Row gap={8}><Ico n={rec.hl.ic} size={rec.hl.big ? 26 : 21} color="#fff" /><Text style={[hs.bannerT, { fontSize: rec.hl.big ? 22 : 18, color: '#fff' }]}>{rec.hl.t} · {S.players[rec.hl.p] ? pnick(S.players[rec.hl.p]) : ''}</Text></Row> : null}<Text style={rec.hl ? hs.bannerS : hs.bannerT}>{ttag(rec.A ? L.A : L.B)} ВЫИГРЫВАЮТ РАУНД</Text>{!rec.hl ? <Text style={hs.bannerS}>{HOW[rec.how] || ''}</Text> : null}</LinearGradient></View> : null}
      {strips('A')}{strips('B')}
    </>
  );
}
const hs = StyleSheet.create({
  top: { position: 'absolute', top: 6, alignSelf: 'center', flexDirection: 'row', alignItems: 'stretch', height: 40 },
  team: { width: 190, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 8 },
  tname: { fontFamily: F.h, fontSize: 13, color: '#fff', letterSpacing: 0.3 },
  side: { fontFamily: F.hx, fontSize: 9, letterSpacing: 1.5 },
  score: { width: 44, alignItems: 'center', justifyContent: 'center' },
  scoreT: { fontFamily: F.hx, fontSize: 24, color: '#fff' },
  clock: { width: 84, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(6,9,15,0.92)' },
  clockT: { fontFamily: F.hx, fontSize: 17, color: '#fff' },
  round: { fontFamily: F.h, fontSize: 8.5, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.4 },
  subWrap: { position: 'absolute', top: 48, alignSelf: 'center', backgroundColor: 'rgba(6,9,15,0.7)', paddingHorizontal: 10, paddingVertical: 2 },
  sub: { fontFamily: F.h, fontSize: 9, color: 'rgba(255,255,255,0.75)', letterSpacing: 1.3 },
  feed: { position: 'absolute', right: 10, top: 70, alignItems: 'flex-end', gap: 3 },
  kill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(6,9,15,0.78)', paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: 'transparent', borderRadius: 3 },
  kn: { fontFamily: F.hm, fontSize: 11, maxWidth: 88 },
  wpn: { fontFamily: F.hx, fontSize: 9, color: '#ffd27a', letterSpacing: 1 },
  place: { fontFamily: F.b, fontSize: 9, color: 'rgba(255,255,255,0.55)', maxWidth: 70 },
  banner: { position: 'absolute', top: 92, left: 0, right: 0, alignItems: 'center' },
  bannerIn: { paddingHorizontal: 60, paddingVertical: 6, alignItems: 'center' },
  bannerT: { fontFamily: F.hx, fontSize: 16, color: '#fff', letterSpacing: 2 },
  bannerS: { fontFamily: F.h, fontSize: 10, color: 'rgba(255,255,255,0.85)', letterSpacing: 1.5 },
  strips: { position: 'absolute', bottom: 62, gap: 2 },
  strip: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 150, height: 19, backgroundColor: 'rgba(6,9,15,0.72)', paddingRight: 6 },
  stripR: { paddingRight: 0, paddingLeft: 6 },
  pn: { flex: 1, fontFamily: F.hm, fontSize: 11, color: '#fff', paddingHorizontal: 4 },
  kd: { fontFamily: F.hx, fontSize: 10, color: 'rgba(255,255,255,0.8)' },
});
function Scoreboard({ L, sub }) {
  const sc = L.phase === 'play' ? L.shown : [L.sa, L.sb];
  return (
    <View style={st.sb} pointerEvents="none">
      <Row gap={8} style={{ flex: 1, justifyContent: 'flex-end' }}><T h s={14} n={1} style={{ textAlign: 'right', flexShrink: 1 }}>{tname(L.A)}</T><TeamLogo t={L.A} size={36} /></Row>
      <View style={{ alignItems: 'center', minWidth: 150 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ fontFamily: F.hx, fontSize: 34, color: L.us === 'A' ? S.org.c1 : C.tx }}>{sc[0]}</Text>
          <Text style={{ fontFamily: F.h, fontSize: 18, color: C.mu }}>:</Text>
          <Text style={{ fontFamily: F.hx, fontSize: 34, color: L.us === 'B' ? S.org.c1 : C.tx }}>{sc[1]}</Text>
        </View>
        <T mu s={10.5} n={1}>{sub}{L.phase === 'play' ? ` · серия ${L.sa}:${L.sb}` : ''}</T>
      </View>
      <Row gap={8} style={{ flex: 1 }}><TeamLogo t={L.B} size={36} /><T h s={14} n={1} style={{ flexShrink: 1 }}>{tname(L.B)}</T></Row>
    </View>
  );
}
function evText(L, e) {
  const nick = id => { const p = S.players[id]; return p ? pnick(p) : '?'; }; const tm = s => ttag(s === 'A' ? L.A : L.B); const col = s => s === L.us ? S.org.c1 : '#c8d0e4';
  if (L.kind === 'fps') { const buy = { pistol: 'пистолетка', full: 'фулл-бай', force: 'форс', eco: 'эко' }; return <View><T s={11} style={{ color: e.A === (L.us === 'A') ? S.org.c1 : C.mu, fontFamily: F.hm }}>Раунд {e.n} · {e.A ? tm('A') : tm('B')} · {{ elim: 'зачистка', bomb: 'бомба', defuse: 'разминирование', clutch: 'клатч' }[e.how]} · {buy[e.bA]} / {buy[e.bB]}</T>{e.ev.slice(-3).map((k, i) => <T key={i} s={11}><Text style={{ color: col(k.A ? 'A' : 'B'), fontFamily: F.hm }}>{nick(k.k)}</Text> <Ico n={k.awp ? 'crosshair' : 'pistol'} size={11} color="#ffd27a" style={{ marginBottom: -1 }} />{k.hs ? <Ico n="headshot" size={11} color="#ff8080" style={{ marginBottom: -1 }} /> : null} <Text style={{ color: col(k.A ? 'B' : 'A') }}>{nick(k.v)}</Text></T>)}</View>; }
  const c = col(e.side);
  if (e.type === 'fight') return <T s={11.5}><Text style={{ color: c, fontFamily: F.hm }}>{tm(e.side)}</Text> {e.big ? 'выигрывают тимфайт' : 'стычка'} {e.kw}:{e.kl} · {nick(e.killer)} → {nick(e.victim)}</T>;
  if (e.type === 'tower') return <T s={11.5}><Text style={{ color: c, fontFamily: F.hm }}>{tm(e.side)}</Text> {L.d === 'dl' ? 'ломают ' + (e.n <= 3 ? 'Guardian' : e.n <= 6 ? 'Walker' : e.n <= 9 ? 'Base Guardian' : 'Shrine') : 'сносят башню'} ({e.n})</T>;
  if (e.type === 'hg') return <T s={11.5}><Text style={{ color: c, fontFamily: F.hm }}>{tm(e.side)}</Text> заходят на базу!</T>;
  if (e.type === 'bcall') return <T s={11.5}><Text style={{ color: c, fontFamily: F.hm }}>{tm(e.side)}</Text> {(L.kind === 'ball' ? { allin: 'идут ва-банк', park: 'закрываются в обороне', rot: 'берут тайм-аут' } : { allin: 'включают прессинг', park: 'ставят автобус', rot: 'тренер подбадривает игрока' })[e.call]}</T>;
  if (e.type === 'call') return <T s={11.5}><Text style={{ color: c, fontFamily: F.hm }}>{tm(e.side)}</Text> {{ smoke: 'уходят в смок', push: 'давят линию', boss: 'идут на ' + pack(L.d).boss }[e.call]}</T>;
  if (e.type === 'boss' && e.stolen) return <T s={11.5}><Text style={{ color: c, fontFamily: F.hm }}>{tm(e.side)}</Text> отбивают {pack(L.d).boss}!</T>;
  if (e.type === 'boss') return <T s={11.5}><Text style={{ color: c, fontFamily: F.hm }}>{tm(e.side)}</Text> забирают {pack(L.d).boss}</T>;
  if (e.type === 'end') return <T h s={12} style={{ color: c }}>{tm(e.side)} уничтожают {pack(L.d).base}!</T>;
  if (e.type === 'goal') return <T s={12}><Ico n="ball" size={12} color="#fff" style={{ marginBottom: -2 }} /> <Text style={{ color: c, fontFamily: F.h }}>ГОЛ! {nick(e.p)}</Text>{e.as ? <Text style={{ color: C.mu }}> пас {nick(e.as)}</Text> : null}{e.ot ? ' · золотой гол' : ''}</T>;
  if (e.type === 'save') return <T s={11.5}><Ico n="glove" size={12} color="#fff" style={{ marginBottom: -2 }} /> <Text style={{ color: c }}>{nick(e.p)}</Text> спасает</T>;
  if (e.type === 'demo') return <T s={11.5}><Ico n="explosion" size={12} color="#ff9a5a" style={{ marginBottom: -2 }} /> <Text style={{ color: c }}>{nick(e.p)}</Text> взрывает {nick(e.v)}</T>;
  if (e.type === 'chance') return <T s={11.5}><Text style={{ color: c }}>{nick(e.p)}</Text> <Text style={{ color: C.mu }}>не реализует момент</Text></T>;
  if (e.type === 'ot') return <T h s={12} style={{ color: C.gold }}>ОВЕРТАЙМ — до первого гола!</T>;
  if (e.type === 'et') return <T h s={12} style={{ color: C.gold }}>Дополнительное время</T>;
  if (e.type === 'pens') return <T h s={12} style={{ color: C.gold }}>Пенальти {e.a}:{e.b}</T>;
  if (e.type === 'ht') return <T mu s={11}>Перерыв</T>;
  return null;
}
function Feed({ L }) { return <View style={st.feed} pointerEvents="none">{L.feed.slice(0, L.kind === 'fps' ? 2 : 4).map((e, i) => <View key={i} style={{ opacity: 1 - i * 0.12, marginBottom: 4 }}>{evText(L, e)}</View>)}</View>; }
function Board({ L }) {
  const g = L.cur; if (!g) return null; const R = Math.max(1, g.round || 1); const lbl = L.kind === 'ball' ? ['Г', 'С', 'П'] : L.kind === 'duel' ? ['Г', 'Пр', ''] : ['K', 'D', 'A'];
  const sides = L.kind === 'duel' ? [['A', [g.pA]], ['B', [g.pB]]] : [['A', L.cA.players], ['B', L.cB.players]];
  return (
    <View style={st.board} pointerEvents="none">
      {sides.map(([s, ps]) => <View key={s} style={{ marginBottom: 4 }}><T s={10} style={{ color: s === L.us ? S.org.c1 : C.mu, fontFamily: F.h }}>{ttag(s === 'A' ? L.A : L.B)}</T>{ps.map(p => { const x = g.stats[p.id] || {}; return <Row key={p.id} gap={6}><T s={11} n={1} style={{ flex: 1 }}>{pnick(p)}</T><T num s={11} style={{ width: 22, textAlign: 'right' }}>{x.k || 0}</T><T num s={11} style={{ width: 22, textAlign: 'right' }}>{x.d || 0}</T>{lbl[2] ? <T num s={11} style={{ width: 22, textAlign: 'right' }}>{x.a || 0}</T> : null}{L.kind === 'fps' ? <T num s={11} style={{ width: 32, textAlign: 'right' }}>{fpsRating(x, R).toFixed(2)}</T> : null}</Row>; })}</View>)}
    </View>
  );
}
// Оценка подготовки соперника аналитиком: без аналитика — «?», чем выше уровень — тем точнее
function scoutPrac(L, op, i) { const sk = staffSk('analyst', L.d); if (!sk) return null; const err = Math.max(2, 22 - sk); const h = Math.sin((op.id || 1) * 12.9898 + i * 78.233 + S.season * 3.1) * 43758.5453; const n = (h - Math.floor(h) - 0.5) * 2 * err; return { v: Math.max(0, Math.min(100, Math.round(op.prac[i] + n))), err }; }
function Veto({ L, onPick, onSkip }) {
  const V = L.veto; const st0 = V.order[V.step]; const my = st0 && st0[1] === L.us; const me = L.us === 'A' ? L.cA : L.cB, op = L.us === 'A' ? L.cB : L.cA;
  return (
    <View style={st.overlay}>
      <View style={st.panel}>
        <Row style={{ marginBottom: 8 }}><T h s={16} style={{ flex: 1 }}>Вето карт · BO{L.bo}</T>{st0 ? <Tag t={my ? (st0[0] === 'b' ? 'ваш бан' : 'ваш пик') : 'соперник думает…'} c={my ? FAKE[L.d].color : C.mu} /> : null}</Row>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {[0, 1, 2, 3, 4, 5, 6].map(i => { const lg = V.log.find(x => x[1] === i); const ban = lg && lg[0] !== 'dec' && lg[0][0] === 'b'; const pk = lg && !ban; const who = lg ? (lg[0] === 'dec' ? 'десайдер' : ttag(lg[0][1] === 'A' ? L.A : L.B) + (ban ? ' бан' : ' пик')) : ''; return (
            <Pressable key={i} disabled={!my || !!lg} onPress={() => onPick(i)} style={{ width: '23.5%', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: pk ? FAKE[L.d].color : C.line, backgroundColor: ban ? 'rgba(255,90,106,0.08)' : pk ? alpha(FAKE[L.d].color, 0.15) : 'rgba(0,0,0,0.35)', opacity: ban ? 0.45 : 1 }}>
              <T h s={14} n={1} style={{ textDecorationLine: ban ? 'line-through' : 'none' }}>{mapName(L.d, i)}</T>
              <T mu s={10.5}>мы {Math.round(me.prac[i])} · они {(() => { const e = scoutPrac(L, op, i); return e ? '≈' + e.v : '?'; })()}</T>
              {(() => { const ms = me.players.filter(p => sigMap(p) === i).length; const os = staffSk('analyst', L.d) ? op.players.filter(p => sigMap(p) === i).length : 0; const mm = S.mapMeta && S.mapMeta[i]; return (ms || os || mm) ? <T s={9.5} style={{ color: C.gold }}>{ms ? '★' + ms + ' наш.' : ''}{os ? (ms ? ' · ' : '') + '★' + os + ' у них' : ''}{mm ? ((ms || os) ? ' · ' : '') + 'патч: ' + (mm === 'ct' ? 'CT' : 'T') : ''}</T> : null; })()}
              {who ? <T s={10} style={{ color: ban ? C.bad : FAKE[L.d].color, fontFamily: F.hm, marginTop: 2 }}>{who}</T> : null}
            </Pressable>); })}
        </View>
        {(() => { const sk = staffSk('analyst', L.d); const avail = V.avail || []; if (!sk) return <T s={11} style={{ marginTop: 8, color: C.gold }}>Без аналитика подготовка соперника неизвестна. Найми аналитика в Состав → Штаб — он оценит карты соперника и подскажет вето.</T>;
          const est = avail.map(i => ({ i, me: me.prac[i], op: scoutPrac(L, op, i).v }));
          const ban = est.slice().sort((a, b) => (b.op - b.me) - (a.op - a.me))[0]; const pick = est.slice().sort((a, b) => (b.me - b.op) - (a.me - a.op))[0];
          return <View style={{ marginTop: 8, padding: 8, borderRadius: 9, backgroundColor: 'rgba(56,200,255,0.07)', borderWidth: 1, borderColor: 'rgba(56,200,255,0.3)' }}><T s={11.5}>📊 Аналитик (ур. {sk}, точность ±{Math.max(2, 22 - sk)}): {ban ? 'банить ' + mapName(L.d, ban.i) : ''}{pick && ban && pick.i !== ban.i ? ', брать ' + mapName(L.d, pick.i) : ''}.</T></View>; })()}
        <Row style={{ marginTop: 8 }}><T mu s={10.5} style={{ flex: 1 }}>Цифры — знание карты (0–100). Разница в 50 очков ≈ +11 к силе каждого игрока в перестрелке.</T><Btn small title="⏩ Пропустить серию" onPress={onSkip} /></Row>
      </View>
    </View>
  );
}
function Draft({ L, rr, onPick, onAuto, onSkip }) {
  const { height: WH, width: WW } = useWindowDimensions(); const cw = WW > 1100 ? '19.2%' : '24.2%';
  const dr = L.draft; const ord = draftOrder(L.d); const st0 = ord[dr.step]; const my = st0 && st0[0] === L.us && !L.autoD; const list = heroList(L.d); const taken = draftTaken(dr); const isBan = st0 && st0[1] === 'ban';
  const me = L.us === 'A' ? L.cA : L.cB, op = L.us === 'A' ? L.cB : L.cA; const used = new Set(dr.picks[L.us].map(x => x.pid)); const oside = L.us === 'A' ? 'B' : 'A'; const oused = new Set(dr.picks[oside].map(x => x.pid));
  const score = h => { let s = 0; if (isBan) op.players.forEach(p => { if (!oused.has(p.id)) s = Math.max(s, prof(p, h, L.d)); }); else me.players.forEach(p => { if (!used.has(p.id)) s = Math.max(s, prof(p, h, L.d) + (list[h].r.includes(p.role) ? 0 : -15)); }); return Math.round(s); };
  const ids = list.map((x, i) => i).filter(i => L.hrole < 0 || list[i].r.includes(L.hrole)).sort((a, b) => score(b) - score(a));
  const col = side => <View style={{ width: 150 }}><T h s={12} style={{ color: side === L.us ? S.org.c1 : C.mu }}>{ttag(side === 'A' ? L.A : L.B)}</T><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginVertical: 3 }}>{dr.bans[side].map(h => <T key={h} s={9.5} style={{ color: '#ffb8c0', textDecorationLine: 'line-through', backgroundColor: 'rgba(255,90,106,0.12)', paddingHorizontal: 4, borderRadius: 4 }}>{list[h].n}</T>)}</View>{Array.from({ length: FAKE[L.d].size }, (_, i) => { const pk = dr.picks[side][i]; return <View key={i} style={{ backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 7, padding: 4, marginBottom: 3, borderWidth: 1, borderColor: C.line, minHeight: 30 }}>{pk ? <><T h s={11} n={1}>{list[pk.h].n}</T><T mu s={9.5} n={1}>{pnick(S.players[pk.pid])}</T></> : <T mu s={10}>—</T>}</View>; })}</View>;
  return (
    <View style={[st.overlay, { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingTop: 58 }]}>
      {col('A')}
      <View style={[st.panel, { flex: 1, width: 'auto', maxWidth: 99999, padding: 10, height: WH - 58 - 10 }]}>
        <Row style={{ marginBottom: 6 }}><T h s={14} style={{ flex: 1 }}>Драфт · игра {L.sa + L.sb + 1}</T>{st0 ? <Tag t={my ? (isBan ? 'ваш бан' : 'ваш пик') : 'соперник выбирает…'} c={my ? FAKE[L.d].color : C.mu} /> : null}</Row>
        {my ? <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 6 }} contentContainerStyle={{ gap: 5 }}>{[[-1, 'Все'], ...FAKE[L.d].roles.map((r, i) => [i, r])].map(([k, n]) => <Pressable key={k} onPress={() => { L.hrole = k; rr(); }} style={{ paddingHorizontal: 9, paddingVertical: 4, borderRadius: 99, backgroundColor: L.hrole === k ? FAKE[L.d].color : 'rgba(255,255,255,0.06)' }}><T s={11} style={{ color: L.hrole === k ? '#0a0d14' : C.mu, fontFamily: F.hm }}>{n}</T></Pressable>)}</ScrollView>
          <ScrollView style={{ flex: 1 }}><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>{ids.map(h => { const tk = taken.has(h); const mt = heroMeta(L.d, h); return <Pressable key={h} disabled={tk} onPress={() => { L.sel = h; rr(); }} style={{ width: cw, padding: 7, borderRadius: 8, borderWidth: 1, borderColor: L.sel === h ? FAKE[L.d].color : C.line, backgroundColor: L.sel === h ? alpha(FAKE[L.d].color, 0.18) : 'rgba(0,0,0,0.3)', opacity: tk ? 0.22 : 1 }}><T h s={11} n={1}>{list[h].n}</T><T mu s={9.5} n={1}>{list[h].r.map(r => FAKE[L.d].roles[r].slice(0, 6)).join('/')} · {{ e: 'ранний', m: 'мид', l: 'поздний' }[list[h].s || 'm']}</T>{(() => { const mine = !isBan && me.players.find(p => !used.has(p.id) && sigHero(p) === h); const theirs = isBan && staffSk('analyst', L.d) && op.players.find(p => !oused.has(p.id) && sigHero(p) === h); return mine || theirs ? <T s={9.5} n={1} style={{ color: C.gold }}>★ коронный {pnick(mine || theirs)}</T> : null; })()}<T s={10}>{isBan ? 'угроза' : 'наш'} <Text style={{ fontFamily: F.h }}>{score(h)}</Text>{mt > 0 ? <Text style={{ color: C.good }}> ▲</Text> : mt < 0 ? <Text style={{ color: C.bad }}> ▼</Text> : null}</T></Pressable>; })}</View></ScrollView>
          <Row style={{ marginTop: 6 }}><Btn style={{ flex: 1 }} kind="pri" ac={FAKE[L.d].color} disabled={L.sel === null || taken.has(L.sel)} title={(isBan ? 'Забанить ' : 'Выбрать ') + (L.sel !== null ? list[L.sel].n : '')} onPress={() => onPick(L.sel)} /><Btn title="🤖 Авто до конца" onPress={onAuto} /><Btn title="⏩ Серия" onPress={onSkip} /></Row>
        </> : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><T mu>{L.autoD ? 'Авто-драфт…' : 'Соперник выбирает…'}</T><Btn small style={{ marginTop: 10 }} title="⏩ Пропустить серию" onPress={onSkip} /></View>}
      </View>
      {col('B')}
    </View>
  );
}
function End({ L, onClose }) {
  const r = L.m.res; const won = r.win === (L.us === 'A' ? L.A.id : L.B.id); const mvp = r.mvp ? S.players[r.mvp] : null; const lb = L.kind === 'ball' ? ['Г', 'С', 'П'] : L.kind === 'duel' ? ['Г', 'Пр', ''] : ['K', 'D', 'A'];
  return (
    <View style={[st.overlay, { paddingTop: 70 }]}>
      <View style={[st.panel, { flexDirection: 'row', gap: 14, maxWidth: 760 }]}>
        <View style={{ width: 230 }}>
          <View style={{ alignItems: 'center' }}><Ico n={won ? 'trophy' : 'brokenheart'} size={46} color={won ? C.gold : C.bad} /></View>
          <Text style={{ fontFamily: F.hx, fontSize: 26, color: won ? C.gold : C.bad, textAlign: 'center' }}>{won ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ'}</Text>
          {L.maps.map((mp, i) => <Row key={i} style={{ paddingVertical: 3 }}><T mu s={11} style={{ width: 16 }}>{i + 1}</T><T s={11.5} n={1} style={{ flex: 1 }}>{L.kind === 'fps' ? mapName(L.d, mp.map) : L.kind === 'moba' ? mp.t + ' мин' : L.kind === 'ball' ? (pack(L.d).maps[mp.map] || 'Арена') + (mp.ot ? ' (ОТ)' : '') : pnick(S.players[mp.pa]) + ' – ' + pnick(S.players[mp.pb])}</T><T h s={12}>{L.kind === 'moba' ? mp.kA + ':' + mp.kB : mp.sa + ':' + mp.sb}{mp.pens ? ' п' + mp.pens.join(':') : ''}</T></Row>)}
          {mvp ? <View style={{ marginTop: 8, padding: 8, borderRadius: 10, backgroundColor: 'rgba(255,201,77,0.1)', borderWidth: 1, borderColor: 'rgba(255,201,77,0.4)' }}><Row gap={5}><Ico n="star" size={12} color={C.gold} /><T mu s={10} style={{ fontFamily: F.hm }}>MVP СЕРИИ</T></Row><Row gap={6}><Flag cc={pcc(mvp)} /><T h s={15}>{pnick(mvp)}</T></Row></View> : null}
          <Row style={{ marginTop: 8 }}><T s={12} style={{ flex: 1 }}>Призовые и бонусы</T><T h s={14} style={{ color: L.prize >= 0 ? C.good : C.bad }}>{(L.prize >= 0 ? '+$' : '−$') + fmt(Math.abs(L.prize))}</T></Row>
          <Btn kind="pri" ac={S.org.c1} title="Продолжить" onPress={onClose} style={{ marginTop: 10 }} />
        </View>
        <ScrollView style={{ flex: 1, maxHeight: 280 }}>
          {L.hls.length ? <View style={{ marginBottom: 8, padding: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: C.line }}><T mu s={10} style={{ fontFamily: F.hm, letterSpacing: 1.2, marginBottom: 3 }}>МОМЕНТЫ СЕРИИ</T>{L.hls.slice().sort((a, b) => (b.big ? 1 : 0) - (a.big ? 1 : 0)).slice(0, 5).map((h, i) => <Row key={i} gap={6} style={{ paddingVertical: 2 }}><Ico n={h.ic} size={16} color={h.side === L.us ? S.org.c1 : C.gold} /><T s={11.5} n={1} style={{ flex: 1 }}><Text style={{ fontFamily: F.h, color: h.side === L.us ? S.org.c1 : C.tx }}>{h.t}</Text>{h.p && S.players[h.p] ? ' · ' + pnick(S.players[h.p]) : ' · ' + ttag(h.side === 'A' ? L.A : L.B)}</T><T mu s={10}>игра {h.g}{h.at ? ' · ' + h.at : ''}</T></Row>)}</View> : null}
          {['A', 'B'].map(s => { const c = s === 'A' ? L.cA : L.cB; return <View key={s} style={{ marginBottom: 6 }}><T h s={12} style={{ color: s === L.us ? S.org.c1 : C.mu, marginBottom: 2 }}>{tname(s === 'A' ? L.A : L.B)}</T><Row><T mu s={10} style={{ flex: 1 }}>ИГРОК</T>{lb.filter(Boolean).map(x => <T key={x} mu s={10} style={{ width: 28, textAlign: 'right' }}>{x}</T>)}<T mu s={10} style={{ width: 40, textAlign: 'right' }}>РЕЙТ.</T></Row>{c.players.map(p => { const x = r.ps.find(y => y.id === p.id); if (!x) return null; return <Row key={p.id} style={{ paddingVertical: 2 }}><T s={11.5} n={1} style={{ flex: 1 }}>{pnick(p)}{x.mvp ? ' ★' : ''}</T><T num s={11.5} style={{ width: 28, textAlign: 'right' }}>{x.k}</T><T num s={11.5} style={{ width: 28, textAlign: 'right' }}>{x.d}</T>{lb[2] ? <T num s={11.5} style={{ width: 28, textAlign: 'right' }}>{x.a}</T> : null}<T num s={11.5} style={{ width: 40, textAlign: 'right' }}>{(x.rt / Math.max(1, x.mp)).toFixed(2)}</T></Row>; })}</View>; })}
        </ScrollView>
      </View>
    </View>
  );
}
const st = StyleSheet.create({
  sb: { position: 'absolute', top: 6, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  banner: { backgroundColor: 'rgba(8,12,20,0.82)', borderRadius: 16, borderWidth: 1, borderColor: C.line2, paddingHorizontal: 26, paddingVertical: 16 },
  bottom: { position: 'absolute', left: 10, right: 10, bottom: 8, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(6,9,15,0.78)', borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 6 },
  feed: { position: 'absolute', left: 10, top: 66, width: 236, backgroundColor: 'rgba(6,9,15,0.45)', borderRadius: 10, padding: 6, borderWidth: 1, borderColor: C.line },
  menuBtn: { position: 'absolute', left: 10, top: 8, width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(6,9,15,0.8)', borderWidth: 1, borderColor: C.line2 },
  board: { position: 'absolute', right: 12, top: 70, width: 230, backgroundColor: 'rgba(6,9,15,0.8)', borderRadius: 12, padding: 8, borderWidth: 1, borderColor: C.line },
  overlay: { ...StyleSheet.absoluteFillObject, paddingTop: 64, paddingHorizontal: 14, paddingBottom: 10, alignItems: 'center' },
  panel: { backgroundColor: 'rgba(10,14,24,0.9)', borderRadius: 16, borderWidth: 1, borderColor: C.line2, padding: 14, width: '100%', maxWidth: 720 },
});
