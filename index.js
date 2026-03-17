const { Client } = require('pg');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver'); // Auto-configura o binário nativo para o Selenium

require('dotenv').config();

const pgClient = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://service_account:ronin1234@localhost:5432/ligamagic'
});

pgClient.connect(err => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

async function runScraper() {
    let options = new chrome.Options();
    options.addArguments('--headless=new'); // Run headless Chrome
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
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
        const insertQuery = `
            INSERT INTO lista_cartas_dia (dia, carta, preco_min, variacao) 
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (dia, carta) 
            DO UPDATE SET preco_min = EXCLUDED.preco_min, variacao = EXCLUDED.variacao
        `;

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
                    
                    // Insert into DB
                    await pgClient.query(insertQuery, [today, cardName, minPrice, variation]);
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
        pgClient.end((err) => {
            if (err) {
                console.error("Error closing database", err.stack);
            } else {
                console.log("Database connection closed.");
            }
        });
    }
}

runScraper();
