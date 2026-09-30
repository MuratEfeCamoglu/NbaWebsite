/** All user-facing Turkish text lives here. */
export const tr = {
  meta: {
    title: "NBA Sezon Öncesi Tahmin",
    description:
      "Sezon başlamadan fikrini kaydet, sezon bitince kim haklıymış görelim. 30 takımı sırala, galibiyet baremlerine Alt ya da Üst de.",
  },
  brand: {
    name: "SEZON TAHMİNİ",
  },
  home: {
    eyebrow: (season: string) => `${season} NBA SEZONU`,
    title: "SEZON BAŞLAMADAN FİKRİNİ KAYDET",
    lead: "30 takımı en iyiden en kötüye sırala, her takımın galibiyet baremi için Alt ya da Üst de. Sezon bitince kim haklıymış görelim.",
    comingSoon: "YAKINDA",
    comingSoonText: "Tahmin ekranları hazırlanıyor.",
    lockLabel: "TAHMİNLER KİLİTLENİR",
    lockZone: "Türkiye saati",
    stepsTitle: "NASIL ÇALIŞIR",
    steps: [
      {
        number: "01",
        title: "SIRALAMA",
        text: "30 takımı sürükleyip bırakarak 1'den 30'a diz.",
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
    suffix: "KONFERANSI",
  },
  footer: {
    disclaimer:
      "Bu site bir tahmin oyunudur. Gerçek para, ödül ya da oran içermez.",
    unofficial:
      "NBA veya herhangi bir takımla bağlantılı değildir; resmi logo kullanılmaz.",
  },
} as const;
