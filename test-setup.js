/**
 * Jednoduchý testovací skript pro kontrolu struktury projektu
 * 
 * Skript ověřuje, že všechny potřebné soubory a složky jsou na správném místě
 * a že aplikace může být správně sestavena.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Získání cesty k aktuálnímu adresáři (náhrada za __dirname v ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Funkce pro kontrolu existence souborů a složek
function checkFileExists(filePath, errorMessage) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ CHYBA: ${errorMessage}`);
    return false;
  }
  console.log(`✅ OK: ${filePath} existuje`);
  return true;
}

// Funkce pro kopírování obrázků do složky public, pokud tam ještě nejsou
function setupImages() {
  const publicDir = path.resolve(__dirname, 'public');
  const requiredFolders = ['Muz', 'Zena', 'Chlapec', 'Devce'];
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
    console.log("✅ OK: Vytvořena složka public");
  }
  
  let allFoldersExist = true;
  
  for (const folder of requiredFolders) {
    const targetPath = path.resolve(publicDir, folder);
    const sourcePath = path.resolve(__dirname, '..', folder);
    
    if (!fs.existsSync(targetPath) && fs.existsSync(sourcePath)) {
      console.log(`Kopíruji složku ${folder} do public/...`);
      fs.mkdirSync(targetPath, { recursive: true });
      
      // Kopírování obrázků
      const files = fs.readdirSync(sourcePath);
      for (const file of files) {
        const srcFile = path.resolve(sourcePath, file);
        const destFile = path.resolve(targetPath, file);
        
        if (fs.statSync(srcFile).isFile()) {
          fs.copyFileSync(srcFile, destFile);
        }
      }
      
      console.log(`✅ OK: Složka ${folder} zkopírována do public/`);
    } else if (!fs.existsSync(targetPath) && !fs.existsSync(sourcePath)) {
      console.error(`❌ CHYBA: Složka ${folder} neexistuje ani ve zdrojovém adresáři`);
      allFoldersExist = false;
    } else {
      console.log(`✅ OK: Složka public/${folder} již existuje`);
    }
  }
  
  return allFoldersExist;
}

// Kontrola hlavních souborů projektu
function runTests() {
  console.log("🔍 Spouštím kontrolu projektu...");
  
  let allTestsPassed = true;
  
  // Kontrola existence základních souborů
  const requiredFiles = [
    { path: 'package.json', message: 'Soubor package.json chybí' },
    { path: 'src/App.tsx', message: 'Soubor App.tsx chybí' },
    { path: 'src/components/CharacterDisplay.tsx', message: 'Komponenta CharacterDisplay.tsx chybí' },
    { path: 'src/components/ClothingMenu.tsx', message: 'Komponenta ClothingMenu.tsx chybí' },
    { path: 'src/components/GenderToggle.tsx', message: 'Komponenta GenderToggle.tsx chybí' },
    { path: 'src/pages/Index.tsx', message: 'Stránka Index.tsx chybí' }
  ];
  
  for (const file of requiredFiles) {
    if (!checkFileExists(file.path, file.message)) {
      allTestsPassed = false;
    }
  }
  
  // Kontrola a kopírování obrázků
  console.log("\n🖼️ Kontroluji obrázky...");
  if (!setupImages()) {
    allTestsPassed = false;
    console.error("❌ CHYBA: Některé složky s obrázky chybí");
  }
  
  // Kontrola TypeScript kompilace
  console.log("\n🔨 Kontroluji TypeScript kompilaci...");
  try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    console.log("✅ OK: TypeScript kompilace proběhla úspěšně");
  } catch (error) {
    console.error("❌ CHYBA: TypeScript kompilace selhala");
    allTestsPassed = false;
  }
  
  // Výsledek testů
  console.log("\n🏁 Výsledek kontroly projektu:");
  if (allTestsPassed) {
    console.log("✅ ÚSPĚCH: Všechny testy prošly! Aplikace by měla být připravena ke spuštění.");
    console.log("📝 Můžete spustit 'npm run dev' pro spuštění vývojového serveru.");
  } else {
    console.log("❌ NEÚSPĚCH: Některé testy selhaly. Opravte chyby a spusťte test znovu.");
  }
}

// Spuštění testů
runTests();