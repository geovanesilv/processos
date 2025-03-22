<script>
// Configurações
const CONFIG = {
    jsonUrl: "https://script.google.com/macros/s/AKfycbzbAiIxAOf9KJje5lUjHQCg2SpZbvVJVv-pFnklbiwcdWbTwlpj777v5xqw72r1LQXp6w/exec",
    transparenciaUrl: "https://portaldatransparencia.gov.br/sancoes/consulta?cadastro=1&cadastro=2&cpfCnpj="
};

// Utilitários de formatação
const Formatters = {
    // Formata valores monetários para o padrão brasileiro
    valor: function(valor) {
        if (valor == null) return 'Valor não disponível';
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    },

    // Formata data para dd/mm/aaaa
    data: function(data) {
        if (data === null || data === undefined || data === "" || data === "null" || data === "undefined") {
            return 'Data não disponível';
        }
        
        const date = new Date(data);
        
        if (isNaN(date.getTime())) {
            return 'Data não disponível';
        }
        
        return date.toLocaleDateString('pt-BR');
    },

    // Formata CNPJ para XX.XXX.XXX/XXXX-XX
    cnpj: function(cnpj) {
        if (!cnpj || cnpj.length !== 14) return cnpj || 'CNPJ não disponível';
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    },

    // Formata link de acordo com o tipo
    link: function(url) {
        if (!url) return 'Informação não disponível';
        
        // Verifica se é um email
        if (url.includes('@')) {
            return `<a href="mailto:${url}" target="_blank">${url}</a>`;
        } 
        // Verifica se é o Portal de Compras Públicas
        else if (url.includes('portaldecompraspublicas')) {
            return `<a href="${url}" target="_blank">Portal de Compras Públicas</a>`;
        }
        // Verifica se já é uma URL completa
        else if (url.startsWith('http')) {
            try {
                const urlObj = new URL(url);
                const dominio = urlObj.hostname.replace('www.', '');
                return `<a href="${url}" target="_blank">Acessar ${dominio}</a>`;
            } catch (e) {
                return `<a href="${url}" target="_blank">Acessar site</a>`;
            }
        }
        // Se parece um domínio, adiciona http:// para criar um link válido
        else if (url.includes('.')) {
            const dominio = url.replace('www.', '');
            return `<a href="http://${url}" target="_blank">Acessar ${dominio}</a>`;
        }
        // Caso contrário, retorna o texto puro
        else {
            return url;
        }
    }
};

// Manipulação dos processos
const ProcessosManager = {
    // Agrupa processos por número e ano
    agrupar: function(processos) {
        const agrupados = {};

        processos.forEach(processo => {
            const chave = `${processo['Número do Processo']}-${processo['Ano do Processo']}`;
            
            if (!agrupados[chave]) {
                agrupados[chave] = [];
            }
            agrupados[chave].push(processo);
        });

        return agrupados;
    },

    // Ordena as chaves dos processos
    ordenarChaves: function(agrupados) {
        return Object.keys(agrupados).sort((a, b) => {
            const [numA, anoA] = a.split('-');
            const [numB, anoB] = b.split('-');
            return (anoB - anoA) || (numB - numA); // Decrescente por ano e número do processo
        });
    },

    // Cria um item de detalhe para exibição
    criarDetalheItem: function(label, valor) {
        return `
            <div class="detalhe-item">
                <div class="detalhe-label">${label}</div>
                <div class="detalhe-valor">${valor || 'Informação não disponível'}</div>
            </div>
        `;
    },

    // Ordena documentos por nome
    ordenarDocumentos: function(processos) {
        return processos.sort((a, b) => {
            const docA = a.Documento.replace(/_/g, ' ').replace(/.pdf$/, '');
            const docB = b.Documento.replace(/_/g, ' ').replace(/.pdf$/, '');
            return docA.localeCompare(docB);
        });
    },

    // Filtra processos com base na pesquisa
    filtrar: function() {
        const termo = document.getElementById('pesquisa').value.toLowerCase();
        const processos = document.querySelectorAll('.processo');
        const container = document.getElementById('processos');
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
        
        // Remove mensagem anterior se existir
        const emptySearch = document.querySelector('.empty-search');
        if (emptySearch) {
            emptySearch.remove();
        }
        
        // Mostra mensagem se não houver resultados
        if (encontrados === 0 && termo !== '') {
            const emptyEl = document.createElement('div');
            emptyEl.classList.add('empty-state', 'empty-search');
            emptyEl.innerHTML = `
                <i class="fas fa-search"></i>
                <p>Nenhum resultado encontrado</p>
            `;
            container.appendChild(emptyEl);
        }
    }
};

