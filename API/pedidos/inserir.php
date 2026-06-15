<?php
require_once("../../config/conexao.php");
require_once "../../config/protect_api.php";

$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados) {
    die(json_encode(["sucesso" => false, "mensagem" => "Nenhum dado recebido."]));
}

$conexao->begin_transaction();

try {
    // 1. Inserir na tabela venda
    $id_cliente = $dados['idCliente'];
    $data_venda = $dados['dataVenda'] ?: date('Y-m-d');
    $desconto_venda = $dados['descontoVenda'] ?? 0;
    // IDusuario fixo como 1 para simplificar, já que não temos o ID do logado no front
    $id_usuario = 1; 

    $sqlVenda = "INSERT INTO venda (desconto_venda, data_venda, IDcliente, IDusuario) VALUES (?, ?, ?, ?)";
    $stmtVenda = $conexao->prepare($sqlVenda);
    $stmtVenda->bind_param("dsii", $desconto_venda, $data_venda, $id_cliente, $id_usuario);
    $stmtVenda->execute();
    $idVenda = $conexao->insert_id;

    // 2. Inserir na tabela itemvenda
    $itens = $dados['itens'];
    $somaSubtotais = 0;

    $sqlItem = "INSERT INTO itemvenda (preco_unitario, quantidade_vendido, desconto_unitario, IDvenda, IDproduto) VALUES (?, ?, ?, ?, ?)";
    $stmtItem = $conexao->prepare($sqlItem);

    foreach ($itens as $item) {
        $precoOriginal = $item['preco'];
        $qtd = $item['quantidade'];
        $descUnitario = $item['desconto'] ?? 0;
        $idProd = $item['idProduto'];
        
        // A regra: (Preço Venda - Desconto Unitário) * Quantidade
        $precoComDesconto = $precoOriginal - $descUnitario;
        $subtotalItem = $precoComDesconto * $qtd;
        
        $somaSubtotais += $subtotalItem;

        // Gravamos o preço original no itemvenda, o desconto e a quantidade
        $stmtItem->bind_param("dddii", $precoOriginal, $qtd, $descUnitario, $idVenda, $idProd);
        $stmtItem->execute();
    }

    // 3. Calcular Valor Total Final do Pagamento
    // Total = (Soma dos Subtotais dos Itens) - Desconto Geral da Venda
    $valorTotalFinal = $somaSubtotais - $desconto_venda;

    // 4. Inserir na tabela pagamento
    $valorPago = $dados['valorPago'] ?? 0;
    $status = 'PENDENTE';
    if ($valorPago >= $valorTotalFinal) $status = 'PAGO';
    elseif ($valorPago > 0) $status = 'PARCIAL';

    $dataQuitacao = ($status == 'PAGO') ? date('Y-m-d') : null;

    $sqlPagto = "INSERT INTO pagamento (valor_total, valor_pago, data_quitacao, status_pagamento, IDvenda) VALUES (?, ?, ?, ?, ?)";
    $stmtPagto = $conexao->prepare($sqlPagto);
    $stmtPagto->bind_param("ddssi", $valorTotalFinal, $valorPago, $dataQuitacao, $status, $idVenda);
    $stmtPagto->execute();

    $conexao->commit();
    echo json_encode(["sucesso" => true, "mensagem" => "Pedido realizado com sucesso!", "idVenda" => $idVenda]);

} catch (Exception $e) {
    $conexao->rollback();
    echo json_encode(["sucesso" => false, "mensagem" => "Erro ao processar pedido: " . $e->getMessage()]);
}
?>