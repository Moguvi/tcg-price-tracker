const { createClient } = require('@supabase/supabase-js');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

try {
    require('dotenv').config();
} catch (_) {}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠ Warning: SUPABASE_URL or SUPABASE_KEY not found in environment.");
}

const supabase = createClient(supabaseUrl || 'https://xxxxxxxx.supabase.co', supabaseKey || 'public-anon-key');

const FORMATOS = [1, 2, 3, 5, 6, 7, 8];

const SOURCES = FORMATOS.flatMap(f => [
    { label: `Alta (f=${f})`,  url: `https://www.ligamagic.com.br/?view=cards/variacao&show=alta&formato=${f}&order=1` },
    { label: `Queda (f=${f})`, url: `https://www.ligamagic.com.br/?view=cards/variacao&show=queda&formato=${f}&order=1` },
    { label: `Hits (f=${f})`,  url: `https://www.ligamagic.com.br/?view=cards/hits&formato=${f}&order=1` },
]);

console.log(`Total de fontes: ${SOURCES.length}`);

async function scrapePage(driver, source, today) {
    try {
        console.log(`\n  → [${source.label}]: ${source.url}`);
        await driver.get(source.url);

        await driver.wait(until.elementLocated(By.css('body')), 20000);
        await driver.sleep(5000);

        try {
            const listBtn = await driver.findElement(By.css('.tb-view-02'));
            await listBtn.click();
            await driver.sleep(2000);
        } catch (_) {}

        let rows = [];
        try {
            await driver.wait(until.elementLocated(By.css('table tr')), 10000);
            rows = await driver.findElements(By.css('table tr'));
        } catch (e) {
            console.log(`  [${source.label}] ⚠ Nenhuma tabela encontrada.`);
            return;
        }

        console.log(`  → ${rows.length} linhas encontradas`);

        let saved = 0;
        for (const row of rows) {
            try {
                const cells = await row.findElements(By.css('td'));
                if (cells.length < 2) continue;

                let cardName = '';
                try {
                    const link = await cells[1].findElement(By.css('a'));
                    cardName = (await link.getText()).trim();
                } catch (_) {
                    cardName = (await cells[1].getAttribute('textContent')).trim();
                }

                if (!cardName) continue;

                const { error } = await supabase
                    .from('lista_cartas_dia')
                    .upsert({ dia: today, carta: cardName }, { onConflict: 'dia,carta' });

                if (!error) saved++;

            } catch (err) { }
        }
        console.log(`  ✅ [${source.label}]: ${saved} cartas salvas.`);

    } catch (err) {
        console.error(`  [${source.label}] Error:`, err.message);
    }
}

async function runScraper() {
    let options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1280,900');

    let driver;
    try {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        const today = new Date().toISOString().split('T')[0];

        for (const source of SOURCES) {
            try {
                await scrapePage(driver, source, today);
            } catch (pErr) {
                console.error(`  [${source.label}] Page Error:`, pErr.message);
            }
        }

        console.log('\n✅ Todos os scrapers concluídos!');
        await deduplicateToday(today);

    } catch (err) {
        console.error('Scraper Error:', err.message);
    } finally {
        if (driver) await driver.quit();
    }
}

async function deduplicateToday(today) {
    console.log('\n🧹 Removendo duplicatas...');
    try {
        const { data, error } = await supabase
            .from('lista_cartas_dia')
            .select('id, dia, carta')
            .eq('dia', today)
            .order('id', { ascending: true });

        if (error) throw error;

        const seen = new Map();
        const toDelete = [];
        for (const row of data) {
            if (seen.has(row.carta)) {
                toDelete.push(row.id);
            } else {
                seen.set(row.carta, row.id);
            }
        }

        if (toDelete.length > 0) {
            await supabase.from('lista_cartas_dia').delete().in('id', toDelete);
            console.log(`  ✅ ${toDelete.length} duplicata(s) removida(s).`);
        } else {
            console.log('  ✅ Nenhuma duplicata encontrada.');
        }
    } catch (e) {
        console.error('  Deduplication Error:', e.message);
    }
}

runScraper();