// Renderização da UI
const UI = {
    // Exibe mensagem de erro
    exibirErro: function(mensagem) {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('processos').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${mensagem}</p>
            </div>
        `;
    },

    // Exibe estado vazio (sem processos)
    exibirVazio: function() {
        document.getElementById('processos').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-invoice"></i>
                <p>Nenhum processo encontrado</p>
            </div>
        `;
    },

    // Cria o HTML para um processo
    criarProcessoHTML: function(processo, numero, ano, processosGrupo) {
        const status = processo['Status'];
        const statusClass = status === 'Concluído' ? 'status-concluido' : 'status-aberto';
        const modalidade = processo.Modalidade;
        const objeto = processo['Objeto'];
        const valorEstimado = Formatters.valor(processo['Valor Estimado']);
        
        const divProcesso = document.createElement('div');
        divProcesso.classList.add('processo');
        divProcesso.setAttribute('aria-expanded', 'false');
        
        divProcesso.innerHTML = `
            <div class="processo-header" tabindex="0" role="button" aria-controls="processo-content-${numero}-${ano}">
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
                    <span class="status-pill ${statusClass}" role="status">${status}</span>
                    <i class="fas fa-chevron-down processo-toggle" aria-hidden="true"></i>
                </div>
            </div>
            <div class="processo-content" id="processo-content-${numero}-${ano}">
                <div class="modalidade">
                    ${modalidade} nº ${processo['Número da Contratação']}/${processo['Ano da Contratação']}
                </div>
                <div class="detalhes">
                    <div class="detalhes-grid">
                        ${ProcessosManager.criarDetalheItem('Objeto', objeto)}
                        ${ProcessosManager.criarDetalheItem('Valor Estimado', valorEstimado)}
                        ${ProcessosManager.criarDetalheItem('Responsável', processo['Responsável pela Contratação'])}
                        ${ProcessosManager.criarDetalheItem('Data de Abertura', processo['Data de Abertura'] ? Formatters.data(processo['Data de Abertura']) : null)}
                        <div class="detalhe-item">
                            <div class="detalhe-label">Local</div>
                            <div class="detalhe-valor">${Formatters.link(processo['Local'])}</div>
                        </div>
                    </div>
                    ${this.renderizarDetalhesAvancados(processo, status)}
                </div>
                <div class="documentos">
                    <div class="documentos-titulo">
                        <i class="fas fa-folder-open"></i> Documentos
                    </div>
                    <div class="documentos-grid" id="documentos-${numero}-${ano}"></div>
                </div>
            </div>
        `;
        
        return divProcesso;
    },
    
    // Renderiza detalhes específicos para processos concluídos
    renderizarDetalhesAvancados: function(processo, status) {
        if (status !== 'Concluído') return '';
        
        return `
            ${ProcessosManager.criarDetalheItem('Valor Homologado', processo['Valor Homologado'] ? Formatters.valor(processo['Valor Homologado']) : null)}
            ${ProcessosManager.criarDetalheItem('Data de Encerramento', processo['Data de Encerramento'] ? Formatters.data(processo['Data de Encerramento']) : null)}
            ${ProcessosManager.criarDetalheItem('Empresa Vencedora', processo['Empresa Vencedora'])}
            <div class="detalhe-item">
                <div class="detalhe-label">CNPJ da Empresa</div>
                <div class="detalhe-valor">
                    <a href="${CONFIG.transparenciaUrl}${processo['CNPJ da Empresa']}" 
                       target="_blank" 
                       class="cnpj-link">
                        ${Formatters.cnpj(processo['CNPJ da Empresa'])}
                    </a>
                </div>
            </div>
            ${ProcessosManager.criarDetalheItem('Fiscal do Contrato', processo['Fiscal do Contrato'])}
            <div class="detalhe-item">
                <div class="detalhe-label">Contrato</div>
                <div class="detalhe-valor">${Formatters.link(processo['Contrato'])}</div>
            </div>
        `;
    },

    // Renderiza documentos para um processo
    renderizarDocumentos: function(processosGrupo, numero, ano) {
        const documentsContainer = document.getElementById(`documentos-${numero}-${ano}`);
        if (!documentsContainer) return;
        
        const documentosOrdenados = ProcessosManager.ordenarDocumentos(processosGrupo);
        
        documentosOrdenados.forEach(processo => {
            const docElement = document.createElement('div');
            docElement.classList.add('documento');
            const docName = processo.Documento.replace(/_/g, ' ').replace(/.pdf$/, '');
            docElement.innerHTML = `
                <a href="${processo.Link}" target="_blank" title="${docName}">
                    <i class="fas fa-file-pdf doc-icon" aria-hidden="true"></i>
                    <span>${docName}</span>
                </a>
            `;
            documentsContainer.appendChild(docElement);
        });
    },

    // Configura eventos de interação
    configurarEventos: function() {
        // Evento de pesquisa
        document.getElementById('pesquisa').addEventListener('input', ProcessosManager.filtrar);
        
        // Eventos para expandir/recolher processos
        document.querySelectorAll('.processo-header').forEach(header => {
            header.addEventListener('click', () => {
                const processo = header.parentElement;
                processo.classList.toggle('ativo');
                processo.setAttribute('aria-expanded', processo.classList.contains('ativo'));
            });
            
            // Suporte a navegação por teclado
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click();
                }
            });
        });
    }
};

