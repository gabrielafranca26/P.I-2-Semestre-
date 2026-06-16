function renderFornecedores() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 class="text-lg font-bold mb-4 text-gray-800">Novo Fornecedor</h3>
            <form onsubmit="saveFornecedor(event)" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" id="f-nome" placeholder="Razão Social / Nome" required class="border p-2.5 rounded-lg text-sm focus:outline-none">
                <input type="text" id="f-cnpj" placeholder="CNPJ / CPF" required class="border p-2.5 rounded-lg text-sm focus:outline-none">
                <input type="text" id="f-tipo" placeholder="Tipo de Insumo" required class="border p-2.5 rounded-lg text-sm focus:outline-none">
                <button type="submit" class="bg-eros-red hover:bg-red-800 text-white font-medium p-2.5 rounded-lg text-sm transition md:col-span-3">Salvar Fornecedor</button>
            </form>
        </div>
        <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table class="w-full text-left min-w-[600px]">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="p-4 font-semibold text-sm text-gray-700">Fornecedor</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">CNPJ/CPF</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Categoria Fornecida</th>
                        <th class="p-4 font-semibold text-sm text-gray-700 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${db.fornecedores.map((f, idx) => `
                        <tr class="border-b hover:bg-gray-50 text-sm">
                            <td class="p-4 font-medium text-gray-900">${f.nome}</td>
                            <td class="p-4 text-gray-600">${f.cnpj}</td>
                            <td class="p-4 text-gray-600">${f.tipo}</td>
                            <td class="p-4 text-center">
                                <button onclick="deleteItem('fornecedores', ${idx}, renderFornecedores)" class="text-red-600 hover:text-red-900 font-medium">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function saveFornecedor(e) {
    e.preventDefault();
    db.fornecedores.push({
        nome: document.getElementById('f-nome').value,
        cnpj: document.getElementById('f-cnpj').value,
        tipo: document.getElementById('f-tipo').value
    });
    saveDB();
    renderFornecedores();
}