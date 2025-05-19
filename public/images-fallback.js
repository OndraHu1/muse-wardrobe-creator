// Fallback pro obrázky, pokud nejsou správně načteny
window.addEventListener('DOMContentLoaded', () => {
  // Vytvoří fallback div pokud chybí správné obrázky
  const checkImagesFallback = () => {
    const characterImages = document.querySelectorAll('img[alt*="postava"]');
    if (characterImages.length === 0) {
      console.warn('Aplikace nemohla najít obrázky postav. Používám fallback.');
      
      // Zkontroluj jestli složky existují
      fetch('/Muz/muz.png')
        .then(response => {
          if (!response.ok) {
            console.error('Složka s obrázky nenalezena: /Muz/muz.png');
            document.body.innerHTML += `
              <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                          background: white; padding: 20px; border-radius: 8px; 
                          box-shadow: 0 0 10px rgba(0,0,0,0.1); z-index: 9999; text-align: center;">
                <h2>Chybí obrázky</h2>
                <p>Aplikace nemohla najít potřebné obrázky. Ujistěte se, že jste spustili:</p>
                <pre>npm run setup</pre>
                <p>Pro kopírování obrázků do složky public/</p>
                <button onclick="window.location.reload()" 
                        style="padding: 8px 16px; background: #4f46e5; color: white; 
                               border: none; border-radius: 4px; cursor: pointer;">
                  Obnovit stránku
                </button>
              </div>
            `;
          }
        })
        .catch(error => {
          console.error('Chyba při kontrole obrázků:', error);
        });
    }
  };

  // Počkej na načtení celé stránky a zkontroluj
  setTimeout(checkImagesFallback, 2000);
});