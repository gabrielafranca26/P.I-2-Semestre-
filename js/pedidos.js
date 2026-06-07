/* ========== VARIÁVEIS ========== */
let pedidos = [];
let itensDoPedido = [];
let listaClientes = [];
let listaProdutos = [];
let pedidoIdEditando = null;
let pagamentoIdEditando = null;

/* ========== FUNÇÕES DE CARREGAMENTO ========== */

async function carregarDadosPedidos() {
    const resVendas = await fetch("API/pedidos/listar.php");
    pedidos = await resVendas.json();

    const resClientes = await fetch("API/clientes/listar.php");
    listaClientes = await resClientes.json();

    const resProdutos = await fetch("API/produtos/listar.php");
    listaProdutos = await resProdutos.json();
}

/* ========== RENDERIZAÇÃO DA PÁGINA ========== */

async function renderPedidos() {
    const area = document.getElementById('content-area');
    await carregarDadosPedidos();

    area.innerHTML = `
        <!-- ÁREA DE VISUALIZAÇÃO DE DETALHES (Escondida por padrão) -->
        <div id="view-pedido-container" class="bg-white p-6 rounded-xl shadow-sm mb-6 hidden border-2 border-eros-red">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-gray-800">Detalhes do Pedido <span id="view-id-venda" class="text-eros-red"></span></h3>
                <button onclick="fecharVisualizacao()" class="text-gray-400 hover:text-gray-600">
                    <i data-lucide="x-circle" class="w-6 h-6"></i>
                </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-[11px] font-bold text-gray-400 uppercase mb-2">Informações do Cliente</h4>
                    <p class="text-sm font-bold text-gray-800" id="view-cli-nome"></p>
                    <p class="text-xs text-gray-600" id="view-cli-tel"></p>
                    <p class="text-xs text-gray-600" id="view-cli-end"></p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-[11px] font-bold text-gray-400 uppercase mb-2">Dados da Venda</h4>
                    <p class="text-sm text-gray-800">Data: <span class="font-bold" id="view-venda-data"></span></p>
                    <p class="text-sm text-gray-800">Desconto Geral: <span class="font-bold text-red-600" id="view-venda-desc"></span></p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-[11px] font-bold text-gray-400 uppercase mb-2">Status Financeiro</h4>
                    <p class="text-sm text-gray-800">Total: <span class="font-bold" id="view-fin-total"></span></p>
                    <p class="text-sm text-gray-800">Pago: <span class="font-bold text-green-700" id="view-fin-pago"></span></p>
                    <p class="text-sm text-gray-800">Status: <span id="view-fin-status" class="font-bold"></span></p>
                </div>
            </div>

            <div class="overflow-x-auto mb-6">
                <table class="w-full text-sm">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-3 text-left">Produto</th>
                            <th class="p-3 text-center">Preço Unit.</th>
                            <th class="p-3 text-center">Qtd</th>
                            <th class="p-3 text-center">Desc. Item</th>
                            <th class="p-3 text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody id="view-itens-body"></tbody>
                </table>
            </div>

            <div class="flex justify-end">
                <button onclick="fecharVisualizacao()" class="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm hover:bg-black transition">Fechar Visualização</button>
            </div>
        </div>

        <div id="form-pedido-container" class="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 class="text-lg font-bold mb-4 text-gray-800" id="form-title-pedidos">Novo Pedido</h3>
            
            <form onsubmit="savePedido(event)" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="flex flex-col">
                        <label class="text-[11px] font-bold text-gray-500 uppercase mb-1">Data da Venda</label>
                        <input type="date" id="p-data-venda" required class="border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-700 focus:outline-none">
                    </div>
                    <div class="flex flex-col">
                        <label class="text-[11px] font-bold text-gray-500 uppercase mb-1">Cliente</label>
                        <select id="p-cliente" required class="border p-2.5 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-700 focus:outline-none">
                            <option value="">Selecione um Cliente</option>
                            ${listaClientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-[11px] font-bold text-gray-500 uppercase mb-1">Desconto Total (Venda)</label>
                        <input type="number" step="0.01" id="p-desconto-venda" value="0.00" class="border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-700 focus:outline-none">
                    </div>
                </div>

                <div class="border-t pt-4">
                    <h4 class="text-sm font-bold text-gray-700 mb-3">Adicionar Itens</h4>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                        <div class="flex flex-col">
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Produto</label>
                            <select id="p-item-prod" class="border p-2 rounded-lg text-sm bg-white">
                                <option value="">Selecione</option>
                                ${listaProdutos.map(p => `<option value="${p.id}" data-preco="${p.preco_venda}">${p.nome} (R$ ${p.preco_venda})</option>`).join('')}
                            </select>
                        </div>
                        <div class="flex flex-col">
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Qtd</label>
                            <input type="number" id="p-item-qtd" value="1" min="1" class="border p-2 rounded-lg text-sm">
                        </div>
                        <div class="flex flex-col">
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Desc. Item</label>
                            <input type="number" step="0.01" id="p-item-desc" value="0.00" class="border p-2 rounded-lg text-sm">
                        </div>
                        <button type="button" onclick="addItemAoPedido()" class="bg-gray-800 text-white p-2 rounded-lg text-sm hover:bg-black transition">Adicionar</button>
                    </div>
                </div>

                <div id="lista-itens-temp" class="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                    <p class="text-xs text-gray-400 text-center" id="msg-sem-itens">Nenhum item adicionado ainda.</p>
                    <table class="w-full text-xs hidden" id="tabela-itens-temp">
                        <thead>
                            <tr class="text-left border-b border-gray-200">
                                <th class="pb-2">Produto</th>
                                <th class="pb-2">Qtd</th>
                                <th class="pb-2">Preço</th>
                                <th class="pb-2">Desc.</th>
                                <th class="pb-2">Subtotal</th>
                                <th class="pb-2 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="body-itens-temp"></tbody>
                        <tfoot>
                            <tr class="font-bold text-gray-800">
                                <td colspan="4" class="pt-2 text-right">TOTAL DO PEDIDO:</td>
                                <td colspan="2" class="pt-2 pl-2" id="total-pedido-temp">R$ 0,00</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                     <div class="flex flex-col">
                        <label class="text-[11px] font-bold text-gray-500 uppercase mb-1">Valor Pago Inicial</label>
                        <input type="number" step="0.01" id="p-valor-pago" value="0.00" class="border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-700 focus:outline-none">
                    </div>
                    <button type="submit" id="btn-submit-pedidos" class="bg-eros-red hover:bg-red-800 text-white font-medium p-2.5 rounded-lg text-sm transition self-end">Finalizar Pedido</button>
                </div>
            </form>
        </div>

        <!-- FORMULÁRIO DE EDIÇÃO DE PAGAMENTO (Escondido por padrão) -->
        <div id="edit-pagamento-container" class="bg-white p-6 rounded-xl shadow-sm mb-6 hidden border-2 border-blue-500">
            <h3 class="text-lg font-bold mb-4 text-blue-800">Atualizar Pagamento</h3>
            <form onsubmit="updatePagamento(event)" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label class="text-[11px] font-bold text-gray-500 uppercase mb-1">Total do Pedido</label>
                    <input type="text" id="edit-p-total" readonly class="bg-gray-100 border p-2.5 rounded-lg text-sm w-full outline-none">
                </div>
                <div>
                    <label class="text-[11px] font-bold text-gray-500 uppercase mb-1">Valor Já Pago</label>
                    <input type="number" step="0.01" id="edit-p-pago" required class="border p-2.5 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none">
                </div>
                <div class="flex gap-2">
                    <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-800 text-white font-medium p-2.5 rounded-lg text-sm transition">Salvar Alteração</button>
                    <button type="button" onclick="cancelarEdicaoPagamento()" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium p-2.5 rounded-lg text-sm transition">Cancelar</button>
                </div>
            </form>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table class="w-full text-left min-w-[800px]">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="p-4 font-semibold text-sm text-gray-700">Data</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Cliente</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Total</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Pago</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Status</th>
                        <th class="p-4 font-semibold text-sm text-gray-700 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${pedidos.map(p => `
                        <tr class="border-b hover:bg-gray-50 text-sm">
                            <td class="p-4 text-gray-600">${p.data.split('-').reverse().join('/')}</td>
                            <td class="p-4 font-medium text-gray-900">${p.cliente}</td>
                            <td class="p-4 font-bold text-gray-800">R$ ${parseFloat(p.total).toFixed(2)}</td>
                            <td class="p-4 text-green-700">R$ ${parseFloat(p.pago).toFixed(2)}</td>
                            <td class="p-4">
                                <span class="px-2 py-1 rounded-full text-[10px] font-bold ${
                                    p.status === 'PAGO' ? 'bg-green-100 text-green-800' : 
                                    p.status === 'PARCIAL' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'
                                }">${p.status}</span>
                            </td>
                            <td class="p-4 text-center space-x-2">
                                <button onclick="visualizarPedido(${p.id})" class="text-gray-600 hover:text-black font-medium" title="Ver">
                                    <i data-lucide="eye" class="w-4 h-4 inline"></i> Ver
                                </button>
                                <button onclick="prepararEdicaoPagamento(${p.id_pagamento}, ${p.total}, ${p.pago})" class="text-blue-600 hover:text-blue-900 font-medium">Editar</button>
                                <button onclick="excluirPedido(${p.id})" class="text-red-600 hover:text-red-900 font-medium">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    if(window.lucide) lucide.createIcons();

    // Definir data atual como padrão no formulário
    const dataInput = document.getElementById('p-data-venda');
    if(dataInput) {
        dataInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Adicionar listener para o desconto da venda
    const descVendaInput = document.getElementById('p-desconto-venda');
    if(descVendaInput) {
        descVendaInput.addEventListener('input', renderItensTemp);
    }
}

