function renderProdutos() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 class="text-lg font-bold mb-4 text-gray-800" id="form-title-produtos">Novo Produto</h3>
            <form onsubmit="saveProduto(event)" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <input type="text" id="p-ref" placeholder="Cód/Ref (Ex: SN01)" required class="border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-700 focus:outline-none">
                <input type="text" id="p-nome" placeholder="Nome do Snack" required class="border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-700 focus:outline-none">
                <input type="number" step="0.01" id="p-preco" placeholder="Preço Atacado (R$)" required class="border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-700 focus:outline-none">
                <input type="number" id="p-min" placeholder="Estoque Mínimo" required class="border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-700 focus:outline-none">
                <button type="submit" id="btn-submit-produtos" class="bg-eros-red hover:bg-red-800 text-white font-medium p-2.5 rounded-lg text-sm transition sm:col-span-2 md:col-span-4">Adicionar Produto</button>
            </form>
        </div>
        <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table class="w-full text-left min-w-[600px]">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="p-4 font-semibold text-sm text-gray-700">Ref</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Produto</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Preço Unitário</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Mínimo Alerta</th>
                        <th class="p-4 font-semibold text-sm text-gray-700 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${db.produtos.map((p, idx) => `
                        <tr class="border-b hover:bg-gray-50 text-sm">
                            <td class="p-4 font-mono text-gray-500">${p.ref}</td>
                            <td class="p-4 font-medium text-gray-900">${p.nome}</td>
                            <td class="p-4 text-gray-900">R$ ${parseFloat(p.preco).toFixed(2)}</td>
                            <td class="p-4 text-gray-600">${p.min} un</td>
                            <td class="p-4 text-center space-x-2">
                                <button onclick="editProduto(${idx})" class="text-blue-600 hover:text-blue-900 font-medium">Editar</button>
                                <button onclick="deleteItem('produtos', ${idx}, renderProdutos)" class="text-red-600 hover:text-red-900 font-medium">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function saveProduto(e) {
    e.preventDefault();
    const preco = parseFloat(document.getElementById('p-preco').value);
    if(preco <= 0) { alert("O preço precisa ser maior que zero!"); return; }

    const data = {
        ref: document.getElementById('p-ref').value,
        nome: document.getElementById('p-nome').value,
        preco: preco.toFixed(2),
        min: document.getElementById('p-min').value
    };

    if (editIndex !== null) {
        db.produtos[editIndex] = data;
        editIndex = null;
    } else {
        db.produtos.push(data);
    }

    saveDB();
    renderProdutos();
}

function editProduto(idx) {
    editIndex = idx;
    const item = db.produtos[idx];
    document.getElementById('form-title-produtos').innerText = "Editar Produto";
    document.getElementById('btn-submit-produtos').innerText = "Atualizar Produto";
    document.getElementById('p-ref').value = item.ref;
    document.getElementById('p-nome').value = item.nome;
    document.getElementById('p-preco').value = item.preco;
    document.getElementById('p-min').value = item.min;
}