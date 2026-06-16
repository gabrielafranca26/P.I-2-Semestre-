<<<<<<< HEAD
function renderRelatorios() {
    const area = document.getElementById('content-area');
    const totalDespesas = db.despesas.reduce((acc, c) => acc + parseFloat(c.valor || 0), 0);
    const totalPedidos = db.pedidos.reduce((acc, c) => acc + parseFloat(c.total || 0), 0);
    const liquido = totalPedidos - totalDespesas;

    area.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-sm">
            <h3 class="text-xl font-bold text-gray-800 mb-2">Balanço Patrimonial</h3>
            <p class="text-xs text-gray-500 mb-6">Métricas calculadas em tempo real com base nos registros locais.</p>
            
            <div class="border rounded-xl divide-y">
                <div class="p-4 flex justify-between items-center text-sm">
                    <span class="font-medium text-gray-700">Carteira de Clientes Cadastrados</span>
                    <span class="font-bold text-gray-900">${db.clientes.length}</span>
                </div>
                <div class="p-4 flex justify-between items-center text-sm">
                    <span class="font-medium text-gray-700">Produtos Ativos no Mix</span>
                    <span class="font-bold text-gray-900">${db.produtos.length}</span>
                </div>
                <div class="p-4 flex justify-between items-center text-sm bg-green-50">
                    <span class="font-medium text-green-800">Faturamento Comercial Bruto</span>
                    <span class="font-bold text-green-700">R$ ${totalPedidos.toFixed(2)}</span>
                </div>
                <div class="p-4 flex justify-between items-center text-sm bg-red-50">
                    <span class="font-medium text-red-800">Custos e Despesas Totais</span>
                    <span class="font-bold text-red-700">R$ ${totalDespesas.toFixed(2)}</span>
                </div>
                <div class="p-4 flex justify-between items-center text-sm ${liquido >= 0 ? 'bg-blue-50' : 'bg-orange-50'}">
                    <span class="font-medium ${liquido >= 0 ? 'text-blue-800' : 'text-orange-800'}">Resultado Líquido do Período</span>
                    <span class="font-bold ${liquido >= 0 ? 'text-blue-700' : 'text-orange-700'}">R$ ${liquido.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
=======
async function renderRelatorios() {
    const area = document.getElementById('content-area');
    
    try {
        const res = await fetch("API/dashboard.php");
        const m = await res.json();
        
        const faturamento = parseFloat(m.faturamento);
        const despesas = parseFloat(m.despesas);
        const liquido = faturamento - despesas;

        area.innerHTML = `
            <div class="space-y-6">
                <!-- BALANÇO CONSOLIDADO -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <h3 class="text-xl font-bold text-gray-800 mb-6">Balanço Patrimonial Consolidado</h3>
                    
                    <div class="border rounded-xl divide-y">                        
                        <div class="p-4 flex justify-between items-center text-sm bg-green-50">
                            <span class="font-medium text-green-800">Faturamento Bruto</span>
                            <span class="font-bold text-green-700">R$ ${faturamento.toFixed(2)}</span>
                        </div>
                        <div class="p-4 flex justify-between items-center text-sm bg-teal-50">
                            <span class="font-medium text-teal-800">Faturamento Liquidado (Pago)</span>
                            <span class="font-bold text-teal-700">R$ ${parseFloat(m.faturamento_liquidado).toFixed(2)}</span>
                        </div>
                        <div class="p-4 flex justify-between items-center text-sm bg-red-50">
                            <span class="font-medium text-red-800">Despesas Totais</span>
                            <span class="font-bold text-red-700">R$ ${despesas.toFixed(2)}</span>
                        </div>
                        <div class="p-4 flex justify-between items-center text-sm ${liquido >= 0 ? 'bg-blue-50' : 'bg-orange-50'}">
                            <span class="font-medium ${liquido >= 0 ? 'text-blue-800' : 'text-orange-800'}">Resultado Líquido (Bruto - Despesas)</span>
                            <span class="font-bold ${liquido >= 0 ? 'text-blue-700' : 'text-orange-700'}">R$ ${liquido.toFixed(2)}</span>
                        </div>
                    </div>

                    <div class="mt-8">
                        <h4 class="text-sm font-bold text-gray-700 mb-4 uppercase">Desempenho do Mês Atual</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="p-4 border rounded-lg bg-gray-50">
                                <p class="text-xs text-gray-500 font-bold uppercase">Faturamento Mensal</p>
                                <p class="text-lg font-black text-green-700">R$ ${parseFloat(m.faturamento_mensal).toFixed(2)}</p>
                            </div>
                            <div class="p-4 border rounded-lg bg-gray-50">
                                <p class="text-xs text-gray-500 font-bold uppercase">Despesas Mensais</p>
                                <p class="text-lg font-black text-red-700">R$ ${parseFloat(m.despesas_mensais).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MENU DE RELATÓRIOS ADICIONAIS -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onclick="gerarRelatorioEstoque()" class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-eros-red transition flex flex-col items-center text-center">
                        <div class="w-10 h-10 bg-red-50 text-eros-red rounded-full flex items-center justify-center mb-2">
                            <i data-lucide="package" class="w-5 h-5"></i>
                        </div>
                        <span class="text-sm font-bold text-gray-800">Relatório de Estoque</span>
                    </button>
                    <button onclick="gerarRelatorioLucroProduto()" class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-eros-red transition flex flex-col items-center text-center">
                        <div class="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2">
                            <i data-lucide="trending-up" class="w-5 h-5"></i>
                        </div>
                        <span class="text-sm font-bold text-gray-800">Lucro Por Produto</span>
                    </button>
                    <button onclick="gerarRelatorioLucroCliente()" class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-eros-red transition flex flex-col items-center text-center">
                        <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                            <i data-lucide="users" class="w-5 h-5"></i>
                        </div>
                        <span class="text-sm font-bold text-gray-800">Lucro Por Cliente</span>
                    </button>
                    <button onclick="mostrarFormLucroPeriodo()" class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-eros-red transition flex flex-col items-center text-center">
                        <div class="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-2">
                            <i data-lucide="calendar" class="w-5 h-5"></i>
                        </div>
                        <span class="text-sm font-bold text-gray-800">Lucro Por Período</span>
                    </button>
                    <button onclick="mostrarFormPendenciasCliente()" class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-eros-red transition flex flex-col items-center text-center">
                        <div class="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-2">
                            <i data-lucide="user-minus" class="w-5 h-5"></i>
                        </div>
                        <span class="text-sm font-bold text-gray-800">Pendências Por Cliente</span>
                    </button>
                    <button onclick="mostrarFormPendenciasPeriodo()" class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-eros-red transition flex flex-col items-center text-center">
                        <div class="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center mb-2">
                            <i data-lucide="clock" class="w-5 h-5"></i>
                        </div>
                        <span class="text-sm font-bold text-gray-800">Pendências Por Período</span>
                    </button>
                </div>

                <!-- ÁREA DE RESULTADO DO RELATÓRIO -->
                <div id="relatorio-resultado" class="bg-white p-6 rounded-xl shadow-sm hidden">
                    <div class="flex justify-between items-center mb-4">
                        <h3 id="relatorio-titulo" class="text-lg font-bold text-gray-800">
                            Resultado do Relatório
                        </h3>

                        <div class="flex gap-2">

                            <button
                                onclick="exportarPDF()"
                                class="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-bold">
                                Exportar PDF
                            </button>

                            <button
                                onclick="document.getElementById('relatorio-resultado').classList.add('hidden')"
                                class="text-gray-400 hover:text-gray-600">
                                <i data-lucide="x-circle" class="w-5 h-5"></i>
                            </button>

                        </div>
                    </div>
                    <div id="relatorio-filtros" class="mb-4 hidden"></div>
                    <div id="relatorio-tabela-container" class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead id="relatorio-head" class="bg-gray-50 border-b"></thead>
                            <tbody id="relatorio-body" class="divide-y"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        if(window.lucide) lucide.createIcons();
    } catch (err) {
        console.error(err);
        area.innerHTML = `<p class="text-red-500">Erro ao carregar relatório.</p>`;
    }
}

/* ========== FUNÇÕES DE GERAÇÃO DE RELATÓRIOS ========== */

function prepararTabela(titulo, colunas) {
    const container = document.getElementById('relatorio-resultado');
    const head = document.getElementById('relatorio-head');
    const body = document.getElementById('relatorio-body');
    const titleEl = document.getElementById('relatorio-titulo');
    const filtros = document.getElementById('relatorio-filtros');

    container.classList.remove('hidden');
    filtros.classList.add('hidden');
    titleEl.innerText = titulo;
    body.innerHTML = '<tr><td colspan="'+colunas.length+'" class="p-8 text-center text-gray-400 italic">Carregando dados...</td></tr>';
    
    head.innerHTML = `<tr>${colunas.map(c => `<th class="p-3 font-bold text-gray-600">${c}</th>`).join('')}</tr>`;
    
    window.scrollTo({ top: container.offsetTop - 20, behavior: 'smooth' });
}

async function gerarRelatorioEstoque() {
    prepararTabela("Relatório de Estoque", ["Produto", "Descrição", "Quantidade em Estoque"]);
    const res = await fetch("API/relatorios/estoque.php");
    const dados = await res.json();
    
    const body = document.getElementById('relatorio-body');
    body.innerHTML = dados.map(d => `
        <tr class="hover:bg-gray-50">
            <td class="p-3 font-medium">${d.nome_produto}</td>
            <td class="p-3 text-gray-600">${d.descricao || '-'}</td>
            <td class="p-3 font-bold ${d.quantidade_estoque <= 5 ? 'text-red-600' : 'text-gray-800'}">${d.quantidade_estoque}</td>
        </tr>
    `).join('');
}

async function gerarRelatorioLucroProduto() {
    prepararTabela("Relatório de Lucro Por Produto", ["Produto", "Qtd Vendida", "Lucro Total"]);
    const res = await fetch("API/relatorios/lucro_produto.php");
    const dados = await res.json();
    
    const body = document.getElementById('relatorio-body');
    body.innerHTML = dados.map(d => `
        <tr class="hover:bg-gray-50">
            <td class="p-3 font-medium">${d.nome_produto}</td>
            <td class="p-3">${d.quantidade_vendida}</td>
            <td class="p-3 font-bold text-green-700">R$ ${parseFloat(d.lucro_total).toFixed(2)}</td>
        </tr>
    `).join('');
}

async function gerarRelatorioLucroCliente() {
    prepararTabela("Relatório de Lucro Por Cliente", ["Cliente", "Total Vendas", "Lucro Esperado", "Lucro Obtido"]);
    const res = await fetch("API/relatorios/lucro_cliente.php");
    const dados = await res.json();
    
    const body = document.getElementById('relatorio-body');
    body.innerHTML = dados.map(d => `
        <tr class="hover:bg-gray-50">
            <td class="p-3 font-medium">${d.cliente}</td>
            <td class="p-3 text-center">${d.total_vendas}</td>
            <td class="p-3 text-gray-500 italic">R$ ${parseFloat(d.lucro_esperado).toFixed(2)}</td>
            <td class="p-3 font-bold text-green-700">R$ ${parseFloat(d.lucro_obtido).toFixed(2)}</td>
        </tr>
    `).join('');
}

/* ========== RELATÓRIOS COM FILTROS ========== */

function mostrarFormLucroPeriodo() {
    prepararTabela("Lucro Por Período", ["Total Vendas", "Lucro Esperado", "Lucro Obtido"]);
    const filtros = document.getElementById('relatorio-filtros');
    filtros.classList.remove('hidden');
    filtros.innerHTML = `
        <div class="flex flex-wrap gap-4 items-end bg-gray-50 p-4 rounded-lg">
            <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase">Data Inicial</label>
                <input type="date" id="f-data-ini" class="block w-full border p-2 rounded text-sm">
            </div>
            <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase">Data Final</label>
                <input type="date" id="f-data-fim" class="block w-full border p-2 rounded text-sm">
            </div>
            <button onclick="executarLucroPeriodo()" class="bg-purple-600 text-white px-4 py-2 rounded text-sm font-bold">Filtrar</button>
        </div>
    `;
    document.getElementById('f-data-ini').value = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    document.getElementById('f-data-fim').value = new Date().toISOString().split('T')[0];
}

async function executarLucroPeriodo() {
    const dataIni = document.getElementById('f-data-ini').value;
    const dataFim = document.getElementById('f-data-fim').value;
    
    const res = await fetch("API/relatorios/lucro_periodo.php", {
        method: "POST",
        body: JSON.stringify({ data_inicial: dataIni, data_final: dataFim })
    });
    const d = await res.json();
    
    const body = document.getElementById('relatorio-body');
    body.innerHTML = `
        <tr class="bg-purple-50">
            <td class="p-4 font-bold text-center text-lg">${d.total_vendas || 0}</td>
            <td class="p-4 text-gray-500 italic text-center">R$ ${parseFloat(d.lucro_esperado || 0).toFixed(2)}</td>
            <td class="p-4 font-black text-green-700 text-center text-lg">R$ ${parseFloat(d.lucro_obtido || 0).toFixed(2)}</td>
        </tr>
    `;
}

async function mostrarFormPendenciasCliente() {
    prepararTabela("Pendências Por Cliente", ["Data", "Valor Total", "Valor Pago", "Pendente", "Status"]);
    const filtros = document.getElementById('relatorio-filtros');
    filtros.classList.remove('hidden');
    
    const resCli = await fetch("API/clientes/listar.php");
    const clientes = await resCli.json();

    filtros.innerHTML = `
        <div class="flex flex-wrap gap-4 items-end bg-gray-50 p-4 rounded-lg">
            <div class="flex-1 min-w-[200px]">
                <label class="text-[10px] font-bold text-gray-400 uppercase">Selecione o Cliente</label>
                <select id="f-cliente-id" class="block w-full border p-2 rounded text-sm">
                    ${clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}
                </select>
            </div>
            <button onclick="executarPendenciasCliente()" class="bg-orange-600 text-white px-4 py-2 rounded text-sm font-bold">Gerar Relatório</button>
        </div>
    `;
}

async function executarPendenciasCliente() {
    const id = document.getElementById('f-cliente-id').value;
    const res = await fetch(`API/relatorios/pendencias_cliente.php?id_cliente=${id}`);
    const dados = await res.json();
    
    const body = document.getElementById('relatorio-body');
    if(dados.length === 0) {
        body.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-400">Nenhuma pendência encontrada para este cliente.</td></tr>';
        return;
    }

    body.innerHTML = dados.map(d => `
        <tr class="hover:bg-gray-50">
            <td class="p-3">${d.data_venda.split('-').reverse().join('/')}</td>
            <td class="p-3">R$ ${parseFloat(d.valor_total).toFixed(2)}</td>
            <td class="p-3 text-green-600">R$ ${parseFloat(d.valor_pago).toFixed(2)}</td>
            <td class="p-3 font-bold text-red-600">R$ ${parseFloat(d.valor_pendente).toFixed(2)}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-800">${d.status_pagamento}</span></td>
        </tr>
    `).join('');
}

function mostrarFormPendenciasPeriodo() {
    prepararTabela("Pendências Por Período", ["Data", "Cliente", "Total", "Pago", "Pendente"]);
    const filtros = document.getElementById('relatorio-filtros');
    filtros.classList.remove('hidden');
    filtros.innerHTML = `
        <div class="flex flex-wrap gap-4 items-end bg-gray-50 p-4 rounded-lg">
            <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase">Data Inicial</label>
                <input type="date" id="f-p-data-ini" class="block w-full border p-2 rounded text-sm">
            </div>
            <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase">Data Final</label>
                <input type="date" id="f-p-data-fim" class="block w-full border p-2 rounded text-sm">
            </div>
            <button onclick="executarPendenciasPeriodo()" class="bg-gray-800 text-white px-4 py-2 rounded text-sm font-bold">Filtrar</button>
        </div>
    `;
    document.getElementById('f-p-data-ini').value = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    document.getElementById('f-p-data-fim').value = new Date().toISOString().split('T')[0];
}

async function executarPendenciasPeriodo() {
    const dataIni = document.getElementById('f-p-data-ini').value;
    const dataFim = document.getElementById('f-p-data-fim').value;
    
    const res = await fetch(`API/relatorios/pendencias_periodo.php?data_inicial=${dataIni}&data_final=${dataFim}`);
    const dados = await res.json();
    
    const body = document.getElementById('relatorio-body');
    if(dados.length === 0) {
        body.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-400">Nenhuma pendência encontrada neste período.</td></tr>';
        return;
    }

    body.innerHTML = dados.map(d => `
        <tr class="hover:bg-gray-50">
            <td class="p-3">${d.data_venda.split('-').reverse().join('/')}</td>
            <td class="p-3 font-medium">${d.cliente}</td>
            <td class="p-3">R$ ${parseFloat(d.valor_total).toFixed(2)}</td>
            <td class="p-3 text-green-600">R$ ${parseFloat(d.valor_pago).toFixed(2)}</td>
            <td class="p-3 font-bold text-red-600">R$ ${parseFloat(d.valor_pendente).toFixed(2)}</td>
        </tr>
    `).join('');
}

/* ========== EXPORTAR RELATÓRIOS EM PDF ========== */

function exportarPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const titulo =
        document.getElementById('relatorio-titulo')
        .innerText;

    doc.setFontSize(16);

    doc.text(
        titulo,
        14,
        15
    );

    const headers = [];

    document
        .querySelectorAll('#relatorio-head th')
        .forEach(th => {

            headers.push(
                th.innerText
            );

        });

    const rows = [];

    document
        .querySelectorAll('#relatorio-body tr')
        .forEach(tr => {

            const row = [];

            tr.querySelectorAll('td')
                .forEach(td => {

                    row.push(
                        td.innerText.trim()
                    );

                });

            if(row.length > 0){
                rows.push(row);
            }

        });

    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 25,
        styles: {
            fontSize: 9
        }
    });

    const nomeArquivo =
        titulo
        .replace(/\s+/g, "_")
        .toLowerCase();

    doc.save(
        `${nomeArquivo}.pdf`
    );

>>>>>>> 1e2799b424afbf2589afe5e929b4176f5837d75a
}