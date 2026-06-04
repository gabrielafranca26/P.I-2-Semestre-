// ====== CONTROLE DE AUTENTICAÇÃO (LOGIN) ======
const USUARIO_CORRETO = "admin";
const SENHA_CORRETA = "1234";

function handleLogin(e) {
    e.preventDefault();
    const userIn = document.getElementById('login-user').value;
    const passIn = document.getElementById('login-pass').value;
    const errorMsg = document.getElementById('login-error');

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
        home: "Painel Geral", clientes: "Gestão de Clientes", produtos: "Catálogo de Produtos",
        pedidos: "Pedidos de Venda", fornecedores: "Fornecedores Parceiros", despesas: "Controle de Despesas", relatorios: "Relatórios Estratégicos"
    };
    document.getElementById('page-title').innerText = titles[pageId] || "Painel";

    if (pageId === 'home') {
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
    } 
    else if (pageId === 'clientes') renderClientes();
    else if (pageId === 'produtos') renderProdutos();
    else if (pageId === 'pedidos') renderPedidos();
    else if (pageId === 'fornecedores') renderFornecedores();
    else if (pageId === 'despesas') renderDespesas();
    else if (pageId === 'relatorios') renderRelatorios();
    
    if(window.lucide) lucide.createIcons();
}

function deleteItem(key, idx, callback) {
    if(confirm("Deseja realmente remover este registro?")) {
        db[key].splice(idx, 1);
        saveDB();
        callback();
    }
}

// Inicialização alterada para checar a segurança primeiro
window.onload = () => { checkAuth(); };