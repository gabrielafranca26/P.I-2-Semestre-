let produtos = [];
let produtoIdEditando = null;

async function carregarProdutos() {

    const resposta = await fetch(
        "API/produtos/listar.php"
    );

    produtos = await resposta.json();

    return produtos;

}

async function renderProdutos() {
    const area = document.getElementById('content-area');
    const produtos = await carregarProdutos();

    area.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 class="text-lg font-bold mb-4 text-gray-800" id="form-title-produtos">Novo Produto</h3>
            <form onsubmit="saveProduto(event)" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <input type="text" id="p-nome" placeholder="Nome do Produto" required class="border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-700 focus:outline-none">                
                <input type="number" step="0.01" id="p-precocusto" placeholder="Preço de Custo" required class="border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-700 focus:outline-none">
                <input type="number" step="0.01" id="p-precovenda" placeholder="Preço de Venda" required class="border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-700 focus:outline-none">
                <input type="number" id="p-estoque" placeholder="Estoque" required class="border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-700 focus:outline-none">
                <div class="md:col-span-4">
                    <textarea id="p-descricao" placeholder="Descrição" required rows="4" class="w-full border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-700 focus:outline-none resize-none"></textarea>
                </div>
                <button type="submit" id="btn-submit-produtos" class="bg-eros-red hover:bg-red-800 text-white font-medium p-2.5 rounded-lg text-sm transition sm:col-span-2 md:col-span-4">Adicionar Produto</button>
            </form>
        </div>
        <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table class="w-full text-left min-w-[600px]">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="p-4 font-semibold text-sm text-gray-700">Produto</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Descrição</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Preço de Custo</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Preço de Venda</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Estoque</th>
                        <th class="p-4 font-semibold text-sm text-gray-700 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${produtos.map((p) => `
                        <tr class="border-b hover:bg-gray-50 text-sm">
                            <td class="p-4 font-medium text-gray-900">${p.nome}</td>
                            <td class="p-4 text-gray-600">${p.descricao}</td>
                            <td class="p-4 text-gray-600">
                                R$ ${parseFloat(p.preco_custo).toFixed(2)}
                            </td>
                            <td class="p-4 text-gray-600">
                                R$ ${parseFloat(p.preco_venda).toFixed(2)}
                            </td>
                            <td class="p-4 text-gray-600">${p.estoque}</td>
                            <td class="p-4 text-center">
                                <button
                                    onclick="editProduto(${p.id})"
                                    class="text-blue-600 hover:text-blue-900 font-medium">
                                    Editar
                                </button>

                                <button
                                    onclick="excluirProduto(${p.id})"
                                    class="text-red-600 hover:text-red-900 font-medium">
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

async function saveProduto(e) {

    e.preventDefault();

    const data = {
        id: produtoIdEditando,
        nome: document.getElementById('p-nome').value,
        descricao: document.getElementById('p-descricao').value,
        preco_custo: document.getElementById('p-precocusto').value,
        preco_venda: document.getElementById('p-precovenda').value,
        estoque: document.getElementById('p-estoque').value
    };

    try{

        const url = produtoIdEditando
            ? "API/produtos/editar.php"
            : "API/produtos/inserir.php";

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

            renderProdutos();

        }else{

            alert("Erro: " + resultado.mensagem);

        }

    }catch(erro){

        console.error(erro);

        alert("Erro ao conectar com o servidor.");

    }

}

function editProduto(id) {

    const item = produtos.find(
        p => p.id == id
    );

    produtoIdEditando = item.id;

    document.getElementById('form-title-produtos').innerText = "Editar Produto";

    document.getElementById('btn-submit-produtos').innerText = "Atualizar Produto";

    document.getElementById('p-nome').value = item.nome;

    document.getElementById('p-descricao').value = item.descricao;

    document.getElementById('p-precocusto').value = item.preco_custo;

    document.getElementById('p-precovenda').value = item.preco_venda;

    document.getElementById('p-estoque').value = item.estoque;
}

async function excluirProduto(id) {

    if(!confirm("Deseja realmente excluir este produto?")){
        return;
    }

    try{

        const resposta = await fetch(
            "API/produtos/excluir.php",
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

            renderProdutos();

        }else{

            alert("Erro: " + resultado.mensagem);

        }

    }catch(erro){

        console.error(erro);

        alert("Erro ao conectar com o servidor.");

    }

}