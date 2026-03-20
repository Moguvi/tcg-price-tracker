/**
 * INDEX.JS - FIRECRAWL VERSION (Bypasses Cloudflare ASN Bans)
 * -----------------------------------------------------------
 */
try {
    require('dotenv').config();
} catch (_) { }

const { supabase } = require('./lib/supabase');
const FirecrawlApp = require('@mendable/firecrawl-js').default;

const firecrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY
});

// SDK v4: inicialização padrão e acesso métodos via .v1
const api = firecrawl.v1 || firecrawl;

const FORMATOS = [2, 5, 6, 7];

const SOURCES = [
    ...FORMATOS.flatMap(f => [
        { label: `Alta (f=${f})`, url: `https://www.ligamagic.com.br/?view=cards/variacao&show=alta&formato=${f}&order=2`, tcg: "MAGIC" },
        { label: `Queda (f=${f})`, url: `https://www.ligamagic.com.br/?view=cards/variacao&show=queda&formato=${f}&order=2`, tcg: "MAGIC" },
        { label: `Hits (f=${f})`, url: `https://www.ligamagic.com.br/?view=cards/hits&formato=${f}&order=2`, tcg: "MAGIC" },
    ]),
    // Pokémon Links (Static)
    { label: "PKMN Alta", url: "https://www.ligapokemon.com.br/?view=cards/variacao&show=alta&formato=&order=2", tcg: "POKEMON" },
    { label: "PKMN Queda", url: "https://www.ligapokemon.com.br/?view=cards/variacao&show=queda&formato=&order=2", tcg: "POKEMON" },
    { label: "PKMN Hits", url: "https://www.ligapokemon.com.br/?view=cards/hits&show=alta&formato=&order=2", tcg: "POKEMON" }
];

async function scrapePage(source, today) {
    console.log(`\n  → [${source.label}] Investigando: ${source.url} (TCG: ${source.tcg})`);

    const isHits = source.label.includes("Hits");

    try {
        const isPokemon = source.tcg === "POKEMON";

        const scrapeResult = await api.scrapeUrl(source.url, {
            formats: ['json'],
            actions: [
                { type: 'wait', milliseconds: 3000 },
                { type: 'click', selector: '.white-list-img' },
                { type: 'wait', milliseconds: 3000 },
                { type: 'scroll' }
            ],
            jsonOptions: {
                prompt: isHits 
                    ? "Extract all card names and their corresponding number of views (Visualizações) from the table. Return a list of objects with 'name' and 'views'."
                    : "Extract all card names listed in this variation table. Return a list of strings.",
                schema: isHits ? {
                    type: 'object',
                    properties: {
                        cards: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    views: { type: 'number' }
                                },
                                required: ['name', 'views']
                            }
                        }
                    },
                    required: ['cards']
                } : {
                    type: 'object',
                    properties: {
                        cards: {
                            type: 'array',
                            items: { type: 'string' }
                        }
                    },
                    required: ['cards']
                }
            }
        });

        if (scrapeResult.success && scrapeResult.json && scrapeResult.json.cards) {
            const cardsFound = scrapeResult.json.cards;
            console.log(`  ✅ ${cardsFound.length} registros identificados pela IA.`);

            let saved = 0;
            for (const item of cardsFound) {
                const cardName = (isHits ? item.name : item).trim();
                const views = isHits ? (parseInt(item.views) || 0) : 0;

                if (!cardName) continue;

                const { error } = await supabase
                    .from('lista_cartas_dia')
                    .upsert({
                        dia: today,
                        carta: cardName,
                        visualizacoes: views,
                        tcg: source.tcg
                    }, { onConflict: 'dia,carta,tcg' });

                if (!error) saved++;
            }
            console.log(`  ✅ [${source.label}]: ${saved} cartas salvas no Supabase.`);
        } else {
            console.log(`  ⚠ Erro no Scrape do Firecrawl: ${scrapeResult.error || 'sem dados JSON'}`);
        }

    } catch (err) {
        console.error(`  ❌ [${source.label}] Erro Fatal:`, err.message);
    }
}

async function runScraper() {
    console.log('[index.js] Iniciando coleta de nomes de cartas (e visualizações para Hits) via Firecrawl...');
    const today = new Date().toISOString().split('T')[0];

    try {
        for (const source of SOURCES) {
            await scrapePage(source, today);
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log('\n✅ Todos os scrapers de lista concluídos!');
        await deduplicateToday(today);

    } catch (err) {
        console.error('Global Scraper Error:', err.message);
    }
}

async function deduplicateToday(today) {
    console.log('\n🧹 Removendo duplicatas de lista_cartas_dia (Priorizando quem tem mais visualizações)...');
    try {
        const { data, error } = await supabase
            .from('lista_cartas_dia')
            .select('id, dia, carta, tcg, visualizacoes')
            .eq('dia', today)
            .order('visualizacoes', { ascending: false });

        if (error) throw error;

        const seen = new Set();
        const toDelete = [];

        for (const row of data) {
            const key = `${row.carta}|${row.tcg}`;
            if (seen.has(key)) {
                toDelete.push(row.id);
            } else {
                seen.add(key);
            }
        }

        if (toDelete.length > 0) {
            const { error: delError } = await supabase
                .from('lista_cartas_dia')
                .delete()
                .in('id', toDelete);

            if (delError) throw delError;
            console.log(`  ✅ ${toDelete.length} duplicata(s) removida(s).`);
        } else {
            console.log('  ✅ Nenhuma duplicata encontrada.');
        }
    } catch (e) {
        console.error('  Erro na deduplicação:', e.message);
    }
}

runScraper();
