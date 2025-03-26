<script>



// Funções utilitárias
const formatarMoeda = (valor) => {
    if (typeof valor !== 'number' || isNaN(valor)) return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const formatarCNPJ = (cnpj) => {
    if (!cnpj) return 'Informação não disponível';
    const cnpjNumeros = cnpj.replace(/\D/g, '');
    if (cnpjNumeros.length !== 14) return cnpj;
    return cnpjNumeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

const formatarContrato = (contrato) => {
    if (!contrato) return 'Informação não disponível';
    return contrato.startsWith('http') 
        ? `<a href="${contrato}" target="_blank">Ver contrato</a>` 
        : contrato;
};

const formatarLocal = (local) => {
    if (!local) return 'Informação não disponível';

    if (local.includes('@')) {
        return `<a href="mailto:${local}" target="_blank">${local}</a>`;
    }

    if (local.startsWith('http')) {
        try {
            const urlObj = new URL(local);
            const dominio = urlObj.hostname.replace('www.', '');
            return `<a href="${local}" target="_blank">Acessar ${dominio}</a>`;
        } catch (e) {
            return `<a href="${local}" target="_blank">Acessar site</a>`;
        }
    }

    return local;
};

const formatarData = (dataOriginal) => {
    if (!dataOriginal) return 'Data não informada';
    
    try {
        const data = new Date(dataOriginal);
        if (isNaN(data.getTime())) return 'Data inválida';
        
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        return 'Data não processada';
    }
};

// Função de filtro
function filtrarProcessos(termoBusca, processos) {
    const termoBuscaLower = termoBusca.toLowerCase();

    return processos.filter(processo => {
        const camposBusca = [
            processo.numeroProcesso.toString(),
            processo.anoProcesso.toString(),
            processo.modalidade,
            processo.objeto,
            processo.status,
            processo.empresaVencedora,
            processo.responsavelContratacao,
            processo.cnpjEmpresa
        ];

        return camposBusca.some(campo => 
            campo && campo.toString().toLowerCase().includes(termoBuscaLower)
        );
    });
}

// Função de renderização de processos
function renderizarProcessos(data) {
    const processosListaMain = document.getElementById('compras-processos-lista');
    processosListaMain.innerHTML = '';

    data.forEach(item => {
        const processoSection = document.createElement('section');
        processoSection.classList.add('compras-processo');

        const processoHeader = document.createElement('header');
        processoHeader.classList.add('compras-processo-header');
        processoHeader.innerHTML = `
            <p>
                <strong>Processo nº ${item.numeroProcesso}/${item.anoProcesso}</strong> -   
                ${item.modalidade || 'Modalidade não definida'} nº ${item.numeroModalidade || 'Numeração não definida'}/${item.anoModalidade} - 
                ${item.status}
            </p>
            <button class="compras-expandir-btn">Expandir</button>
        `;

        const ulDetalhes = document.createElement('div');
        ulDetalhes.classList.add('compras-detalhes-processo');

        const liObjeto = document.createElement('p');
        liObjeto.innerHTML = `<strong>Objeto</strong> ${item.objeto}`;
        ulDetalhes.appendChild(liObjeto);

        const valorEstimadoFormatado = formatarMoeda(item.valorEstimado);
        const valorHomologadoFormatado = formatarMoeda(item.valorHomologado || 0);
        const dataAberturaFormatada = formatarData(item.dataAbertura);
        const dataPublicacaoFormatada = formatarData(item.dataPublicacao);
        const dataHomologacaoFormatada = formatarData(item.dataHomologacao);

        const liDetalhesGrid = document.createElement('div');
        liDetalhesGrid.classList.add('compras-detalhes-grid');
        liDetalhesGrid.innerHTML = `
            <ul>
                <li><strong>Responsável pela Contratação</strong><br>${item.responsavelContratacao || 'Não informado'}</li>
                <li><strong>Local</strong><br>${formatarLocal(item.local || 'Não informado')}</li>
                <li><strong>Data de Publicação</strong><br>${dataPublicacaoFormatada || 'Não definida'}</li>
                <li><strong>Data de Abertura</strong><br>${dataAberturaFormatada || 'Não definida'}</li>
                <li><strong>Valor Estimado</strong><br>${valorEstimadoFormatado || 'Não informado'}</li>
                <li><strong>Data de Homologação</strong><br>${dataHomologacaoFormatada || 'Não definida'}</li>
                <li><strong>Valor Homologado</strong><br>${valorHomologadoFormatado || 'Não definido'}</li>
                <li><strong>Empresa Vencedora</strong><br>${item.empresaVencedora || 'Não definida'}</li>
                <li><strong>CNPJ da Empresa</strong><br>
                    <a href="https://portaldatransparencia.gov.br/sancoes/consulta?cpfCnpj=${item.cnpjEmpresa}" 
                       target="_blank" class="cnpj-link">
                       ${formatarCNPJ(item.cnpjEmpresa || 'Não informado')}
                    </a>
                </li>
                <li><strong>Contrato</strong><br>${formatarContrato(item.contrato || 'Não informado')}</li>
                <li><strong>Fiscal do Contrato</strong><br>${item.fiscalContrato || 'Não informado'}</li>
            </ul>
        `;
        ulDetalhes.appendChild(liDetalhesGrid);

        const listaDocumentos = document.createElement('div');
        listaDocumentos.classList.add('compras-lista-documentos');
        
        const documentosOrdenados = item.documentos
            .sort((a, b) => a.nome.localeCompare(b.nome));

        listaDocumentos.innerHTML = '<strong>Documentos do Processo</strong>';
        const ulDocumentos = document.createElement('ul');
        documentosOrdenados.forEach(doc => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${doc.link}" target="_blank">${doc.nome}</a>`;
            ulDocumentos.appendChild(li);
        });

        listaDocumentos.appendChild(ulDocumentos);
        ulDetalhes.appendChild(listaDocumentos);

        const expandirBtn = processoHeader.querySelector('.compras-expandir-btn');
        expandirBtn.addEventListener('click', () => {
            const todosProcessos = document.querySelectorAll('.compras-processo');
            todosProcessos.forEach(processo => {
                const detalhes = processo.querySelector('.compras-detalhes-processo');
                const btn = processo.querySelector('.compras-expandir-btn');
                
                if (processo !== processoSection) {
                    detalhes.classList.remove('expanded');
                    btn.classList.remove('ativo');
                    btn.textContent = 'Expandir';
                }
            });

            if (!ulDetalhes.classList.contains('expanded')) {
                ulDetalhes.classList.add('expanded');
                expandirBtn.classList.add('ativo');
                expandirBtn.textContent = 'Recolher';
            } else {
                ulDetalhes.classList.remove('expanded');
                expandirBtn.classList.remove('ativo');
                expandirBtn.textContent = 'Expandir';
            }
        });

        processoSection.appendChild(processoHeader);
        processoSection.appendChild(ulDetalhes);

        processosListaMain.appendChild(processoSection);
    });

    // Adiciona mensagem se nenhum processo for encontrado
    if (data.length === 0) {
        processosListaMain.innerHTML = `
            <div class="sem-resultados">
                <p>Nenhum processo encontrado.</p>
                <p>Tente outro termo de busca.</p>
            </div>
        `;
    }
}

// Função principal para carregar dados
async function carregarDadosCompras() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzFBqdJ7IJ8gDXjENcOMqkZ80QREU3kQU_5GFtXNnIobyUTxfb3Nue-cRYn3buaUsS4/exec');
        const data = await response.json();

        // Ordenação dos processos
        const processosSorted = data.sort((a, b) => {
            const anoComparacao = b.anoProcesso - a.anoProcesso;
            return anoComparacao !== 0 
                ? anoComparacao 
                : b.numeroProcesso - a.numeroProcesso;
        });

        // Adiciona evento de busca
        const campoBusca = document.getElementById('campo-busca-compras');
        
        // Armazena os dados originais como propriedade global para referência
        window.dadosProcessos = processosSorted;

        campoBusca.addEventListener('input', (e) => {
            const termoBusca = e.target.value;
            const processosFiltrados = filtrarProcessos(termoBusca, window.dadosProcessos);
            
            // Renderiza apenas os processos filtrados
            renderizarProcessos(processosFiltrados);
        });

        // Renderiza todos os processos inicialmente
        renderizarProcessos(processosSorted);

    } catch (error) {
        console.error('Erro ao carregar os dados de compras:', error);
        document.getElementById('compras-processos-lista').innerHTML = 
            `<p>Não foi possível carregar os dados. Erro: ${error.message}</p>`;
    }
}

// Carregar dados quando a página carregar
window.onload = carregarDadosCompras;

</script>
