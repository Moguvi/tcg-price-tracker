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

// Sources to scrape
const SOURCES = [
    {
        label: 'Alta',
        url: 'https://www.ligamagic.com.br/?view=cards/variacao&show=alta&formato=1',
        hasVariacao: true
    },
    {
        label: 'Queda',
        url: 'https://www.ligamagic.com.br/?view=cards/variacao&show=queda&formato=1',
        hasVariacao: true
    },
    {
        label: 'Hits (Mais Vistos)',
        url: 'https://www.ligamagic.com.br/?view=cards/hits&formato=1',
        hasVariacao: false  // variacao = NULL
    },
];

// Parse "R$ 128,74" → 128.74  |  "34,35" → 34.35
function parseBRL(text) {
    if (!text) return null;
    const cleaned = text.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
}

async function scrapePage(driver, source, today) {
    console.log(`\n  → Acessando [${source.label}]: ${source.url}`);
    await driver.get(source.url);

    // Wait for page to load — wait for any card link to appear
    await driver.wait(until.elementLocated(By.css('a[href*="view=cards/card"]')), 15000);
    await driver.sleep(3000);

    // Switch to LIST view by clicking the list-view button (.tb-view-02)
    try {
        const listBtn = await driver.findElement(By.css('.tb-view-02'));
        await listBtn.click();
        await driver.sleep(2000);
        console.log('  ✓ Modo lista ativado');
    } catch (e) {
        console.log('  ⚠ Botão de modo lista não encontrado, continuando...');
    }

    // Now extract rows from the table
    let rows = [];
    try {
        await driver.wait(until.elementLocated(By.css('table tr')), 8000);
        rows = await driver.findElements(By.css('table tr'));
    } catch (e) {
        console.log('  ⚠ Tabela não encontrada, tentando fallback...');
    }

    console.log(`  → ${rows.length} linhas na tabela de [${source.label}]`);

    let saved = 0, skipped = 0;
    const today_iso = today;

    for (let i = 0; i < rows.length; i++) {
        try {
            const cells = await rows[i].findElements(By.css('td'));
            if (cells.length < 5) continue; // skip header or empty rows

            // Column 2 (index 1): card name via link text
            let cardName = '';
            try {
                const nameLink = await cells[1].findElement(By.css('a'));
                cardName = (await nameLink.getText()).trim();
                if (!cardName) {
                    // fallback: try textContent  
                    cardName = (await cells[1].getAttribute('textContent')).trim();
                }
            } catch (_) {
                cardName = (await cells[1].getAttribute('textContent')).trim();
            }

            if (!cardName) { skipped++; continue; }

            let minPrice = null;
            let variation = null;

            if (source.hasVariacao) {
                // Alta/Queda layout:
                // col[5] = variação (e.g. "34,35"), col[6] = preço mínimo (e.g. "R$ 128,74")
                // col[4] may also be variacao depending on table structure — try both

                // Try col index 6 for price first (7 cols usually: img, name, ed, rar, tipo, var, price)
                if (cells.length >= 7) {
                    const priceText = (await cells[6].getAttribute('textContent')).trim();
                    const varText   = (await cells[5].getAttribute('textContent')).trim();
                    minPrice = parseBRL(priceText);
                    variation = parseBRL(varText);
                } else if (cells.length >= 6) {
                    // Fallback: 6-col layout
                    const priceText = (await cells[5].getAttribute('textContent')).trim();
                    const varText   = (await cells[4].getAttribute('textContent')).trim();
                    minPrice = parseBRL(priceText);
                    variation = parseBRL(varText);
                }

                // Check for rank-down icon (negative variation)
                try {
                    const downIcon = await rows[i].findElements(By.css('i.rank-down, img[src*="rank-down"], img[data-src*="rank-down"]'));
                    if (downIcon.length > 0 && variation !== null) {
                        variation = -Math.abs(variation);
                    }
                } catch (_) {}

            } else {
                // Hits layout: no variation column, price is in col[5]
                if (cells.length >= 6) {
                    const priceText = (await cells[5].getAttribute('textContent')).trim();
                    minPrice = parseBRL(priceText);
                }
                variation = null;
            }

            if (!cardName || minPrice === null || isNaN(minPrice)) {
                skipped++;
                continue;
            }

            console.log(`  [${source.label}] ${cardName} | Min: R$${minPrice} | Var: ${variation ?? 'NULL'}`);

            const { error } = await supabase
                .from('lista_cartas_dia')
                .upsert({
                    dia: today_iso,
                    carta: cardName,
                    preco_min: minPrice,
                    variacao: variation
                }, { onConflict: 'dia,carta' });

            if (error) {
                console.error(`  Error saving ${cardName}: ${error.message}`);
            } else {
                saved++;
            }

        } catch (err) {
            console.error(`  Error on row ${i}:`, err.message);
        }
    }

    console.log(`  ✅ [${source.label}]: ${saved} salvas, ${skipped} ignoradas.`);
}

async function runScraper() {
    let options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1280,900');

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

        console.log('\n✅ Todos os scrapers concluídos!');

    } catch (err) {
        console.error('Scraper Error:', err);
    } finally {
        await driver.quit();
    }
}

runScraper();
