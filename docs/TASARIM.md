# TASARIM.md — Görsel Sistem

Bu dosya sitenin görsel dilini tanımlar. Kaynağı, proje klasöründeki `NBA Sezon Öncesi Tahmin.html` prototipidir (Alt/Üst ekranı, 1440 px). Token'ların koddaki karşılığı `src/app/globals.css` içindeki `@theme` bloğudur; renk veya font değeri bileşen içine elle yazılmaz.

## 1. İlkeler

- **Masaüstü öncelikli.** Tasarım 1280–1440 px'e göre yapılır; 768 px'e kadar yatay kaydırma olmadan çalışır.
- **Tek tema: koyu.** Açık tema v1'de yok. Takım renk rozetleri koyu zeminde en iyi okunuyor.
- **Skorbord hissi, bahis hissi değil.** Büyük, dar, kalın rakamlar; oran, kupon, "kazan" dili yok.
- **Renk tek başına anlam taşımaz.** Alt/Üst her zaman renk + yazı + ok simgesiyle, uyarılar renk + simge + metinle gösterilir.
- **Takımlar gerçek logolarıyla gösterilir.** Resmi NBA fontu, maskot ve lig logosu kullanılmaz; altbilgide marka notu bulunur.

## 2. Renkler

| Token (Tailwind)      | Değer                 | Kullanım                                                   |
| --------------------- | --------------------- | ---------------------------------------------------------- |
| `bg`                  | `#070B14`             | Sayfa zemini                                               |
| `surface`             | `#0A0F1B`             | Tablo / kart gövdesi                                       |
| `surface-raised`      | `#0D1322`             | Tablo başlığı, sekme zemini, gösterge kartı                |
| `surface-active`      | `#131B2D`             | Aktif adım, ilerleme çubuğu zemini                         |
| `border`              | `#1E2840`             | Varsayılan çizgi                                           |
| `border-strong`       | `#2A3654`             | Düğme ve giriş kenarlığı                                   |
| `ink`                 | `#EEF2F8`             | Ana metin; birincil düğme zemini                           |
| `ink-soft`            | `#B4BFD2`             | Açıklama metni                                             |
| `ink-muted`           | `#8D9AB2`             | Etiket, üst başlık                                         |
| `ink-faint`           | `#6E7C98`             | Sıra numarası, yer tutucu — yalnızca büyük/dekoratif metin |
| `over` / `over-ink`   | `#FF8A3D` / `#1C0D02` | **Üst** (turuncu zemin, koyu yazı)                         |
| `under` / `under-ink` | `#5AAEFF` / `#03111F` | **Alt** (mavi zemin, koyu yazı)                            |
| `warn` / `warn-ink`   | `#FFD447` / `#1A1400` | Uyarı (1230 sapması, tutarsız seçim)                       |

Seçili satır zemini: Üst `rgba(255,138,61,0.05)`, Alt `rgba(90,174,255,0.05)`. Uyarı kutusu: zemin `rgba(255,212,71,0.08)`, kenarlık `rgba(255,212,71,0.4)`, metin `#F3E7B8`.

Kontrast (zemin `#070B14` üzerinde): `ink` ≈ 17:1, `ink-soft` ≈ 10:1, `ink-muted` ≈ 6.6:1 — hepsi WCAG AA. `ink-faint` ≈ 4.4:1 olduğu için gövde metninde kullanılmaz.

### Takım renkleri ve logoları

`src/data/teams.ts` → `colors.primary` / `colors.secondary`. Logolar `public/logos/` altında 160 × 160 saydam PNG olarak durur ve yalnızca `TeamBadge` üzerinden gösterilir. Logolar açık zemin için tasarlandığından rozet zemini her zaman `ink` rengidir; koyu zemine doğrudan logo konmaz.

## 3. Tipografi

| Rol                          | Font                                  | Ağırlık         | Not                                      |
| ---------------------------- | ------------------------------------- | --------------- | ---------------------------------------- |
| Başlık, rakam, düğme, etiket | **Barlow Condensed** (`font-display`) | 600 / 700 / 800 | BÜYÜK HARF, `letter-spacing` 0.03–0.08em |
| Gövde                        | **Inter** (`font-sans`)               | 400 / 500 / 600 |                                          |

