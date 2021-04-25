![Build Status](https://api.travis-ci.com/RDevWasTaken/ts-lekcja-bot.svg?branch=main)

# TS Lekcja Bot
Bot Discord z integracją MS Teams napisany w TypeScript

## 🔍 Funkcje
- Pobieranie spotkań z kalendarza w danym dniu
- Graficzne powiadomienia na Discord
- Oznaczanie odpowiednich grup za pomocą słów kluczowych
- Możliwość dodania niestandardowych spotkań

## 🔨 Instalacja
Zalecana wersja Node.JS: 12

Instalacja TypeScript
```sh
npm i -g typescript
npm i -g ts-node
```
Instalacja potrzebnych modułów
```sh
cd ts-lekcja-bot
npm i
```
Uruchomienie bota (przed tym należy stworzyć pliki .env i bot-config.json zgodnie z przykładami)
```sh
npm start
```

## 📝 Konfiguracja
W pliku `.env` należy umieścić token swojego bota oraz dane logowania do MS Teams.
Przykład w [`.env.example`](https://github.com/RDevWasTaken/ts-lekcja-bot/blob/main/.env.example)

Omówienie pliku `bot-config.js` (przykład w [`bot-config.json.example`](https://github.com/RDevWasTaken/ts-lekcja-bot/blob/main/bot-config.json.example))
| Sekcja | Rola |
| ------ | ------ |
| Settings | Ustawienia bota |
| Translations | Tłumaczenia różnych tekstów |
| Groups | Lista grup (ID roli Discord oraz słowa kluczowe) |
| Custom | Niestandardowe spotkania |

Niektóre właściwości:
 - `defaultPing` - domyślne oznaczenie gdy żadna z grup nie została znaleziona (może być to oznaczenie roli - `<@&ID_ROLI>`)
 - `exclusivePing` [true/false] - gdy ustawione jest `true` to bot opinguje `defaultPing` gdy liczba grup jest mniejsza od liczby spotkań

## 🎨 Rozwój projektu
Jeśli chcesz wspomóc rozwój bota, możesz zgłaszać problemy/pomysły w zakładce *Issues* lub złożyć *Pull Request*!
Z góry dzięki!

## Licencja
MIT