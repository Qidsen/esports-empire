import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { S, setS } from '../core/game';

const subs = new Set();
export function bump() { subs.forEach(f => f(v => v + 1)); }
export function useBump() { const [, set] = useState(0); useEffect(() => { subs.add(set); return () => { subs.delete(set); }; }, []); }

export const UI = { tab: 'home', d: null, sel: null, mk: 'fa', mkRole: -1, cmp: 'table', tier: null, org: 'fac', live: null, queue: [], week0: 0 };

// toasts
const toastSubs = new Set();
export function toast(text) { toastSubs.forEach(f => f(text)); }
export function useToasts() { const [list, set] = useState([]); useEffect(() => { const f = t => { const id = Math.random(); set(l => [...l, { id, t }]); setTimeout(() => set(l => l.filter(x => x.id !== id)), 2600); }; toastSubs.add(f); return () => { toastSubs.delete(f); }; }, []); return list; }

// modal
let modalSet = null;
export function registerModal(f) { modalSet = f; }
export function openModal(render) { modalSet && modalSet(() => render); }
export function closeModal() { modalSet && modalSet(null); }

const KEY = 'esports_empire_save_v1';
let saving = false;
export async function save() { if (!S || saving) return; saving = true; try { S.lastTick = Date.now(); await AsyncStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } saving = false; }
export async function load() { try { const r = await AsyncStorage.getItem(KEY); if (r) { setS(JSON.parse(r)); return true; } } catch (e) { } return false; }
export async function wipe() { try { await AsyncStorage.removeItem(KEY); } catch (e) { } setS(null); }
