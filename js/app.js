// ====== CONTROLE DE AUTENTICAÇÃO (LOGIN) ======
<<<<<<< HEAD
const USUARIO_CORRETO = "admin";
const SENHA_CORRETA = "1234";

function handleLogin(e) {
    e.preventDefault();
=======
async function handleLogin(e) {

    e.preventDefault();

>>>>>>> 1e2799b424afbf2589afe5e929b4176f5837d75a
    const userIn = document.getElementById('login-user').value;
    const passIn = document.getElementById('login-pass').value;
    const errorMsg = document.getElementById('login-error');

<<<<<<< HEAD
    if (userIn === USUARIO_CORRETO && passIn === SENHA_CORRETA) {
        sessionStorage.setItem('eros_logged', 'true');
        errorMsg.classList.add('hidden');
        checkAuth();
    } else {
        errorMsg.classList.remove('hidden');
    }
}

function handleLogout() {
    sessionStorage.removeItem('eros_logged');
    checkAuth();
}

function checkAuth() {
    const isLogged = sessionStorage.getItem('eros_logged') === 'true';
    const loginScreen = document.getElementById('login-screen');
    const sidebar = document.getElementById('main-sidebar');
    const content = document.getElementById('main-content');

    if (isLogged) {
        loginScreen.classList.add('hidden');
        sidebar.classList.remove('hidden');
        content.classList.remove('hidden');
        switchPage('home'); // Abre na home
    } else {
        loginScreen.classList.remove('hidden');
        sidebar.classList.add('hidden');
        content.classList.add('hidden');
        // Limpa campos do login
        document.getElementById('login-user').value = '';
        document.getElementById('login-pass').value = '';
    }
    if(window.lucide) lucide.createIcons();
}

// ====== BANCO DE DADOS LOCALSTORAGE ======
let db = JSON.parse(localStorage.getItem('eros_db')) || {
    clientes: [], produtos: [], pedidos: [], fornecedores: [], despesas: []
};

let editIndex = null;

function saveDB() {
    localStorage.setItem('eros_db', JSON.stringify(db));
}
=======
    try {

        const resposta = await fetch(
            "config/authentication.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: userIn,
                    senha: passIn
                })
            }
        );

        const resultado = await resposta.json();

        if(resultado.sucesso){

            checkAuth();

        }else{

            errorMsg.innerText = resultado.mensagem;
            errorMsg.classList.remove('hidden');

        }

    } catch(erro){

        console.error(erro);

        errorMsg.innerText = "Erro ao conectar com o servidor.";
        errorMsg.classList.remove('hidden');

    }

}


async function handleLogout() {

    await fetch(
        "logout.php"
    );

    checkAuth();

}

async function checkAuth() {

    try {

        const resposta = await fetch(
            "config/check_login.php"
        );

        const resultado = await resposta.json();

        const loginScreen = document.getElementById('login-screen');
        const sidebar = document.getElementById('main-sidebar');
        const content = document.getElementById('main-content');

        if(resultado.logado){

            loginScreen.classList.add('hidden');
            sidebar.classList.remove('hidden');
            content.classList.remove('hidden');

            switchPage('home');

        }else{

            loginScreen.classList.remove('hidden');
            sidebar.classList.add('hidden');
            content.classList.add('hidden');

        }

    }catch(erro){

        console.error(erro);

    }

    if(window.lucide){
        lucide.createIcons();
    }

}


// O sistema agora utiliza Banco de Dados MySQL via API.
let editIndex = null; // Mantido apenas por compatibilidade temporária se necessário, mas não utilizado.
>>>>>>> 1e2799b424afbf2589afe5e929b4176f5837d75a

