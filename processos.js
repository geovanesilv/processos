<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Processos</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #3498db;
            --primary-light: #e6f7ff;
            --secondary: #2c3e50;
            --success: #2ecc71;
            --white: #ffffff;
            --gray-100: #f8f9fa;
            --gray-200: #e9ecef;
            --gray-300: #dee2e6;
            --gray-500: #adb5bd;
            --gray-800: #343a40;
            --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            --radius: 4px;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.4;
            color: var(--gray-800);
            background-color: var(--gray-100);
            padding: 10px;
            font-size: 14px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        header {
            background-color: var(--white);
            border-radius: var(--radius);
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: var(--shadow);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        h1 {
            color: var(--secondary);
            font-size: 1.5rem;
            margin: 0;
        }
        
        .search-container {
            position: relative;
            flex-grow: 1;
            max-width: 400px;
            margin-left: 20px;
        }
        
        .search-container input {
            width: 100%;
            padding: 8px 10px 8px 30px;
            border: 1px solid var(--gray-300);
            border-radius: var(--radius);
            font-size: 0.9rem;
        }
        
        .search-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray-500);
            font-size: 0.9rem;
        }
        
        .processo {
            background-color: var(--white);
            border-radius: var(--radius);
            margin-bottom: 8px;
            box-shadow: var(--shadow);
            border: 1px solid var(--gray-200);
        }
        
        .processo-header {
            padding: 8px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            background-color: var(--gray-100);
            border-radius: var(--radius) var(--radius) 0 0;
        }
        
        .processo-header h2 {
            font-size: 1rem;
            font-weight: 600;
            margin: 0;
            display: flex;
            align-items: center;
        }
        
        .processo-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .processo-content {
            padding: 0;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }
        
        .processo.ativo .processo-content {
            max-height: 2000px;
            transition: max-height 0.5s ease-in;
        }
        
        .processo-toggle {
            transition: transform 0.3s ease;
            font-size: 0.8rem;
        }
        
        .processo.ativo .processo-toggle {
            transform: rotate(180deg);
        }
        
        .modalidade {
            background-color: var(--primary-light);
            color: var(--primary);
            padding: 3px 8px;
            border-radius: 3px;
            font-weight: 500;
            font-size: 0.8rem;
            display: inline-block;
            margin: 8px 12px;
        }
        
        .detalhes {
            padding: 0 12px 8px;
        }
        
        .detalhes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 8px 15px;
        }
        
        .detalhe-item {
            margin-bottom: 4px;
        }
        
        .detalhe-label {
            color: var(--gray-500);
            font-size: 0.75rem;
            margin-bottom: 1px;
        }
        
        .detalhe-valor {
            font-weight: 500;
            font-size: 0.85rem;
        }
        
        .status-pill {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-concluido {
            background-color: #d4edda;
            color: #155724;
        }
        
        .status-aberto {
            background-color: #cce5ff;
            color: #004085;
        }
        
        .documentos {
            margin-top: 8px;
            border-top: 1px solid var(--gray-200);
            padding: 8px 12px;
        }
        
        .documentos-titulo {
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--secondary);
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .documentos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 6px;
        }
        
        .documento {
            background-color: var(--gray-100);
            border-radius: 3px;
            padding: 6px 8px;
            transition: all 0.2s ease;
            border: 1px solid var(--gray-200);
        }
        
        .documento:hover {
            background-color: var(--primary-light);
        }
        
        .documento a {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--gray-800);
            font-weight: 500;
            font-size: 0.8rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .doc-icon {
            min-width: 16px;
            margin-right: 6px;
            color: var(--primary);
            font-size: 0.8rem;
        }
        
        .loader {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100px;
        }
        
        .spinner {
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 3px solid var(--primary);
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
        }
        
        .empty-state {
            text-align: center;
            padding: 20px 0;
            color: var(--gray-500);
        }
        
        .empty-state i {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .processo-header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .processo-number {
            color: var(--primary);
        }
        
        .processo-summary {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            font-size: 0.8rem;
            margin-left: 15px;
            color: var(--gray-500);
        }
        
        .processo-summary-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        @media (max-width: 768px) {
            header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .search-container {
                margin-left: 0;
                margin-top: 10px;
                max-width: 100%;
                width: 100%;
            }
            
            .detalhes-grid {
                grid-template-columns: 1fr;
            }
            
            .documentos-grid {
                grid-template-columns: 1fr;
            }
            
            .processo-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Processos de Contratação</h1>
            <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" id="pesquisa" placeholder="Pesquisar...">
            </div>
        </header>
        
        <div id="loader" class="loader">
            <div class="spinner"></div>
        </div>
        
        <div id="processos"></div>
    </div>

    <script>
        // URL do JSON
        const jsonUrl = "https://script.google.com/macros/s/AKfycbzbAiIxAOf9KJje5lUjHQCg2SpZbvVJVv-pFnklbiwcdWbTwlpj777v5xqw72r1LQXp6w/exec";

        // Função para agrupar os processos por Número do Processo e Ano do Processo
        function agruparProcessos(processos) {
            const agrupados = {};

            processos.forEach(processo => {
                const chave = `${processo['Número do Processo']}-${processo['Ano do Processo']}`;
                
                if (!agrupados[chave]) {
                    agrupados[chave] = [];
                }
                agrupados[chave].push(processo);
            });

            return agrupados;
        }

        // Função para formatar valores monetários
        function formatarValor(valor) {
            return valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
        }


// Função para formatar a data no formato dd/mm/aaaa
function formatarData(data) {
   // Verificação rigorosa para valores vazios
   if (data === null || data === undefined || data === "" || data === "null" || data === "undefined") {
      return 'Data não disponível';
   }
   
   // Tentar criar o objeto de data
   const date = new Date(data);
   
   // Verificar se a data é válida
   if (isNaN(date.getTime())) {
      // Para debugging: console.log("Data inválida recebida:", data);
      return 'Data não disponível';
   }
   
   return date.toLocaleDateString('pt-BR');
}

// Função para formatar CNPJ no padrão brasileiro XX.XXX.XXX/XXXX-XX
function formatarCNPJ(cnpj) {
    if (!cnpj || cnpj.length !== 14) return cnpj;
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

        // Função para criar um elemento de detalhe
        function criarDetalheItem(label, valor) {
            return `
                <div class="detalhe-item">
                    <div class="detalhe-label">${label}</div>
                    <div class="detalhe-valor">${valor || 'Informação não disponível'}</div>
                </div>
            `;
        }

        // Função para gerar o HTML
        function exibirProcessos(processos) {
            const agrupados = agruparProcessos(processos);
            const container = document.getElementById('processos');
            container.innerHTML = '';
            
            // Ocultar o loader
            document.getElementById('loader').style.display = 'none';

            // Ordenando os processos por número do processo e ano em ordem decrescente
            const chavesOrdenadas = Object.keys(agrupados).sort((a, b) => {
                const [numA, anoA] = a.split('-');
                const [numB, anoB] = b.split('-');
                return (anoB - anoA) || (numB - numA); // Decrescente por ano e número do processo
            });

            if (chavesOrdenadas.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-file-invoice"></i>
                        <p>Nenhum processo encontrado</p>
                    </div>
                `;
                return;
            }

            chavesOrdenadas.forEach(chave => {
                const processosGrupo = agrupados[chave];
                const [numero, ano] = chave.split('-');
                
                // Criar o bloco de processos
                const divProcesso = document.createElement('div');
                divProcesso.classList.add('processo');
                
                // Processo header
                const processo = processosGrupo[0]; // Considerando que os dados do processo são iguais para todos os documentos
                const status = processo['Status'];
                const statusClass = status === 'Concluído' ? 'status-concluido' : 'status-aberto';
                const modalidade = processo.Modalidade;
                const objeto = processo['Objeto'];
                const valorEstimado = formatarValor(processo['Valor Estimado']);
                
                divProcesso.innerHTML = `
                    <div class="processo-header">
                        <div class="processo-header-left">
                            <h2><span class="processo-number">Processo nº ${numero}/${ano}</span></h2>
                            <div class="processo-summary">
                                <div class="processo-summary-item">
                                    <i class="fas fa-tag"></i>
                                    ${modalidade}
                                </div>
                                <div class="processo-summary-item">
                                    <i class="fas fa-money-bill-alt"></i>
                                    Valor estimado: ${valorEstimado}
                                </div>
                            </div>
                        </div>
                        <div class="processo-info">
                            <span class="status-pill ${statusClass}">${status}</span>
                            <i class="fas fa-chevron-down processo-toggle"></i>
                        </div>
                    </div>
                    <div class="processo-content">
                        <div class="modalidade">
                            ${modalidade} nº ${processo['Número da Contratação']}/${processo['Ano da Contratação']}
                        </div><div class="detalhes">

<div class="detalhes">
    <div class="detalhes-grid">
        ${criarDetalheItem('Objeto', objeto)}
        ${criarDetalheItem('Valor Estimado', valorEstimado)}
        ${criarDetalheItem('Responsável', processo['Responsável pela Contratação'])}
        ${criarDetalheItem('Data de Abertura', processo['Data de Abertura'] ? formatarData(processo['Data de Abertura']) : 'Data não disponível')}
        <div class="detalhe-item">
            <div class="detalhe-label">Local</div>
            <div class="detalhe-valor">
                ${(() => {
                    const local = processo['Local'];
                    if (!local) return 'Informação não disponível';
                    
                    // Verifica se é um email
                if (local.includes('@')) {
                    return `<a href="mailto:${local}" target="_blank">${local}</a>`;
                } 
                // Verifica se é o Portal de Compras Públicas
                else if (local.includes('portaldecompraspublicas')) {
                    return `<a href="${local}" target="_blank">Portal de Compras Públicas</a>`;
                }
                // Verifica se já é uma URL completa
                else if (local.startsWith('http')) {
                    // Tenta extrair o domínio principal para um texto mais curto
                    try {
                        const urlObj = new URL(local);
                        const dominio = urlObj.hostname.replace('www.', '');
                        return `<a href="${local}" target="_blank">Acessar ${dominio}</a>`;
                    } catch (e) {
                        return `<a href="${local}" target="_blank">Acessar site</a>`;
                    }
                }
                // Se parece um domínio, adiciona http:// para criar um link válido
                else if (local.includes('.')) {
                    const dominio = local.replace('www.', '');
                    return `<a href="http://${local}" target="_blank">Acessar ${dominio}</a>`;
                }
                // Se não for nenhum dos casos acima, exibe como texto normal
                else {
                    return local;
                }
            })()}
        </div>
    </div>
    ${status === 'Concluído' ? criarDetalheItem('Valor Homologado', processo['Valor Homologado'] ? formatarValor(processo['Valor Homologado']) : null) : ''}
    ${status === 'Concluído' ? criarDetalheItem('Data de Encerramento', processo['Data de Encerramento'] ? formatarData(processo['Data de Encerramento']) : null) : ''}
    ${status === 'Concluído' ? criarDetalheItem('Empresa Vencedora', processo['Empresa Vencedora']) : ''}
    ${status === 'Concluído' ? `
        <div class="detalhe-item">
            <div class="detalhe-label">CNPJ da Empresa</div>
            <div class="detalhe-valor">
                <a href="https://portaldatransparencia.gov.br/sancoes/consulta?cadastro=1&cadastro=2&cpfCnpj=${processo['CNPJ da Empresa']}" target="_blank" class="cnpj-link">
                    ${processo['CNPJ da Empresa'] || 'Informação não disponível'}
                </a>
            </div>
        </div>
    ` : ''}
    ${status === 'Concluído' ? criarDetalheItem('Fiscal do Contrato', processo['Fiscal do Contrato']) : ''}
    ${status === 'Concluído' ? `
        <div class="detalhe-item">
            <div class="detalhe-label">Contrato</div>
            <div class="detalhe-valor">
                ${(() => {
                    const contrato = processo['Contrato'];
                    if (!contrato) return 'Informação não disponível';
                    
                    // Se for uma URL, exibe como link
                    if (contrato.startsWith('http')) {
                        return `<a href="${contrato}" target="_blank">Ver contrato</a>`;
                    } 
                    // Qualquer outra informação, exibe como texto
                    else {
                        return contrato;
                    }
                })()}
            </div>
        </div>
    ` : ''}
</div>

                        
                        <div class="documentos">
                            <div class="documentos-titulo">
                                <i class="fas fa-folder-open"></i> Documentos
                            </div>
                            <div class="documentos-grid" id="documentos-${numero}-${ano}"></div>
                        </div>
                    </div>
                `;
                
                container.appendChild(divProcesso);
                
                // Adicionar documentos
                const documentsContainer = document.getElementById(`documentos-${numero}-${ano}`);
                
                // Ordenando os documentos em ordem alfabética
                processosGrupo.sort((a, b) => {
                    const docA = a.Documento.replace(/_/g, ' ').replace(/.pdf$/, '');
                    const docB = b.Documento.replace(/_/g, ' ').replace(/.pdf$/, '');
                    return docA.localeCompare(docB);
                });
                
                // Exibir os documentos ordenados
                processosGrupo.forEach(processo => {
                    const docElement = document.createElement('div');
                    docElement.classList.add('documento');
                    const docName = processo.Documento.replace(/_/g, ' ').replace(/.pdf$/, '');
                    docElement.innerHTML = `
                        <a href="${processo.Link}" target="_blank" title="${docName}">
                            <i class="fas fa-file-pdf doc-icon"></i>
                            <span>${docName}</span>
                        </a>
                    `;
                    documentsContainer.appendChild(docElement);
                });
            });

            // Adicionar eventos de clique para expandir/recolher os processos
            document.querySelectorAll('.processo-header').forEach(header => {
                header.addEventListener('click', () => {
                    const processo = header.parentElement;
                    processo.classList.toggle('ativo');
                });
            });
        }
        
        // Função para filtrar processos
        function filtrarProcessos() {
            const termo = document.getElementById('pesquisa').value.toLowerCase();
            const processos = document.querySelectorAll('.processo');
            
            let encontrados = 0;
            
            processos.forEach(processo => {
                const conteudo = processo.textContent.toLowerCase();
                if (conteudo.includes(termo)) {
                    processo.style.display = 'block';
                    encontrados++;
                } else {
                    processo.style.display = 'none';
                }
            });
            
            if (encontrados === 0 && termo !== '') {
                const container = document.getElementById('processos');
                if (!document.querySelector('.empty-search')) {
                    const emptyEl = document.createElement('div');
                    emptyEl.classList.add('empty-state', 'empty-search');
                    emptyEl.innerHTML = `
                        <i class="fas fa-search"></i>
                        <p>Nenhum resultado encontrado</p>
                    `;
                    container.appendChild(emptyEl);
                }
            } else {
                const emptySearch = document.querySelector('.empty-search');
                if (emptySearch) {
                    emptySearch.remove();
                }
            }
        }

        // Função para obter os dados do JSON
        async function obterProcessos() {
            try {
                const resposta = await fetch(jsonUrl);
                const dados = await resposta.json();
                exibirProcessos(dados);
                
// Configurar a busca
                document.getElementById('pesquisa').addEventListener('input', filtrarProcessos);
                
                // Formatação de CNPJs
                function formatarCNPJ(cnpj) {
                    if (!cnpj || cnpj.length !== 14) return cnpj;
                    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
                }
                
                // Aplicar formatação aos CNPJs existentes
                document.querySelectorAll('.cnpj-link').forEach(link => {
                    const texto = link.textContent.trim();
                    if (texto.match(/^\d{14}$/)) {
                        link.textContent = formatarCNPJ(texto);
                    }
                });
                
                // Adicionar observer para formatar CNPJs em elementos adicionados dinamicamente
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        if (mutation.addedNodes.length) {
                            mutation.addedNodes.forEach(node => {
                                if (node.nodeType === 1) { // É um elemento
                                    const cnpjLinks = node.querySelectorAll ? node.querySelectorAll('.cnpj-link') : [];
                                    cnpjLinks.forEach(link => {
                                        const texto = link.textContent.trim();
                                        if (texto.match(/^\d{14}$/)) {
                                            link.textContent = formatarCNPJ(texto);
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
                
                // Iniciar observação de mudanças no DOM
                observer.observe(document.getElementById('processos'), { childList: true, subtree: true });
                
            } catch (erro) {
                console.error('Erro ao carregar os dados:', erro);
                
                document.getElementById('loader').style.display = 'none';
                document.getElementById('processos').innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Erro ao carregar os dados. Tente novamente mais tarde.</p>
                    </div>
                `;
            }
        }
        
        // Chama a função para obter os dados e exibir os processos
        obterProcessos();
    </script>


</body>
</html>