/* ========== VISUALIZAÇÃO DETALHADA ========== */

async function visualizarPedido(id) {
    try {
        const res = await fetch(`API/pedidos/detalhes.php?id=${id}`);
        const data = await res.json();

        if (!data.sucesso) {
            alert(data.mensagem);
            return;
        }

        const v = data.venda;
        const c = data.cliente;
        const p = data.pagamento;
        const itens = data.itens;

        // Verificar se os elementos existem antes de atribuir
        const elId = document.getElementById('view-id-venda');
        const elCliNome = document.getElementById('view-cli-nome');
        const elCliTel = document.getElementById('view-cli-tel');
        const elCliEnd = document.getElementById('view-cli-end');
        const elVendaData = document.getElementById('view-venda-data');
        const elVendaDesc = document.getElementById('view-venda-desc');
        const elFinTotal = document.getElementById('view-fin-total');
        const elFinPago = document.getElementById('view-fin-pago');
        const elFinStatus = document.getElementById('view-fin-status');
        const tbody = document.getElementById('view-itens-body');

        if(elId) elId.innerText = `#${v.id}`;
        if(elCliNome) elCliNome.innerText = c.nome;
        if(elCliTel) elCliTel.innerText = `Tel: ${c.telefone || 'N/A'}`;
        if(elCliEnd) elCliEnd.innerText = `End: ${c.endereco || 'N/A'}`;
        
        if(elVendaData) elVendaData.innerText = v.data.split('-').reverse().join('/');
        if(elVendaDesc) elVendaDesc.innerText = `- R$ ${parseFloat(v.desconto_venda).toFixed(2)}`;

        if(elFinTotal) elFinTotal.innerText = `R$ ${parseFloat(p.valor_total).toFixed(2)}`;
        if(elFinPago) elFinPago.innerText = `R$ ${parseFloat(p.valor_pago).toFixed(2)}`;
        
        if(elFinStatus) {
            elFinStatus.innerText = p.status_pagamento;
            elFinStatus.className = `font-bold ${
                p.status_pagamento === 'PAGO' ? 'text-green-600' : 
                p.status_pagamento === 'PARCIAL' ? 'text-yellow-600' : 'text-red-600'
            }`;
        }

        if(tbody) {
            tbody.innerHTML = itens.map(item => `
                <tr class="border-b">
                    <td class="p-3">${item.nome}</td>
                    <td class="p-3 text-center">R$ ${parseFloat(item.preco).toFixed(2)}</td>
                    <td class="p-3 text-center">${item.quantidade}</td>
                    <td class="p-3 text-center text-red-500">- R$ ${parseFloat(item.desconto).toFixed(2)}</td>
                    <td class="p-3 text-right font-bold">R$ ${parseFloat(item.subtotal).toFixed(2)}</td>
                </tr>
            `).join('');
        }

        // Mostrar container e esconder outros
        const viewContainer = document.getElementById('view-pedido-container');
        const formContainer = document.getElementById('form-pedido-container');
        const editContainer = document.getElementById('edit-pagamento-container');

        if(viewContainer) viewContainer.classList.remove('hidden');
        if(formContainer) formContainer.classList.add('hidden');
        if(editContainer) editContainer.classList.add('hidden');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if(window.lucide) lucide.createIcons();

    } catch (err) {
        console.error(err);
        alert("Erro ao carregar detalhes do pedido.");
    }
}

