const { Client } = require('pg');

const pgClientAdmin = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'ligamagic',
    password: '891221',
    port: 5432,
});

async function setupDatabase() {
    try {
        await pgClientAdmin.connect();
        
        // Create table
        await pgClientAdmin.query(`
            CREATE TABLE IF NOT EXISTS his_precos_ligamagic (
                data DATE,
                carta TEXT,
                edicao TEXT,
                ano INTEGER,
                raridade TEXT,
                tipo_carta TEXT,
                preco_min NUMERIC,
                preco_medio NUMERIC
            );
        `);
        console.log('Created table his_precos_ligamagic');

        // Add constraints for Upsert
        // We need a unique constraint on data, carta, edicao, tipo_carta.
        // It's possible to have same card, same edition, same type, but that wouldn't make sense to duplicate in a day.
        try {
            await pgClientAdmin.query(`
                ALTER TABLE his_precos_ligamagic 
                ADD CONSTRAINT his_precos_ligamagic_unique_data_carta_edicao_tipo UNIQUE (data, carta, edicao, tipo_carta);
            `);
            console.log('Added UNIQUE constraint.');
        } catch(e) {
            if (e.code === '42710') {
                console.log('Constraint already exists.');
            } else {
                throw e;
            }
        }

        // Grant privileges to service_account
        await pgClientAdmin.query(`
            GRANT ALL PRIVILEGES ON TABLE his_precos_ligamagic TO service_account;
        `);
        console.log('Granted privileges to service_account');
        
    } catch (e) {
        console.error('Failed:', e);
    } finally {
        await pgClientAdmin.end();
    }
}

setupDatabase();
