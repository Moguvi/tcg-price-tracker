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

const FORMATOS = [1, 2, 3, 5, 6, 7, 8];

const SOURCES = FORMATOS.flatMap(f => [
    { label: `Alta (f=${f})`,  url: `https://www.ligamagic.com.br/?view=cards/variacao&show=alta&formato=${f}&order=1` },
    { label: `Queda (f=${f})`, url: `https://www.ligamagic.com.br/?view=cards/variacao&show=queda&formato=${f}&order=1` },
    { label: `Hits (f=${f})`,  url: `https://www.ligamagic.com.br/?view=cards/hits&formato=${f}&order=1` },
]);

console.log(`Total de fontes: ${SOURCES.length}`); // 21 fontes


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
        await deduplicateToday(today);

    } catch (err) {
        console.error('Scraper Error:', err);
    } finally {
        await driver.quit();
    }
}

// Remove duplicate (dia, carta) rows keeping only the record with lowest id
async function deduplicateToday(today) {
    console.log('\n🧹 Removendo duplicatas de lista_cartas_dia...');
    try {
        const { data, error } = await supabase
            .from('lista_cartas_dia')
            .select('id, dia, carta')
            .eq('dia', today)
            .order('id', { ascending: true });

        if (error) throw error;

        // Group by carta, keep the first id (lowest), collect the rest for deletion
        const seen = new Map();
        const toDelete = [];

        for (const row of data) {
            if (seen.has(row.carta)) {
                toDelete.push(row.id);
            } else {
                seen.set(row.carta, row.id);
            }
        }

        if (toDelete.length === 0) {
            console.log('  ✅ Nenhuma duplicata encontrada.');
            return;
        }

        const { error: delError } = await supabase
            .from('lista_cartas_dia')
            .delete()
            .in('id', toDelete);

        if (delError) throw delError;

        console.log(`  ✅ ${toDelete.length} duplicata(s) removida(s).`);
    } catch (e) {
        console.error('  Erro na deduplicação:', e.message);
    }
}

runScraper();
