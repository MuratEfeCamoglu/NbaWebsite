# Barem Raporu — 2026-27

Veri Ajanı tarafından `AGENTS.md` → "Barem Araştırma Protokolü"ne göre hazırlandı.

- **Erişim tarihi (`retrievedAt`):** 2026-09-30
- **Çıktı:** `src/data/lines/2026-27.json`
- **Sezon doğrulaması:** Üç kaynağın da başlığında "2026-27" / "2026/27" geçiyor; yayın tarihleri Temmuz–Eylül 2026.
- Oranlar (−110 vb.) protokol gereği kaydedilmedi.

## Kaynaklar

| #   | Kaynak                                     | Bahis şirketi                                              | Yayın tarihi           | Kapsam                         | URL                                                                                                                                                                      |
| --- | ------------------------------------------ | ---------------------------------------------------------- | ---------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A   | Yahoo Sports                               | BetMGM                                                     | 2026-07-28             | 30 takım                       | https://sports.yahoo.com/nba/betting/article/2026-27-nba-overunders-odds-san-antonio-spurs-have-their-highest-win-total-in-over-30-years-144456844.html                  |
| B   | The Sporting News (Yahoo Sports üzerinden) | FanDuel                                                    | 2026-07-29             | 30 takım                       | https://sports.yahoo.com/articles/nba-over-under-predictions-win-121446599.html                                                                                          |
| C   | Hoops Rumors                               | BetMGM / BetOnline (hangi barem hangisinden belirtilmiyor) | 2026-09-25, 2026-09-29 | 10 takım (Atlantic, Northwest) | https://www.hoopsrumors.com/2026/09/2026-27-nba-over-unders-atlantic-division.html · https://www.hoopsrumors.com/2026/09/2026-27-nba-over-unders-northwest-division.html |

Her takımın en az iki **bağımsız** kaynağı var: A (BetMGM) ve B (FanDuel). C kaynağı BetMGM'i de içerdiği için A'dan tam bağımsız sayılmadı; yalnızca "en güncel değer" göstergesi olarak kullanıldı.

Sayfaların ham HTML'i indirilip baremler metinden betikle ayıklandı; elle yazılan ya da hafızadan gelen barem yok.

## Konsensüs kuralı

1. Kaynaklar aynıysa o değer.
2. Eylül tarihli kaynak (C) varsa o değer — Temmuz kaynaklarından iki ay yeni ve baremler oynadı.
3. Yoksa ve A ile B farklıysa en yeni tarihli kaynak (B, 29 Temmuz).
4. Kaynaklar arasında 1 galibiyetten fazla fark varsa `needsReview: true`.

## Baremler

| Takım | Konsensüs | A · BetMGM (28 Tem) | B · FanDuel (29 Tem) | C · Hoops Rumors (Eyl) | Fark | Not                                                               |
| ----- | --------- | ------------------- | -------------------- | ---------------------- | ---- | ----------------------------------------------------------------- |
| ATL   | **44.5**  | 43.5                | 44.5                 | —                      | 1.0  | A ≠ B; en yeni tarihli kaynak (FanDuel, 29 Tem)                   |
| BKN   | **24.5**  | 22.5                | 24.5                 | 24.5                   | 2.0  | En yeni kaynak (Hoops Rumors, Eylül) · **needsReview**            |
| BOS   | **51.5**  | 51.5                | 49.5                 | 51.5                   | 2.0  | En yeni kaynak (Hoops Rumors, Eylül) · **needsReview**            |
| CHA   | **37.5**  | 37.5                | 37.5                 | —                      | 0.0  | Kaynaklar aynı                                                    |
| CHI   | **29.5**  | 27.5                | 29.5                 | —                      | 2.0  | A ≠ B; en yeni tarihli kaynak (FanDuel, 29 Tem) · **needsReview** |
| CLE   | **47.5**  | 47.5                | 47.5                 | —                      | 0.0  | Kaynaklar aynı                                                    |
| DAL   | **35.5**  | 34.5                | 35.5                 | —                      | 1.0  | A ≠ B; en yeni tarihli kaynak (FanDuel, 29 Tem)                   |
| DEN   | **49.5**  | 49.5                | 48.5                 | 49.5                   | 1.0  | En yeni kaynak (Hoops Rumors, Eylül)                              |
| DET   | **49.5**  | 50.5                | 49.5                 | —                      | 1.0  | A ≠ B; en yeni tarihli kaynak (FanDuel, 29 Tem)                   |
| GSW   | **39.5**  | 40.5                | 39.5                 | —                      | 1.0  | A ≠ B; en yeni tarihli kaynak (FanDuel, 29 Tem)                   |
| HOU   | **46.5**  | 47.5                | 46.5                 | —                      | 1.0  | A ≠ B; en yeni tarihli kaynak (FanDuel, 29 Tem)                   |
| IND   | **43.5**  | 44.5                | 43.5                 | —                      | 1.0  | A ≠ B; en yeni tarihli kaynak (FanDuel, 29 Tem)                   |
| LAC   | **28.5**  | 28.5                | 28.5                 | —                      | 0.0  | Kaynaklar aynı                                                    |
| LAL   | **45.5**  | 45.5                | 45.5                 | —                      | 0.0  | Kaynaklar aynı                                                    |
| MEM   | **28.5**  | 28.5                | 28.5                 | —                      | 0.0  | Kaynaklar aynı                                                    |
| MIA   | **45.5**  | 46.5                | 45.5                 | —                      | 1.0  | A ≠ B; en yeni tarihli kaynak (FanDuel, 29 Tem)                   |
| MIL   | **24.5**  | 26.5                | 24.5                 | —                      | 2.0  | A ≠ B; en yeni tarihli kaynak (FanDuel, 29 Tem) · **needsReview** |
| MIN   | **48.5**  | 49.5                | 48.5                 | 48.5                   | 1.0  | En yeni kaynak (Hoops Rumors, Eylül)                              |
| NOP   | **28.5**  | 29.5                | 28.5                 | —                      | 1.0  | A ≠ B; en yeni tarihli kaynak (FanDuel, 29 Tem)                   |
| NYK   | **52.5**  | 52.5                | 51.5                 | 52.5                   | 1.0  | En yeni kaynak (Hoops Rumors, Eylül)                              |
| OKC   | **62.5**  | 60.5                | 60.5                 | 62.5                   | 2.0  | En yeni kaynak (Hoops Rumors, Eylül) · **needsReview**            |
| ORL   | **44.5**  | 43.5                | 44.5                 | —                      | 1.0  | A ≠ B; en yeni tarihli kaynak (FanDuel, 29 Tem)                   |
| PHI   | **50.5**  | 50.5                | 50.5                 | 50.5                   | 0.0  | En yeni kaynak (Hoops Rumors, Eylül)                              |
| PHX   | **39.5**  | 38.5                | 39.5                 | —                      | 1.0  | A ≠ B; en yeni tarihli kaynak (FanDuel, 29 Tem)                   |
| POR   | **41.5**  | 43.5                | 43.5                 | 41.5                   | 2.0  | En yeni kaynak (Hoops Rumors, Eylül) · **needsReview**            |
| SAC   | **21.5**  | 21.5                | 21.5                 | —                      | 0.0  | Kaynaklar aynı                                                    |
| SAS   | **60.5**  | 59.5                | 60.5                 | —                      | 1.0  | A ≠ B; en yeni tarihli kaynak (FanDuel, 29 Tem)                   |
| TOR   | **46.5**  | 45.5                | 45.5                 | 46.5                   | 1.0  | En yeni kaynak (Hoops Rumors, Eylül)                              |
| UTA   | **38.5**  | 35.5                | 36.5                 | 38.5                   | 3.0  | En yeni kaynak (Hoops Rumors, Eylül) · **needsReview**            |
| WAS   | **35.5**  | 35.5                | 35.5                 | —                      | 0.0  | Kaynaklar aynı                                                    |

