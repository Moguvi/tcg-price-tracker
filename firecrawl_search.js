require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_KEY in config.");
}

const supabase = createClient(supabaseUrl || 'https://xxxxxxxx.supabase.co', supabaseKey || 'public-anon-key');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseBRL(text) {
    if (!text) return null;
    const cleaned = text.replace(/R\$/g, '').replace(/\./g, '').replace(',', '.').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
}

// From a flat array of text lines, extract { tipo, min, medio } blocks
// Pattern: [..., "Normal", "R$ X", "R$ Y", "R$ Z", ..., "Foil", "R$ X", ...]
// We look for "Normal", "Foil", "Surge Foil" as anchors, then grab the next R$ values
function extractPriceBlocks(lines) {
    const TYPES = ['Surge Foil', 'Foil', 'Normal'];
    const blocks = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Check if line matches a card type exactly
        const matchedType = TYPES.find(t => line === t);
        if (!matchedType) continue;

        // Collect R$ values that follow
        const prices = [];
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
            const next = lines[j].trim();
            if (/^R\$\s*[\d.,]+$/.test(next)) {
                prices.push(parseBRL(next));
            } else if (TYPES.includes(next)) {
                break; // hit next type block
            }
        }

        if (prices.length >= 1) {
            blocks.push({
                tipo: matchedType,
                min:   prices[0],
                medio: prices[1] ?? prices[0],
            });
        }
    }

    return blocks;
}

// ─── Selenium Driver ──────────────────────────────────────────────────────────

async function createDriver() {
    let options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1280,900');
    let service = new chrome.ServiceBuilder('chromedriver');
    return new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(service)
        .build();
}

// ─── Scrape ONE card ──────────────────────────────────────────────────────────

