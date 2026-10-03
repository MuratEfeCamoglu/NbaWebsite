# ISKELET.md — Projenin Sınırları ve Yapısı

Bu dosya projenin **neyi yapıp neyi yapmayacağını** tanımlar. `CLAUDE.md` "ne ve nasıl" sorusunu cevaplar; bu dosya "nereye kadar" sorusunu cevaplar. Burada yazmayan bir özellik eklenmeden önce bu dosya güncellenmelidir.

---

## 1. Kapsam İçi (Yapılacaklar)

### Faz 0 — Kurulum
- [x] Next.js + TypeScript + Tailwind projesi
- [x] ESLint, Prettier, Vitest, Playwright kurulumu
- [x] `src/data/teams.ts` — 30 takım, doğrulanmış
- [x] `config/season.ts` — sezon adı, kilit tarihi
- [x] **Vegas baremleri:** Veri Ajanı web araştırmasıyla 30 takımın baremini bulur → `2026-27.json` (kaynaklı, tarihli, otomatik doğrulanmış)
- [x] `docs/TASARIM.md` — görsel sistem (renkler, fontlar, bileşenler)
- [ ] Vercel'e ilk boş yayın

### Faz 1 — Hesapsız MVP (veritabanı yok)
- [x] **Power Ranking sayfası:** Batı ve Doğu ayrı ayrı, sürükle-bırak ile 1–15 sıralanır (1–30 tek liste yok)
- [x] **Alt/Üst sayfası:** her takım için çizgi göster, Alt veya Üst seç, 1–3 güven puanı ver; konferansa göre gruplu, sıra numarası konferans içi (1–15); Batı / Doğu / Tümü filtresi
- [x] **Projeksiyon girişi (opsiyonel):** her takıma 0–82 arası galibiyet tahmini
- [x] **Toplam galibiyet göstergesi:** projeksiyon toplamı / 1230, sapma uyarısı
- [x] **Tutarlılık uyarısı:** Kullanıcı aynı konferansta bir takımı üst sıraya koyup alt sıradaki takımdan belirgin düşük projeksiyon girdiyse nazikçe işaret et
- [x] Tahminler tarayıcıda (`localStorage`) saklanır
- [ ] **Paylaşım:** tahmin, URL içinde sıkıştırılmış olarak kodlanır → salt okunur paylaşım sayfası
- [x] **Özet sayfası:** istatistikler, uyarılar, konferans bazında tüm tahminler
- [x] **Resim olarak indirme:** tümü tek PNG, ya da yalnızca sıralama / yalnızca Alt/Üst (tarayıcıda canvas ile üretilir)
- [x] **Görünüm seçeneği:** takımlar konferansa (15 + 15) ya da gruplara/divizyonlara (6 × 5) göre listelenir; kullanıcı seçer, tercih tarayıcıda saklanır
- [ ] Görsel olarak paylaşılabilir özet kartı (Open Graph görseli)

### Faz 2 — Hesaplar ve Kalıcılık
- [ ] E-posta ile giriş (sihirli link)
- [ ] Tahminlerin veritabanına kaydı
- [ ] localStorage'daki tahmini hesaba aktarma
- [ ] Kilit zamanından sonra tahmin düzenlemenin **sunucu tarafında** engellenmesi
- [ ] Admin paneli: çizgileri girme / güncelleme (sadece kilitten önce)

### Faz 3 — Sezon Takibi ve Puanlama
- [ ] Günlük takım galibiyet/mağlubiyet güncellemesi (zamanlanmış görev)
- [ ] Her takım için "şu anki gidişat" (tempo): mevcut yüzde × 82
- [ ] Kullanıcının canlı puanı ve tahminlerinin durumu (tutuyor / tutmuyor / kesinleşti)
- [ ] Liderlik tablosu (genel + arkadaş grubu)
- [ ] Sezon sonu kesin puanlama

> Bir faz bitmeden bir sonrakine geçilmez. Her fazın sonunda çalışan, yayında bir site olmalı.

---

## 2. Kapsam Dışı (Yapılmayacaklar)

Bu liste bilinçli kararlardır. Buradaki bir şeyi eklemek için önce bu dosyada tartışılıp taşınması gerekir.

