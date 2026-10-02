# 🌤️ Aura Weather — Real-Time & Historical Weather Intelligence (React + Vite)

Zamonaviy, yuqori sifatli va jonli ob-havo telemetriyasiga ega zamonaviy React ilova (Single Page Application).

---

## 🚀 Imkoniyatlar va funksiyalar (Features)

1. **Jonli ob-havo telemetriyasi (Live Weather Telemetry)**:
   - Open-Meteo global API orqali real vaqtdagi harorat, sezilish darajasi (*Feels like*), namlik, yog'ingarchilik ehtimoli, barometrik bosim, shamol yo'nalishi va tezligi (*8 kompas yo'nalishi bo'yicha*), shiddat va UV indeksi.

2. **Dinamik SVG to'lqin diagrammasi va prognoz turlari**:
   - **7 kunlik prognoz (7-Day Forecast)**: Haftalik maksimal va minimal haroratlar, ob-havo belgilari.
   - **Soatlik prognoz (Hourly 24h)**: Har 3 soatlik dinamik oraliqlardagi o'zgarishlar.
   - Har qanday kun/soat ustiga bosilganda o'sha vaqtdagi batafsil ma'lumot ko'rsatiladi va to'lqinda interaktiv ajralib turadi.

3. **Tarixiy taqqoslash statistikasi (Historical Intelligence)**:
   - Kecha (*Yesterday*), O'tgan hafta (*Last Week*) va O'tgan oy (*Last Month*)dagi haroratlar bilan bugungi kunni real arxiv ma'lumotlari asosida taqqoslash.
   - Issiqroq (*Warmer* - qizil) va Salqinroq (*Colder* - ko'k) dinamik indikatorlari.

4. **Interaktiv harorat xaritasi (Global Temperature Map)**:
   - Leaflet.js va Carto Dark basemaps asosida yaratilgan interaktiv xarita.
   - Dunyo va O'zbekistonning asosiy shaharlari harorat belgilari bilan (Toshkent, Samarqand, Buxoro, Andijon, Namangan, London, Tokyo, Nyu-York, Dubay va boshqalar).
   - Xaritaning istalgan nuqtasiga bosganda real vaqtdagi harorat va manzil aniqlanadi hamda asosiy stansiya sifatida o'rnatish mumkin.

5. **Oylik barqaror haroratlar taqvimi (Monthly Calendar)**:
   - Oylar bo'yicha oldinga va orqaga (`❮` / `❯`) o'tish imkoniyati.
   - Kundalik o'rtacha barqaror haroratlar va harorat oraliqlari (min - max).
   - Bugungi kun uchun alohida yorqin ko'rsatkich.

6. **Avtomatik joylashuvni aniqlash (GPS & IP Geolocation)**:
   - Brauzer GPS yoki IP geolokatsiyasi orqali foydalanuvchining joylashuvini tezkor avtomatik aniqlash.
   - Teskari geokodlash (*Reverse Geocoding*) orqali koordinatalarni shahar nomiga aylantirish.

7. **Butun dunyo bo'yicha shahar qidiruvi (Search Modal)**:
   - Shahar nomi bo'yicha tezkor avtomatik qidiruv (Open-Meteo Geocoding).
   - Mashhur markazlar (Toshkent, Samarqand, Buxoro, London, Tokyo va boshqalar) uchun qulay tezkor tugmalar.

8. **Ko'p tillilik (Multi-language)**:
   - 🇺🇿 **O'zbekcha** va 🇬🇧 **English** to'liq tarjima va yagona tugma orqali almashtirish.

9. **Birliklar va sozlamalar**:
   - Harorat: Selsiy (°C) yoki Farengeyt (°F).
   - Shamol tezligi: km/h yoki mph.

10. **Dinamik atmosfera fonlari**:
    - Ob-havo holatiga (musaffo, bulutli, yomg'ir, momaqaldiroq, qor, tuman, issiq quyosh, tun) qarab avtomatik ravishda fon rasmlari silliq almashadi.

---

## 💻 Loyihani ishga tushirish (How to Run)

Ilovani ishga tushirish uchun quyidagi usullardan birini tanlang:

### 1-usul: Vite Dev Server orqali (Tavsiya etiladi)
\`\`\`bash
npm run dev
# yoki Windows PowerShell xatolik bersa:
npm.cmd run dev
\`\`\`
Brauzerda: **http://localhost:5173**

### 2-usul: Node.js server orqali
\`\`\`bash
node server.js
\`\`\`
Brauzerda: **http://localhost:8080**