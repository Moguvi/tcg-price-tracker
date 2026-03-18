const { createClient } = require('@supabase/supabase-js');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_KEY in config.");
}

const supabase = createClient(supabaseUrl || 'https://xxxxxxxx.supabase.co', supabaseKey || 'public-anon-key');
console.log('Connected to Supabase via REST API');

async function runScraper() {
    let options = new chrome.Options();
    options.addArguments('--headless=new'); // Run headless Chrome
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
    // Força o Selenium a usar o driver global do sistema Linux (instalado direto no Action)
    let service = new chrome.ServiceBuilder('chromedriver');
    
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(service)
        .build();
    try {
        console.log("Navigating to LigaMagic...");
        await driver.get('https://www.ligamagic.com.br/?view=cards/variacao&show=alta&formato=1');

        // Wait for the card items to load
        console.log("Waiting for cards to load...");
        await driver.wait(until.elementLocated(By.css('.card-item')), 15000);
        
        // Wait a little extra to ensure prices and variants load
        await driver.sleep(3000);

        let cardItems = await driver.findElements(By.css('.card-item'));
        console.log(`Found ${cardItems.length} cards.`);

        const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

        for (let item of cardItems) {
            try {
                // Get Card Name
                let nameElement = await item.findElement(By.css('.invisible-label b'));
                let cardName = await nameElement.getAttribute('textContent');
                cardName = cardName.trim();

                // Get Price Blocks
                let priceBlocks = await item.findElements(By.css('.avgp-minprc'));
                
                if (priceBlocks.length >= 2) {
                    // Min Price is usually the last one (R$ XX,XX)
                    let minPriceText = await priceBlocks[priceBlocks.length - 1].getAttribute('textContent');
                    minPriceText = minPriceText.replace('R$', '').trim().replace(/\./g, '').replace(',', '.');
                    let minPrice = parseFloat(minPriceText);

                    // Variation is usually the first one (XX,XX)
                    let varText = await priceBlocks[0].getAttribute('textContent');
                    varText = varText.trim().replace(/\./g, '').replace(',', '.');
                    let variation = parseFloat(varText);
                    
                    // Check if variation is negative (looking for down icon)
                    let icons = await priceBlocks[0].findElements(By.css('img[data-src*="rank-down"]'));
                    if (icons.length > 0) {
                        variation = -Math.abs(variation);
                    }

                    console.log(`Saving: ${cardName} | Min: ${minPrice} | Var: ${variation}`);
                    
                    // Upsert into Supabase
                    const { error } = await supabase
                        .from('lista_cartas_dia')
                        .upsert({
                            dia: today,
                            carta: cardName,
                            preco_min: minPrice,
                            variacao: variation
                        }, { onConflict: 'dia,carta' });
                        
                    if (error) {
                        console.error(`Error saving card ${cardName}:`, error.message);
                    }
                } else {
                    console.log(`Could not find prices for card: ${cardName}`);
                }
            } catch (err) {
                console.error("Error processing a card item:", err.message);
            }
        }
        
        console.log("Scraping and insertion complete!");
        
    } catch (err) {
        console.error("Scraper Error:", err);
    } finally {
        await driver.quit();
    }
}

runScraper();
