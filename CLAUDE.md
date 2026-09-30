# CLAUDE.md — NBA Sezon Öncesi Tahmin Sitesi

Bu dosya, projede çalışan Claude (veya başka bir AI asistanı) için ana bağlam dosyasıdır. Her oturumun başında okunmalıdır. Projenin **sınırları** için `ISKELET.md`, **ajan düzeni ve görev dağılımı** için `AGENTS.md` dosyasına bak.

---

## 1. Proje Ne?

NBA sezonu başlamadan önce kullanıcıların:

1. **30 takımı sıralamasını** (Power Ranking — 1'den 30'a, sürükle-bırak),
2. Her takım için belirlenmiş **galibiyet çizgisine (win total line)** karşı **Alt / Üst** tahmini yapmasını,
3. İsterse her takım için **kendi galibiyet tahminini** (0–82) girmesini

sağlayan bir web sitesi. Sezon ilerledikçe tahminler gerçek sonuçlarla karşılaştırılır ve puanlanır.

**Tek cümlede:** "Sezon başlamadan fikrini kaydet, sezon bitince kim haklıymış görelim."

### Hedef sezon
- **2026-27 NBA sezonu** (normal sezon Ekim 2026 sonunda başlar).
- Sezon değeri kodda sabit yazılmaz; `config/season.ts` içinden okunur ki proje sonraki sezonlarda yeniden kullanılabilsin.

### Bu proje bir bahis sitesi DEĞİLDİR
- Gerçek para, kupon, oran, ödeme yoktur ve olmayacaktır.
- "Alt/Üst" sadece bir tahmin oyunu formatıdır.
- Arayüzde bahis sitelerine link, reklam veya yönlendirme bulunmaz.

---

## 2. Temel Kavramlar (Sözlük)

| Terim | Anlamı |
|---|---|
| **Power Ranking** | Kullanıcının 30 takımı en iyiden en kötüye dizdiği liste |
| **Çizgi / Vegas Baremi (Line)** | Las Vegas ve ABD spor bahis şirketlerinin sezon öncesi açıkladığı galibiyet baremi, örn. `47.5`. Sitedeki tüm Alt/Üst tahminleri bu baremlere karşı yapılır. Tam sayı barem gelirse (örn. `47`) kaynakta nasıl yazıyorsa öyle saklanır ve berabere (push) durumu puanlamada `0` puan sayılır |
| **Alt / Üst (Under / Over)** | Takımın sezonu çizginin altında mı üstünde mi bitireceği tahmini |
| **Güven (Confidence)** | Kullanıcının bir Alt/Üst tahminine verdiği önem: 1, 2 veya 3 yıldız |
| **Projeksiyon** | Kullanıcının takım için girdiği tam sayı galibiyet tahmini (0–82) |
| **Kilit (Lock)** | Sezonun ilk maçı başladığı an. Bu andan sonra tahmin değiştirilemez |

### Değişmez matematik kuralları
- Her takım **82** maç oynar.
- Ligdeki toplam galibiyet = toplam mağlubiyet = **30 × 82 / 2 = 1230**.
- Ortalama takım **41** galibiyet alır.
- Kullanıcının projeksiyonlarının toplamı 1230'dan çok saparsa arayüz **uyarı** gösterir (engellemez). Bu, sitenin en önemli "akıl sağlığı" özelliğidir.

---

## 3. Teknoloji Yığını

| Katman | Seçim | Not |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | `strict: true` zorunlu |
| Stil | **Tailwind CSS** | Takım renkleri CSS değişkeni olarak |
| Sürükle-bırak | `@dnd-kit/core` + `@dnd-kit/sortable` | Fare ve klavye öncelikli; dokunmatik de çalışmalı |
| Veritabanı (Faz 2+) | **Postgres** (Supabase veya Neon) | Faz 1'de veritabanı yok |
| Kimlik doğrulama (Faz 2+) | Supabase Auth veya Auth.js | E-posta sihirli link yeterli |
| Doğrulama | **Zod** | Tüm dış girdi Zod şemasından geçer |
| Test | **Vitest** (birim), **Playwright** (uçtan uca) | |
| Yayın | **Vercel** | |

Yeni bir bağımlılık eklemeden önce gerçekten gerekli olup olmadığını düşün ve PR açıklamasında gerekçesini yaz.

---

## 4. Komutlar

```bash
npm install          # bağımlılıklar
npm run dev          # geliştirme sunucusu (http://localhost:3000)
npm run build        # production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test         # Vitest
npm run test:e2e     # Playwright
```

Bir görevi "bitti" saymadan önce **mutlaka** şunlar geçmeli: `lint`, `typecheck`, `test`.

---

## 5. Kod Kuralları