| Yapılmayacak | Neden |
|---|---|
| Gerçek para, ödeme, ödül | Bu bir tahmin oyunu, bahis sitesi değil. Hukuki risk |
| Bahis sitelerine link, reklam, affiliate | Aynı sebep |
| Oran (odds) gösterimi (-110, 1.91 vb.) | Sadece çizgi yeterli; oran bahis çağrışımı yapar |
| Canlı skor, maç maç takip | Ürünün amacı sezonluk tahmin; ayrıca veri maliyeti yüksek |
| Oyuncu istatistikleri, oyuncu bazlı tahmin | v1 sadece takım bazlı |
| Playoff / şampiyonluk / MVP tahmini | İleride ayrı özellik olabilir, v1'de yok |
| Resmi NBA / takım **fontları**, maskotlar, NBA lig logosu | Marka hakları. (Takım logoları kullanıcı kararıyla kapsam içine alındı: `public/logos/`, yalnızca takımı tanıtmak için, altbilgide marka notuyla) |
| Canlı sitenin bahis sitelerinden otomatik barem çekmesi (production scraping, cron ile bahis sitesi okuma) | Kullanım koşulları ihlali ve kırılgan. **İzin verilen:** geliştirme sırasında Veri Ajanı'nın spor medyası ve herkese açık sayfalarda web araştırması yapıp baremleri tek seferlik toplaması (bkz. `AGENTS.md`) |
| Barem geçmişi / barem hareketi grafiği | Sezon başı tek bir "konsensüs barem" yeterli |
| Kendi istatistiksel tahmin modelimiz ("site şunu diyor") | Kullanıcının fikri ön planda; model v1'de dikkat dağıtır |
| Yorum, mesajlaşma, sosyal akış | Moderasyon yükü |
| Mobil uygulama (native) | Bu bir web uygulaması; masaüstü öncelikli, duyarlı tasarım yeterli |
| Çoklu dil | Sadece Türkçe arayüz. Ama metinler `i18n` dosyasında toplandığı için ileride eklenebilir |

---

## 3. Dosya ve Klasör İskeleti

```
nba-tahmin/
├── CLAUDE.md                 # Proje bağlamı (AI için ana dosya)
├── ISKELET.md                # Bu dosya: sınırlar
├── AGENTS.md                 # Ajan düzeni
├── docs/
│   ├── TASARIM.md            # görsel sistem
│   └── barem-raporu-2026-27.md  # Veri Ajanı'nın araştırma raporu
├── config/
│   └── season.ts             # sezon adı, kilit tarihi, toplam maç
├── src/
│   ├── app/                  # Next.js App Router sayfaları
│   │   ├── page.tsx                  # Ana sayfa
│   │   ├── siralama/page.tsx         # Power Ranking
│   │   ├── alt-ust/page.tsx          # Alt/Üst + projeksiyon
│   │   ├── ozet/page.tsx             # Kullanıcının tahmin özeti
│   │   ├── paylas/[kod]/page.tsx     # Salt okunur paylaşım
│   │   ├── liderlik/page.tsx         # (Faz 3)
│   │   └── admin/                    # (Faz 2) çizgi girişi
│   ├── components/
│   │   ├── TeamBadge.tsx             # takım logosu rozeti
│   │   ├── RankingList.tsx           # sürükle-bırak liste
│   │   ├── OverUnderRow.tsx          # tek takım Alt/Üst satırı
│   │   ├── WinTotalMeter.tsx         # 1230 göstergesi
│   │   └── ...
│   ├── lib/                  # SAF iş mantığı, React yok
│   │   ├── scoring.ts                # puanlama
│   │   ├── validation.ts             # Zod şemaları
│   │   ├── consistency.ts            # sıralama ↔ projeksiyon tutarlılığı
│   │   ├── share-codec.ts            # tahmin ↔ URL kodlama
│   │   └── lock.ts                   # kilit zamanı kontrolü
│   ├── data/
│   │   ├── teams.ts                  # 30 takım (tek kaynak)
│   │   └── lines/
│   │       ├── 2026-27.json          # gerçek çizgiler (Veri Ajanı araştırır; Faz 2'de admin günceller)
│   │       └── 2026-27.sample.json   # örnek veri — sadece testlerde kullanılır
│   ├── i18n/
│   │   └── tr.ts                     # tüm Türkçe arayüz metinleri
│   └── styles/
├── tests/
│   ├── unit/                 # Vitest — lib/ için
│   └── e2e/                  # Playwright — kullanıcı akışları
└── public/
```

