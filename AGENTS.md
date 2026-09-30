# AGENTS.md — Ajan İçinde Ajan Düzeni

Bu proje, bir **Orkestra Ajanı** (ana ajan) ve ona bağlı **uzman alt ajanlar** ile geliştirilir. Ana ajan işi böler, alt ajanlara dağıtır, sonuçları birleştirir ve kontrol eder. Alt ajanlar sadece kendi alanlarında çalışır.

Tüm ajanlar çalışmaya başlamadan önce `CLAUDE.md` ve `ISKELET.md` dosyalarını okur.

---

## 1. Genel Yapı

```
                    ┌──────────────────────────┐
                    │   ORKESTRA AJANI (Ana)   │
                    │  plan · dağıt · birleştir │
                    └────────────┬─────────────┘
         ┌──────────┬───────────┼───────────┬──────────┐
         ▼          ▼           ▼           ▼          ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
   │  VERİ   │ │ MANTIK  │ │ ARAYÜZ  │ │ BACKEND │ │   QA    │
   │ Ajanı   │ │ Ajanı   │ │ Ajanı   │ │ Ajanı   │ │ Ajanı   │
   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
                                                        │
                                               her işin sonunda
                                               zorunlu kontrol
```

**Temel kural:** Alt ajanlar birbirine doğrudan iş vermez. Her şey Orkestra Ajanı üzerinden akar.

---

## 2. Orkestra Ajanı (Ana Ajan)

**Görevi:** Kullanıcının isteğini anlamak, `ISKELET.md` sınırlarına uyup uymadığını kontrol etmek, işi parçalara bölmek, doğru alt ajana vermek ve sonuçları birleştirmek.

**Çalışma döngüsü:**

1. **Anla** — İstek ne? Hangi faza ait?
2. **Sınır kontrolü** — İstek `ISKELET.md` → "Kapsam Dışı" listesinde mi? Öyleyse dur ve kullanıcıya bildir.
3. **Planla** — İşi en fazla 5–7 adımlık bir plana böl. Her adımın sahibi olan ajanı yaz. Planı kullanıcıya göster ama **onay bekleme**, hemen uygulamaya geç.
4. **Sırala** — Bağımlılıklara göre sırala (genelde: Veri → Mantık → Backend → Arayüz → QA).
5. **Dağıt** — Her alt ajana aşağıdaki formatta görev ver.
6. **Birleştir** — Çıktıları kontrol et, çakışma varsa çöz.
7. **QA'ya gönder** — QA Ajanı onay vermeden iş bitmiş sayılmaz.
8. **Raporla** — Kullanıcıya kısa özet: ne yapıldı, hangi dosyalar, hangi testler, açık kalanlar.

**Yapmaz:** Kendisi büyük kod yazmaz. Küçük birleştirme düzeltmeleri dışında kodu alt ajanlar yazar.

### Görev devri formatı

```md
## GÖREV → [AJAN ADI]
**Amaç:** Tek cümle
**Faz:** 0 / 1 / 2 / 3
**Girdi:** Hangi dosyalar, hangi veri, önceki ajandan ne geldi
**Beklenen çıktı:** Hangi dosyalar oluşacak/değişecek
**Kabul kriteri:** Neyi sağlarsa bitmiş sayılır
**Dokunma:** Bu görevde değiştirilmemesi gereken dosyalar
```

### Geri dönüş formatı (alt ajan → orkestra)

```md
## SONUÇ ← [AJAN ADI]
**Durum:** Tamam / Kısmen / Engellendi
**Değişen dosyalar:** liste
**Eklenen testler:** liste
**Varsayımlar:** Karar verirken yaptığım varsayımlar
**Açık sorular:** Orkestranın veya kullanıcının karar vermesi gerekenler
```

---

## 3. Alt Ajanlar

### 3.1 Veri Ajanı

| | |
|---|---|
| **Alanı** | `src/data/`, `config/season.ts` |
| **Yapar** | Takım listesini tutar, **Vegas baremlerini web araştırmasıyla bulur**, barem JSON dosyalarını yapılandırır, örnek (`.sample.json`) veri üretir, veri şemasını Zod ile tanımlar (Mantık Ajanı ile birlikte) |
| **Yapmaz** | Barem veya sonuç **uydurmaz**, hafızadan yazmaz. Bulamadığı veriyi `TODO` olarak bırakır. Sitenin içine scraping kodu yazmaz |
| **Kontrol listesi** | 30 takım var mı · her kısaltma benzersiz mi · her takımın konferansı ve divizyonu doğru mu · her baremin en az 2 kaynağı var mı · barem toplamı 1210–1250 arasında mı · örnek veri dosyası açıkça "sample" olarak işaretli mi |

