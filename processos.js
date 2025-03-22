    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .processo {
            background-color: #f9f9f9;
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #ddd;
        }
        .processo h2 {
            margin: 0;
            font-size: 20px;
            color: #333;
        }
        .processo p {
            margin: 5px 0;
            color: #666;
        }
        .links a {
            color: #007bff;
            text-decoration: none;
        }
        .links a:hover {
            text-decoration: underline;
        }
    </style>

    <div class="container" id="processos-container">
        <!-- Processos serão inseridos aqui dinamicamente -->
    </div>

    <script>
        fetch('https://script.google.com/macros/s/AKfycbyLbH29klt6xJKOVQWbOLTNpmkxI-Hlz0PXPLKtTI0kQ4ahxgBW53lgnOIfMr26FkjP/exec')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('processos-container');
                data.forEach(processo => {
                    const processoDiv = document.createElement('div');
                    processoDiv.classList.add('processo');

                    processoDiv.innerHTML = `
                        <h2>Processo nº ${processo['Número do Processo']}/${processo['Ano do Processo']}</h2>
                        <p><strong>Modalidade:</strong> ${processo['Modalidade']}</p>
                        <p><strong>Objeto:</strong> ${processo['Objeto']}</p>
                        <p><strong>Valor Estimado:</strong> R$ ${processo['Valor Estimado'].toFixed(2)}</p>
                        <p><strong>Status:</strong> ${processo['Status']}</p>
                        <p><strong>Empresa Vencedora:</strong> ${processo['Empresa Vencedora']}</p>
                        <p><strong>Valor Homologado:</strong> R$ ${processo['Valor Homologado'].toFixed(2)}</p>
                        <p><strong>Data de Abertura:</strong> ${processo['Data de Abertura']}</p>
                        <p><strong>Data de Encerramento:</strong> ${processo['Data de Encerramento']}</p>
                        <div class="links">
                            <strong>Documentos:</strong>
                            <ul>
                                ${processo['Link'].map(link => `<li><a href="${link}" target="_blank">Visualizar Documento</a></li>`).join('')}
                            </ul>
                        </div>
                    `;

                    container.appendChild(processoDiv);
                });
            })
            .catch(error => console.error('Erro ao carregar os dados:', error));
    </script>