- İkisi de açık lisanslı (OFL) Google fontu; `next/font` ile `latin` + `latin-ext` alt kümeleri yüklenir (ğ, ı, İ, ş için şart).
- Rakamlar her zaman `tabular-nums`.
- Büyük harfli metinler `tr.ts` içinde büyük harfle yazılır (İ/I ayrımı CSS'e bırakılmaz).

| Ölçek         | Boyut                           | Kullanım          |
| ------------- | ------------------------------- | ----------------- |
| Sayfa başlığı | 96 px / 0.9 (dar ekranda 72 px) | `ALT / ÜST`       |
| Büyük rakam   | 60 px                           | Toplam galibiyet  |
| Barem         | 38 px                           | Satırdaki çizgi   |
| Bölüm başlığı | 36 px                           | `BATI KONFERANSI` |
| Takım adı     | 24 px                           |                   |
| Düğme         | 18–20 px                        |                   |
| Gövde         | 14–17 px / 1.5                  |                   |
| Üst etiket    | 12–13 px, 600, 0.14em           | `ADIM 2 / 3`      |

## 4. Yerleşim

- Tuval en fazla **1440 px**, ortalanır. Yan boşluk ≥ 1024 px'de **120 px**, altında **24 px**.
- Üst çubuk 72 px: solda sezon rozeti + ad, ortada adımlar (`01 SIRALAMA · 02 ALT / ÜST · 03 ÖZET`), sağda kilit bilgisi.
- Köşe yarıçapı: kart/tablo 16 px, düğme/giriş 10–12 px, rozet 12 px, hap 999 px.
- Tıklanabilir hedefler en az 44 × 44 px.
- Alt/Üst tablosu sütunları (1440 px): `56px · 1fr · 112px · 212px · 152px · 104px`, sütun aralığı 24 px, satır 76 px.

## 5. Bileşenler

| Bileşen             | Tanım                                                                                                                                                 | Durum   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `TeamBadge`         | 48 × 48, yarıçap 12, açık (`ink`) zemin, 2 px takım `primary` kenarlık, içinde 38 px logo. `role="img"` + tam takım adı                               | Faz 0 ✓ |
| Sezon rozeti        | `ink` zemin, `bg` yazı, "26–27"                                                                                                                       | Faz 0 ✓ |
| `OverUnderRow`      | Sıra · rozet + şehir/ad · barem · `ALT` \| `ÜST` düğmeleri (`aria-pressed`) · 3 yıldız · projeksiyon girişi (0–82) · gerekirse satır altı uyarı       | Faz 1   |
| `WinTotalMeter`     | Yapışkan kart: `toplam / 1230` + fark çipi, ±30 ölçeği ve işaretçi, durum başlığı (`DENGEDE` / `SAPMA YÜKSEK`). `role="status"`, `aria-live="polite"` | Faz 1   |
| `RankingList`       | Sürükle-bırak liste; fare, klavye ve dokunmatik                                                                                                       | Faz 1   |
| Konferans sekmeleri | `BATI · DOĞU · TÜMÜ`, `role="tablist"`; seçili sekme `ink` zemin                                                                                      | Faz 1   |
| Düğmeler            | Birincil: `ink` zemin, `bg` yazı, 52 px. İkincil: saydam, `border-strong` kenarlık                                                                    | Faz 1   |

## 6. Erişilebilirlik

- Odak halkası: 2 px `ink`, 2 px boşluk (`:focus-visible`), hiçbir bileşende kaldırılmaz.
- Simge içeren düğmelerde simge `aria-hidden`, anlam metinde.
- Türkçe sıralama ve arama `localeCompare(..., "tr")` ile yapılır; `<html lang="tr">`.
- Tarih ve saat Türkiye saatiyle gösterilir, `<time dateTime>` UTC değerini taşır.

## 7. Dil ve ton

- Sen dili, kısa ve net: "Tahminine başla", "Özete geç".
- Kullanılmayacak sözcükler: oran, kupon, bahis yap, kazan, yatır.
- "Barem" = takımın galibiyet çizgisi. "Alt / Üst" her zaman bu yazımla.
