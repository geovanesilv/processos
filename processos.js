<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informações de Compra</title>
    <style>
        :root {
            --cor-primaria: #2c3e50;
            --cor-secundaria: #3498db;
            --cor-fundo: #f4f6f7;
            --cor-texto: #333;
            --transicao-padrao: all 0.3s ease-in-out;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        #compras-container {
            font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            background-color: var(--cor-fundo);
            color: var(--cor-texto);
        }

        #compras-processos-lista {
            display: grid;
            gap: 15px;
        }

        .compras-processo {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: var(--transicao-padrao);
        }

        .compras-processo:hover {
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .compras-processo-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background-color: var(--cor-primaria);
            color: white;
        }

        .compras-processo-header p {
            flex-grow: 1;
            margin-right: 15px;
            font-size: 0.9rem;
        }

        .compras-expandir-btn {
            background-color: var(--cor-secundaria);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            transition: var(--transicao-padrao);
            font-weight: 500;
        }

        .compras-expandir-btn:hover {
            background-color: #2980b9;
        }

        .compras-expandir-btn.ativo {
            background-color: #2ecc71;
        }

        .compras-detalhes-processo {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: var(--transicao-padrao);
            background-color: #f9f9f9;
        }

        .compras-detalhes-processo.expanded {
            max-height: 1000px;
            opacity: 1;
            padding: 15px;
        }

        .compras-detalhes-grid ul {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 10px;
            list-style: none;
        }

        .compras-detalhes-grid li {
            background-color: white;
            padding: 10px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .compras-detalhes-grid strong {
            display: block;
            margin-bottom: 5px;
            color: var(--cor-primaria);
            font-size: 0.8rem;
        }

        .compras-detalhes-grid .texto-longo {
            word-wrap: break-word;
            white-space: pre-wrap;
            overflow-wrap: break-word;
        }

        /* Nova classe para lista de documentos */
        .compras-lista-documentos {
            margin-top: 15px;
        }

        .compras-lista-documentos ul {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 10px;
            list-style: none;
        }

        .compras-lista-documentos li {
            background-color: white;
            padding: 10px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .compras-lista-documentos a {
            color: var(--cor-secundaria);
            text-decoration: none;
            transition: var(--transicao-padrao);
        }

        .compras-lista-documentos a:hover {
            color: var(--cor-primaria);
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div id="compras-container">
        <main id="compras-processos-lista"></main>
    </div>

    <script>
// Função para formatar moeda brasileira
function formatarMoeda(valor) {
    // Verifica se o valor é um número válido
    if (typeof valor !== 'number' || isNaN(valor)) return 'R$ 0,00';
    
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Função formatar CNPJ
function formatarCNPJ(cnpj) {
    if (!cnpj) return 'Informação não disponível';

    // Remove qualquer caractere que não seja número
    const cnpjNumeros = cnpj.replace(/\D/g, '');

    // Verifica se o CNPJ tem o tamanho correto (14 dígitos)
    if (cnpjNumeros.length !== 14) return cnpj;

    // Formata o CNPJ no padrão brasileiro (XX.XXX.XXX/XXXX-XX)
    return cnpjNumeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}


// função para formatar contrato
function formatarContrato(contrato) {
    if (!contrato) return 'Informação não disponível';

    // Se for uma URL, exibe como link
    if (contrato.startsWith('http')) {
        return `<a href="${contrato}" target="_blank">Ver contrato</a>`;
    } 
    // Qualquer outra informação, exibe como texto
    else {
        return contrato;
    }
}


  // Função para formatar local
function formatarLocal(local) {
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
}


// Função para formatar data no padrão brasileiro
function formatarData(dataOriginal) {
    // Verifica se a data é válida
    if (!dataOriginal) return 'Data não informada';
    
    try {
        // Converte a string de data para um objeto Date
        const data = new Date(dataOriginal);
        
        // Verifica se a data é válida
        if (isNaN(data.getTime())) return 'Data inválida';
        
        // Formata a data no padrão brasileiro
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        return 'Data não processada';
    }
}

async function carregarDadosCompras() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyLbH29klt6xJKOVQWbOLTNpmkxI-Hlz0PXPLKtTI0kQ4ahxgBW53lgnOIfMr26FkjP/exec');
        const data = await response.json();

        data.sort((a, b) => {
            const numA = a.numeroProcesso;
            const numB = b.numeroProcesso;
            const anoA = a.anoProcesso;
            const anoB = b.anoProcesso;
            
            if (anoB !== anoA) return anoB - anoA;
            return numB - numA;
        });

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
                    ${item.modalidade} nº ${item.numeroContratacao}/${item.anoContratacao} - 
                    ${item.status}
                </p>
                <button class="compras-expandir-btn">Expandir</button>
            `;

            const ulDetalhes = document.createElement('div');
            ulDetalhes.classList.add('compras-detalhes-processo');

            const liObjeto = document.createElement('p');
            liObjeto.innerHTML = `<strong>Objeto: </strong> ${item.objeto}`;
            ulDetalhes.appendChild(liObjeto);

            // Formatações de valores e datas
            const valorEstimadoFormatado = formatarMoeda(item.valorEstimado);
            const valorHomologadoFormatado = formatarMoeda(item.valorHomologado);
            const dataAberturaFormatada = formatarData(item.dataAbertura);
            const dataEnceramentoFormatada = formatarData(item.dataEncerramento);

            const liDetalhesGrid = document.createElement('div');
            liDetalhesGrid.classList.add('compras-detalhes-grid');
            liDetalhesGrid.innerHTML = `
                <ul>
                    <li><strong>Responsável pela Contratação<br></strong> ${item.responsavelContratacao}</li>
                    <li><strong>Local<br></strong><span class="texto-longo">${item.local}</span></li>
                    <li><strong>Data de Abertura<br></strong> ${dataAberturaFormatada}</li>
                    <li><strong>Valor Estimado<br></strong> ${valorEstimadoFormatado}</li>
                    <li><strong>Data de Encerramento<br></strong> ${dataEnceramentoFormatada}</li>
                    <li><strong>Valor Homologado<br></strong> ${valorHomologadoFormatado}</li>
                    <li><strong>Empresa Vencedora<br></strong> ${item.empresaVencedora}</li>
                    <li><strong>CNPJ da Empresa Vencedora<br></strong> <a href="https://portaldatransparencia.gov.br/sancoes/consulta?cadastro=1&cadastro=2&cpfCnpj=${item.cnpjEmpresa}" target="_blank" class="cnpj-link">${item.cnpjEmpresa}</a></li>
                    <li><strong>Contrato<br></strong><span class="texto-longo">${item.contrato}</span></li>
                    <li><strong>Fiscal do Contrato<br></strong> ${item.fiscalContrato}</li>
                </ul>
            `;
            ulDetalhes.appendChild(liDetalhesGrid);

            // Nova seção para lista de documentos
            const listaDocumentos = document.createElement('div');
            listaDocumentos.classList.add('compras-lista-documentos');
            
            // Ordenar documentos alfabeticamente
            const documentosOrdenados = item.documentos.map((doc, index) => ({
                nome: doc,
                link: item.link[index]
            })).sort((a, b) => a.nome.localeCompare(b.nome));

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
                // Collapse all other processes
                const todosProcessos = document.querySelectorAll('.compras-processo');
                todosProcessos.forEach(processo => {
                    const detalhes = processo.querySelector('.compras-detalhes-processo');
                    const btn = processo.querySelector('.compras-expandir-btn');
                    
                    // Close all other processes
                    if (processo !== processoSection) {
                        detalhes.classList.remove('expanded');
                        btn.classList.remove('ativo');
                        btn.textContent = 'Expandir';
                    }
                });

                // Toggle current process
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

    } catch (error) {
        console.error('Erro ao carregar os dados de compras:', error);
    }
}

window.onload = carregarDadosCompras;
    </script>
</body>
</html>
