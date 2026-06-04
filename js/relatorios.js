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
}