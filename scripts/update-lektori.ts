import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { lektori } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

async function updateLektori() {
  console.log("Updating lektori...");

  // 1. Aktualizuj Rodrigovu fotku (předpokládám ID 1)
  await db.update(lektori)
    .set({ avatar: "/lektori/rodrigo.jpg" })
    .where(eq(lektori.id, 1));
  console.log("✓ Rodrigo - foto aktualizováno");

  // 2. Smaž staré lektory (kromě Rodriga)
  await db.delete(lektori).where(eq(lektori.id, 2));
  await db.delete(lektori).where(eq(lektori.id, 3));
  console.log("✓ Staří lektoři smazáni");

  // 3. Přidej nové lektory
  const noviLektori = [
    {
      name: "Míša",
      role: "Lektorka španělštiny",
      origin: "Barcelona",
      originFlag: "🇪🇸",
      avatar: "/lektori/misa.jpg",
      bio: JSON.stringify([
        "¡Hola! Jsem Míša, s výukou španělštiny mám dlouholeté zkušenosti a je každodenní součástí mého života.",
        "Odjela jsem totiž studovat do Barcelony a už jsem tu zůstala – učím tedy převážně online.",
        "Zaměřuji se na komunikaci, praktické využití jazyka a pohodovou atmosféru, aby studenty španělština bavila a dávala jim smysl."
      ]),
      highlights: JSON.stringify(["Online výuka", "Komunikace", "Praktický jazyk"]),
    },
    {
      name: "Klára",
      role: "Lektorka španělštiny",
      origin: "Česká republika",
      originFlag: "🇨🇿",
      badge: "DELE B1 & B2",
      avatar: "/lektori/klara.jpg",
      bio: JSON.stringify([
        "¡Hola! Jmenuji se Klára a španělština mě provází už více než 20 let a postupně se stala přirozenou součástí mého života.",
        "Studovala jsem ji také přímo ve Španělsku – na jazykových kurzech v Málaze a Barceloně, kde jsem si kromě jazyka osvojila i místní kulturu a autentický způsob vyjadřování.",
        "Mám složené mezinárodní jazykové zkoušky DELE na úrovni B1 a B2. Vedu individuální i skupinové lekce a snažím se vytvořit příjemnou a podporující atmosféru, aby se studenti nebáli mluvit a postupně získávali jistotu.",
        "Výuku přizpůsobuji individuálním potřebám a cílům – ať už se chcete domluvit na cestách, zlepšit se v práci nebo si splnit osobní sen naučit se španělsky."
      ]),
      highlights: JSON.stringify(["20+ let zkušeností", "DELE B1 & B2", "Individuální přístup"]),
    },
    {
      name: "Laura",
      role: "Lektorka španělštiny",
      origin: "Venezuela",
      originFlag: "🇻🇪",
      avatar: "/lektori/laura.jpg",
      bio: JSON.stringify([
        "Jsem Laura, učitelka španělštiny a studentka španělské literatury.",
        "Učila jsem v Rusku, Španělsku, Venezuele, Kolumbii a nyní i v České republice. Mluvím španělsky, rusky, česky a anglicky a učím se francouzsky.",
        "Zažila jsem výzvy spojené s učením nových jazyků, a proto ráda učím zábavnou a poutavou formou, vedu příjemné konverzace a pomáhám svým studentům učit se španělsky a zároveň objevovat jejich kulturu."
      ]),
      highlights: JSON.stringify(["Mezinárodní zkušenosti", "4 jazyky", "Zábavná výuka"]),
    },
    {
      name: "Eva",
      role: "Lektorka španělštiny",
      origin: "Česká republika",
      originFlag: "🇨🇿",
      avatar: "/lektori/eva.jpg",
      bio: JSON.stringify([
        "Jmenuji se Eva a pocházím ze severní Moravy. Výuce jazyků a překladatelství se věnuji už více než deset let – a pořád mě baví stejně jako na začátku.",
        "Španělštinu jsem studovala v České republice i ve Španělsku. Mám bohaté zkušenosti s individuální a skupinovou výukou v jazykových školách i ve firemním prostředí.",
        "Ve škole u Rodriga jsem začala působit v roce 2014. Na lekcích učím všechny jazykové úrovně a zakládám si na příjemné, uvolněné atmosféře.",
        "Jako každý správný lingvista miluji cizí jazyky a cestování."
      ]),
      highlights: JSON.stringify(["10+ let zkušeností", "Od roku 2014", "Všechny úrovně"]),
    },
    {
      name: "Miguel Ángel",
      role: "Lektor španělštiny",
      origin: "Chile",
      originFlag: "🇨🇱",
      avatar: "/lektori/miguel.jpg",
      bio: JSON.stringify([
        "Miguel Ángel Gutiérrez Kuruz (*1993, Santiago de Chile)",
        "Vystudoval podniková ekonomiku na Universidad de Santiago de Chile. V České republice žije od roku 2018 a od září 2023 se věnuje výuce španělštiny.",
        "Zajímá se o folklorní tanec, a to jak chilský, tak český, a baví ho studium jazyků. Aktivně hovoří česky, což mu umožňuje lépe porozumět potřebám studentů."
      ]),
      highlights: JSON.stringify(["Rodilý mluvčí", "Mluví česky", "Folklorní tanec"]),
    },
    {
      name: "Mariano",
      role: "Lektor španělštiny",
      origin: "Mexiko",
      originFlag: "🇲🇽",
      avatar: "/lektori/mariano.jpg",
      bio: JSON.stringify([
        "Jmenuji se Mariano a jsem Mexičan, studuji španělštinu a portugalštinu na Masarykově univerzitě. Miluji jazyky a ještě více miluji sdílet je s lidmi, kteří mi jsou blízcí.",
        "Mluvím španělsky, slovensky, portugalsky a anglicky.",
        "Španělštinu učím už 4 roky a miluji svou práci. Snažím se, aby moje hodiny byly plné nových poznatků, zajímavých témat k diskusi a příjemné atmosféry pro všechny.",
        "Jsem rád, když se moji studenti učí o hispánské kultuře a stejně tak se se mnou dělí o svou kulturu."
      ]),
      highlights: JSON.stringify(["Rodilý mluvčí", "4 jazyky", "4 roky výuky"]),
    },
  ];

  for (const lektor of noviLektori) {
    await db.insert(lektori).values(lektor);
    console.log(`✓ ${lektor.name} přidán`);
  }

  console.log("\n✅ Hotovo! Všichni lektoři aktualizováni.");
  process.exit(0);
}

updateLektori().catch(console.error);
