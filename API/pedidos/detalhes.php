<?php
require_once("../../config/conexao.php");
require_once "../../config/protect_api.php";

if (!isset($_GET['id'])) {
    die(json_encode(["sucesso" => false, "mensagem" => "ID da venda não informado."]));
}

$idVenda = intval($_GET['id']);

// 1. Buscar dados da venda e cliente
$sqlVenda = "SELECT v.*, c.nome_cliente, c.razao_social, c.endereco, c.telefone, c.email_cliente, u.nome as nome_usuario
             FROM venda v
             LEFT JOIN cliente c ON v.IDcliente = c.IDcliente
             LEFT JOIN usuario u ON v.IDusuario = u.IDusuario
             WHERE v.IDvenda = ?";
$stmtVenda = $conexao->prepare($sqlVenda);
$stmtVenda->bind_param("i", $idVenda);
$stmtVenda->execute();
$resVenda = $stmtVenda->get_result()->fetch_assoc();

if (!$resVenda) {
    die(json_encode(["sucesso" => false, "mensagem" => "Pedido não encontrado."]));
}

// 2. Buscar itens da venda
$sqlItens = "SELECT iv.*, p.nome_produto 
             FROM itemvenda iv
             JOIN produto p ON iv.IDproduto = p.IDproduto
             WHERE iv.IDvenda = ?";
$stmtItens = $conexao->prepare($sqlItens);
$stmtItens->bind_param("i", $idVenda);
$stmtItens->execute();
$resItens = $stmtItens->get_result();
$itens = [];
while ($item = $resItens->fetch_assoc()) {
    $itens[] = [
        "nome" => $item['nome_produto'],
        "preco" => $item['preco_unitario'],
        "quantidade" => $item['quantidade_vendido'],
        "desconto" => $item['desconto_unitario'],
        "subtotal" => ($item['preco_unitario'] - $item['desconto_unitario']) * $item['quantidade_vendido']
    ];
}

// 3. Buscar dados do pagamento
$sqlPagto = "SELECT * FROM pagamento WHERE IDvenda = ?";
$stmtPagto = $conexao->prepare($sqlPagto);
$stmtPagto->bind_param("i", $idVenda);
$stmtPagto->execute();
$pagto = $stmtPagto->get_result()->fetch_assoc();

header('Content-Type: application/json');
echo json_encode([
    "sucesso" => true,
    "venda" => [
        "id" => $resVenda['IDvenda'],
        "data" => $resVenda['data_venda'],
        "desconto_venda" => $resVenda['desconto_venda'],
        "usuario" => $resVenda['nome_usuario']
    ],
    "cliente" => [
        "nome" => $resVenda['nome_cliente'] ?: $resVenda['razao_social'],
        "endereco" => $resVenda['endereco'],
        "telefone" => $resVenda['telefone'],
        "email" => $resVenda['email_cliente']
    ],
    "itens" => $itens,
    "pagamento" => $pagto
]);
?>