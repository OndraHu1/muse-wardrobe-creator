# Muzejní Šatník

Interaktivní webová aplikace pro vytváření a oblékání postav. Umožňuje uživatelům oblékat 
mužské a ženské postavy různými druhy oblečení a vytvářet vlastní návrhy oděvů.

## Funkce

- Výběr mezi mužskou a ženskou postavou
- Přetahování oblečení na postavu
- Možnost měnit velikost a pozici oblečení
- Vlastní návrhář oblečení s různými kreslícími nástroji
- Přepínání mezi světlým a tmavým motivem

## Technologie

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/UI komponenty

## Jak spustit aplikaci lokálně

### Předpoklady

- Node.js (verze 16 nebo novější)
- npm nebo yarn nebo pnpm nebo bun

### Instalace

1. Naklonujte repozitář:
   ```bash
   git clone <url-repozitáře>
   ```

2. Přejděte do složky projektu:
   ```bash
   cd muse-wardrobe-creator
   ```

3. Nainstalujte závislosti:
   ```bash
   npm install
   # nebo
   yarn install
   # nebo
   pnpm install
   # nebo
   bun install
   ```

4. **Důležité: Zkopírujte obrázky**
   Zkopírujte složky s obrázky (`Muz`, `Zena`, `Chlapec`, `Devce`) do složky `public` v projektu:
   ```bash
   cp -r ../Muz ../Zena ../Chlapec ../Devce public/
   ```

5. Spuštění vývojového serveru:
   ```bash
   npm run dev
   # nebo
   yarn dev
   # nebo
   pnpm dev
   # nebo
   bun dev
   ```

6. Otevřete prohlížeč a přejděte na adresu `http://localhost:5173`

## Nasazení na web

### Sestavení pro produkci

Pro sestavení optimalizovaných produkčních souborů spusťte:

```bash
npm run build
# nebo
yarn build
# nebo
pnpm build
# nebo
bun build
```

Výsledné soubory budou ve složce `dist`.

### Nasazení na hosting

Výsledné soubory ze složky `dist` můžete nahrát na jakýkoliv statický hosting:

1. **GitHub Pages**:
   - Nahrajte obsah složky `dist` do větve `gh-pages` vašeho GitHub repozitáře
   - Nastavte GitHub Pages v nastavení repozitáře

2. **Netlify**:
   - Vytvořte účet na Netlify
   - Přetáhněte složku `dist` do sekce upload na dashboardu Netlify
   - Případně propojte s vaším GitHub repozitářem pro automatické nasazování

3. **Vercel**:
   - Vytvořte účet na Vercel
   - Importujte váš projekt z GitHub
   - Nastavte build command na `npm run build` a output directory na `dist`

## Struktura obrázků

Aplikace používá obrázky ze složek:
- `/Muz/` - Obrázky mužské postavy a oblečení
- `/Zena/` - Obrázky ženské postavy a oblečení
- `/Chlapec/` - Obrázky chlapecké postavy a oblečení
- `/Devce/` - Obrázky dívčí postavy a oblečení

Pro přidání dalšího oblečení stačí přidat nové obrázky do příslušné složky a upravit soubor `ClothingMenu.tsx`.

## Licence

© 2024 Muzejní Šatník. Všechna práva vyhrazena.