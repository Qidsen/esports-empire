// Настройки приложения (отдельно от сохранения карьеры).
import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = 'esports_empire_settings_v1';
export const SET = { lang: 'ru', gfx: 'auto', speed: 1, haptics: true };
export const LANGS = [['ru', 'Русский', true], ['uk', 'Українська', false], ['en', 'English', false]];
export const GFX_OPTS = [['auto', 'Авто'], ['high', 'Высокая'], ['mid', 'Средняя'], ['low', 'Низкая']];
export async function loadSettings() { try { const r = await AsyncStorage.getItem(KEY); if (r) Object.assign(SET, JSON.parse(r)); } catch (e) { } }
export function saveSettings() { AsyncStorage.setItem(KEY, JSON.stringify(SET)).catch(() => { }); }
export function gfxLevel() { return SET.gfx === 'low' ? 2 : SET.gfx === 'mid' ? 1 : 0; }