#### Barem Araştırma Protokolü

Vegas baremleri (NBA win totals) web'den şu adımlarla toplanır:

1. **Ara.** Sezon adıyla birlikte arama yap: `NBA win totals 2026-27`, `NBA over under win totals odds 2026-27`, `[takım adı] win total 2026-27`. Tarihi mutlaka sorguya ekle; yoksa eski sezonların baremleri gelir.
2. **Kaynak seç.** Öncelik sırası:
   - Büyük spor medyası: ESPN, CBS Sports, The Athletic, Yahoo Sports, NBC Sports
   - Barem derleyen siteler: Action Network, Covers, VegasInsider
   - Bahis şirketlerinin herkese açık haber/blog sayfaları (DraftKings, FanDuel, BetMGM, Caesars, Westgate SuperBook)
   - Forum, Reddit, sosyal medya **kaynak sayılmaz**.
3. **Sezonu doğrula.** Sayfanın yayın tarihi 2026 yazı veya sonbaharı mı, başlıkta "2026-27" geçiyor mu? Geçmiyorsa kullanma.
4. **Çapraz kontrol.** Her takım için en az 2 bağımsız kaynaktan barem al. Aynı bahis şirketini aktaran iki haber tek kaynak sayılır.
5. **Baremi belirle.** Sitedeki barem BetMGM Blog tablosundaki değerdir (https://sports.betmgm.com/en/blog/nba/nba-odds-predictions-season-win-totals-bm23/). Diğer kaynaklar çapraz kontrol içindir; BetMGM ile aralarında 1 galibiyetten fazla fark varsa `needsReview: true`. BetMGM'e erişilemezse: en yeni tarihli ve en çok tekrar eden değer.
6. **Sadece bareme odaklan.** Oran (-110, 1.91 gibi) sitede gösterilmez; kaydetmek gerekmez.
7. **Toplam kontrolü.** 30 baremi topla; 1210–1250 dışındaysa bir takımda hata vardır, tekrar kontrol et.
8. **Rapor yaz.** `docs/barem-raporu-2026-27.md`: takım · konsensüs barem · kaynaklar · tarih · notlar tablosu, en altta toplam ve `needsReview` listesi.
9. **Doğrudan yaz.** Kontrollerden geçen baremleri onay beklemeden `src/data/lines/2026-27.json` dosyasına yaz. Kaynakları çelişen takımları en iyi konsensüsle yaz ve `needsReview: true` bırak. Hiç kaynak bulunamayan takım `TODO` kalır. İş sonunda raporu kullanıcıya özetle.

Baremler sezon başlayana kadar oynar. Kilit tarihinden kısa süre önce protokol bir kez daha çalıştırılıp güncellenebilir; kilitten sonra baremler donar.

### 3.2 Mantık Ajanı

| | |
|---|---|
| **Alanı** | `src/lib/` |
| **Yapar** | Puanlama, doğrulama (Zod), tutarlılık uyarıları, 1230 kontrolü, paylaşım kodlaması, kilit kontrolü. Tümü **saf fonksiyon** |
| **Yapmaz** | React, DOM, `fetch`, veritabanı çağrısı içeren kod yazmaz |
| **Kural** | **Önce test, sonra kod.** Her fonksiyon için Vitest testi aynı görevde yazılır |
| **Kontrol listesi** | Uç durumlar test edildi mi (0 galibiyet, 82 galibiyet, boş tahmin, eksik takım, tekrar eden takım) · fonksiyonlar deterministik mi |

### 3.3 Arayüz Ajanı

| | |
|---|---|
| **Alanı** | `src/app/`, `src/components/`, `src/styles/`, `src/i18n/` |
| **Yapar** | Sayfalar, bileşenler, sürükle-bırak, masaüstü düzen (duyarlı), erişilebilirlik, Türkçe metinler |
| **Yapmaz** | İş mantığını bileşen içine gömmez; `src/lib/` fonksiyonlarını çağırır. Resmi NBA fontu/lig logosu kullanmaz (takım logoları `public/logos/` içinden) |
| **Kural** | Kullanıcıya görünen her metin `src/i18n/tr.ts` içinden gelir |
| **Kontrol listesi** | 1440 ve 1280 px'de düzgün mü · 768 px'de bozulmuyor mu · klavyeyle kullanılabiliyor mu · Alt/Üst sadece renkle değil yazıyla da belli mi · koyu/açık tema kontrastı yeterli mi |

### 3.4 Backend Ajanı (Faz 2'den itibaren aktif)

| | |
|---|---|
| **Alanı** | `src/app/api/`, sunucu aksiyonları, veritabanı şeması ve migration'lar, kimlik doğrulama, zamanlanmış görevler |
| **Yapar** | Tahmin kaydetme/okuma, kilit zamanını **sunucuda** zorlama, admin yetkisi, günlük sonuç güncelleme (Faz 3) |
| **Yapmaz** | Faz 1'de hiçbir şey yapmaz. Gizli anahtarları koda yazmaz (sadece ortam değişkeni) |
| **Kontrol listesi** | Tüm girdiler Zod'dan geçiyor mu · kullanıcı başkasının tahminini değiştirebiliyor mu (değiştirememeli) · kilit sonrası yazma engelli mi · admin uçları korumalı mı |

### 3.5 QA Ajanı (Kalite Kontrol)

| | |
|---|---|
| **Alanı** | `tests/`, tüm projeye **salt okunur** bakış |
| **Yapar** | `lint`, `typecheck`, `test`, `test:e2e` çalıştırır; eksik test yazar; `ISKELET.md` sınırlarına uyumu denetler |
| **Yapmaz** | Üretim kodunu düzeltmez. Hata bulursa ilgili ajana geri gönderilmesi için Orkestraya raporlar |
| **Veto hakkı** | Var. QA "geçmedi" derse iş bitmiş sayılmaz |

**QA kontrol listesi (her işte):**
- [ ] `npm run lint` temiz
- [ ] `npm run typecheck` temiz
- [ ] `npm run test` geçiyor
- [ ] Yeni mantık için test eklenmiş
- [ ] Kapsam dışı bir özellik eklenmemiş
- [ ] Uydurulmuş gerçek veri yok
- [ ] Kullanıcıya görünen yeni metinler `tr.ts` içinde
- [ ] Bahis çağrışımı yapan dil/görsel yok (oran, kupon, "kazan" vurgusu vb.)

---

## 4. Tipik Akış Örneği

**Kullanıcı isteği:** "Alt/Üst sayfasına toplam galibiyet göstergesi ekle."

```
ORKESTRA
 ├─ Sınır kontrolü: Faz 1, kapsam içi ✓
 ├─ Plan:
 │   1. Mantık → sumProjectedWins() + deviationLevel() + testler
 │   2. Arayüz → WinTotalMeter bileşeni, Alt/Üst sayfasına yerleştir, tr.ts metinleri
 │   3. QA    → tüm kontroller + e2e: "projeksiyon gir → gösterge güncellenir"
 │
 ├─ GÖREV → Mantık Ajanı ... SONUÇ ← Tamam, 2 fonksiyon, 9 test
 ├─ GÖREV → Arayüz Ajanı ... SONUÇ ← Tamam, 1 bileşen, 1 sayfa değişti
 ├─ GÖREV → QA Ajanı     ... SONUÇ ← Geçti
 └─ Kullanıcıya rapor
```

**Kapsam dışı istek örneği:** "Her takımın yanına bahis oranlarını da göster."

```
ORKESTRA
 └─ Sınır kontrolü: ISKELET.md → "Oran gösterimi" kapsam dışı ✗
    → Kullanıcıya: "Bu ISKELET.md'de kapsam dışı olarak işaretli (bahis
      çağrışımı). Eklemek istersen önce ISKELET.md'yi güncelleyelim."
```

---

## 5. Çakışma Kuralları

- İki ajan aynı dosyaya dokunmak zorundaysa **sırayla** çalışır, paralel değil.
- `src/lib/validation.ts` ortak alandır: şema değişikliğini **Mantık Ajanı** yapar, diğerleri önerir.
- Bir alt ajan sınırda bir karar vermek zorunda kalırsa kendi başına karar vermez; "Açık sorular" kısmına yazar. Orkestra **kullanıcıya sormadan** en makul kararı verir ve bunu son rapora yazar.
- `CLAUDE.md`, `ISKELET.md` ve `AGENTS.md` dosyalarını **sadece Orkestra Ajanı** değiştirebilir; yaptığı her değişikliği son rapora yazar.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
