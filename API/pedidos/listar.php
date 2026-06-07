<?php
require_once("../../config/conexao.php");

$sql = "SELECT 
            v.IDvenda, 
            v.data_venda, 
            v.desconto_venda,
            c.nome_cliente, 
            c.razao_social,
            p.valor_total, 
            p.valor_pago, 
            p.status_pagamento,
            p.data_quitacao,
            p.IDpagamento
        FROM venda v
        LEFT JOIN cliente c ON v.IDcliente = c.IDcliente
        LEFT JOIN pagamento p ON v.IDvenda = p.IDvenda
        ORDER BY v.data_venda DESC, v.IDvenda DESC";

$resultado = $conexao->query($sql);
$pedidos = [];

if ($resultado->num_rows > 0) {
    while ($linha = $resultado->fetch_assoc()) {
        $pedidos[] = [
            "id" => $linha["IDvenda"],
            "data" => $linha["data_venda"],
            "desconto" => $linha["desconto_venda"],
            "cliente" => $linha["nome_cliente"] ?: $linha["razao_social"],
            "total" => $linha["valor_total"],
            "pago" => $linha["valor_pago"],
            "status" => $linha["status_pagamento"],
            "data_quitacao" => $linha["data_quitacao"],
            "id_pagamento" => $linha["IDpagamento"]
        ];
    }
}

header('Content-Type: application/json');
echo json_encode($pedidos);
?>