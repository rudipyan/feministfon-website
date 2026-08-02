// scripts/seed-content.mjs — one-off, run manually after Task 8. Requires
// SANITY_PROJECT_ID, SANITY_DATASET, SANITY_WRITE_TOKEN env vars.
const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_WRITE_TOKEN } = process.env;
if (!SANITY_PROJECT_ID || !SANITY_WRITE_TOKEN) {
  console.error('Set SANITY_PROJECT_ID, SANITY_DATASET, SANITY_WRITE_TOKEN first.');
  process.exit(1);
}

function slugify(input) {
  const map = { İ: 'i', I: 'i', ı: 'i', ş: 's', Ş: 's', ğ: 'g', Ğ: 'g', ç: 'c', Ç: 'c', ö: 'o', Ö: 'o', ü: 'u', Ü: 'u' };
  const transliterated = input.replace(/[İIışŞğĞçÇöÖüÜ]/g, (ch) => map[ch] ?? ch);
  return transliterated.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 96);
}

function slug(input) {
  return { _type: 'slug', current: slugify(input) };
}

const documents = [
  {
    _type: 'announcement',
    titleTr: "Türkiye'de Feminist bir fon: Fizibilite raporumuz çıktı!",
    titleEn: 'A feminist fund in Türkiye: our feasibility report is out!',
    slug: slug("Türkiye'de Feminist bir fon: Fizibilite raporumuz çıktı!"),
    dateLabel: 'Haziran 2026',
    publishedAt: '2026-06-01T00:00:00.000Z',
    coverImageAltTr: "Türkiye'de Feminist Bir Fon fizibilite raporu",
    coverImageAltEn: "Türkiye'de Feminist Bir Fon fizibilite raporu",
    bodyTr: [
      "Feminist Fon İnisiyatifi (FFI) olarak, Türkiye'deki feminist ve LGBTİ+ örgütlerin finansal ve örgütsel sürdürülebilirliğini, karşılaştıkları yapısal engelleri ve katılımcı bir feminist fonun olanaklarını incelediğimiz \"Türkiye'de Feminist Bir Fon: İhtiyaçlar, Zorluklar ve Olanaklar\" başlıklı fizibilite raporumuzu yayımladık. Kolektif bir emeğin ve dayanışmanın ürünü olan bu rapor; 11 farklı şehirde faaliyet yürüten 30 kadın, feminist ve LGBTİ+ örgütüyle yaptığımız görüşmelerde paylaşılan deneyimler ve katkılarla şekillendi.",
      "Raporumuzun görsel dilinde, logomuzla da uyumlu bir şekilde, okyanus ekosisteminin can damarı olan mercan resiflerini merkezimize aldık. Tıpkı mercanların birbirine tutunarak, birbirini besleyerek ve dışarıdan gelen akıntılara karşı devasa resifler oluşturarak hayatta kalması gibi; sivil toplumdaki feminist örgütlenmelerin de dayanışma ağlarıyla nasıl bir koruma çemberi ve yaşam alanı kurduğunu vurgulamak istedik.",
    ],
    bodyEn: [
      "Feminist Fon İnisiyatifi (FFI) olarak, Türkiye'deki feminist ve LGBTİ+ örgütlerin finansal ve örgütsel sürdürülebilirliğini, karşılaştıkları yapısal engelleri ve katılımcı bir feminist fonun olanaklarını incelediğimiz \"Türkiye'de Feminist Bir Fon: İhtiyaçlar, Zorluklar ve Olanaklar\" başlıklı fizibilite raporumuzu yayımladık. Kolektif bir emeğin ve dayanışmanın ürünü olan bu rapor; 11 farklı şehirde faaliyet yürüten 30 kadın, feminist ve LGBTİ+ örgütüyle yaptığımız görüşmelerde paylaşılan deneyimler ve katkılarla şekillendi.",
      "Raporumuzun görsel dilinde, logomuzla da uyumlu bir şekilde, okyanus ekosisteminin can damarı olan mercan resiflerini merkezimize aldık. Tıpkı mercanların birbirine tutunarak, birbirini besleyerek ve dışarıdan gelen akıntılara karşı devasa resifler oluşturarak hayatta kalması gibi; sivil toplumdaki feminist örgütlenmelerin de dayanışma ağlarıyla nasıl bir koruma çemberi ve yaşam alanı kurduğunu vurgulamak istedik.",
    ],
    linkUrl: 'https://feministfon.org/wp-content/uploads/2026/06/ffi-fizibilite-raporu-2026.pdf',
    linkLabelTr: 'Raporun tamamını PDF olarak okumak ve indirmek için buraya tıklayınız.',
    linkLabelEn: 'Raporun tamamını PDF olarak okumak ve indirmek için buraya tıklayınız.',
  },
  {
    _type: 'announcement',
    titleTr: "Women Deliver 2026 Konferansı'ndaydık",
    titleEn: 'We were at the Women Deliver 2026 Conference',
    slug: slug("Women Deliver 2026 Konferansı'ndaydık"),
    dateLabel: '27–30 Nisan 2026 · Naarm (Melbourne), Avustralya',
    publishedAt: '2026-04-27T00:00:00.000Z',
    coverImageAltTr: 'Women Deliver 2026 Konferansı',
    coverImageAltEn: 'Women Deliver 2026 Konferansı',
    bodyTr: [
      "Feminist Fon İnisiyatifi (FFI) olarak, 27-30 Nisan 2026 tarihlerinde Naarm (Melbourne), Avustralya'da düzenlenen uluslararası Women Deliver 2026 Konferansı'na katıldık. Konferans boyunca hem bölgesel düzeydeki baskı mekanizmalarını hem de bu baskılara karşı geliştirdiğimiz sürdürülebilir finansman ve kolektif bakım stratejilerini tartışarak deneyimlerimizi aktardık.",
      "Dalan Fund ortaklığıyla düzenlediğimiz \"Resisting Backlash: Feminist Strategies against Anti-Gender Movements in CEECCNA\" başlıklı oturumda, Kırgızistan, Gürcistan, Romanya ve Macaristan'dan yerel örgütlenmelerle birlikteydik. Toplumsal cinsiyet karşıtı anlatıların, sivil toplumun işleyişini baltalamak için kullanılan yıpratıcı hukuki-idari araçların ve hak savunucularına yönelik sistemli kriminalizasyonun bir tesadüf olmadığını; aksine otoriter rejimlerin birbirini besleyen ortak bir el kitabının parçası olduğunu vurguladık.",
      "Bugün örgütler çok yönlü bir varoluş mücadelesi veriyor; bir yandan derinleşen fon kesintileriyle boğuşurken, diğer yandan güvencesizliğe maruz bırakılıyorlar. Kolektif bakımın artık ikincil bir gündem ya da krizler arasında verilen kısa bir mola olarak ele alınamayacağını, doğrudan politik bir strateji olduğunu konuştuk.",
    ],
    bodyEn: [
      "Feminist Fon İnisiyatifi (FFI) olarak, 27-30 Nisan 2026 tarihlerinde Naarm (Melbourne), Avustralya'da düzenlenen uluslararası Women Deliver 2026 Konferansı'na katıldık. Konferans boyunca hem bölgesel düzeydeki baskı mekanizmalarını hem de bu baskılara karşı geliştirdiğimiz sürdürülebilir finansman ve kolektif bakım stratejilerini tartışarak deneyimlerimizi aktardık.",
      "Dalan Fund ortaklığıyla düzenlediğimiz \"Resisting Backlash: Feminist Strategies against Anti-Gender Movements in CEECCNA\" başlıklı oturumda, Kırgızistan, Gürcistan, Romanya ve Macaristan'dan yerel örgütlenmelerle birlikteydik. Toplumsal cinsiyet karşıtı anlatıların, sivil toplumun işleyişini baltalamak için kullanılan yıpratıcı hukuki-idari araçların ve hak savunucularına yönelik sistemli kriminalizasyonun bir tesadüf olmadığını; aksine otoriter rejimlerin birbirini besleyen ortak bir el kitabının parçası olduğunu vurguladık.",
      "Bugün örgütler çok yönlü bir varoluş mücadelesi veriyor; bir yandan derinleşen fon kesintileriyle boğuşurken, diğer yandan güvencesizliğe maruz bırakılıyorlar. Kolektif bakımın artık ikincil bir gündem ya da krizler arasında verilen kısa bir mola olarak ele alınamayacağını, doğrudan politik bir strateji olduğunu konuştuk.",
    ],
  },
  {
    _type: 'announcement',
    titleTr: 'Kaynaklar azalırken sivil toplumda ne oluyor?',
    titleEn: "#PaylaşmaGünü: what's happening in civil society as resources shrink?",
    slug: slug('PaylaşmaGünü Kaynaklar azalırken sivil toplumda ne oluyor'),
    dateLabel: '2 Aralık 2025',
    publishedAt: '2025-12-02T00:00:00.000Z',
    coverImageAltTr: '#PaylaşmaGünü paneli',
    coverImageAltEn: '#PaylaşmaGünü paneli',
    bodyTr: [
      "Türkiye Üçüncü Sektör Vakfı'nın (TÜSEV) ülke koordinatörlüğünü üstlendiği, bağışçılık ile gönüllülüğün önemine dikkat çekmeyi ve paylaşma kültürünü kutlamayı amaçlayan #PaylaşmaGünü kapsamında, 2 Aralık 2025'te bir araya geldik.",
      "Bu yılki etkinlikte düzenlenen \"Yeni bir filantropi modeline doğru yola çıkarken: Kaynaklar azalırken sivil toplumda ne oluyor?\" başlıklı panelin konuşmacıları arasındaydık. Tütengül Küçüker'in moderatörlüğünde gerçekleşen oturumda, Ashoka Türkiye'den Ezgi Özkök Sefer, Sivil Toplum Destek Vakfı'ndan (STDV) Hakan Kahraman ve TÜSEV'den Rana Tutcuoğlu ile birlikte panelist olarak sivil toplumun dönüşen kaynak yapısı, daralan sivil alan karşısındaki finansal sürdürülebilirlik ve yeni filantropi modelleri tartıştık.",
      "Feminist Fon İnisiyatifi (FFI) olarak katıldığımız bu panelde; feminist bir yaklaşımla hibe ilişkilerinin nasıl yeniden kurgulanabileceğini, esnek fonlamanın sivil toplum örgütleri için hayati önemini ve katılımcı hibe modelleri (PGM) üzerine geliştirdiğimiz alternatif yaklaşımları paylaştık.",
    ],
    bodyEn: [
      "Türkiye Üçüncü Sektör Vakfı'nın (TÜSEV) ülke koordinatörlüğünü üstlendiği, bağışçılık ile gönüllülüğün önemine dikkat çekmeyi ve paylaşma kültürünü kutlamayı amaçlayan #PaylaşmaGünü kapsamında, 2 Aralık 2025'te bir araya geldik.",
      "Bu yılki etkinlikte düzenlenen \"Yeni bir filantropi modeline doğru yola çıkarken: Kaynaklar azalırken sivil toplumda ne oluyor?\" başlıklı panelin konuşmacıları arasındaydık. Tütengül Küçüker'in moderatörlüğünde gerçekleşen oturumda, Ashoka Türkiye'den Ezgi Özkök Sefer, Sivil Toplum Destek Vakfı'ndan (STDV) Hakan Kahraman ve TÜSEV'den Rana Tutcuoğlu ile birlikte panelist olarak sivil toplumun dönüşen kaynak yapısı, daralan sivil alan karşısındaki finansal sürdürülebilirlik ve yeni filantropi modelleri tartıştık.",
      "Feminist Fon İnisiyatifi (FFI) olarak katıldığımız bu panelde; feminist bir yaklaşımla hibe ilişkilerinin nasıl yeniden kurgulanabileceğini, esnek fonlamanın sivil toplum örgütleri için hayati önemini ve katılımcı hibe modelleri (PGM) üzerine geliştirdiğimiz alternatif yaklaşımları paylaştık.",
    ],
  },
  {
    _type: 'announcement',
    titleTr: '"Genç Feministlerin Ön Saflardan Kriz Müdahelesi: Suriye ve Türkiye Depremleri" raporu yayınlandı!',
    titleEn: 'Report published: "Young Feminist Frontline Crisis Response to the Earthquake in Syria and Turkey"',
    slug: slug('Genç Feministlerin Ön Saflardan Kriz Müdahelesi raporu yayınlandı'),
    dateLabel: '25 Haziran 2025',
    publishedAt: '2025-06-25T00:00:00.000Z',
    coverImageAltTr: 'Genç Feministlerin Ön Saflardan Kriz Müdahelesi raporu',
    coverImageAltEn: 'Genç Feministlerin Ön Saflardan Kriz Müdahelesi raporu',
    bodyTr: [
      "Global Resilience Fund ve Purposeful ortaklığıyla geliştirilen, ekibimizden Ezgi Kan'ın da hazırlık sürecinde ve içeriğinde yer aldığı \"Young Feminist Frontline Crisis Response to the Earthquake in Syria and Turkey\" başlıklı rapor yayınlandı. 6 Şubat 2023 depremlerinin ardından ortaya çıkan yıkıcı tablo karşısında sahaya ilk inen ve toplulukların ihtiyaçlarına hızla yanıt veren genç feministlerin deneyimlerini merkezine alan bu çalışma, kriz anlarındaki dönüştürücü dayanışma pratiklerine ışık tutuyor.",
      "Feminist Fon İnisiyatifi olarak bizim de dayanışma ilkelerimizin temelini oluşturan 'yerel hareketlerin ve taban örgütlenmelerinin doğrudan desteklenmesi' gerekliliğini vurgulayan bu araştırma, sadece yaşanan zorlukları değil; aynı zamanda umudu, direnişi ve adil bir geleceğin nasıl yeniden inşa edilebileceğini de belgeliyor.",
    ],
    bodyEn: [
      "Global Resilience Fund ve Purposeful ortaklığıyla geliştirilen, ekibimizden Ezgi Kan'ın da hazırlık sürecinde ve içeriğinde yer aldığı \"Young Feminist Frontline Crisis Response to the Earthquake in Syria and Turkey\" başlıklı rapor yayınlandı. 6 Şubat 2023 depremlerinin ardından ortaya çıkan yıkıcı tablo karşısında sahaya ilk inen ve toplulukların ihtiyaçlarına hızla yanıt veren genç feministlerin deneyimlerini merkezine alan bu çalışma, kriz anlarındaki dönüştürücü dayanışma pratiklerine ışık tutuyor.",
      "Feminist Fon İnisiyatifi olarak bizim de dayanışma ilkelerimizin temelini oluşturan 'yerel hareketlerin ve taban örgütlenmelerinin doğrudan desteklenmesi' gerekliliğini vurgulayan bu araştırma, sadece yaşanan zorlukları değil; aynı zamanda umudu, direnişi ve adil bir geleceğin nasıl yeniden inşa edilebileceğini de belgeliyor.",
    ],
  },
  {
    _type: 'announcement',
    titleTr: 'EDGE Konferansı\'ndaydık: "Taahhütten Eyleme: Filantropide Hesap Verebilirlik"',
    titleEn: 'We were at the EDGE Conference: "From Commitment to Action: Accountability in Philanthropy"',
    slug: slug('EDGE Konferansındaydık Taahhütten Eyleme Filantropide Hesap Verebilirlik'),
    dateLabel: '28–30 Nisan 2025 · Bogotá, Kolombiya',
    publishedAt: '2025-04-28T00:00:00.000Z',
    coverImageAltTr: 'EDGE Konferansı',
    coverImageAltEn: 'EDGE Konferansı',
    bodyTr: [
      "Feminist Fon İnisiyatifi olarak, 28-30 Nisan 2025'te Bogotá, Kolombiya'da düzenlenen EDGE Konferansı'ndaydık. \"Taahhütten Eyleme: Filantropide Hesap Verebilirlik\" temasıyla öne çıkan konferans, hesap verebilirliğin sadece fon sağlayıcılar tarafından talep edilen tek yönlü bir yükümlülük değil, karşılıklı bir sorumluluk olduğunun altını çizdi.",
      "Fonlara erişimin adil, esnek ve hareketle kurulan dayanışmaya dayalı olması gerektiğini vurgulayan bu buluşma; taban örgütlerinin sesini duyurduğu ve filantropiyi yeniden düşünmeye alan açan güçlü bir alandı.",
    ],
    bodyEn: [
      "Feminist Fon İnisiyatifi olarak, 28-30 Nisan 2025'te Bogotá, Kolombiya'da düzenlenen EDGE Konferansı'ndaydık. \"Taahhütten Eyleme: Filantropide Hesap Verebilirlik\" temasıyla öne çıkan konferans, hesap verebilirliğin sadece fon sağlayıcılar tarafından talep edilen tek yönlü bir yükümlülük değil, karşılıklı bir sorumluluk olduğunun altını çizdi.",
      "Fonlara erişimin adil, esnek ve hareketle kurulan dayanışmaya dayalı olması gerektiğini vurgulayan bu buluşma; taban örgütlerinin sesini duyurduğu ve filantropiyi yeniden düşünmeye alan açan güçlü bir alandı.",
    ],
  },
  {
    _type: 'announcement',
    titleTr: "CSW68'te feminist stratejiler",
    titleEn: 'Feminist strategies at CSW68',
    slug: slug('CSW68te feminist stratejiler'),
    dateLabel: '21 Mart 2024',
    publishedAt: '2024-03-21T00:00:00.000Z',
    coverImageAltTr: 'CSW68 etkinliği',
    coverImageAltEn: 'CSW68 etkinliği',
    bodyTr: [
      "Birleşmiş Milletler Kadının Statüsü Komisyonu'nun 68. Oturumu (CSW68) kapsamında, 21 Mart 2024'te Kadının İnsan Hakları Derneği'nin (KİH) organize ettiği \"Haklarımıza Saldırılar, Kadın Yoksulluğu ve Yoksullukla Mücadelede Feminist Stratejiler\" başlıklı çevrimiçi paralel etkinliğe katıldık. İpek İlkkaracan'ın kolaylaştırıcılığında organize edilen oturumda; ekibimizden Pınar Ensari'nin yanı sıra Pınar Uyan Semerci, Sohela Nazneen ve Hazel Birungi panelist olarak yer aldı. Toplumsal cinsiyet karşıtı hareketlerin, hak gasplarının ve popülist otoriter rejimlerin yükseldiği bu zorlu dönemde, toplumsal cinsiyet eşitliğini sağlamanın ve kadın yoksulluğuyla mücadele etmenin önündeki yapısal engelleri hep birlikte masaya yatırdık.",
      "Panel boyunca, mevcut otoriter rejimlerin kadınlar arasındaki yoksulluğu kronikleştiren yapısal sorunları çözmek yerine, nakit transferleri gibi geçici ve kısa vadeli ekonomik paketlerle krizi yönetmeye çalıştığına dikkat çektik. Ekibimizden Pınar, yaptığı sunumda kriz dönemlerinde feminist ve LGBTI+ örgütlerinin, inisiyatiflerin ve aktivistlerin acil ihtiyaçlara yanıt vermede oynadığı hayati role odaklandı; geleneksel fonlama modellerinin kısa vadeli ve proje odaklı yapısına karşı güven temelli, katılımcı, esnek ve çekirdek desteği önceleyen feminist fonlama yaklaşımlarının önemini vurguladı.",
    ],
    bodyEn: [
      "Birleşmiş Milletler Kadının Statüsü Komisyonu'nun 68. Oturumu (CSW68) kapsamında, 21 Mart 2024'te Kadının İnsan Hakları Derneği'nin (KİH) organize ettiği \"Haklarımıza Saldırılar, Kadın Yoksulluğu ve Yoksullukla Mücadelede Feminist Stratejiler\" başlıklı çevrimiçi paralel etkinliğe katıldık. İpek İlkkaracan'ın kolaylaştırıcılığında organize edilen oturumda; ekibimizden Pınar Ensari'nin yanı sıra Pınar Uyan Semerci, Sohela Nazneen ve Hazel Birungi panelist olarak yer aldı. Toplumsal cinsiyet karşıtı hareketlerin, hak gasplarının ve popülist otoriter rejimlerin yükseldiği bu zorlu dönemde, toplumsal cinsiyet eşitliğini sağlamanın ve kadın yoksulluğuyla mücadele etmenin önündeki yapısal engelleri hep birlikte masaya yatırdık.",
      "Panel boyunca, mevcut otoriter rejimlerin kadınlar arasındaki yoksulluğu kronikleştiren yapısal sorunları çözmek yerine, nakit transferleri gibi geçici ve kısa vadeli ekonomik paketlerle krizi yönetmeye çalıştığına dikkat çektik. Ekibimizden Pınar, yaptığı sunumda kriz dönemlerinde feminist ve LGBTI+ örgütlerinin, inisiyatiflerin ve aktivistlerin acil ihtiyaçlara yanıt vermede oynadığı hayati role odaklandı; geleneksel fonlama modellerinin kısa vadeli ve proje odaklı yapısına karşı güven temelli, katılımcı, esnek ve çekirdek desteği önceleyen feminist fonlama yaklaşımlarının önemini vurguladı.",
    ],
  },
  {
    _type: 'publication',
    titleTr: "Türkiye'de Feminist Bir Fon: İhtiyaçlar, Zorluklar ve Olanaklar",
    titleEn: 'A Feminist Fund in Türkiye: Needs, Challenges, and Possibilities',
    slug: slug("Türkiye'de Feminist Bir Fon İhtiyaçlar Zorluklar ve Olanaklar"),
    dateLabel: 'Haziran 2026',
    publishedAt: '2026-06-01T00:00:00.000Z',
    coverImageAltTr: "Türkiye'de Feminist Bir Fon: İhtiyaçlar, Zorluklar ve Olanaklar — Fizibilite Raporu kapağı",
    coverImageAltEn: "Türkiye'de Feminist Bir Fon: İhtiyaçlar, Zorluklar ve Olanaklar — Fizibilite Raporu kapağı",
    pdfUrl: 'https://feministfon.org/wp-content/uploads/2026/06/ffi-fizibilite-raporu-2026.pdf',
    teaserTr: "Türkiye'de 11 ilden 30 kadın, feminist ve LGBTİ+ örgütüyle yaptığımız görüşmelere dayanan \"Türkiye'de Feminist Bir Fon: İhtiyaçlar, Zorluklar ve Olanaklar\" başlıklı fizibilite raporumuz çıktı!",
    teaserEn: "Türkiye'de 11 ilden 30 kadın, feminist ve LGBTİ+ örgütüyle yaptığımız görüşmelere dayanan \"Türkiye'de Feminist Bir Fon: İhtiyaçlar, Zorluklar ve Olanaklar\" başlıklı fizibilite raporumuz çıktı!",
  },
];

const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${SANITY_DATASET || 'production'}`;
const mutations = documents.map((doc) => ({ create: doc }));
const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SANITY_WRITE_TOKEN}` },
  body: JSON.stringify({ mutations }),
});
if (!res.ok) {
  console.error('Seed failed:', res.status, await res.text());
  process.exit(1);
}
console.log('Seeded', documents.length, 'documents.');