function fecharVisualizacao() {
    const viewContainer = document.getElementById('view-pedido-container');
    const formContainer = document.getElementById('form-pedido-container');
    
    if(viewContainer) viewContainer.classList.add('hidden');
    if(formContainer) formContainer.classList.remove('hidden');
}

/* ========== LÓGICA DE ITENS TEMPORÁRIOS ========== */

function addItemAoPedido() {
    const select = document.getElementById('p-item-prod');
    const idProd = select.value;
    const nomeProd = select.options[select.selectedIndex].text.split(' (')[0];
    const preco = parseFloat(select.options[select.selectedIndex].dataset.preco);
    const qtd = parseFloat(document.getElementById('p-item-qtd').value);
    const desc = parseFloat(document.getElementById('p-item-desc').value);

    if (!idProd || qtd <= 0) {
        alert("Selecione um produto e informe a quantidade.");
        return;
    }

    const precoComDesconto = preco - desc;
    const subtotal = precoComDesconto * qtd;

    itensDoPedido.push({
        idProduto: idProd,
        nome: nomeProd,
        preco: preco,
        quantidade: qtd,
        desconto: desc,
        subtotal: subtotal
    });

    renderItensTemp();
    
    // Reset campos de item
    select.value = "";
    document.getElementById('p-item-qtd').value = 1;
    document.getElementById('p-item-desc').value = "0.00";
}