---

## 4. Veri Kuralları (Değişmez Sınırlar)

| Alan | Kural |
|---|---|
| `ranking` | Konferans başına bir liste (`West`, `East`); her biri tam 15 eleman, o konferansın her takımı bir kez |
| `line` | 0 ile 82 arası, `.5` veya tam sayı (kaynakta nasıl yazıyorsa) |
| `sources` | En az 2 bağımsız kaynak; her birinde URL + `retrievedAt` zorunlu |
| Kaynak farkı | Kaynaklar arasında 1 galibiyetten fazla fark varsa takım `needsReview` olarak işaretlenir |
| Barem toplamı | 30 baremin toplamı genelde 1230 civarındadır; 1210–1250 dışındaysa Veri Ajanı uyarı verir (muhtemelen hatalı veri) |
| Barem kilidi | Baremler Kilit tarihinde dondurulur; sezon içinde değişmez |
| `side` | Sadece `"over"` veya `"under"` |
| `confidence` | Sadece `1`, `2`, `3` |
| `projectedWins` | 0–82 arası tam sayı, opsiyonel |
| Projeksiyon toplamı | 1230'dan ±30'dan fazla saparsa **uyarı**, engel değil |
| Alt/Üst ↔ projeksiyon çelişkisi | Kullanıcı "Üst" seçip çizginin altında projeksiyon girerse **uyarı** |
| Kilit sonrası | Hiçbir tahmin alanı değiştirilemez (Faz 2'den itibaren sunucu tarafında zorunlu) |
| Güven puanı dağılımı | Sınır yok; kullanıcı istediği kadar 3 yıldız verebilir (v1 kararı) |

---

## 5. Kullanıcı Akışı (Faz 1)

```
Ana sayfa
   │  "Tahminine başla"
   ▼
Power Ranking (Batı 1→15, Doğu 1→15 sürükle-bırak)
   │  "Devam"
   ▼
Alt / Üst (konferans başına 15 satır, sıralama sırasıyla listelenir)
   │  ├─ her satır: çizgi · Alt | Üst · ★★★ · [projeksiyon]
   │  └─ üstte sabit: Toplam galibiyet göstergesi
   │  "Özeti gör"
   ▼
Özet (uyarılar + paylaşım linki + paylaşım kartı)
```

Kullanıcı Alt/Üst sayfasına sıralama yapmadan da girebilir; o durumda takımlar alfabetik listelenir.

---

## 6. Kalite Sınırları (Kabul Kriterleri)

- Lighthouse masaüstü performans ≥ 90
- İlk yükleme JS paketi mümkün olduğunca küçük; sürükle-bırak kütüphanesi sadece sıralama sayfasında yüklenir
- `src/lib/` birim test kapsamı ≥ %90, `scoring.ts` %100
- Sürükle-bırak: fare, dokunmatik ve klavye ile çalışır
- Ana hedef 1280–1440 px; 768 px'e kadar yatay kaydırma olmadan kullanılabilir
- Tüm Türkçe karakterler (ç, ğ, ı, İ, ö, ş, ü) doğru görünür ve arama/sıralamada doğru davranır (`localeCompare(..., "tr")`)

---

## 7. Açık Kararlar (Henüz Netleşmedi)

Bunlar karara bağlanınca bu bölümden çıkarılıp yukarıya taşınır.

- Veritabanı: Supabase mı Neon mu?
- Sezon sonu gerçek sonuçlar hangi kaynaktan, hangi yolla (elle mi, API mi) alınacak?
- Liderlik tablosunda sıralama ağırlıkları: Alt/Üst puanı ile Power Ranking hatası nasıl tek skora dönüşecek?
- Lig 30 takımdan fazlasına genişlerse (`teams.ts` ve 1230 sabiti) nasıl ele alınacak — sabitler şimdiden `config/season.ts` üzerinden türetilmeli.