function switchPage(pageId) {
    const area = document.getElementById('content-area');
    editIndex = null;
    
    document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.remove('bg-eros-red', 'text-white');
        b.classList.add('text-gray-400', 'hover:bg-gray-900', 'hover:text-white');
    });
    const activeBtn = document.getElementById(`btn-${pageId}`);
    if(activeBtn) {
        activeBtn.classList.remove('text-gray-400', 'hover:bg-gray-900', 'hover:text-white');
        activeBtn.classList.add('bg-eros-red', 'text-white');
    }

    const titles = {
<<<<<<< HEAD
        home: "Painel Geral", clientes: "Gestão de Clientes", produtos: "Catálogo de Produtos",
        pedidos: "Pedidos de Venda", fornecedores: "Fornecedores Parceiros", despesas: "Controle de Despesas", relatorios: "Relatórios Estratégicos"
=======
        home: "Painel Geral", clientes: "Gestão de Clientes", produtos: "Gestão de Produtos",
        pedidos: "Gestão de Pedidos", fornecedores: "Gestão de Fornecedores", despesas: "Controle de Despesas", relatorios: "Relatórios e Métricas"
>>>>>>> 1e2799b424afbf2589afe5e929b4176f5837d75a
    };
    document.getElementById('page-title').innerText = titles[pageId] || "Painel";

    if (pageId === 'home') {
<<<<<<< HEAD
        const totalDespesas = db.despesas.reduce((acc, c) => acc + parseFloat(c.valor || 0), 0);
        const totalPedidos = db.pedidos.reduce((acc, c) => acc + parseFloat(c.total || 0), 0);
        
        area.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-eros-red">
                    <p class="text-sm text-gray-500 font-medium">Clientes Ativos</p>
                    <p class="text-2xl font-bold text-gray-800 mt-1">${db.clientes.length}</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-eros-yellow">
                    <p class="text-sm text-gray-500 font-medium">Produtos Cadastrados</p>
                    <p class="text-2xl font-bold text-gray-800 mt-1">${db.produtos.length}</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                    <p class="text-sm text-gray-500 font-medium">Faturamento Bruto</p>
                    <p class="text-2xl font-bold text-gray-800 mt-1">R$ ${totalPedidos.toFixed(2)}</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                    <p class="text-sm text-gray-500 font-medium">Custos Operacionais</p>
                    <p class="text-2xl font-bold text-gray-800 mt-1">R$ ${totalDespesas.toFixed(2)}</p>
                </div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
                <h3 class="text-lg font-bold text-gray-800 mb-2">Bem-vindo ao Painel Integrado - Eros Atacadista</h3>
                <p class="text-gray-600 text-sm">Protótipo funcional desenvolvido para o Projeto Integrador. Controle de acesso e persistência ativados.</p>
            </div>
        `;
=======
        renderHome();
>>>>>>> 1e2799b424afbf2589afe5e929b4176f5837d75a
    } 
    else if (pageId === 'clientes') renderClientes();
    else if (pageId === 'produtos') renderProdutos();
    else if (pageId === 'pedidos') renderPedidos();
    else if (pageId === 'fornecedores') renderFornecedores();
    else if (pageId === 'despesas') renderDespesas();
    else if (pageId === 'relatorios') renderRelatorios();
    
    if(window.lucide) lucide.createIcons();
}

<<<<<<< HEAD
function deleteItem(key, idx, callback) {
    if(confirm("Deseja realmente remover este registro?")) {
        db[key].splice(idx, 1);
        saveDB();
        callback();
    }
}

=======
async function renderHome() {
    const area = document.getElementById('content-area');
    
    try {
        const res = await fetch("API/dashboard.php");
        const m = await res.json();

        area.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <!-- CLIENTES -->
                <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">Clientes Cadastrados</p>
                    <p class="text-2xl font-black text-gray-800 mt-1">${m.total_clientes}</p>
                </div>

                <!-- PRODUTOS -->
                <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-eros-yellow">
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">Produtos cadastrados</p>
                    <p class="text-2xl font-black text-gray-800 mt-1">${m.total_produtos}</p>
                </div>

                <!-- FATURAMENTO BRUTO -->
                <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">Faturamento</p>
                    <p class="text-2xl font-black text-green-700 mt-1">R$ ${parseFloat(m.faturamento).toFixed(2)}</p>
                </div>

                <!-- FATURAMENTO MENSAL -->
                <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-600">
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">Faturamento Mensal</p>
                    <p class="text-2xl font-black text-green-800 mt-1">R$ ${parseFloat(m.faturamento_mensal).toFixed(2)}</p>
                </div>

                <!-- FATURAMENTO LIQUIDADO -->
                <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-teal-500">
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">Faturamento Liquidado</p>
                    <p class="text-2xl font-black text-teal-700 mt-1">R$ ${parseFloat(m.faturamento_liquidado).toFixed(2)}</p>
                </div>

                <!-- FATURAMENTO MENSAL LIQUIDADO -->
                <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-teal-600">
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">Faturamento Mensal Liquidado</p>
                    <p class="text-2xl font-black text-teal-800 mt-1">R$ ${parseFloat(m.faturamento_mensal_liquidado).toFixed(2)}</p>
                </div>

                <!-- DESPESAS -->
                <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">Despesas</p>
                    <p class="text-2xl font-black text-red-700 mt-1">R$ ${parseFloat(m.despesas).toFixed(2)}</p>
                </div>

                <!-- DESPESAS MENSAIS -->
                <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-600">
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">Despesas Mensais</p>
                    <p class="text-2xl font-black text-red-800 mt-1">R$ ${parseFloat(m.despesas_mensais).toFixed(2)}</p>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
                <h3 class="text-lg font-bold text-gray-800 mb-2">Painel de Gestão - Eros Atacadista</h3>
                <p class="text-gray-600 text-sm">Mês corrente: <span class="font-bold">${new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</span></p>
            </div>
        `;
    } catch (err) {
        console.error(err);
        area.innerHTML = `<p class="text-red-500">Erro ao carregar indicadores do banco de dados.</p>`;
    }

    if(window.lucide) lucide.createIcons();
}

// Função deleteItem removida pois agora cada módulo tem sua própria função de exclusão via API.

>>>>>>> 1e2799b424afbf2589afe5e929b4176f5837d75a
// Inicialização alterada para checar a segurança primeiro
window.onload = () => { checkAuth(); };