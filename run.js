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
    try {
        console.log("Iniciando a esteira de Extração de Preços (MTG Price Tracker)...\n");

        // 1º Passo: Raspagem básica via Selenium (Mínimos do Dia)
        await runScript('index.js');
        
        // Dá um pequeno tempo entre os dois só por garantia e fluidez
        await new Promise(res => setTimeout(res, 2000));

        // 2º Passo: Pesquisa avançada via Firecrawl (Preços Históricos detalhados)
        await runScript('firecrawl_search.js');

        console.log(`========================================`);
        console.log(`🎉 Todos os scripts foram executados com sucesso!`);
        console.log(`========================================`);

    } catch (error) {
        console.error(`\n🚨 A execução foi interrompida devido a um erro:`, error.message);
        process.exit(1);
    }
}

runAll();
