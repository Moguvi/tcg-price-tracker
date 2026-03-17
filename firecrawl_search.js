require('dotenv').config();
const { Client } = require('pg');
const FirecrawlApp = require('@mendable/firecrawl-js').default;

const pgClient = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://service_account:ronin1234@localhost:5432/ligamagic'
});

const firecrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY
});

async function runAdvancedSearch() {
    try {
        await pgClient.connect();
        console.log('Connected to PostgreSQL database');

        // Get distinct cards from the last 90 days
        const query = `
            SELECT DISTINCT carta 
            FROM lista_cartas_dia 
            WHERE carta IS NOT NULL AND TO_DATE(dia, 'YYYY-MM-DD') >= CURRENT_DATE - INTERVAL '90 days'
        `;
        const res = await pgClient.query(query);
        const cards = res.rows.map(row => row.carta);

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
                        const insertQuery = `
                            INSERT INTO his_precos_ligamagic (data, carta, edicao, ano, raridade, tipo_carta, preco_min, preco_medio) 
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                            ON CONFLICT (data, carta, edicao, tipo_carta) 
                            DO UPDATE SET preco_min = EXCLUDED.preco_min, preco_medio = EXCLUDED.preco_medio
                        `;

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
                                // ano is retrieved as string, must parse to int, handling empty safely
                                const ano = parseInt(record.Ano) || 0;
                                await pgClient.query(insertQuery, [
                                    today,
                                    record.Nome_da_carta,
                                    record.Edição,
                                    ano,
                                    record.Raridade,
                                    record.Tipo_Carta,
                                    record.Preço_Mínimo,
                                    record.Preço_Médio
                                ]);
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
    } finally {
        await pgClient.end();
    }
}

runAdvancedSearch();
