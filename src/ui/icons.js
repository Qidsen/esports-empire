// Игровые иконки вместо системных смайликов: SVG из game-icons.net (CC BY 3.0).
import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PATHS } from './iconPaths';

// смайлик → иконка (для старых строк новостей/тостов и данных)
const E = {
  '👑': 'crown', '💪': 'biceps', '🤫': 'silence', '🎤': 'mic', '🎙': 'mic', '🔥': 'flame', '☠': 'toxic', '🧠': 'brain', '📊': 'chart', '🧘': 'meditation',
  '🔭': 'spyglass', '📸': 'camera', '📷': 'camera', '💼': 'briefcase', '🌱': 'sprout', '🤝': 'handshake', '🏠': 'house', '🎥': 'video', '🖥': 'pc', '📣': 'megaphone',
  '📢': 'megaphone', '🧖': 'spa', '🗄': 'server', '🎓': 'cap', '🏢': 'building', '💢': 'angry', '😠': 'angry', '📺': 'tv', '🕴': 'spy', '🥤': 'soda', '🕵': 'ninja',
  '🎉': 'party', '🌙': 'moon', '🎬': 'clapper', '✈': 'plane', '😤': 'steam', '💙': 'heart', '🌫': 'smoke', '⬆': 'push', '🐉': 'dragon', '🧊': 'frozen',
  '💥': 'explosion', '⚔': 'swords', '🏆': 'trophy', '🎩': 'tophat', '⭐': 'star', '★': 'star', '🏅': 'medal', '🎖': 'medal', '👥': 'friends', '🎯': 'target',
  '🗺': 'map', '🦸': 'hero', '🎮': 'gamepad', '📡': 'radar', '🌴': 'palm', '⚡': 'bolt', '📨': 'envelope', '🔫': 'pistol', '💀': 'headshot', '💣': 'bomb',
  '✂': 'cut', '🧤': 'glove', '⚽': 'ball', '🤖': 'robot', '✅': 'check', '✓': 'check', '❌': 'cross', '✕': 'cross', '✗': 'cross', '💰': 'money', '🔁': 'cycle',
  '🔄': 'cycle', '🧪': 'flask', '🗓': 'calendar', '📅': 'calendar', '📄': 'scroll', '📝': 'quill', '✍': 'quill', '🚪': 'door', '🏗': 'crane', '💬': 'chat',
  '⏳': 'hourglass', '💔': 'brokenheart', '🩹': 'plaster', '⚠': 'warning', '🌃': 'nightsky', '🏁': 'flag', '👀': 'eye', '👋': 'hand', '📉': 'down',
  '🛬': 'arrival', '🧩': 'puzzle', '🚗': 'car', '⚙': 'cog', '📂': 'folder', '🧑': 'person', '🔒': 'lock', '▶': 'play', '⏭': 'skip', '⏩': 'skip', '⏸': 'pause',
  '↩': 'cycle', '🏳': 'flag',
};
const strip = s => s.replace(/[️‍]/g, '');
export function iconKey(n) { if (!n || typeof n !== 'string') return null; if (PATHS[n]) return n; const x = strip(n); return E[x] || E[Array.from(x)[0]] || null; }
export function Ico({ n, size = 18, color = '#e8ecf6', style }) {
  const k = iconKey(n);
  if (!k) return n ? <Text style={[{ fontSize: size * 0.85, color }, style]}>{n}</Text> : null;
  return <View style={[{ width: size, height: size }, style]}><Svg width={size} height={size} viewBox="0 0 512 512"><Path d={PATHS[k]} fill={color} /></Svg></View>;
}
// Текст, начинающийся со смайлика: «🏆 Титул!» → [иконка] Титул!
const LEAD = /^\s*((?:[←-⯿]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF])[️‍]*)\s*/;
export function splitIcon(s) { if (typeof s !== 'string') return [null, s]; const m = s.match(LEAD); if (!m) return [null, s]; const k = iconKey(m[1]); return k ? [k, s.slice(m[0].length)] : [null, s]; }
export function IconText({ text, size = 14, color, iconColor, style, numberOfLines, gap = 6 }) {
  const [k, rest] = splitIcon(text);
  if (!k) return <Text numberOfLines={numberOfLines} style={style}>{text}</Text>;
  return <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap }}><Ico n={k} size={size} color={iconColor || color || '#e8ecf6'} style={{ marginTop: 2 }} /><Text numberOfLines={numberOfLines} style={[style, { flexShrink: 1 }]}>{rest}</Text></View>;
}
