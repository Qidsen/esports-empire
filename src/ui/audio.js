// Звук, музыка и вибрация. Звуки интерфейса — Kenney (CC0), остальное синтезировано (assets/sfx).
import { Platform } from 'react-native';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { SET } from './settings';

const SRC = {
  ak: require('../../assets/sfx/ak.m4a'), awp: require('../../assets/sfx/awp.m4a'), pistol: require('../../assets/sfx/pistol.m4a'), headshot: require('../../assets/sfx/headshot.m4a'),
  beep: require('../../assets/sfx/beep.m4a'), explosion: require('../../assets/sfx/explosion.m4a'), defuse: require('../../assets/sfx/defuse.m4a'), roundwin: require('../../assets/sfx/roundwin.m4a'),
  cheer: require('../../assets/sfx/cheer.m4a'), crowd_loop: require('../../assets/sfx/crowd_loop.m4a'), horn: require('../../assets/sfx/horn.m4a'), whistle: require('../../assets/sfx/whistle.m4a'),
  kick: require('../../assets/sfx/kick.m4a'), boost: require('../../assets/sfx/boost.m4a'), demo: require('../../assets/sfx/demo.m4a'),
  clash: require('../../assets/sfx/clash.m4a'), tower: require('../../assets/sfx/tower.m4a'), roar: require('../../assets/sfx/roar.m4a'),
  win: require('../../assets/sfx/win.m4a'), lose: require('../../assets/sfx/lose.m4a'), trophy: require('../../assets/sfx/trophy.m4a'), event: require('../../assets/sfx/event.m4a'), cash: require('../../assets/sfx/cash.m4a'),
  ui_click: require('../../assets/sfx/ui_click.m4a'), ui_select: require('../../assets/sfx/ui_select.m4a'), ui_confirm: require('../../assets/sfx/ui_confirm.m4a'), ui_error: require('../../assets/sfx/ui_error.m4a'), ui_tab: require('../../assets/sfx/ui_tab.m4a'), ui_open: require('../../assets/sfx/ui_open.m4a'),
};
// Музыка: треки CC0 (Komiku, Soft and Furious), можно выбрать в настройках
export const TRACKS = [
  ['m_epic', 'Komiku — Action Epic', require('../../assets/music/m_epic.m4a')],
  ['m_power', 'Komiku — Ultimate Power', require('../../assets/music/m_power.m4a')],
  ['m_techno', 'Komiku — Action Techno', require('../../assets/music/m_techno.m4a')],
  ['m_hardwave', 'Soft and Furious — Hardwave', require('../../assets/music/m_hardwave.m4a')],
  ['m_gameon', 'Soft and Furious — Game On', require('../../assets/music/m_gameon.m4a')],
  ['m_falling', 'Soft and Furious — Falling into the game', require('../../assets/music/m_falling.m4a')],
  ['m_lucidity', 'Soft and Furious — Lucidity', require('../../assets/music/m_lucidity.m4a')],
  ['m_granular', 'Soft and Furious — Granular Dreams', require('../../assets/music/m_granular.m4a')],
  ['m_obscur', 'Komiku — Ambiant Obscur Technology', require('../../assets/music/m_obscur.m4a')],
];
TRACKS.forEach(([k, , r]) => { SRC[k] = r; });
function trackFor(slot) { const k = slot === 'music_menu' ? SET.trackMenu : SET.trackHub; return k === 'rand' ? TRACKS[Math.floor(Math.random() * TRACKS.length)][0] : k; }
const VOL = { ak: 0.55, awp: 0.75, pistol: 0.5, headshot: 0.5, beep: 0.5, explosion: 1, cheer: 0.8, horn: 0.6, whistle: 0.6, kick: 0.6, boost: 0.5, ui_click: 0.5, ui_tab: 0.45, ui_select: 0.5, clash: 0.55, event: 0.7 };
const POOL = { ak: 4, pistol: 2, awp: 2, kick: 2, clash: 2, headshot: 2 };
const pools = {}; const idx = {}; let ready = false;
function init() { if (ready) return; ready = true; try { setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false, interruptionMode: 'mixWithOthers' }).catch(() => { }); } catch (e) { } }
function player(name) {
  if (!pools[name]) { pools[name] = []; idx[name] = 0; }
  const P = pools[name]; const n = POOL[name] || 1;
  if (P.length < n) { try { const p = createAudioPlayer(SRC[name]); P.push(p); return p; } catch (e) { return null; } }
  const p = P[idx[name] % P.length]; idx[name]++; return p;
}
let lastAt = {};
export function sfx(name, vol = 1) {
  if (!SET.sfx || !SRC[name]) return; init();
  const now = Date.now(); if (lastAt[name] && now - lastAt[name] < 40) return; lastAt[name] = now;
  try { const p = player(name); if (!p) return; p.volume = Math.min(1, (VOL[name] || 0.8) * vol * SET.sfx); p.seekTo(0).catch(() => { }); p.play(); } catch (e) { }
}
// ---- музыка ----
let mus = null, musName = null, fadeT = null;
export function music(slot) {
  init(); if (musName === slot) return; musName = slot;
  const name = slot === 'music_menu' || slot === 'music_hub' ? trackFor(slot) : slot;
  const old = mus; mus = null;
  if (old) { let v = old.volume; const f = setInterval(() => { v -= 0.06; if (v <= 0) { clearInterval(f); try { old.pause(); old.remove(); } catch (e) { } } else try { old.volume = v; } catch (e) { } }, 50); }
  if (!name || !SRC[name]) return;
  try { const p = createAudioPlayer(SRC[name]); p.loop = true; p.volume = 0; mus = p; if (SET.music) p.play(); let v = 0; clearInterval(fadeT); fadeT = setInterval(() => { v += 0.04; if (v >= 1 || mus !== p) { clearInterval(fadeT); v = Math.min(v, 1); } try { p.volume = v * 0.55 * SET.music; } catch (e) { } }, 60); } catch (e) { }
}
export function restartMusic() { const s = musName; musName = null; music(s); }
export function applyMusicVolume() { if (!mus) return; try { mus.volume = 0.55 * SET.music; if (SET.music) mus.play(); else mus.pause(); } catch (e) { } }
export function duckMusic(on) { if (!mus) return; try { mus.volume = 0.55 * SET.music * (on ? 0.35 : 1); } catch (e) { } }
// ---- вибрация ----
export function buzz(kind = 'light') {
  if (!SET.haptics || Platform.OS === 'web') return;
  try {
    if (kind === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (kind === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    else Haptics.impactAsync(kind === 'heavy' ? Haptics.ImpactFeedbackStyle.Heavy : kind === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
  } catch (e) { }
}
