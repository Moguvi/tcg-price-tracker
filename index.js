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

const SOURCES = [
    { label: 'Alta',            url: 'https://www.ligamagic.com.br/?view=cards/variacao&show=alta&formato=1' },
    { label: 'Queda',           url: 'https://www.ligamagic.com.br/?view=cards/variacao&show=queda&formato=1' },
    { label: 'Hits (Mais Vistos)', url: 'https://www.ligamagic.com.br/?view=cards/hits&formato=1' },
];

async function scrapePage(driver, source, today) {
    console.log(`\n  → [${source.label}]: ${source.url}`);
    await driver.get(source.url);

    await driver.wait(until.elementLocated(By.css('a[href*="view=cards/card"]')), 15000);
    await driver.sleep(3000);

    // Switch to list view
    try {
        const listBtn = await driver.findElement(By.css('.tb-view-02'));
        await listBtn.click();
        await driver.sleep(2000);
    } catch (_) {}

    // Get all table rows
    let rows = [];
    try {
        await driver.wait(until.elementLocated(By.css('table tr')), 5000);
        rows = await driver.findElements(By.css('table tr'));
    } catch (_) {}

    console.log(`  → ${rows.length} linhas encontradas`);

    let saved = 0;

    for (const row of rows) {
        try {
            const cells = await row.findElements(By.css('td'));
            if (cells.length < 2) continue;

            // Card name is in column index 1 (second td)
            let cardName = '';
            try {
                const link = await cells[1].findElement(By.css('a'));
                cardName = (await link.getText()).trim();
            } catch (_) {
                cardName = (await cells[1].getAttribute('textContent')).trim();
            }

            if (!cardName) continue;

            console.log(`  [${source.label}] ${cardName}`);

            const { error } = await supabase
                .from('lista_cartas_dia')
                .upsert({ dia: today, carta: cardName }, { onConflict: 'dia,carta' });

            if (error) {
                console.error(`  Error saving ${cardName}: ${error.message}`);
            } else {
                saved++;
            }

        } catch (err) {
            console.error('  Error on row:', err.message);
        }
    }

    console.log(`  ✅ [${source.label}]: ${saved} cartas salvas.`);
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
