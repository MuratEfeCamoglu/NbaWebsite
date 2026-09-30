# Barem Raporu — 2026-27

Veri Ajanı tarafından `AGENTS.md` → "Barem Araştırma Protokolü"ne göre hazırlandı.

- **Erişim tarihi (`retrievedAt`):** 2026-09-30
- **Çıktı:** `src/data/lines/2026-27.json`
- **Sezon doğrulaması:** Üç kaynağın da başlığında "2026-27" / "2026/27" geçiyor.
- Oranlar (−110 vb.) protokol gereği kaydedilmedi.

## Kaynaklar

| #   | Kaynak                                     | Bahis şirketi                                              | Yayın tarihi           | Kapsam                         | URL                                                                                                                                                                      |
| --- | ------------------------------------------ | ---------------------------------------------------------- | ---------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| M   | BetMGM Blog                                | BetMGM                                                     | 2026-09-23             | 30 takım                       | https://sports.betmgm.com/en/blog/nba/nba-odds-predictions-season-win-totals-bm23/                                                                                       |
| B   | The Sporting News (Yahoo Sports üzerinden) | FanDuel                                                    | 2026-07-29             | 30 takım                       | https://sports.yahoo.com/articles/nba-over-under-predictions-win-121446599.html                                                                                          |
| C   | Hoops Rumors                               | BetMGM / BetOnline (hangi barem hangisinden belirtilmiyor) | 2026-09-25, 2026-09-29 | 10 takım (Atlantic, Northwest) | https://www.hoopsrumors.com/2026/09/2026-27-nba-over-unders-atlantic-division.html · https://www.hoopsrumors.com/2026/09/2026-27-nba-over-unders-northwest-division.html |

Sayfaların ham HTML'i indirilip baremler metinden betikle ayıklandı; elle yazılan ya da hafızadan gelen barem yok.

## Barem kuralı

Kullanıcı talimatıyla **sitedeki barem = BetMGM Blog'daki tablo değeri** (23 Eylül 2026). Diğer kaynaklar yalnızca çapraz kontrol içindir; BetMGM ile aralarında 1 galibiyetten fazla fark varsa takım `needsReview: true` olarak işaretlenir. İlk sürümde BetMGM sayfasına erişilememişti ve Temmuz tarihli Yahoo/BetMGM listesi kullanılmıştı; o kaynak aynı şirketin eski hâli olduğu için çıkarıldı.

BetMGM sayfasının alt kısmındaki "Win Total Prediction" listesinde bazı takımlar için tablodan farklı (eski) rakamlar var; esas alınan üstteki tablodur.

## Baremler

| Takım | Barem (BetMGM, 23 Eyl) | B · FanDuel (29 Tem) | C · Hoops Rumors (Eyl) | Fark | Not             |
| ----- | ---------------------- | -------------------- | ---------------------- | ---- | --------------- |
| ATL   | **43.5**               | 44.5                 | —                      | 1.0  |                 |
| BKN   | **24.5**               | 24.5                 | 24.5                   | 0.0  |                 |
| BOS   | **51.5**               | 49.5                 | 51.5                   | 2.0  | **needsReview** |
| CHA   | **39.5**               | 37.5                 | —                      | 2.0  | **needsReview** |
| CHI   | **29.5**               | 29.5                 | —                      | 0.0  |                 |
| CLE   | **47.5**               | 47.5                 | —                      | 0.0  |                 |
| DAL   | **34.5**               | 35.5                 | —                      | 1.0  |                 |
| DEN   | **49.5**               | 48.5                 | 49.5                   | 1.0  |                 |
| DET   | **49.5**               | 49.5                 | —                      | 0.0  |                 |
| GSW   | **40.5**               | 39.5                 | —                      | 1.0  |                 |
| HOU   | **47.5**               | 46.5                 | —                      | 1.0  |                 |
| IND   | **44.5**               | 43.5                 | —                      | 1.0  |                 |
| LAC   | **30.5**               | 28.5                 | —                      | 2.0  | **needsReview** |
| LAL   | **46.5**               | 45.5                 | —                      | 1.0  |                 |
| MEM   | **29.5**               | 28.5                 | —                      | 1.0  |                 |
| MIA   | **46.5**               | 45.5                 | —                      | 1.0  |                 |
| MIL   | **25.5**               | 24.5                 | —                      | 1.0  |                 |
| MIN   | **48.5**               | 48.5                 | 48.5                   | 0.0  |                 |
| NOP   | **27.5**               | 28.5                 | —                      | 1.0  |                 |
| NYK   | **52.5**               | 51.5                 | 52.5                   | 1.0  |                 |
| OKC   | **62.5**               | 60.5                 | 62.5                   | 2.0  | **needsReview** |
| ORL   | **43.5**               | 44.5                 | —                      | 1.0  |                 |
| PHI   | **50.5**               | 50.5                 | 50.5                   | 0.0  |                 |
| PHX   | **40.5**               | 39.5                 | —                      | 1.0  |                 |
| POR   | **42.5**               | 43.5                 | 41.5                   | 2.0  | **needsReview** |
| SAC   | **21.5**               | 21.5                 | —                      | 0.0  |                 |
| SAS   | **59.5**               | 60.5                 | —                      | 1.0  |                 |
| TOR   | **45.5**               | 45.5                 | 46.5                   | 1.0  |                 |
| UTA   | **37.5**               | 36.5                 | 38.5                   | 2.0  | **needsReview** |
| WAS   | **34.5**               | 35.5                 | —                      | 1.0  |                 |

## Toplam kontrolü

- **Toplam: 1247.0** — beklenen aralık 1210–1250 → **geçti** (1230'dan +17.0).
- Kaynak B (FanDuel, Temmuz) toplamı: 1235.0

## needsReview (6 takım)

| Takım | Barem | Kaynak değerleri                               | Neden                              |
| ----- | ----- | ---------------------------------------------- | ---------------------------------- |
| BOS   | 51.5  | BetMGM 51.5 · FanDuel 49.5 · Hoops Rumors 51.5 | Kaynaklar arası fark 2.0 galibiyet |
| CHA   | 39.5  | BetMGM 39.5 · FanDuel 37.5                     | Kaynaklar arası fark 2.0 galibiyet |
| LAC   | 30.5  | BetMGM 30.5 · FanDuel 28.5                     | Kaynaklar arası fark 2.0 galibiyet |
| OKC   | 62.5  | BetMGM 62.5 · FanDuel 60.5 · Hoops Rumors 62.5 | Kaynaklar arası fark 2.0 galibiyet |
| POR   | 42.5  | BetMGM 42.5 · FanDuel 43.5 · Hoops Rumors 41.5 | Kaynaklar arası fark 2.0 galibiyet |
| UTA   | 37.5  | BetMGM 37.5 · FanDuel 36.5 · Hoops Rumors 38.5 | Kaynaklar arası fark 2.0 galibiyet |

## TODO (baremi bulunamayan takım)

Yok — 30 takımın 30'unda barem var.

## Sınırlamalar

- İkinci bağımsız kaynak (FanDuel) Temmuz sonu tarihli; `needsReview` farklarının çoğu iki ay içindeki barem hareketinden geliyor olabilir.
- Baremler sezon başlayana kadar oynar. Kilit tarihinden (20 Ekim 2026, 22:00 TSİ) kısa süre önce BetMGM tablosu bir kez daha kontrol edilmeli.
