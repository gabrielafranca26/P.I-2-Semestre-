let fornecedores = [];
let fornecedorIdEditando = null;

async function carregarFornecedores() {

    const resposta = await fetch(
        "API/fornecedores/listar.php"
    );

    fornecedores = await resposta.json();

    return fornecedores;
}

async function renderFornecedores() {
    const area = document.getElementById('content-area');
    const fornecedores = await carregarFornecedores();
    area.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 class="text-lg font-bold mb-4 text-gray-800">Novo Fornecedor</h3>
            <form onsubmit="saveFornecedor(event)" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" id="f-nome" placeholder="Razão Social / Nome" required class="border p-2.5 rounded-lg text-sm focus:outline-none">
                <input type="text" id="f-cnpj" placeholder="CNPJ / CPF" required class="border p-2.5 rounded-lg text-sm focus:outline-none">
                <input type="text" id="f-tel" placeholder="Telefone" required class="border p-2.5 rounded-lg text-sm focus:outline-none">
                <input type="text" id="f-email" placeholder="E-mail" required class="border p-2.5 rounded-lg text-sm focus:outline-none">
                <button type="submit" id="btn-submit-fornecedor" class="bg-eros-red hover:bg-red-800 text-white font-medium p-2.5 rounded-lg text-sm transition md:col-span-3">Salvar Fornecedor</button>
            </form>
        </div>
        <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table class="w-full text-left min-w-[600px]">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="p-4 font-semibold text-sm text-gray-700">Fornecedor</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">CNPJ/CPF</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Telefone</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">E-mail</th>
                        <th class="p-4 font-semibold text-sm text-gray-700 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${fornecedores.map((f, idx) => `
                        <tr class="border-b hover:bg-gray-50 text-sm">
                            <td class="p-4 font-medium text-gray-900">${f.nome}</td>
                            <td class="p-4 text-gray-600">${f.cnpj}</td>
                            <td class="p-4 text-gray-600">${f.telefone}</td>
                            <td class="p-4 text-gray-600">${f.email}</td>
                            <td class="p-4 text-center">
                                <button onclick="editFornecedor(${f.id})" class="text-blue-600 hover:text-blue-900 font-medium">Editar</button>
                                <button onclick="excluirFornecedor(${f.id})" class="text-red-600 hover:text-red-900 font-medium">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/* ===== FUNÇÃO - API INSERIR ===== */
async function saveFornecedor(e) {

    e.preventDefault();

    const data = {
        id: fornecedorIdEditando,
        nome: document.getElementById('f-nome').value,
        cnpj: document.getElementById('f-cnpj').value,
        tel: document.getElementById('f-tel').value,
        email: document.getElementById('f-email').value
    };

    try{

        const url = fornecedorIdEditando
            ? "API/fornecedores/editar.php"
            : "API/fornecedores/inserir.php";

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

            fornecedorIdEditando = null;

            renderFornecedores();

        }else{

            alert("Erro: " + resultado.mensagem);

        }

    }catch(erro){

        console.error(erro);

        alert("Erro ao conectar com o servidor.");

    }

}

/* ===== FUNÇÃO - API EDITAR ===== */
function editFornecedor(id) {

    const item = fornecedores.find(
        fornecedor => fornecedor.id == id
    );

    fornecedorIdEditando = id;

    document.getElementById('f-nome').value = item.nome;
    document.getElementById('f-cnpj').value = item.cnpj;
    document.getElementById('f-tel').value = item.telefone;
    document.getElementById('f-email').value = item.email;

    document.querySelector(
        "h3"
    ).innerText = "Editar Fornecedor";

    document.getElementById(
    "btn-submit-fornecedor"
    ).innerText = "Atualizar Fornecedor";

}


async function excluirFornecedor(id) {

    if(!confirm("Deseja realmente excluir este fornecedor?")){
        return;
    }

    try{

        const resposta = await fetch(
            "API/fornecedores/excluir.php",
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

            renderFornecedores();

        }else{

            alert("Erro: " + resultado.mensagem);

        }

    }catch(erro){

        console.error(erro);

        alert("Erro ao conectar com o servidor.");

    }

}