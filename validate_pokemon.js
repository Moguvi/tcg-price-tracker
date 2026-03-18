/**
 * VALIDATE_POKEMON.JS
 * Script para validar detalhadamente a extração de cartas Pokémon.
 * Mostra o nome encontrado e o "contexto" (texto original) usado pela IA.
 */
try {
    require('dotenv').config();
} catch (_) {}

const FirecrawlApp = require('@mendable/firecrawl-js').default;

const firecrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY
});

const api = firecrawl.v1 || firecrawl;

const PKMN_SOURCES = [
    { label: "PKMN Alta",  url: "https://www.ligapokemon.com.br/?view=cards/variacao&show=alta&formato=&order=2" },
    { label: "PKMN Queda", url: "https://www.ligapokemon.com.br/?view=cards/variacao&show=queda&formato=&order=2" },
    { label: "PKMN Hits",  url: "https://www.ligapokemon.com.br/?view=cards/hits&show=alta&formato=&order=2" }
];

async function validatePokemon() {
    console.log("==================================================");
    console.log("🔍 VALIDANDO EXTRAÇÃO POKÉMON (LIGAPOKEMON)");
    console.log("==================================================\n");

    for (const source of PKMN_SOURCES) {
        console.log(`\nTesting Source: [${source.label}]`);
        console.log(`URL: ${source.url}`);
        console.log("--------------------------------------------------");

        try {
            const isHits = source.label.includes("Hits");
            
            const scrapeResult = await api.scrapeUrl(source.url, {
                formats: ['json'],
                jsonOptions: {
                    prompt: `Extract card names from the list. 
                    For each card, I need:
                    1. name: The identified name of the card.
                    2. context: A snippet of the raw text from the table row where you found this card (to validate the extraction).
                    ${isHits ? "3. views: The number of views (Visualizações) associated with it." : ""}`,
                    schema: {
                        type: 'object',
                        properties: {
                            extracted_cards: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        context: { type: 'string', description: "Raw text from the page used to identify this card" },
                                        views: isHits ? { type: 'number' } : undefined
                                    },
                                    required: ['name', 'context']
                                }
                            }
                        },
                        required: ['extracted_cards']
                    }
                }
            });

            if (scrapeResult.success && scrapeResult.json && scrapeResult.json.extracted_cards) {
                const cards = scrapeResult.json.extracted_cards;
                console.log(`✅ Sucesso! ${cards.length} cartas encontradas.\n`);

                cards.forEach((c, index) => {
                    console.log(`${index + 1}. Nome Identificado: ${c.name}`);
                    if (isHits) console.log(`   Visualizações: ${c.views}`);
                    console.log(`   Texto de Origem: "${c.context}"`);
                    console.log('   ---');
                });
            } else {
                console.log(`⚠ Erro na Extração: ${scrapeResult.error || 'Nenhum dado retornado'}`);
            }

        } catch (err) {
            console.error(`❌ Erro no Processo: ${err.message}`);
        }
        
        console.log("\n(Aguardando 2s para próxima fonte...)");
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log("\n==================================================");
    console.log("✅ VALIDAÇÃO CONCLUÍDA");
    console.log("==================================================");
}

validatePokemon();
