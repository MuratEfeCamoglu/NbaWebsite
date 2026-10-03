/** All user-facing Turkish text lives here. */
export const tr = {
  meta: {
    title: "NBA Sezon Öncesi Tahmin",
    description:
      "Sezon başlamadan fikrini kaydet, sezon bitince kim haklıymış görelim. Takımları sırala, galibiyet baremlerine Alt ya da Üst de.",
  },
  brand: {
    name: "SEZON TAHMİNİ",
    homeLabel: "Ana sayfa",
  },
  nav: {
    label: "Adımlar",
    ranking: "01 SIRALAMA",
    picks: "02 ALT / ÜST",
    summary: "03 ÖZET",
  },
  lock: {
    label: "TAHMİNLER KİLİTLENİR",
    shortLabel: "KİLİT",
    zone: "Türkiye saati",
    lockedTitle: "TAHMİNLER KİLİTLENDİ",
    lockedText: "Sezon başladı; tahminler artık değiştirilemez.",
  },
  home: {
    eyebrow: (season: string) => `${season} NBA SEZONU`,
    title: "SEZON BAŞLAMADAN FİKRİNİ KAYDET",
    lead: "Batı'yı ve Doğu'yu en iyiden en kötüye sırala, her takımın galibiyet baremi için Alt ya da Üst de. Sezon bitince kim haklıymış görelim.",
    start: "TAHMİNİNE BAŞLA",
    stepsTitle: "NASIL ÇALIŞIR",
    steps: [
      {
        number: "01",
        title: "SIRALAMA",
        text: "Batı ve Doğu konferanslarını ayrı ayrı, sürükleyip bırakarak 1'den 15'e diz.",
      },
      {
        number: "02",
        title: "ALT / ÜST",
        text: "Her takımın galibiyet baremi için Alt ya da Üst seç, emin olduklarına daha çok yıldız ver.",
      },
      {
        number: "03",
        title: "ÖZET",
        text: "Tahminini gözden geçir ve arkadaşlarınla paylaş.",
      },
    ],
    teamsTitle: "TAKIMLAR",
    teamCount: (count: number) => `${count} takım`,
  },
  conference: {
    East: "DOĞU",
    West: "BATI",
    all: "TÜMÜ",
    names: { East: "Doğu", West: "Batı" },
    suffix: "KONFERANSI",
    tabsLabel: "Konferans",
  },
  division: {
    Atlantic: "ATLANTİK",
    Central: "MERKEZ",
    Southeast: "GÜNEYDOĞU",
    Northwest: "KUZEYBATI",
    Pacific: "PASİFİK",
    Southwest: "GÜNEYBATI",
    suffix: "GRUBU",
  },
  view: {
    label: "Görünüm",
    conference: "KONFERANS",
    division: "GRUPLAR",
  },
  ranking: {
    step: "ADIM 1 / 3",
    title: "SIRALAMA",
    lead: "Her konferansı en iyiden en kötüye diz. Takımı tutamacından sürükle ya da ok düğmeleriyle taşı; sıralaman kendiliğinden kaydedilir.",
    keyboardHint:
      "Klavyeyle: tutamaca gel, Boşluk ile tut, ok tuşlarıyla taşı, Boşluk ile bırak. Esc iptal eder.",
    listLabel: (conference: string) => `${conference} konferansı sıralaması`,
    dragHandle: (team: string) => `${team} takımını sürükle`,
    moveUp: (team: string) => `${team} takımını bir sıra yukarı taşı`,
    moveDown: (team: string) => `${team} takımını bir sıra aşağı taşı`,
    reset: "ALFABETİK SIRAYA DÖN",
    resetShort: "SIFIRLA",
    unsaved: "Henüz sıralama yapmadın; takımlar alfabetik duruyor.",
    saved: "Sıralaman kaydedildi.",
    next: "ALT / ÜST'E GEÇ",
    announce: {
      instructions:
        "Bir takımı tutmak için Boşluk tuşuna bas. Tutarken ok tuşlarıyla taşı, Boşluk ile bırak, Esc ile iptal et.",
      start: (team: string) => `${team} tutuldu.`,
      over: (team: string, position: number) =>
        `${team} ${position}. sıraya taşındı.`,
      end: (team: string, position: number) =>
        `${team} ${position}. sıraya bırakıldı.`,
      cancel: (team: string) => `${team} için taşıma iptal edildi.`,
    },
  },
  picks: {
    step: "ADIM 2 / 3",
    title: "ALT / ÜST",
    lead: "Her takımın galibiyet baremi için sezon sonunu tahmin et. Emin olduğun seçimlere daha çok yıldız ver; istersen kendi galibiyet sayını da yaz.",
    over: "ÜST",
    under: "ALT",
    overHint: "Baremin üstünde bitirir",
    underHint: "Baremin altında bitirir",
    columns: {
      rank: "SIRA",
      team: "TAKIM",
      line: "BAREM",
      side: "SEÇİMİN",
      confidence: "GÜVEN",
      projection: "TAHMİNİN",
    },
    sideGroup: (team: string) => `${team} için Alt veya Üst`,
    confidenceGroup: (team: string) => `${team} için güven puanı`,
    confidenceStar: (count: number) => `Güven ${count} / 3`,
    projectionLabel: (team: string) =>
      `${team} galibiyet tahmini, 0 ile 82 arası`,
    needsReview:
      "Barem kaynakları arasında fark var; kilitten önce güncellenebilir",
    needsReviewMark: "*",
    pickedOf: (total: number) => `/ ${total} takım seçildi`,
    conferencePicked: (total: number) => `/ ${total} seçildi`,
    unranked: "Henüz sıralama yapmadın; takımlar alfabetik listeleniyor.",
    unrankedLink: "Sıralamaya git",
    conflictTitle: "Tutarsız seçim:",
    conflict: {
      "over-but-below": (projection: number, line: string) =>
        `Üst seçtin ama tahminin (${projection}) baremin (${line}) altında. Seçimini ya da tahminini güncelle.`,
      "under-but-above": (projection: number, line: string) =>
        `Alt seçtin ama tahminin (${projection}) baremin (${line}) üstünde. Seçimini ya da tahminini güncelle.`,
    },
    footnote:
      "Toplama, tahmin yazmadığın takımlar için barem eklenir (Üst seçtiysen yukarı, diğer durumlarda aşağı yuvarlanır).",
    remaining: (left: number) =>
      left > 0
        ? `${left} takım boş. İstediğin kadarını boş bırakabilirsin.`
        : "Tüm takımlar seçildi.",
    back: "SIRALAMA",
    next: "ÖZETE GEÇ",
  },
  summary: {
    step: "ADIM 3 / 3",
    title: "ÖZET",
    lead: "Sıralaman ve Alt/Üst seçimlerin tek bakışta. Beğendiysen resim olarak indirip paylaşabilirsin.",
    columns: { side: "SEÇİM", projection: "TAHMİN" },
    stats: {
      picked: "SEÇİLEN TAKIM",
      projections: "GALİBİYET TAHMİNİ",
      maxPoints: "EN FAZLA PUAN",
    },
    noPick: "Seçim yok",
    warn: {
      title: "GÖZDEN GEÇİR",
      none: "Uyarı yok; tahminin tutarlı görünüyor.",
      unranked:
        "Henüz sıralama yapmadın; takımlar alfabetik ve sıra numarasız görünüyor.",
      incomplete: (left: number) =>
        `${left} takım için Alt/Üst seçmedin. Boş bırakabilirsin; o takımlardan puan alamazsın.`,
      total: (deviation: number) =>
        `Galibiyet toplamın ligdeki toplamdan ${Math.abs(deviation)} ${deviation > 0 ? "fazla" : "eksik"}.`,
    },
    back: "ALT / ÜST",
    downloadShort: "İNDİR",
    download: {
      all: "TÜMÜNÜ İNDİR",
      ranking: "SIRALAMAYI İNDİR",
      picks: "ALT / ÜST'Ü İNDİR",
    },
    downloadVariantShort: {
      all: "TÜMÜ",
      ranking: "SIRALAMA",
      picks: "ALT / ÜST",
    },
    downloading: "HAZIRLANIYOR…",
    downloadHint:
      "Tahminini PNG resim olarak indir: tümü tek resimde ya da sıralama ve Alt/Üst ayrı ayrı.",
    downloadError: "Resim oluşturulamadı. Lütfen tekrar dene.",
    retry: "TEKRAR DENE",
    preparing: "Resim hazırlanıyor…",
    share: "PAYLAŞ / KAYDET",
    save: "İNDİR",
    previewClose: "Önizlemeyi kapat",
    previewHint:
      "Paylaş menüsünden resmi kaydedebilir ya da gönderebilirsin. Olmazsa resme basılı tutup kaydet.",
    fileName: {
      all: (season: string) => `nba-tahmin-${season}.png`,
      ranking: (season: string) => `nba-siralama-${season}.png`,
      picks: (season: string) => `nba-alt-ust-${season}.png`,
    },
    imageTitle: {
      all: "TAHMİNİM",
      ranking: "SIRALAMAM",
      picks: "ALT / ÜST TAHMİNİM",
    },
    imageCounts: (picked: number, total: number, over: number, under: number) =>
      `${picked} / ${total} SEÇİM  ·  ${over} ÜST  ·  ${under} ALT`,
    imageCredit: (season: string) => `${season} NBA sezon öncesi tahmini`,
  },
  meter: {
    label: "TOPLAM GALİBİYET",
    balancedTitle: "DENGEDE",
    balancedText: (total: number) =>
      `Tahminlerin, ligdeki toplam ${total} galibiyetle uyumlu.`,
    offTitle: "SAPMA YÜKSEK",
    offText: (deviation: number, total: number) =>
      `Tahminlerinin toplamı ${Math.abs(deviation)} galibiyet ${deviation > 0 ? "fazla" : "eksik"}. Ligde her sezon toplam ${total} galibiyet olur.`,
    scaleCenter: (tolerance: number) => `DENGE ±${tolerance}`,
  },
  footer: {
    disclaimer:
      "Bu site bir tahmin oyunudur. Gerçek para, ödül ya da oran içermez.",
    unofficial:
      "NBA veya herhangi bir takımla bağlantılı değildir. Takım adları ve logoları sahiplerinin tescilli markalarıdır.",
  },
} as const;
