/**
 * FIRECRAWL SEARCH
 * --------------------------------------------------
 */
try {
    require('dotenv').config();
} catch (_) { }

const { supabase } = require('./lib/supabase');
const FirecrawlApp = require('@mendable/firecrawl-js').default;

const firecrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY
});

// DETECT SDK STRUCTURE (v3/v4 compatibility)
const api = firecrawl.v1 || firecrawl;

async function runAdvancedSearch() {
    try {
        console.log('[firecrawl_search.js] Initializing...');

        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Selecionamos carta e TCG para saber qual site buscar
        const { data: resRows, error: selectError } = await supabase
            .from('lista_cartas_dia')
            .select('carta, tcg')
            .gte('dia', ninetyDaysAgo)
            .not('carta', 'is', null);

        if (selectError) throw selectError;

        // Criamos pares únicos (carta, tcg)
        const uniqueCards = [];
        const seen = new Set();
        for (const r of resRows) {
            const tcg = (r.tcg || 'MAGIC').toUpperCase();
            const key = `${r.carta}|${tcg}`;
            if (!seen.has(key)) {
                uniqueCards.push({ name: r.carta, tcg: tcg });
                seen.add(key);
            }
        }

        console.log(`[firecrawl_search.js] Found ${uniqueCards.length} distinct card/tcg pairs from the last 90 days.`);

        const today = new Date().toISOString().split('T')[0];

        for (const card of uniqueCards) {
            console.log(`\n[firecrawl_search.js] --- Searching for: ${card.name} (${card.tcg}) ---`);

            // Define o domínio correto conforme o TCG
            const domain = card.tcg === 'POKEMON' ? 'ligapokemon.com.br' : 'ligamagic.com.br';
            const searchUrl = `https://www.${domain}/?view=cards/card&card=${encodeURIComponent(card.name)}`;

            console.log(`[firecrawl_search.js] Target URL: ${searchUrl}`);

            try {
                const scrapeResult = await api.scrapeUrl(searchUrl, {
                    formats: ['json'],
                    jsonOptions: {
                        prompt: `Extract all edition records for the card "${card.name}" from the page.
                        Each record must include:
                        1. name: card name (strictly "${card.name}").
                        2. edition: the name of the edition/set.
                        3. year: release year as a number.
                        4. rarity: rarity in Portuguese (e.g., Comum, Incomum, Rara, Mítica).
                        5. variant: e.g., "Normal", "Foil", or "Reverse Holo"
                        6. quality: condition e.g., NM, SP, MP, HP, D.
                        7. language: e.g., "Português" or "Inglês".
                        8. min_price: lowest price found for this variant in BRL (number).
                        9. avg_price: average price for this variant in BRL (number).`,
                        schema: {
                            type: 'object',
                            properties: {
                                records: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string' },
                                            edition: { type: 'string' },
                                            year: { type: 'number' },
                                            rarity: { type: 'string' },
                                            variant: { type: 'string' },
                                            quality: { type: 'string' },
                                            language: { type: 'string' },
                                            min_price: { type: 'number' },
                                            avg_price: { type: 'number' }
                                        },
                                        required: ['name', 'edition', 'year', 'rarity', 'variant', 'quality', 'language', 'min_price', 'avg_price']
                                    }
                                }
                            },
                            required: ['records']
                        }
                    }
                });

                if (scrapeResult.success && scrapeResult.json && scrapeResult.json.records) {
                    const records = scrapeResult.json.records;
                    console.log(`  ✅ ${records.length} registro(s) encontrado(s)`);

                    for (const record of records) {
                        try {
                            const { error } = await supabase
                                .from('his_precos_liga')
                                .upsert({
                                    data: today,
                                    carta: record.name,
                                    edicao: record.edition,
                                    ano: parseInt(record.year) || 0,
                                    raridade: record.rarity,
                                    tipo_carta: record.variant,
                                    qualidade: record.quality,
                                    idioma: record.language,
                                    preco_min: record.min_price,
                                    preco_medio: record.avg_price,
                                    tcg: card.tcg
                                }, { onConflict: 'data,carta,edicao,tipo_carta,qualidade,idioma,tcg' });

                            if (error) throw error;
                        } catch (e) {
                            console.error('  Error inserting:', e.message);
                        }
                    }
                } else {
                    console.log('  ⚠ Firecrawl error:', scrapeResult.error || 'unknown');
                }

            } catch (err) {
                console.error(`  [firecrawl_search.js ERROR] ${card.name}:`, err.message);
            }

            // Delay entre cartas para dar respiro pro Firecrawl e site alvo
            await new Promise(r => setTimeout(r, 2000));
        }

    } catch (err) {
        console.error('[firecrawl_search.js FATAL]', err.message);
    }
    console.log('\n[firecrawl_search.js] ✅ Finished.');
}

runAdvancedSearch();