async function scrapeCard(driver, cardName) {
    const records = [];
    const baseUrl = `https://www.ligamagic.com.br/?view=cards/card&card=${encodeURIComponent(cardName)}`;

    console.log(`  → ${cardName}`);
    await driver.get(baseUrl);
    await driver.sleep(3500);

    // ── Raridade ──────────────────────────────────────────────────────────────
    let raridade = '';
    try {
        const el = await driver.findElement(By.css('a[href*="rarid="]'));
        raridade = (await el.getText()).trim();
    } catch (_) {}

    // ── Tipo de carta ─────────────────────────────────────────────────────────
    let tipoCarta = '';
    try {
        const el = await driver.findElement(By.css('a[href*="tipo%3D"], a[href*="tipo="]'));
        tipoCarta = (await el.getText()).trim();
    } catch (_) {}

    // ── Collect all edition links on this page ────────────────────────────────
    let edicoes = [];
    try {
        const edLinks = await driver.findElements(By.css('a[href*="view=cards/card"][href*="ed="]'));
        const seen = new Set();
        for (const link of edLinks) {
            const href = await link.getAttribute('href');
            const m = href.match(/[?&]ed=([^&]+)/);
            if (!m) continue;
            const sigla = m[1];
            if (seen.has(sigla)) continue;
            seen.add(sigla);
            const nome = (await link.getText()).trim();
            if (nome) edicoes.push({ sigla, nome });
        }
    } catch (_) {}

    if (edicoes.length === 0) {
        // No edition selector found — only the current page edition
        edicoes = [{ sigla: null, nome: '' }];
    }

    console.log(`    📦 ${edicoes.length} edição(ões)`);

    // ── For each edition, load the page and parse prices ─────────────────────
    for (const ed of edicoes) {
        try {
            if (ed.sigla) {
                const edUrl = `${baseUrl}&ed=${ed.sigla}`;
                await driver.get(edUrl);
                await driver.sleep(2500);
            }

            // ── Grab full page innerText ──────────────────────────────────────
            const bodyText = await driver.findElement(By.css('body')).getAttribute('innerText');
            const lines = bodyText.split('\n').map(l => l.trim()).filter(Boolean);

            // ── Extract edition name if not known ──────────────────────────────
            let edicaoNome = ed.nome;
            
            // ── Extract year ───────────────────────────────────────────────────
            let ano = 0;
            // Look for year near edition section — grab first 4-digit year
            // that appears after "Edição" or "Lançamento" label in the text
            const edicaoIdx = lines.findIndex(l => /^(Edição|Edition|Lançamento|Launch)/i.test(l));
            const searchFrom = edicaoIdx >= 0 ? edicaoIdx : 0;
            for (let i = searchFrom; i < Math.min(searchFrom + 30, lines.length); i++) {
                const m = lines[i].match(/\b(200[0-9]|201[0-9]|202[0-9])\b/);
                if (m) { ano = parseInt(m[0]); break; }
            }

            // ── Extract price blocks (Normal / Foil / Surge Foil) ─────────────
            const priceBlocks = extractPriceBlocks(lines);

            if (priceBlocks.length === 0) {
                console.log(`    ⚠ Sem preços para: ${edicaoNome || ed.sigla}`);
                continue;
            }

            for (const block of priceBlocks) {
                console.log(`    ✓ ${edicaoNome} | ${block.tipo} | min=${block.min} med=${block.medio}`);
                records.push({
                    Nome_da_carta: cardName,
                    Edição: edicaoNome,
                    Ano: ano,
                    Raridade: raridade,
                    TipoCarta: tipoCarta,
                    Tipo_Carta: block.tipo,       // Normal / Foil / Surge Foil
                    Preço_Mínimo: block.min,
                    Preço_Médio: block.medio,
                });
            }

        } catch (e) {
            console.error(`    ⚠ Erro edição ${ed.nome || ed.sigla}:`, e.message);
        }

        await new Promise(r => setTimeout(r, 800));
    }

    return records;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function runAdvancedSearch() {
    const driver = await createDriver();

    try {
        console.log('Connected to Supabase via REST API');

        const dateObj = new Date();
        const ninetyDaysAgo = new Date(dateObj.getTime() - 90 * 24 * 60 * 60 * 1000)
            .toISOString().split('T')[0];

        const { data: resRows, error: selectError } = await supabase
            .from('lista_cartas_dia')
            .select('carta')
            .gte('dia', ninetyDaysAgo)
            .not('carta', 'is', null);

        if (selectError) throw selectError;

        const cards = [...new Set(resRows.map(r => r.carta))];
        console.log(`Found ${cards.length} distinct cards from the last 90 days.`);

        const today = new Date().toISOString().split('T')[0];

        for (const cardName of cards) {
            console.log(`\n--- ${cardName} ---`);
            try {
                const records = await scrapeCard(driver, cardName);
                console.log(`  ✅ ${records.length} registro(s) extraído(s)`);

                for (const record of records) {
                    try {
                        const { error } = await supabase
                            .from('his_precos_ligamagic')
                            .upsert({
                                data: today,
                                carta: record.Nome_da_carta,
                                edicao: record.Edição,
                                ano: record.Ano || 0,
                                raridade: record.Raridade,
                                tipo_carta: record.Tipo_Carta,
                                preco_min: record.Preço_Mínimo,
                                preco_medio: record.Preço_Médio
                            }, { onConflict: 'data,carta,edicao,tipo_carta' });

                        if (error) throw error;
                    } catch (e) {
                        console.error('  Error inserting:', e.message);
                    }
                }

                if (records.length === 0) {
                    console.log('  ⚠ Nenhum registro encontrado.');
                }

            } catch (err) {
                console.error(`  Error scraping ${cardName}:`, err.message);
            }

            await new Promise(r => setTimeout(r, 2000));
        }

    } catch (err) {
        console.error('Fatal error:', err);
    } finally {
        await driver.quit();
        console.log('\n✅ Scraping finalizado.');
    }
}

runAdvancedSearch();
