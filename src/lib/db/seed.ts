import { db } from "./index";
import { courses, lektori, levels, testimonials, pricing, settings, pageContent } from "./schema";

// Helper to ensure db is available
function getDb() {
  if (!db) {
    throw new Error("Database not configured - check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables");
  }
  return db;
}

async function seed() {
  console.log("Seeding database...");

  // Kurzy
  await getDb().insert(courses).values([
    {
      title: "Skupinové kurzy",
      subtitle: "Semestrální výuka",
      description: "Učte se v přátelské partě maximálně 4 lidí na podobné úrovni. Kurzy probíhají 2× týdně po 90 minutách.",
      icon: "👥",
      badge: "Nejoblíbenější",
      category: "skupinove",
      featured: true,
    },
    {
      title: "Individuální výuka",
      subtitle: "Výuka šitá na míru",
      description: "Tempo, obsah i čas určujete vy. Pro ty, kdo ví, co potřebují. Flexibilní rozvrh podle vašich možností.",
      icon: "👤",
      category: "individualni",
      featured: true,
    },
    {
      title: "Intenzivní kurzy",
      subtitle: "Dvoutýdenní programy",
      description: "Rychlý pokrok za krátkou dobu. Ideální před cestou do Španělska nebo Latinské Ameriky.",
      icon: "⚡",
      badge: "Léto 2025",
      category: "intenzivni",
      featured: true,
    },
    {
      title: "Příprava na DELE",
      subtitle: "Mezinárodní certifikát",
      description: "Připravíme vás na zkoušku DELE Intermedio i Superior. Mezinárodně uznávaný certifikát španělštiny.",
      icon: "🎓",
      category: "specializovane",
      featured: true,
    },
    {
      title: "Obchodní španělština",
      subtitle: "Business Spanish",
      description: "Španělština pro profesionály. Obchodní korespondence, prezentace, jednání s klienty.",
      icon: "💼",
      category: "specializovane",
      featured: false,
    },
    {
      title: "Erasmus v Telči",
      subtitle: "Letní program",
      description: "Intenzivní letní kurz španělštiny kombinovaný s kulturním programem v krásném prostředí Telče.",
      icon: "🏰",
      badge: "Léto 2025",
      category: "intenzivni",
      featured: false,
    },
  ]);
  console.log("✓ Courses seeded");

  // Lektoři
  await getDb().insert(lektori).values([
    {
      name: "Rodrigo Valenzuela",
      role: "Zakladatel a hlavní lektor",
      origin: "Chile",
      originFlag: "🇨🇱",
      badge: "Rodilý mluvčí",
      badgeIcon: "🌎",
      bio: JSON.stringify([
        "Rodrigo pochází z chilského Santiaga a španělštinu vyučuje v Brně už od roku 2010.",
        "Jeho přístup kombinuje tradiční výuku gramatiky s živou konverzací a kulturním kontextem.",
        "Specializuje se na latinskoamerickou španělštinu a přípravu na certifikáty DELE."
      ]),
      highlights: JSON.stringify([
        "15+ let zkušeností s výukou",
        "Certifikovaný DELE examinátor",
        "Specializace na latinskoamerickou kulturu"
      ]),
    },
    {
      name: "Olga Trampotová",
      role: "Lektorka španělštiny",
      origin: "Universidad de Sevilla",
      originFlag: "🇪🇸",
      badge: "Evropská španělština",
      badgeIcon: "🎓",
      bio: JSON.stringify([
        "Olga vystudovala hispanistiku na Universidad de Sevilla a má bohaté zkušenosti s výukou cizinců.",
        "Přináší do výuky perspektivu evropské španělštiny a důraz na správnou výslovnost.",
        "Její hodiny jsou plné energie, humoru a praktických cvičení."
      ]),
      highlights: JSON.stringify([
        "Magisterský titul z hispanistiky",
        "Studium v Seville",
        "Specializace na fonetiku a konverzaci"
      ]),
    },
    {
      name: "Xabi",
      role: "Lektor španělštiny",
      origin: "Baskicko",
      originFlag: "🇪🇸",
      badge: "Architekt & lektor",
      badgeIcon: "📐",
      bio: JSON.stringify([
        "Xabi pochází z Baskicka a kromě španělštiny ovládá i baskičtinu, katalánštinu a galicijštinu.",
        "Původní profesí architekt, který objevil vášeň pro výuku jazyků.",
        "Jeho unikátní přístup spojuje kreativitu s metodickou přesností."
      ]),
      highlights: JSON.stringify([
        "Multilingvní rodilý mluvčí",
        "Kreativní přístup k výuce",
        "Znalost regionálních variant"
      ]),
    },
  ]);
  console.log("✓ Lektori seeded");

  // Jazykové úrovně
  await getDb().insert(levels).values([
    {
      code: "A1",
      label: "Úplný začátečník",
      title: "A1 – Úplný začátečník",
      subtitle: "Primeros pasos",
      description: "Naučíte se základní fráze pro běžné situace: pozdravy, představení, nakupování, objednávání v restauraci.",
      grammarTitle: "Co se naučíte",
      grammar: JSON.stringify([
        "Přítomný čas pravidelných sloves",
        "Základní slovní zásoba (500+ slov)",
        "Číslovky, barvy, dny v týdnu",
        "Zájmena a základní předložky"
      ]),
      color: "#4CAF50",
      sortOrder: 1,
    },
    {
      code: "A2",
      label: "Mírně pokročilý začátečník",
      title: "A2 – Mírně pokročilý začátečník",
      subtitle: "Paso a paso",
      description: "Dokážete se domluvit v každodenních situacích a vyprávět o sobě, své rodině a zájmech.",
      grammarTitle: "Co se naučíte",
      grammar: JSON.stringify([
        "Minulé časy (indefinido, imperfecto)",
        "Rozkazovací způsob",
        "Stupňování přídavných jmen",
        "Slovní zásoba 1000+ slov"
      ]),
      color: "#8BC34A",
      sortOrder: 2,
    },
    {
      code: "A2-B1",
      label: "Přechodová úroveň",
      title: "A2-B1 – Přechodová úroveň",
      subtitle: "En camino",
      description: "Přechodová úroveň pro ty, kdo chtějí upevnit základy před pokročilejší gramatikou.",
      grammarTitle: "Co se naučíte",
      grammar: JSON.stringify([
        "Opakování a upevnění časů",
        "Úvod do subjuntivu",
        "Složitější větné konstrukce",
        "Konverzační dovednosti"
      ]),
      color: "#CDDC39",
      sortOrder: 3,
    },
    {
      code: "B1",
      label: "Středně pokročilý",
      title: "B1 – Středně pokročilý",
      subtitle: "Avanzando",
      description: "Dokážete plynule konverzovat na běžná témata, číst články a sledovat filmy s titulky.",
      grammarTitle: "Co se naučíte",
      grammar: JSON.stringify([
        "Subjuntiv přítomný a minulý",
        "Kondicionál",
        "Nepřímá řeč",
        "Slovní zásoba 2000+ slov"
      ]),
      color: "#FFC107",
      sortOrder: 4,
    },
    {
      code: "B1+",
      label: "Vyšší středně pokročilý",
      title: "B1+ – Vyšší středně pokročilý",
      subtitle: "Más allá",
      description: "Jste připraveni na složitější konverzace a můžete začít s přípravou na DELE Intermedio.",
      grammarTitle: "Co se naučíte",
      grammar: JSON.stringify([
        "Pokročilé použití subjuntivu",
        "Idiomatické výrazy",
        "Formální vs. neformální jazyk",
        "Příprava na DELE B1"
      ]),
      color: "#FF9800",
      sortOrder: 5,
    },
    {
      code: "B2+",
      label: "Pokročilý",
      title: "B2+ – Pokročilý / DELE příprava",
      subtitle: "Nivel superior",
      description: "Plynulá konverzace na jakékoli téma. Příprava na DELE Superior a profesionální použití jazyka.",
      grammarTitle: "Co se naučíte",
      grammar: JSON.stringify([
        "Veškerá gramatika španělštiny",
        "Regionální varianty",
        "Akademický a profesní jazyk",
        "Příprava na DELE B2/C1"
      ]),
      color: "#F44336",
      sortOrder: 6,
    },
  ]);
  console.log("✓ Levels seeded");

  // Reference
  await getDb().insert(testimonials).values([
    {
      text: "Skvělá atmosféra a perfektní lektoři. Po roce už se dokážu bez problémů domluvit ve Španělsku!",
      author: "Petra K.",
      role: "Studentka B1",
      course: "Skupinové kurzy",
      rating: 5,
      featured: true,
    },
    {
      text: "Malé skupiny jsou velká výhoda. Konečně mám prostor mluvit a nebojím se dělat chyby.",
      author: "Martin V.",
      role: "Student A2",
      course: "Skupinové kurzy",
      rating: 5,
      featured: true,
    },
    {
      text: "Rodrigo a Olga jsou skvělý tým. Výuka je zábavná a člověk se těší na každou hodinu.",
      author: "Jana M.",
      role: "Studentka B2",
      course: "Skupinové kurzy",
      rating: 5,
      featured: true,
    },
    {
      text: "Díky intenzivnímu kurzu jsem se za dva týdny naučila víc než za rok na jiné škole.",
      author: "Lucie H.",
      role: "Studentka A2",
      course: "Intenzivní kurzy",
      rating: 5,
      featured: true,
    },
    {
      text: "Individuální výuka mi vyhovuje nejvíc. Tempo si určuji sám a lektor se věnuje jen mně.",
      author: "Tomáš R.",
      role: "Student B1",
      course: "Individuální výuka",
      rating: 5,
      featured: true,
    },
    {
      text: "Příprava na DELE byla náročná, ale díky Rodrigovi jsem zkoušku zvládla napoprvé!",
      author: "Eva S.",
      role: "DELE B2",
      course: "Příprava na DELE",
      rating: 5,
      featured: true,
    },
    {
      text: "Nejlepší jazyková škola v Brně. Profesionální přístup a přátelská atmosféra.",
      author: "David K.",
      role: "Student B1+",
      course: "Skupinové kurzy",
      rating: 5,
      featured: false,
    },
    {
      text: "Konečně rozumím španělským filmům bez titulků. Děkuji za skvělou výuku!",
      author: "Markéta P.",
      role: "Studentka B2",
      course: "Skupinové kurzy",
      rating: 5,
      featured: false,
    },
    {
      text: "Obchodní španělština mi otevřela nové pracovní příležitosti v Latinské Americe.",
      author: "Petr N.",
      role: "Business Spanish",
      course: "Obchodní španělština",
      rating: 5,
      featured: false,
    },
  ]);
  console.log("✓ Testimonials seeded");

  // Ceník
  await getDb().insert(pricing).values([
    {
      icon: "👤",
      name: "Individuální výuka",
      description: "Výuka 1 na 1 s lektorem. Tempo a obsah šitý na míru vašim potřebám.",
      price: "450 Kč",
      period: "/ 60 min",
      features: JSON.stringify([
        "Flexibilní rozvrh",
        "Vlastní tempo",
        "Individuální materiály",
        "Online nebo osobně"
      ]),
      featured: false,
      sortOrder: 1,
    },
    {
      icon: "👥",
      name: "Skupinový kurz",
      description: "Semestrální kurz v malé skupině max. 4 studentů. 2× týdně 90 minut.",
      price: "3 200 Kč",
      period: "/ měsíc",
      features: JSON.stringify([
        "Max. 4 studenti",
        "2× týdně 90 min",
        "Dva lektoři",
        "Učebnice v ceně"
      ]),
      featured: true,
      sortOrder: 2,
    },
    {
      icon: "⚡",
      name: "Intenzivní kurz",
      description: "Dvoutýdenní intenzivní program. 4 hodiny denně, pondělí až pátek.",
      price: "5 900 Kč",
      period: "/ 2 týdny",
      features: JSON.stringify([
        "40 hodin výuky",
        "Rychlý pokrok",
        "Malá skupina",
        "Certifikát"
      ]),
      featured: false,
      sortOrder: 3,
    },
  ]);
  console.log("✓ Pricing seeded");

  // Site Settings
  await getDb().insert(settings).values([
    { key: "semester_info", value: "Zimní semestr 2025" },
    { key: "semester_start", value: "15.9.2025" },
    { key: "contact_phone", value: "+420 777 123 456" },
    { key: "contact_email", value: "info@brno-spanelstina.cz" },
    { key: "contact_address", value: "Zábrdovická 2, 615 00 Brno" },
    { key: "lesson_schedule", value: "2× týdně 90 minut" },
    { key: "transport_info", value: "Tramvaj 2, 3 – zastávka Tkalcovská" },
  ]);
  console.log("✓ Settings seeded");

  // Homepage Content (for hero section quick info)
  await getDb().insert(pageContent).values([
    { page: "homepage", section: "quick_info", key: "semester_text", value: "Zimní semestr od 15.9.2025" },
    { page: "homepage", section: "quick_info", key: "schedule_text", value: "2× týdně 90 minut" },
    { page: "homepage", section: "quick_info", key: "location_text", value: "Zábrdovická 2, Brno" },
  ]);
  console.log("✓ Homepage content seeded");

  console.log("\n✅ Database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
