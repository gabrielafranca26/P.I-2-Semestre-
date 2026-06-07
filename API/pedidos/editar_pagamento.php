<?php
require_once("../../config/conexao.php");

$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados || !isset($dados['idPagamento'])) {
    die(json_encode(["sucesso" => false, "mensagem" => "ID do pagamento não informado."]));
}

$idPagamento = $dados['idPagamento'];
$valorPago = $dados['valorPago'];
$valorTotal = $dados['valorTotal'];

$status = 'PENDENTE';
if ($valorPago >= $valorTotal) $status = 'PAGO';
elseif ($valorPago > 0) $status = 'PARCIAL';

$dataQuitacao = ($status == 'PAGO') ? date('Y-m-d') : null;

$sql = "UPDATE pagamento SET valor_pago = ?, status_pagamento = ?, data_quitacao = ? WHERE IDpagamento = ?";
$stmt = $conexao->prepare($sql);
$stmt->bind_param("dssi", $valorPago, $status, $dataQuitacao, $idPagamento);

if ($stmt->execute()) {
    echo json_encode(["sucesso" => true, "mensagem" => "Pagamento atualizado com sucesso!"]);
} else {
    echo json_encode(["sucesso" => false, "mensagem" => "Erro ao atualizar pagamento: " . $conexao->error]);
}
?>