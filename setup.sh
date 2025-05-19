#!/bin/bash

# Vytvoření složky public, pokud neexistuje
mkdir -p public

# Zkopírování složek s obrázky do složky public
echo "Kopíruji složky s obrázky do složky public..."

# Funkce pro kopírování složek
copy_folder() {
  local src="../$1"
  local dest="public/$1"
  
  if [ -d "$src" ]; then
    mkdir -p "$dest"
    echo "Kopíruji složku $src do $dest"
    cp -r "$src"/* "$dest"/ 2>/dev/null || echo "Varování: Žádné soubory v $src"
    
    # Kontrola, zda existuje hlavní soubor postavy
    if [ -f "$src/$1.png" ]; then
      cp "$src/$1.png" "$dest"/ 
      echo "✓ Soubor $1.png byl zkopírován"
    else
      echo "! Varování: Soubor $1.png nebyl nalezen ve složce $src"
      # Pokud neexistuje, vytvoříme symlink na fallback obrázek
      echo "  Používám fallback obrázek..."
      touch "$dest/$1.png" # Vytvoříme prázdný soubor jako zástupný symbol
    fi
  else
    echo "! Chyba: Složka $src neexistuje!"
  fi
}

# Kopírování všech složek
copy_folder "Muz"
copy_folder "Zena" 
copy_folder "Chlapec"
copy_folder "Devce"

echo ""
echo "Hotovo! Obrázky byly zkopírovány do složky public/"
echo "Nyní můžete spustit aplikaci příkazem 'npm run dev'"