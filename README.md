# Španělština Brno - Web

Moderní webové stránky pro jazykovou školu španělštiny v Brně.

**Klient:** Rodrigo Valenzuela
**Vývojář:** Weblyx.cz
**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion

## Quick Start

```bash
# Instalace závislostí
npm install

# Spuštění dev serveru
npm run dev

# Build pro produkci
npm run build
```

Otevři [http://localhost:3000](http://localhost:3000)

## Struktura projektu

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage ✅
│   ├── kurzy/             # Stránka kurzů
│   ├── lektori/           # Stránka lektorů
│   ├── jazykove-urovne/   # Jazykové úrovně CEFR
│   ├── o-nas/             # O škole
│   ├── reference/         # Reference studentů
│   └── kontakt/           # Kontaktní formulář
├── components/
│   ├── layout/            # Header ✅, Footer ✅
│   ├── ui/                # Buttons, Cards, etc.
│   └── sections/          # Page sections
└── lib/                   # Utilities, data
```

## Design System

### Barvy
- **Cream:** `#FBF9F6` - pozadí
- **Terracotta:** `#D35233` - primární
- **Terracotta Dark:** `#B5412A` - hover
- **Brown:** `#1F1A17` - text
- **Brown Mid:** `#6B5D54` - secondary text
- **Sand:** `#EBE6DF` - borders

### Fonty
- **Outfit** - hlavní font
- **Playfair Display** - dekorativní (italics)

### Border Radius
- SM: 16px | MD: 24px | LG: 32px | XL: 48px

## Podklady

Design soubory: `/Users/weblyx/Desktop/files/`
- `brno-spanelstina-FINAL-kurzy.html`
- `brno-spanelstina-FINAL-lektori.html`
- `brno-spanelstina-FINAL-jazykove-urovne.html`

Analýza: `/Users/weblyx/Desktop/brno-spanelstina-analyza.docx`

## Deployment

Projekt bude nasazen na Vercel s test doménou, poté přepnut na produkční doménu klienta.

---

Viz `TODO.md` pro seznam úkolů.