// Principal função para exibir processos
function exibirProcessos(processos) {
    const agrupados = ProcessosManager.agrupar(processos);
    const container = document.getElementById('processos');
    container.innerHTML = '';
    
    // Ocultar o loader
    document.getElementById('loader').style.display = 'none';

    // Ordenando os processos
    const chavesOrdenadas = ProcessosManager.ordenarChaves(agrupados);

    if (chavesOrdenadas.length === 0) {
        UI.exibirVazio();
        return;
    }

    // Criar e adicionar processos ao DOM
    chavesOrdenadas.forEach(chave => {
        const processosGrupo = agrupados[chave];
        const [numero, ano] = chave.split('-');
        
        // Usa o primeiro processo para os dados gerais
        const processo = processosGrupo[0];
        
        // Cria o elemento do processo
        const divProcesso = UI.criarProcessoHTML(processo, numero, ano, processosGrupo);
        container.appendChild(divProcesso);
        
        // Adiciona os documentos
        UI.renderizarDocumentos(processosGrupo, numero, ano);
    });

    // Configura eventos para interação
    UI.configurarEventos();
}

// Função principal para buscar e exibir dados
async function inicializarSistema() {
    try {
        const resposta = await fetch(CONFIG.jsonUrl);
        
        // Verifica se a resposta foi bem-sucedida
        if (!resposta.ok) {
            throw new Error(`Erro na resposta: ${resposta.status} ${resposta.statusText}`);
        }
        
        const dados = await resposta.json();
        exibirProcessos(dados);
        
    } catch (erro) {
        console.error('Erro ao carregar os dados:', erro);
        UI.exibirErro('Erro ao carregar os dados. Tente novamente mais tarde.');
    }
}

// Inicia o carregamento dos dados quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', inicializarSistema);
</script>
