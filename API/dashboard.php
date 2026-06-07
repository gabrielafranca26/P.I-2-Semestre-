<?php
require_once("../config/conexao.php");

$metrics = [];

// 1. Total Clientes (Procedure)
$res = $conexao->query("CALL sp_TotalClientes()");
$metrics['total_clientes'] = $res->fetch_assoc()['total_clientes'];
$res->close();
$conexao->next_result();

// 2. Total Produtos (Procedure)
$res = $conexao->query("CALL sp_TotalProdutos()");
$metrics['total_produtos'] = $res->fetch_assoc()['total_produtos'];
$res->close();
$conexao->next_result();

// 3. Funções
$sql = "SELECT 
            fn_TotalFaturamentoBruto() as faturamento,
            fn_TotalFaturamentoBrutoMensal() as faturamento_mensal,
            fn_TotalFaturamentoPago() as faturamento_liquidado,
            fn_TotalFaturamentoPagoMensal() as faturamento_mensal_liquidado,
            fn_TotalDespesa() as despesas,
            fn_TotalDespesaMensal() as despesas_mensais";

$res = $conexao->query($sql);
$row = $res->fetch_assoc();

$metrics['faturamento'] = $row['faturamento'];
$metrics['faturamento_mensal'] = $row['faturamento_mensal'];
$metrics['faturamento_liquidado'] = $row['faturamento_liquidado'];
$metrics['faturamento_mensal_liquidado'] = $row['faturamento_mensal_liquidado'];
$metrics['despesas'] = $row['despesas'];
$metrics['despesas_mensais'] = $row['despesas_mensais'];

header('Content-Type: application/json');
echo json_encode($metrics);
?>