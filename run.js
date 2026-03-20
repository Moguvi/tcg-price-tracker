const { spawn } = require('child_process');
const path = require('path');

function runScript(scriptName) {
    return new Promise((resolve, reject) => {
        console.log(`\n========================================`);
        console.log(`🚀 Iniciando execução de: ${scriptName}`);
        console.log(`========================================\n`);

        const scriptPath = path.join(__dirname, scriptName);
        
        // Spawn o processo child do script .js atual
        const proc = spawn('node', [scriptPath]);

        // Redireciona stdout line-by-line
        proc.stdout.on('data', (data) => {
            const lines = data.toString().split('\n');
            lines.forEach(line => {
                if (line.trim()) console.log(`[${scriptName}] ${line.trim()}`);
            });
        });

        // Redireciona stderr line-by-line
        proc.stderr.on('data', (data) => {
            const lines = data.toString().split('\n');
            lines.forEach(line => {
                if (line.trim()) console.error(`[${scriptName} ERROR] ${line.trim()}`);
            });
        });

        // Quando o script terminar
        proc.on('close', (code) => {
            if (code === 0) {
                console.log(`\n✅ Script ${scriptName} finalizado com sucesso.\n`);
                resolve();
            } else {
                console.error(`\n❌ Script ${scriptName} falhou com código de saída ${code}.\n`);
                reject(new Error(`Script ${scriptName} exist code ${code}`));
            }
        });
    });
}

async function runAll() {
    const startTime = Date.now();
    try {
        console.log("==================================================");
        console.log("🚀 INICIANDO ESTEIRA DE EXTRAÇÃO (MTG PRICE TRACKER)");
        console.log("==================================================\n");

        // 1º Passo: Raspagem de Listas (Alta/Queda/Hits)
        await runScript('index.js');
        
        console.log("\n--- Aguardando 5s para iniciar busca avançada ---\n");
        await new Promise(res => setTimeout(res, 5000));

        // 2º Passo: Pesquisa avançada via Firecrawl (Preços Históricos)
        await runScript('firecrawl_search.js');

        const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
        console.log(`\n==================================================`);
        console.log(`🎉 EXECUÇÃO CONCLUÍDA COM SUCESSO!`);
        console.log(`⏱ Duração Total: ${duration} minutos`);
        console.log(`==================================================`);

    } catch (error) {
        console.error(`\n🚨 EXECUÇÃO INTERROMPIDA POR ERRO:`, error.message);
        process.exit(1);
    }
}

runAll();
