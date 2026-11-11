# Esports Empire

Менеджер киберспортивной организации для iPhone (Expo Go): 5 дисциплин, матчи в 3D, альбомная ориентация.

## Дисциплины
- **Counter-Strike 2** (5×5): вето карт, раунды с экономикой, тайм-ауты
- **Dota 2** (5×5): драфт, золото, башни, Рошан
- **Deadlock** (6×6): 3 дуо-линии, Guardian → Walker → Base Guardian → Shrine → Patron, Mid Boss
- **Rocket League** (3×3): BO5/BO7, голы, сейвы, демо, овертайм
- **EA SPORTS FC 27** (1×1, по 2 игрока в составе)

## Что внутри
- Организация с общим бюджетом; офис открывает новые дивизионы
- Трансферы с торгом, аренда в обе стороны, предложения о покупке твоих игроков
- Молодёжный состав и академия, прокачка навыков за очки тренировок
- Мораль с причинами: игровое время, зарплата, результаты, обещания
- Персонал: тренер, аналитик, психолог, скаут, медиа- и бизнес-менеджер, тренер молодёжки, трансферный директор
- База: геймхаус, стрим-студия, аналитический центр, медиа-отдел, wellness, серверная, академия, офис
- Спонсоры, контент-мейкеры, idle-доход (копится, пока игра закрыта)
- Лиги с повышением и вылетом, плей-офф, мейджор
- Матчи в 3D (three.js + expo-gl) с управлением по ходу игры

## Данные
По умолчанию всё вымышленное. Патч «Real Esports 2026» (`src/core/realPatch.js`) включает реальные игры, карты, героев, команды и игроков — составы сверены 11.11.2026. Можно загрузить свой патч в том же JSON-формате (Клуб → Патч и данные).

## Запуск
Пуш в `main` → GitHub Action публикует обновление в Expo, ссылка для Expo Go появляется в `EXPO_LINK.md`.

## Иконки игр в патче
Реальный патч уже содержит логотипы CS2, Dota 2, Deadlock, Rocket League и EA SPORTS FC (`src/core/patchIcons.js`, PNG-копии в `assets/game-icons/`). Источники: simple-icons (CC0) для CS2 и Dota 2, открытые GitHub-репозитории для остальных. Товарные знаки принадлежат Valve, Psyonix/Epic и EA.

У каждой дисциплины в патче может быть поле `icon` — ссылка на картинку или `data:image/png;base64,...`:
```json
{ "disciplines": { "cs": { "game": "Counter-Strike 2", "icon": "https://.../cs2.png" } } }
```
Проще всего: Клуб → Патч → нажать на иконку игры и выбрать PNG/JPG (до 400 КБ). Иконки сохраняются, даже если переустановить патч.

## 3D-модели
Бойцы, оружие и окружение CS2 — Quaternius «Toon Shooter Game Kit» (CC0, quaternius.com), оптимизированы в GLB (`assets/models/`).

## Карты CS2
Раскладки семи карт (Ancient, Anubis, Cache, Dust II, Inferno, Mirage, Nuke) построены из навигационных сеток awpy-data (MIT, github.com/pnxenopoulos/awpy-data), названия зон — из awpy 1.3 (MIT). Бойцы ходят по реальным маршрутам (A* по сетке).

## 3D других дисциплин
Герои Dota 2 — Quaternius Knight (CC0), Deadlock и футболисты — Quaternius Cyberpunk Character (CC0), деревья/башни/здания — Quaternius Nature, RTS и Buildings (CC0). Машины Rocket League — Kenney Car Kit «race-future» (CC0/MIT, текстура запечена в цвета вершин).

Музыка — Komiku и Soft and Furious (CC0, через сборник CC0-Music). Иконки интерфейса — [game-icons.net](https://game-icons.net) (CC BY 3.0): Lorc, Delapouite, Skoll, Sbed, Carl Olsen, DarkZaitzev, Zeromancer. Пути SVG лежат в `src/ui/iconPaths.js`.
