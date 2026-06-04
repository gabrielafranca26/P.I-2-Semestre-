function renderPedidos() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 class="text-lg font-bold mb-4 text-gray-800">Lançar Novo Pedido</h3>
            <form onsubmit="savePedido(event)" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select id="sel-cliente" required class="border p-2.5 rounded-lg text-sm bg-white focus:outline-none">
                    <option value="" disabled selected>Selecione o Cliente</option>
                    ${db.clientes.map(c => `<option value="${c.nome}">${c.nome}</option>`).join('')}
                </select>
                <select id="sel-produto" required class="border p-2.5 rounded-lg text-sm bg-white focus:outline-none">
                    <option value="" disabled selected>Selecione o Produto</option>
                    ${db.produtos.map(p => `<option value="${p.nome}" data-price="${p.preco}">${p.nome} (R$ ${p.preco})</option>`).join('')}
                </select>
                <input type="number" id="ped-qtd" placeholder="Quantidade" required class="border p-2.5 rounded-lg text-sm focus:outline-none">
                <button type="submit" class="bg-eros-red hover:bg-red-800 text-white font-medium p-2.5 rounded-lg text-sm transition md:col-span-3">Fechar Venda</button>
            </form>
        </div>
        <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table class="w-full text-left min-w-[600px]">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="p-4 font-semibold text-sm text-gray-700">Cliente</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Produto</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Qtd.</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Valor Total</th>
                        <th class="p-4 font-semibold text-sm text-gray-700 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${db.pedidos.map((p, idx) => `
                        <tr class="border-b hover:bg-gray-50 text-sm">
                            <td class="p-4 font-medium text-gray-900">${p.cliente}</td>
                            <td class="p-4 text-gray-600">${p.produto}</td>
                            <td class="p-4 text-gray-600">${p.qtd}</td>
                            <td class="p-4 font-bold text-green-700">R$ ${parseFloat(p.total).toFixed(2)}</td>
                            <td class="p-4 text-center">
                                <button onclick="deleteItem('pedidos', ${idx}, renderPedidos)" class="text-red-600 hover:text-red-900 font-medium">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function savePedido(e) {
    e.preventDefault();
    const pSelect = document.getElementById('sel-produto');
    const opt = pSelect.options[pSelect.selectedIndex];
    const price = parseFloat(opt.getAttribute('data-price'));
    const qtd = parseInt(document.getElementById('ped-qtd').value);

    db.pedidos.push({
        cliente: document.getElementById('sel-cliente').value,
        produto: pSelect.value,
        qtd: qtd,
        total: (price * qtd).toFixed(2)
    });
    saveDB();
    renderPedidos();
}