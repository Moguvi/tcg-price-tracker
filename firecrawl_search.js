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

        for (const cardName of cards) {
            console.log(`\n--- Searching for: ${cardName} ---`);
            const searchUrl = `https://www.ligamagic.com.br/?view=cards/card&card=${encodeURIComponent(cardName)}`;

            try {
                const scrapeResult = await firecrawl.v1.scrapeUrl(searchUrl, {
                    formats: ['json'],
                    jsonOptions: {
                        prompt: `Extract the pricing and edition information for this card. I need a list of records where each record contains the following fields: 
- Nome da carta (Card name, e.g., ${cardName})
- Edição (Edition name)
- Ano (Year)
- Raridade (Rarity, e.g., Rara (FIN) or Rara, Incomum, etc)
- Tipo Carta (Normal, Foil or Surge Foil)
- Preço Mínimo (Min price, number)
- Preço Médio (Average price, number)

There can be multiple editions and for each edition there can be multiple version such as Normal, Foil or Surge Foil. Extract as many distinct relevant records as possible.`,
                        schema: {
                            type: 'object',
                            properties: {
                                records: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            "Nome_da_carta": { type: 'string' },
                                            "Edição": { type: 'string' },
                                            "Ano": { type: 'string' },
                                            "Raridade": { type: 'string' },
                                            "Tipo_Carta": { type: 'string' },
                                            "Preço_Mínimo": { type: 'number' },
                                            "Preço_Médio": { type: 'number' }
                                        },
                                        required: ["Nome_da_carta", "Edição", "Ano", "Raridade", "Tipo_Carta", "Preço_Mínimo", "Preço_Médio"]
                                    }
                                }
                            }
                        }
                    }
                });

                if (scrapeResult.success && scrapeResult.json && scrapeResult.json.records) {
                    const records = scrapeResult.json.records;
                    if (records.length === 0) {
                        console.log('No records found for this card.');
                    } else {
                        const today = new Date().toISOString().split('T')[0];

                        for (let [index, record] of records.entries()) {
                            console.log(`Registro ${index + 1}:`);
                            console.log(`- Nome da carta: "${record.Nome_da_carta}"`);
                            console.log(`- Edição: ${record.Edição}`);
                            console.log(`- Ano: ${record.Ano}`);
                            console.log(`- Raridade: ${record.Raridade}`);
                            console.log(`- Tipo Carta: ${record.Tipo_Carta}`);
                            console.log(`- Preço Mínimo: ${record.Preço_Mínimo}`);
                            console.log(`- Preço Médio: ${record.Preço_Médio}`);
                            console.log('');

                            try {
                                const ano = parseInt(record.Ano) || 0;
                                const { error: upsertError } = await supabase
                                    .from('his_precos_ligamagic')
                                    .upsert({
                                        data: today,
                                        carta: record.Nome_da_carta,
                                        edicao: record.Edição,
                                        ano: ano,
                                        raridade: record.Raridade,
                                        tipo_carta: record.Tipo_Carta,
                                        preco_min: record.Preço_Mínimo,
                                        preco_medio: record.Preço_Médio
                                    }, { onConflict: 'data,carta,edicao,tipo_carta' });
                                
                                if (upsertError) throw upsertError;
                            } catch (e) {
                                console.error('Error inserting record:', e.message);
                            }
                        }
                    }
                } else {
                    console.log(`Failed to extract data or no JSON returned. Result:`, scrapeResult.error || scrapeResult);
                }
            } catch (err) {
                console.error(`Error scraping ${cardName}:`, err.message);
            }

            // Add a small delay between requests to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

    } catch (err) {
        console.error('Database query failed:', err);
    }
}

runAdvancedSearch();
