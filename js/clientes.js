let clientes = [];
let clienteIdEditando = null;

async function carregarClientes() {

    const resposta = await fetch(
        "API/clientes/listar.php"
    );

    clientes = await resposta.json();

    return clientes;

}

async function renderClientes() {
    const area = document.getElementById('content-area');
    const clientes = await carregarClientes();
    area.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 class="text-lg font-bold mb-4 text-gray-800" id="form-title-clientes">Novo Cliente</h3>
            <form onsubmit="saveCliente(event)" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                <div class="flex flex-col justify-center bg-gray-50 p-2.5 rounded-lg border">
                    <label class="text-[11px] font-bold text-gray-500 uppercase mb-1">Tipo de Cadastro</label>
                    <div class="flex gap-4">
                        <label class="inline-flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                            <input type="radio" name="tipo_doc" value="CNPJ" checked onclick="toggleDocumentLabel('CNPJ')" class="text-eros-red focus:ring-red-700 mr-1.5"> CNPJ
                        </label>
                        <label class="inline-flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                            <input type="radio" name="tipo_doc" value="CPF" onclick="toggleDocumentLabel('CPF')" class="text-eros-red focus:ring-red-700 mr-1.5"> CPF
                        </label>
                    </div>
                </div>

                <input type="text" id="c-nome" placeholder="Nome Completo / Razão Social" required class="border p-2.5 rounded-lg text-sm w-full focus:ring-2 focus:ring-red-700 focus:outline-none">
                <input type="text" id="c-doc" placeholder="Insira o CNPJ" required class="border p-2.5 rounded-lg text-sm w-full focus:ring-2 focus:ring-red-700 focus:outline-none">
                <input type="text" id="c-tel" placeholder="Telefone de Contato" required class="border p-2.5 rounded-lg text-sm w-full focus:ring-2 focus:ring-red-700 focus:outline-none">
                <input type="email" id="c-email" placeholder="E-mail" required class="border p-2.5 rounded-lg text-sm w-full focus:ring-2 focus:ring-red-700 focus:outline-none">
                <div class="md:col-span-4">
                    <input type="text" id="c-rota" placeholder="Endereço Completo / Rota de Entrega" required class="border p-2.5 rounded-lg text-sm w-full focus:ring-2 focus:ring-red-700 focus:outline-none">
                </div>

                <button type="submit" id="btn-submit-clientes" class="bg-eros-red hover:bg-red-800 text-white font-medium p-2.5 rounded-lg text-sm transition md:col-span-4">Salvar Cliente</button>
            </form>
        </div>
        <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table class="w-full text-left min-w-[700px]">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="p-4 font-semibold text-sm text-gray-700">Nome / Empresa</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Tipo / Documento</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Contato</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">E-mail</th>
                        <th class="p-4 font-semibold text-sm text-gray-700">Rota / Endereço</th>
                        <th class="p-4 font-semibold text-sm text-gray-700 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${clientes.map((c, idx) => `
                        <tr class="border-b hover:bg-gray-50 text-sm">
                            <td class="p-4 font-medium text-gray-900">${c.nome}</td>
                            <td class="p-4 text-gray-600 font-mono text-xs">
                                <span class="px-1.5 py-0.5 rounded text-[10px] font-bold mr-1 ${c.tipoDoc === 'CNPJ' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}">${c.tipoDoc || 'CNPJ'}</span>
                                ${c.doc || 'Não informado'}
                            </td>
                            <td class="p-4 text-gray-600">${c.tel}</td>
                            <td class="p-4 text-gray-600">${c.email || 'Não informado'}</td>
                            <td class="p-4 text-gray-600">${c.rota}</td>
                            <td class="p-4 text-center space-x-2">
                                <button onclick="editCliente(${idx})" class="text-blue-600 hover:text-blue-900 font-medium">Editar</button>
                                <button onclick="deleteItem('clientes', ${idx}, renderClientes)" class="text-red-600 hover:text-red-900 font-medium">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Muda o placeholder do campo baseado no rádio ativo
function toggleDocumentLabel(type) {
    const docInput = document.getElementById('c-doc');
    if (docInput) {
        docInput.placeholder = type === 'CNPJ' ? 'Insira o CNPJ' : 'Insira o CPF';
    }
}

async function saveCliente(e) {
    e.preventDefault();

    const tipoDocAtivo = document.querySelector(
        'input[name="tipo_doc"]:checked'
    ).value;

    const data = {
        id: clienteIdEditando,
        tipoDoc: tipoDocAtivo,
        nome: document.getElementById('c-nome').value,
        doc: document.getElementById('c-doc').value,
        tel: document.getElementById('c-tel').value,
        email: document.getElementById('c-email').value,
        rota: document.getElementById('c-rota').value
    };

    try {

        const url = clienteIdEditando
            ? "API/clientes/editar.php"
            : "API/clientes/inserir.php";  

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

            clienteIdEditando = null;
            editIndex = null;

            renderClientes();


        }else{

            alert("Erro: " + resultado.mensagem);

        }

    } catch(erro){

        console.error(erro);

        alert("Erro ao conectar com o servidor.");

    }
}

function editCliente(idx) {
    editIndex = idx;
    const item = clientes[idx];
    clienteIdEditando = item.id;
    
    document.getElementById('form-title-clientes').innerText = "Editar Cliente";
    document.getElementById('btn-submit-clientes').innerText = "Atualizar Cadastro";
    
    document.getElementById('c-nome').value = item.nome;
    document.getElementById('c-doc').value = item.doc || '';
    document.getElementById('c-tel').value = item.tel;
    document.getElementById('c-email').value = item.email || '';
    document.getElementById('c-rota').value = item.rota;

    // Marca o botão de rádio correto na edição
    const tipo = item.tipoDoc || 'CNPJ';
    document.querySelector(`input[name="tipo_doc"][value="${tipo}"]`).checked = true;
    toggleDocumentLabel(tipo);
}