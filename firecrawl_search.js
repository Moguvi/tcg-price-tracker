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

// ─── Selenium Driver Setup ────────────────────────────────────────────────────
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

// ─── Parse price string like "R$ 12,50" → 12.50 ──────────────────────────────
function parseBRL(text) {
    if (!text) return null;
    const cleaned = text.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
}

// ─── Extract data for ONE card across ALL its editions ────────────────────────
async function scrapeCard(driver, cardName) {
    const records = [];
    const url = `https://www.ligamagic.com.br/?view=cards/card&card=${encodeURIComponent(cardName)}`;
    
    console.log(`  → Acessando: ${url}`);
    await driver.get(url);
    await driver.sleep(3500);

    // ─── 1. Get card details (Raridade) from the page ────────────────────────
    let raridade = '';
    try {
        // Raridade link has rarid= in href
        const raridLink = await driver.findElement(By.css('a[href*="rarid="]'));
        raridade = (await raridLink.getText()).trim();
    } catch (_) {}

    // ─── 2. Get all editions available via the edition dropdown/list ──────────
    // The page shows editions as links with ed= in the href
    let edicoes = [];
    try {
        // Edition selector: each edition has a link with ed= param 
        const edLinks = await driver.findElements(By.css('a[href*="view=cards/card"][href*="ed="]'));
        for (const link of edLinks) {
            try {
                const href = await link.getAttribute('href');
                const edMatch = href.match(/ed=([^&]+)/);
                const edName = (await link.getText()).trim();
                if (edMatch && edName) {
                    edicoes.push({ sigla: edMatch[1], nome: edName });
                }
            } catch (_) {}
        }
        // Deduplicate by sigla
        const seen = new Set();
        edicoes = edicoes.filter(e => {
            if (seen.has(e.sigla)) return false;
            seen.add(e.sigla);
            return true;
        });
    } catch (e) {
        console.log(`    ⚠ Nenhuma edição encontrada para ${cardName}: ${e.message}`);
    }

    // If no specific editions found, at least try the current page
    if (edicoes.length === 0) {
        edicoes = [{ sigla: null, nome: '' }];
    }

    console.log(`    📦 Edições encontradas: ${edicoes.length}`);

    // ─── 3. For each edition, load the page and extract prices ────────────────
    for (const edicao of edicoes) {
        try {
            let pageUrl = url;
            if (edicao.sigla) {
                pageUrl = `https://www.ligamagic.com.br/?view=cards/card&card=${encodeURIComponent(cardName)}&ed=${edicao.sigla}`;
                await driver.get(pageUrl);
                await driver.sleep(2500);
            }

            // Get edition name (in case we're overriding from the page header)
            let edicaoNome = edicao.nome;
            try {
                const edHeader = await driver.findElement(By.css('.card-ed-title, .ed-name, [class*="edicao-nome"], select option[selected]'));
                const headerText = (await edHeader.getText()).trim();
                if (headerText) edicaoNome = headerText;
            } catch (_) {}

            // Get year from edition year span/text
            let ano = 0;
            try {
                const bodyText = await driver.findElement(By.css('body')).getAttribute('innerText');
                // Look for 4-digit year near edition name
                const yearMatch = bodyText.match(/\b(19|20)\d{2}\b/);
                if (yearMatch) ano = parseInt(yearMatch[0]);
            } catch (_) {}

            // ── Extract the price summary table ──────────────────────────────
            // The summary section has rows like: Normal | R$ 12,00 | R$ 15,00 | R$ 20,00
            // or: Foil | R$ 30,00 | R$ 35,00 | R$ 40,00
            
            // Try to find price rows by locating elements that have R$ and a card type
            let priceRows = [];
            try {
                // Look for table rows that contain price data
                const allTrs = await driver.findElements(By.css('tr'));
                for (const tr of allTrs) {
                    try {
                        const text = (await tr.getText()).trim();
                        if (!text.includes('R$')) continue;
                        
                        // Check if row has card type (Normal, Foil, Surge Foil)
                        const hasType = /Normal|Foil|Surge\s*Foil/i.test(text);
                        if (!hasType) continue;
                        
                        // Extract cells
                        const tds = await tr.findElements(By.css('td'));
                        const cells = [];
                        for (const td of tds) {
                            cells.push((await td.getText()).trim());
                        }
                        priceRows.push({ text, cells });
                    } catch (_) {}
                }
            } catch (_) {}

            // If no rows found via table, try div-based layout
            if (priceRows.length === 0) {
                try {
                    const bodyText = await driver.findElement(By.css('body')).getAttribute('innerText');
                    // Pattern: "Normal\nR$ 12,00\nR$ 15,00" or "Foil R$ 30,00 R$ 35,00"
                    const lines = bodyText.split('\n').map(l => l.trim()).filter(Boolean);
                    
                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        if (/^(Normal|Foil|Surge\s*Foil)$/i.test(line)) {
                            // Collect next few lines looking for R$ values
                            const priceMatches = [];
                            for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
                                const pMatch = lines[j].match(/R\$\s*[\d.,]+/g);
                                if (pMatch) priceMatches.push(...pMatch);
                                if (priceMatches.length >= 2) break;
                            }
                            if (priceMatches.length >= 2) {
                                priceRows.push({ 
                                    text: `${line} ${priceMatches.join(' ')}`,
                                    cells: [line, priceMatches[0], priceMatches[1], priceMatches[2] || priceMatches[1]]
                                });
                            }
                        }
                    }
                } catch (_) {}
            }

            // Parse price rows into records
            for (const row of priceRows) {
                const cells = row.cells;
                if (cells.length < 3) continue;

                // Find tipo carta (first cell matching Normal/Foil)
                let tipoCarta = '';
                let minCell = null, medCell = null;

                for (let k = 0; k < cells.length; k++) {
                    if (/^(Normal|Foil|Surge\s*Foil)$/i.test(cells[k])) {
                        tipoCarta = cells[k].includes('Surge') ? 'Surge Foil' : cells[k];
                        // Next R$ values are min, med, max
                        const priceVals = cells.slice(k + 1).filter(c => c.includes('R$'));
                        minCell = priceVals[0] || null;
                        medCell = priceVals[1] || priceVals[0] || null;
                        break;
                    }
                }

                if (!tipoCarta || !minCell) continue;

                const precoMin = parseBRL(minCell);
                const precoMedio = parseBRL(medCell);
                if (precoMin === null) continue;

                records.push({
                    Nome_da_carta: cardName,
                    Edição: edicaoNome || edicao.sigla || '',
                    Ano: ano,
                    Raridade: raridade,
                    Tipo_Carta: tipoCarta,
                    Preço_Mínimo: precoMin,
                    Preço_Médio: precoMedio || precoMin,
                });
            }

        } catch (edErr) {
            console.error(`    ⚠ Erro em edição ${edicao.nome}:`, edErr.message);
        }

        await new Promise(r => setTimeout(r, 1000));
    }

    return records;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function runAdvancedSearch() {
    const driver = await createDriver();
    
    try {
        console.log('Connected to Supabase via REST API');

        // Get distinct cards from last 90 days
        const dateObj = new Date();
        const ninetyDaysAgo = new Date(dateObj.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const { data: resRows, error: selectError } = await supabase
            .from('lista_cartas_dia')
            .select('carta')
            .gte('dia', ninetyDaysAgo)
            .not('carta', 'is', null);

        if (selectError) throw selectError;

        const cards = [...new Set(resRows.map(row => row.carta))];
        console.log(`Found ${cards.length} distinct cards from the last 90 days.`);

        const today = new Date().toISOString().split('T')[0];

        for (const cardName of cards) {
            console.log(`\n--- Searching for: ${cardName} ---`);

            try {
                const records = await scrapeCard(driver, cardName);
                console.log(`    ✅ Registros extraídos: ${records.length}`);

                for (const [index, record] of records.entries()) {
                    console.log(`  Registro ${index + 1}: ${record.Edição} | ${record.Tipo_Carta} | Min: R$${record.Preço_Mínimo} | Med: R$${record.Preço_Médio}`);
                    try {
                        const { error: upsertError } = await supabase
                            .from('his_precos_ligamagic')
                            .upsert({
                                data: today,
                                carta: record.Nome_da_carta,
                                edicao: record.Edição,
                                ano: parseInt(record.Ano) || 0,
                                raridade: record.Raridade,
                                tipo_carta: record.Tipo_Carta,
                                preco_min: record.Preço_Mínimo,
                                preco_medio: record.Preço_Médio
                            }, { onConflict: 'data,carta,edicao,tipo_carta' });

                        if (upsertError) throw upsertError;
                    } catch (e) {
                        console.error('    Error inserting record:', e.message);
                    }
                }

                if (records.length === 0) {
                    console.log('    ⚠ Nenhum registro encontrado para esta carta.');
                }

            } catch (err) {
                console.error(`  Error scraping ${cardName}:`, err.message);
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
        }

    } catch (err) {
        console.error('Fatal error:', err);
    } finally {
        await driver.quit();
        console.log('\n✅ Scraping finalizado.');
    }
}

runAdvancedSearch();
