<<<<<<< HEAD
function renderDespesas() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 class="text-lg font-bold mb-4 text-gray-800">Lançar Custo / Saída</h3>
            <form onsubmit="saveDespesa(event)" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="text" id="d-desc" placeholder="Descrição do gasto" required class="border p-2.5 rounded-lg text-sm sm:col-span-2 focus:outline-none">
                <input type="number" step="0.01" id="d-valor" placeholder="Valor (R$)" required class="border p-2.5 rounded-lg text-sm focus:outline-none">
                <button type="submit" class="bg-eros-red hover:bg-red-800 text-white font-medium p-2.5 rounded-lg text-sm transition sm:col-span-3">Lançar Saída</button>
=======
let despesas = [];
let despesaIdEditando = null;

async function carregarDespesas(){

    const resposta = await fetch(
        "API/despesas/listar.php"
    );

    despesas = await resposta.json();

    return despesas;

}

async function renderDespesas() {
    const area = document.getElementById('content-area');
    const despesas = await carregarDespesas();

    area.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 id="form-title-despesas" class="text-lg font-bold mb-4 text-gray-800">Lançar Despesa</h3>
            <form onsubmit="saveDespesa(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="date" id="d-data" required class="border p-2.5 rounded-lg text-sm focus:outline-none">                
                <input type="number" step="0.01" id="d-valor" placeholder="Valor (R$)" required class="border p-2.5 rounded-lg text-sm focus:outline-none">
                <textarea type="text" id="d-desc" placeholder="Descrição do gasto" required class="border p-2.5 rounded-lg text-sm sm:col-span-2 focus:outline-none"></textarea>
                <button type="submit" id="btn-submit-despesas" class="bg-eros-red hover:bg-red-800 text-white font-medium p-2.5 rounded-lg text-sm transition sm:col-span-3">Lançar</button>
>>>>>>> 1e2799b424afbf2589afe5e929b4176f5837d75a
            </form>
        </div>
        <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table class="w-full text-left min-w-[500px]">
                <thead class="bg-gray-50 border-b">
                    <tr>
<<<<<<< HEAD
                        <th class="p-4 font-semibold text-sm text-gray-700">Descrição do Custo</th>
=======
                        <th class="p-4 font-semibold text-sm text-gray-700">Data</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Descrição da Despesa</th>
>>>>>>> 1e2799b424afbf2589afe5e929b4176f5837d75a
                        <th class="p-4 font-semibold text-sm text-gray-700">Valor Lançado</th>
                        <th class="p-4 font-semibold text-sm text-gray-700 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
<<<<<<< HEAD
                    ${db.despesas.map((d, idx) => `
                        <tr class="border-b hover:bg-gray-50 text-sm">
                            <td class="p-4 font-medium text-gray-800">${d.desc}</td>
                            <td class="p-4 text-red-600 font-bold">R$ ${parseFloat(d.valor).toFixed(2)}</td>
                            <td class="p-4 text-center">
                                <button onclick="deleteItem('despesas', ${idx}, renderDespesas)" class="text-red-600 hover:text-red-900 font-medium">Excluir</button>
=======
                    ${despesas.map((d) => `
                        <tr class="border-b hover:bg-gray-50 text-sm">
                            <td class="p-4 text-gray-600">${d.data}</td>
                            <td class="p-4 font-medium text-gray-800">${d.descricao}</td>
                            <td class="p-4 text-red-600 font-bold">R$ ${parseFloat(d.valor).toFixed(2)}</td>
                            <td class="p-4 text-center">
                                <button onclick="editDespesa(${d.id})" class="text-blue-600 hover:text-blue-900 font-medium">Editar</button>
                                <button onclick="excluirDespesa(${d.id})" class="text-red-600 hover:text-red-900 font-medium">Excluir</button>
>>>>>>> 1e2799b424afbf2589afe5e929b4176f5837d75a
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

<<<<<<< HEAD
function saveDespesa(e) {
    e.preventDefault();
    db.despesas.push({
        desc: document.getElementById('d-desc').value,
        valor: document.getElementById('d-valor').value
    });
    saveDB();
    renderDespesas();
=======
async function saveDespesa(e){

    e.preventDefault();

    const data = {
        id: despesaIdEditando,
        data: document.getElementById('d-data').value,
        descricao: document.getElementById('d-desc').value,
        valor: document.getElementById('d-valor').value
    };

    try{

        const url = despesaIdEditando
            ? "API/despesas/editar.php"
            : "API/despesas/inserir.php";

        const resposta = await fetch(
            url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const resultado = await resposta.json();

        if(resultado.sucesso){

            alert(resultado.mensagem);

            despesaIdEditando = null;

            renderDespesas();

        }else{

            alert("Erro: " + resultado.mensagem);

        }

    }catch(erro){

        console.error(erro);

        alert("Erro ao conectar com o servidor.");

    }

}

function editDespesa(id){

    const item = despesas.find(
        d => d.id == id
    );

    despesaIdEditando = item.id;

    document.getElementById('form-title-despesas').innerText = "Editar Despesa";

document.getElementById('btn-submit-despesas').innerText = "Atualizar Despesa";

    document.getElementById('d-data').value = item.data;

    document.getElementById('d-desc').value = item.descricao;

    document.getElementById('d-valor').value = item.valor;

}

async function excluirDespesa(id){

    if(!confirm("Deseja realmente excluir esta despesa?")){
        return;
    }

    try{

        const resposta = await fetch(
            "API/despesas/excluir.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id
                })
            }
        );

        const resultado = await resposta.json();

        if(resultado.sucesso){

            alert(resultado.mensagem);

            renderDespesas();

        }else{

            alert("Erro: " + resultado.mensagem);

        }

    }catch(erro){

        console.error(erro);

        alert("Erro ao conectar com o servidor.");

    }

>>>>>>> 1e2799b424afbf2589afe5e929b4176f5837d75a
}