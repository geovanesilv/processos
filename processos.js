(function() {
    async function carregarDados() {
        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbzbAiIxAOf9KJje5lUjHQCg2SpZbvVJVv-pFnklbiwcdWbTwlpj777v5xqw72r1LQXp6w/exec");
            const dados = await response.json();
            const container = document.getElementById("processos");
            
            if (!container) {
                console.error("Elemento #processos não encontrado na página.");
                return;
            }

            const agrupado = {};
            dados.forEach(item => {
                const chave = `${item["Número do Processo"]}/${item["Ano do Processo"]}`;
                if (!agrupado[chave]) {
                    agrupado[chave] = { detalhes: item, documentos: [] };
                }
                agrupado[chave].documentos.push({ nome: item["Documento"], link: item["Link"] });
            });

            const processosOrdenados = Object.keys(agrupado).sort((a, b) => {
                const [numA, anoA] = a.split("/").map(Number);
                const [numB, anoB] = b.split("/").map(Number);
                return anoB - anoA || numB - numA;
            });

            const processosExibidos = processosOrdenados.slice(0, 3);
            let html = "<h2>Processos de Contratação</h2>";
            
            processosExibidos.forEach(chave => {
                const processo = agrupado[chave];
                html += `<div class='processo'>
                    <strong>Processo:</strong> ${processo.detalhes["Número do Processo"]}/${processo.detalhes["Ano do Processo"]}<br>
                    <strong>Modalidade:</strong> ${processo.detalhes["Modalidade"]}<br>
                    <strong>Objeto:</strong> ${processo.detalhes["Objeto"]}<br>
                    <strong>Valor Estimado:</strong> R$ ${parseFloat(processo.detalhes["Valor Estimado"]).toFixed(2)}<br>
                    <strong>Status:</strong> ${processo.detalhes["Status"]}<br>
                    <strong>Documentos:</strong>
                    <ul>
                        ${processo.documentos.map(doc => `<li><a href="${doc.link}" target="_blank">${doc.nome}</a></li>`).join('')}
                    </ul>
                </div>`;
            });

            container.innerHTML = html;
        } catch (error) {
            console.error("Erro ao carregar os dados:", error);
            document.getElementById("processos").innerHTML = "Erro ao carregar os processos.";
        }
    }

    document.addEventListener("DOMContentLoaded", carregarDados);
})();
