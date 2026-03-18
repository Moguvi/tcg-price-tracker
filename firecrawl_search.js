require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const FirecrawlApp = require('@mendable/firecrawl-js').default;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_KEY in config.");
}

const supabase = createClient(supabaseUrl || 'https://xxxxxxxx.supabase.co', supabaseKey || 'public-anon-key');

const firecrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY
});

async function runAdvancedSearch() {
    try {
        console.log('Connected to Supabase via REST API');

        // Get distinct cards from the last 90 days
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
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
            console.log(`\n--- Searching for: ${cardName} ---`);
            const searchUrl = `https://www.ligamagic.com.br/?view=cards/card&card=${encodeURIComponent(cardName)}`;

            try {
                const scrapeResult = await firecrawl.scrapeUrl(searchUrl, {
                    formats: ['json'],
                    jsonOptions: {
                        prompt: `Extract the pricing and edition information for this Magic card. 
Return a list of records, one for each combination of edition × card type (Normal, Foil, Surge Foil).
Each record must contain:
- Nome_da_carta: card name (always "${cardName}")
- Edição: edition name (e.g. "Dominaria United")
- Ano: year of the edition as a number (e.g. 2022)
- Raridade: rarity in Portuguese (e.g. "Rara", "Incomum", "Comum", "Mítica")
- Tipo_Carta: card type variant (exactly one of: "Normal", "Foil", "Surge Foil")
- Preço_Mínimo: minimum price as a number in BRL (e.g. 12.50)
- Preço_Médio: average price as a number in BRL (e.g. 15.00)

Extract ALL editions and ALL variants found on the page. Do not skip any.`,
                        schema: {
                            type: 'object',
                            properties: {
                                records: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            Nome_da_carta:  { type: 'string' },
                                            Edição:         { type: 'string' },
                                            Ano:            { type: 'number' },
                                            Raridade:       { type: 'string' },
                                            Tipo_Carta:     { type: 'string' },
                                            Preço_Mínimo:   { type: 'number' },
                                            Preço_Médio:    { type: 'number' }
                                        },
                                        required: ['Nome_da_carta', 'Edição', 'Ano', 'Raridade', 'Tipo_Carta', 'Preço_Mínimo', 'Preço_Médio']
                                    }
                                }
                            }
                        }
                    }
                });

                if (scrapeResult.success && scrapeResult.json && scrapeResult.json.records) {
                    const records = scrapeResult.json.records;

                    if (records.length === 0) {
                        console.log('  ⚠ Nenhum registro encontrado.');
                    } else {
                        console.log(`  ✅ ${records.length} registro(s) encontrado(s)`);

                        for (const [i, record] of records.entries()) {
                            console.log(`  [${i + 1}] ${record.Edição} | ${record.Tipo_Carta} | Min: R$${record.Preço_Mínimo} | Med: R$${record.Preço_Médio}`);
                            try {
                                const { error } = await supabase
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

                                if (error) throw error;
                            } catch (e) {
                                console.error('  Error inserting:', e.message);
                            }
                        }
                    }
                } else {
                    console.log('  ⚠ Firecrawl não retornou JSON. Erro:', scrapeResult.error || 'unknown');
                }

            } catch (err) {
                console.error(`  Error scraping ${cardName}:`, err.message);
            }

            // Small delay between requests to avoid rate limits
            await new Promise(r => setTimeout(r, 2000));
        }

    } catch (err) {
        console.error('Fatal error:', err);
    }

    console.log('\n✅ Scraping finalizado.');
}

runAdvancedSearch();
