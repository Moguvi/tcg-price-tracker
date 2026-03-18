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

// Pages to scrape: { url, hasVariacao }
const SOURCES = [
    {
        label: 'Alta',
        url:   'https://www.ligamagic.com.br/?view=cards/variacao&show=alta&formato=1',
        hasVariacao: true
    },
    {
        label: 'Queda',
        url:   'https://www.ligamagic.com.br/?view=cards/variacao&show=queda&formato=1',
        hasVariacao: true
    },
    {
        label: 'Hits (Mais Vistos)',
        url:   'https://www.ligamagic.com.br/?view=cards/hits&formato=1',
        hasVariacao: false   // variacao = NULL for this source
    },
];

// ─── Scrape one page ──────────────────────────────────────────────────────────
async function scrapePage(driver, source, today) {
    console.log(`\n  → Acessando [${source.label}]: ${source.url}`);
    await driver.get(source.url);

    await driver.wait(until.elementLocated(By.css('.card-item')), 15000);
    await driver.sleep(3000);

    const cardItems = await driver.findElements(By.css('.card-item'));
    console.log(`  → ${cardItems.length} cartas encontradas em [${source.label}]`);

    let saved = 0, skipped = 0;

    for (const item of cardItems) {
        try {
            // Card name
            const nameElement = await item.findElement(By.css('.invisible-label b'));
            let cardName = (await nameElement.getAttribute('textContent')).trim();

            // Price blocks
            const priceBlocks = await item.findElements(By.css('.avgp-minprc'));

            let minPrice = null;
            let variation = null;

            if (source.hasVariacao) {
                // Pages with high/low variation: need at least 2 price blocks
                if (priceBlocks.length < 2) {
                    skipped++;
                    continue;
                }

                // Min price is the last block
                let minPriceText = await priceBlocks[priceBlocks.length - 1].getAttribute('textContent');
                minPriceText = minPriceText.replace('R$', '').trim().replace(/\./g, '').replace(',', '.');
                minPrice = parseFloat(minPriceText);

                // Variation is the first block
                let varText = await priceBlocks[0].getAttribute('textContent');
                varText = varText.trim().replace(/\./g, '').replace(',', '.');
                variation = parseFloat(varText);

                // Check if it's negative (rank-down icon)
                const icons = await priceBlocks[0].findElements(By.css('img[data-src*="rank-down"]'));
                if (icons.length > 0) {
                    variation = -Math.abs(variation);
                }

            } else {
                // Hits page: only needs min price, variacao stays NULL
                if (priceBlocks.length === 0) {
                    skipped++;
                    continue;
                }
                let minPriceText = await priceBlocks[priceBlocks.length - 1].getAttribute('textContent');
                minPriceText = minPriceText.replace('R$', '').trim().replace(/\./g, '').replace(',', '.');
                minPrice = parseFloat(minPriceText);
                variation = null;
            }

            if (!cardName || isNaN(minPrice)) {
                skipped++;
                continue;
            }

            console.log(`  Saving [${source.label}]: ${cardName} | Min: R$${minPrice} | Var: ${variation ?? 'NULL'}`);

            const upsertData = {
                dia: today,
                carta: cardName,
                preco_min: minPrice,
                variacao: variation   // null is allowed by the DB
            };

            const { error } = await supabase
                .from('lista_cartas_dia')
                .upsert(upsertData, { onConflict: 'dia,carta' });

            if (error) {
                console.error(`  Error saving ${cardName}: ${error.message}`);
            } else {
                saved++;
            }

        } catch (err) {
            console.error('  Error processing card item:', err.message);
        }
    }

    console.log(`  ✅ [${source.label}] concluído: ${saved} salvas, ${skipped} ignoradas.`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function runScraper() {
    let options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    let service = new chrome.ServiceBuilder('chromedriver');
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(service)
        .build();

    try {
        const today = new Date().toISOString().split('T')[0];

        for (const source of SOURCES) {
            await scrapePage(driver, source, today);
        }

        console.log('\n✅ Todos os scrapers concluídos com sucesso!');

    } catch (err) {
        console.error('Scraper Error:', err);
    } finally {
        await driver.quit();
    }
}

runScraper();
