import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
// Выбор картинки PNG/JPG/WebP → data URI. Возвращает null при отмене, бросает строку-ошибку.
export async function pickImageDataUri(maxBytes = 400000) {
  const r = await DocumentPicker.getDocumentAsync({ type: ['image/png', 'image/jpeg', 'image/webp'], copyToCacheDirectory: true });
  if (r.canceled || !r.assets?.length) return null;
  const a = r.assets[0];
  if (a.size && a.size > maxBytes) throw 'Картинка больше ' + Math.round(maxBytes / 1000) + ' КБ — возьми поменьше';
  const mime = a.mimeType || (/\.png$/i.test(a.name || '') ? 'image/png' : /\.webp$/i.test(a.name || '') ? 'image/webp' : 'image/jpeg');
  if (Platform.OS === 'web') {
    const blob = a.file || await (await fetch(a.uri)).blob();
    return await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(blob); });
  }
  const { File } = require('expo-file-system');
  return 'data:' + mime + ';base64,' + await new File(a.uri).base64();
}