function removeItemTemp(index) {
    itensDoPedido.splice(index, 1);
    renderItensTemp();
}

function renderItensTemp() {
    const tbody = document.getElementById('body-itens-temp');
    const tabela = document.getElementById('tabela-itens-temp');
    const msg = document.getElementById('msg-sem-itens');
    const totalLabel = document.getElementById('total-pedido-temp');

    if (itensDoPedido.length === 0) {
        if(tabela) tabela.classList.add('hidden');
        if(msg) msg.classList.remove('hidden');
        return;
    }

    if(tabela) tabela.classList.remove('hidden');
    if(msg) msg.classList.add('hidden');

    let totalBruto = 0;
    if(tbody) {
        tbody.innerHTML = itensDoPedido.map((item, idx) => {
            totalBruto += item.subtotal;
            return `
                <tr class="border-b border-gray-100">
                    <td class="py-2">${item.nome}</td>
                    <td class="py-2">${item.quantidade}</td>
                    <td class="py-2">R$ ${item.preco.toFixed(2)}</td>
                    <td class="py-2 text-red-500">- R$ ${item.desconto.toFixed(2)}</td>
                    <td class="py-2 font-bold">R$ ${item.subtotal.toFixed(2)}</td>
                    <td class="py-2 text-center">
                        <button type="button" onclick="removeItemTemp(${idx})" class="text-red-500 hover:text-red-700">Remover</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    const descontoVenda = parseFloat(document.getElementById('p-desconto-venda').value) || 0;
    const totalFinal = totalBruto - descontoVenda;

    if(totalLabel) totalLabel.innerText = `R$ ${totalFinal.toFixed(2)}`;
}

/* ========== AÇÕES DO CRUD ========== */

async function savePedido(e) {
    e.preventDefault();

    if (itensDoPedido.length === 0) {
        alert("Adicione pelo menos um item ao pedido.");
        return;
    }

    const data = {
        dataVenda: document.getElementById('p-data-venda').value,
        idCliente: document.getElementById('p-cliente').value,
        descontoVenda: document.getElementById('p-desconto-venda').value,
        valorPago: document.getElementById('p-valor-pago').value,
        itens: itensDoPedido
    };

    try {
        const res = await fetch("API/pedidos/inserir.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (result.sucesso) {
            alert(result.mensagem);
            itensDoPedido = [];
            renderPedidos();
        } else {
            alert("Erro: " + result.mensagem);
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao conectar com o servidor.");
    }
}

function prepararEdicaoPagamento(idPagto, total, pago) {
    pagamentoIdEditando = idPagto;
    
    const formContainer = document.getElementById('form-pedido-container');
    const editContainer = document.getElementById('edit-pagamento-container');
    const viewContainer = document.getElementById('view-pedido-container');
    
    if(formContainer) formContainer.classList.add('hidden');
    if(editContainer) editContainer.classList.remove('hidden');
    if(viewContainer) viewContainer.classList.add('hidden');
    
    const elTotal = document.getElementById('edit-p-total');
    const elPago = document.getElementById('edit-p-pago');

    if(elTotal) {
        elTotal.value = `R$ ${parseFloat(total).toFixed(2)}`;
        elTotal.dataset.valor = total;
    }
    if(elPago) elPago.value = parseFloat(pago).toFixed(2);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelarEdicaoPagamento() {
    pagamentoIdEditando = null;
    const formContainer = document.getElementById('form-pedido-container');
    const editContainer = document.getElementById('edit-pagamento-container');
    
    if(formContainer) formContainer.classList.remove('hidden');
    if(editContainer) editContainer.classList.add('hidden');
}

async function updatePagamento(e) {
    e.preventDefault();

    const elTotal = document.getElementById('edit-p-total');
    const elPago = document.getElementById('edit-p-pago');

    const data = {
        idPagamento: pagamentoIdEditando,
        valorPago: elPago ? elPago.value : 0,
        valorTotal: elTotal ? elTotal.dataset.valor : 0
    };

    try {
        const res = await fetch("API/pedidos/editar_pagamento.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (result.sucesso) {
            alert(result.mensagem);
            cancelarEdicaoPagamento();
            renderPedidos();
        } else {
            alert("Erro: " + result.mensagem);
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao conectar com o servidor.");
    }
}

async function excluirPedido(id) {
    if (!confirm("Deseja realmente excluir este pedido? Esta ação removerá a venda, os itens e o pagamento associado.")) return;

    try {
        const res = await fetch("API/pedidos/excluir.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id })
        });

        const result = await res.json();
        if (result.sucesso) {
            alert(result.mensagem);
            renderPedidos();
        } else {
            alert("Erro: " + result.mensagem);
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao conectar com o servidor.");
    }
}