1. **İş mantığı saf fonksiyonlarda yaşar.** Puanlama, toplam galibiyet kontrolü, sıralama karşılaştırması `src/lib/` altında, React'tan bağımsız ve test edilmiş olmalı.
2. **Takım verisi tek kaynaktan gelir:** `src/data/teams.ts`. Takım adı, kısaltma veya renk başka yerde elle yazılmaz.
3. **Takımlar kısaltma ile tanımlanır** (`BOS`, `LAL`, `OKC`...). ID olarak şehir veya isim kullanma; takımlar taşınabilir veya isim değiştirebilir.
4. **Çizgiler veri, kod değil.** `src/data/lines/2026-27.json` içinde tutulur.
5. **Türkçe arayüz, İngilizce kod.** Değişken, fonksiyon, dosya adları İngilizce; kullanıcıya görünen metinler Türkçe ve `src/i18n/tr.ts` içinde toplanır.
6. **Tarih ve saat** her zaman UTC olarak saklanır, kullanıcıya Türkiye saatiyle (Europe/Istanbul) gösterilir.
7. **Erişilebilirlik:** Sürükle-bırak listesi klavyeyle de sıralanabilmeli. Renk tek başına anlam taşımamalı (Alt/Üst hem renk hem yazıyla gösterilir).
8. **Masaüstü öncelikli web uygulaması.** Tasarım kararları 1280–1440 px tarayıcı genişliğine göre verilir. Daha dar ekranlarda (tablet, telefon) bozulmadan çalışmalı ama ana hedef masaüstüdür.

---

## 6. Veri Modeli (Özet)

```ts
type TeamId = string; // "BOS", "LAL" ...

interface Team {
  id: TeamId;
  city: string;          // "Boston"
  name: string;          // "Celtics"
  conference: "East" | "West";
  division: string;
  colors: { primary: string; secondary: string };
}

interface WinLine {
  teamId: TeamId;
  season: string;        // "2026-27"
  line: number;          // 47.5 — konsensüs Vegas baremi
  sources: {
    name: string;        // "ESPN", "Action Network" ...
    book?: string;       // "DraftKings", "FanDuel", "BetMGM", "Caesars", "Westgate"
    url: string;
    line: number;        // bu kaynaktaki barem
    publishedAt?: string; // ISO tarih — kaynağın yayın tarihi (en yeni baremi seçmek için)
    retrievedAt: string; // ISO tarih — baremler zamanla oynar
  }[];                   // en az 2 bağımsız kaynak
  needsReview?: boolean; // kaynaklar çelişiyorsa true
}

interface Prediction {
  userId: string;
  season: string;
  ranking: TeamId[];                         // uzunluk tam 30, tekrar yok
  picks: Record<TeamId, {
    side: "over" | "under";
    confidence: 1 | 2 | 3;
    projectedWins?: number;                  // 0–82 tam sayı
  }>;
  lockedAt?: string;                         // ISO tarih
}
```

Ayrıntılı sınırlar ve alan kuralları `ISKELET.md` içinde.

---

## 7. Puanlama (Sezon Sonu)

- **Alt/Üst:** Doğru tahmin = `confidence` puanı (1–3). Yanlış = `0`. Berabere (tam sayı baremde takım tam o sayıda galibiyet alırsa) = `0`.
- **Power Ranking:** Kullanıcının sıralaması ile gerçek sıralama arasındaki mutlak farkların toplamı. **Düşük daha iyi.** Eşit galibiyette gerçek sıralama NBA eşitlik kuralları yerine basitçe galibiyet yüzdesi + takım kısaltması alfabetik ile belirlenir (tutarlı ve öngörülebilir olsun diye).
- **Projeksiyon:** Ortalama mutlak hata (MAE). Düşük daha iyi.

Puanlama fonksiyonlarının tamamı `src/lib/scoring.ts` içindedir ve %100 birim test kapsamına sahip olmalıdır.

---

## 8. Claude İçin Çalışma Talimatları

- **Kullanıcıdan izin veya onay bekleme.** Büyük bir değişiklikten önce kısa bir plan yaz ve hemen uygula. Belirsiz noktalarda en makul kararı ver, kararı rapora yaz, devam et.
- `ISKELET.md` içindeki "Kapsam Dışı" listesinde olan bir şeyi **önerme ve yapma**. Kullanıcı açıkça isterse önce `ISKELET.md` güncellenmeli.
- Vegas baremlerini **web araştırmasıyla kendin bul**, ama `AGENTS.md` → Veri Ajanı → "Barem Araştırma Protokolü"ne birebir uy: en az 2 bağımsız kaynak, her kaynağın URL'si ve tarihi, otomatik doğrulama kontrolleri. Hafızadan veya tahminle barem yazma. Bulamadığın takımı `TODO` bırak.
- Resmi NBA veya takım logosu, yazı tipi, maskot kullanma. Takımlar kısaltma + renk rozetiyle gösterilir.
- Bir görev birden fazla alana dokunuyorsa `AGENTS.md` içindeki ajan dağılımına göre çalış.
- Her tamamlanan iş sonunda: ne yapıldı, hangi dosyalar değişti, hangi testler eklendi — kısa özet ver.
