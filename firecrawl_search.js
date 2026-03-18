/**
 * FIRECRAWL SEARCH
 * --------------------------------------------------
 */
try {
    require('dotenv').config();
} catch (_) {}

const { createClient } = require('@supabase/supabase-js');
const FirecrawlApp = require('@mendable/firecrawl-js').default;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠ Warning: SUPABASE_URL or SUPABASE_KEY not found in environment.");
}

const supabase = createClient(supabaseUrl || 'https://xxxxxxxx.supabase.co', supabaseKey || 'public-anon-key');

const firecrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY
});

// DETECT SDK STRUCTURE (v3/v4 compatibility)
const api = firecrawl.v1 || firecrawl;

async function runAdvancedSearch() {
    try {
        console.log('[firecrawl_search.js] Initializing...');

        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const { data: resRows, error: selectError } = await supabase
            .from('lista_cartas_dia')
            .select('carta')
            .gte('dia', ninetyDaysAgo)
            .not('carta', 'is', null);

        if (selectError) throw selectError;

        const cards = [...new Set(resRows.map(r => r.carta))];
        console.log(`[firecrawl_search.js] Found ${cards.length} distinct cards from the last 90 days.`);

        const today = new Date().toISOString().split('T')[0];

        for (const cardName of cards) {
            console.log(`\n[firecrawl_search.js] --- Searching for: ${cardName} ---`);
            const searchUrl = `https://www.ligamagic.com.br/?view=cards/card&card=${encodeURIComponent(cardName)}`;

            try {
                const scrapeResult = await api.scrapeUrl(searchUrl, {
                    formats: ['json'],
                    jsonOptions: {
                        prompt: `Extract a list of records for the card ${cardName}. Each record must contain:
- Nome_da_carta: card name (always "${cardName}")
- Edição: edition name
- Ano: year of the edition as a number
- Raridade: rarity in Portuguese
- Tipo_Carta: card variant (e.g.: "Normal", "Foil", "Surge Foil")
- Qualidade: quality (e.g.: "NM", "SP")
- Idioma: language (e.g.: "Português", "Inglês")
- Preço_Mínimo: minimum price as a number in BRL
- Preço_Médio: average price as a number in BRL

Extract ALL editions and variants found on the page.`,
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
                                            Qualidade:      { type: 'string' },
                                            Idioma:         { type: 'string' },
                                            Preço_Mínimo:   { type: 'number' },
                                            Preço_Médio:    { type: 'number' }
                                        },
                                        required: ['Nome_da_carta', 'Edição', 'Ano', 'Raridade', 'Tipo_Carta', 'Qualidade', 'Idioma', 'Preço_Mínimo', 'Preço_Médio']
                                    }
                                }
                            }
                        }
                    }
                });

                if (scrapeResult.success && scrapeResult.json && scrapeResult.json.records) {
                    const records = scrapeResult.json.records;
                    console.log(`  ✅ ${records.length} registro(s) encontrado(s)`);

                    for (const record of records) {
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
                                    qualidade: record.Qualidade,
                                    idioma: record.Idioma,
                                    preco_min: record.Preço_Mínimo,
                                    preco_medio: record.Preço_Médio
                                }, { onConflict: 'data,carta,edicao,tipo_carta,qualidade,idioma' });

                            if (error) throw error;
                        } catch (e) {
                            console.error('  Error inserting:', e.message);
                        }
                    }
                } else {
                    console.log('  ⚠ Firecrawl error:', scrapeResult.error || 'unknown');
                }

            } catch (err) {
                console.error(`  [firecrawl_search.js ERROR] ${cardName}:`, err.message);
            }

            await new Promise(r => setTimeout(r, 2000));
        }

    } catch (err) {
        console.error('[firecrawl_search.js FATAL]', err.message);
    }
    console.log('\n[firecrawl_search.js] ✅ Finished.');
}

runAdvancedSearch();
