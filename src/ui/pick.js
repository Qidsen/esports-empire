import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// Выбор картинки из галереи (раздел «Фото») → уменьшенный PNG data URI (до 256 px, прозрачность сохраняется).
// Возвращает null при отмене, бросает строку-ошибку.
export async function pickImageDataUri(maxBytes = 400000, maxSide = 256) {
  if (Platform.OS !== 'web') {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) throw 'Нет доступа к фото — разреши его в настройках iPhone';
  }
  const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: false, quality: 1 });
  if (r.canceled || !r.assets?.length) return null;
  const a = r.assets[0];
  const w = a.width || maxSide, h = a.height || maxSide;
  const resize = Math.max(w, h) > maxSide ? (w >= h ? { width: maxSide } : { height: maxSide }) : null;
  const out = await manipulateAsync(a.uri, resize ? [{ resize }] : [], { format: SaveFormat.PNG, base64: true });
  const uri = 'data:image/png;base64,' + out.base64;
  if (uri.length * 0.75 > maxBytes) throw 'Картинка слишком тяжёлая — возьми попроще';
  return uri;
}