## Toplam kontrolü

- **Konsensüs toplamı: 1242.0** — beklenen aralık 1215–1245 → **geçti** (1230'dan +12.0).
- Kaynak A toplamı: 1238.0 · Kaynak B toplamı: 1235.0
- Toplam aralığın üst sınırına yakın. Sebep: 10 takımda Eylül değeri, 20 takımda Temmuz değeri kullanıldı; Eylül'de yükselen baremlerin (OKC, UTA) karşılığı olan düşüşler henüz diğer takımlara yansımamış olabilir.

## needsReview (7 takım)

| Takım | Konsensüs | Kaynak değerleri         | Neden                              |
| ----- | --------- | ------------------------ | ---------------------------------- |
| BKN   | 24.5      | A 22.5 · B 24.5 · C 24.5 | Kaynaklar arası fark 2.0 galibiyet |
| BOS   | 51.5      | A 51.5 · B 49.5 · C 51.5 | Kaynaklar arası fark 2.0 galibiyet |
| CHI   | 29.5      | A 27.5 · B 29.5          | Kaynaklar arası fark 2.0 galibiyet |
| MIL   | 24.5      | A 26.5 · B 24.5          | Kaynaklar arası fark 2.0 galibiyet |
| OKC   | 62.5      | A 60.5 · B 60.5 · C 62.5 | Kaynaklar arası fark 2.0 galibiyet |
| POR   | 41.5      | A 43.5 · B 43.5 · C 41.5 | Kaynaklar arası fark 2.0 galibiyet |
| UTA   | 38.5      | A 35.5 · B 36.5 · C 38.5 | Kaynaklar arası fark 3.0 galibiyet |

## TODO (baremi bulunamayan takım)

Yok — 30 takımın 30'unda barem var.

## Sınırlamalar ve açık noktalar

- **Erişilemeyen kaynaklar:** `sports.betmgm.com`, `sportsbettingdime.com`, `sportsbookreview.com`, `dknetwork.draftkings.com`, `oddsshopper.com` ve `fantasyball365.substack.com` bu ağdan bağlantıyı sıfırladı (connection reset). Engel aşılmaya çalışılmadı; bu sayfalar kaynak olarak kullanılmadı.
- Arama sonucu özetlerinde BetMGM'in güncel (Eylül) listesi görünüyordu, ancak sayfanın kendisi okunamadığı için **doğrulanamadı ve kullanılmadı**.
- ESPN, CBS Sports, Action Network, Covers ve VegasInsider'da 2026-27 için okunabilir bir tam liste bulunamadı (Covers sayfası hâlâ 2025-26 başlıklıydı).
- **20 takımın baremi yalnızca Temmuz sonu verisine dayanıyor.** Hoops Rumors'ın kalan dört divizyon yazısı (Central, Southeast, Pacific, Southwest) henüz yayımlanmamıştı.
- **Öneri:** Kilit tarihinden (20 Ekim 2026, 22:00 TSİ) kısa süre önce protokol bir kez daha çalıştırılmalı; özellikle `needsReview` takımları ve yalnızca Temmuz verisi olan 20 takım güncellenmeli.
