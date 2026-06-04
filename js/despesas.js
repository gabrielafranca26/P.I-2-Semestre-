function renderDespesas() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 class="text-lg font-bold mb-4 text-gray-800">Lançar Custo / Saída</h3>
            <form onsubmit="saveDespesa(event)" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="text" id="d-desc" placeholder="Descrição do gasto" required class="border p-2.5 rounded-lg text-sm sm:col-span-2 focus:outline-none">
                <input type="number" step="0.01" id="d-valor" placeholder="Valor (R$)" required class="border p-2.5 rounded-lg text-sm focus:outline-none">
                <button type="submit" class="bg-eros-red hover:bg-red-800 text-white font-medium p-2.5 rounded-lg text-sm transition sm:col-span-3">Lançar Saída</button>
            </form>
        </div>
        <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table class="w-full text-left min-w-[500px]">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="p-4 font-semibold text-sm text-gray-700">Descrição do Custo</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Valor Lançado</th>
                        <th class="p-4 font-semibold text-sm text-gray-700 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${db.despesas.map((d, idx) => `
                        <tr class="border-b hover:bg-gray-50 text-sm">
                            <td class="p-4 font-medium text-gray-800">${d.desc}</td>
                            <td class="p-4 text-red-600 font-bold">R$ ${parseFloat(d.valor).toFixed(2)}</td>
                            <td class="p-4 text-center">
                                <button onclick="deleteItem('despesas', ${idx}, renderDespesas)" class="text-red-600 hover:text-red-900 font-medium">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function saveDespesa(e) {
    e.preventDefault();
    db.despesas.push({
        desc: document.getElementById('d-desc').value,
        valor: document.getElementById('d-valor').value
    });
    saveDB();
    renderDespesas();
}