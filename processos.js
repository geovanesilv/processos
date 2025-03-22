
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

