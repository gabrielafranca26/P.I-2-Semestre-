<?php
require_once("../../config/conexao.php");

$data_ini = $_GET['data_inicial'] ?? date('Y-m-01');
$data_fim = $_GET['data_final'] ?? date('Y-m-d');

$stmt = $conexao->prepare("CALL sp_PendenciasPorPeriodo(?, ?)");
$stmt->bind_param("ss", $data_ini, $data_fim);
$stmt->execute();
$resultado = $stmt->get_result();
$dados = [];

if ($resultado) {
    while ($linha = $resultado->fetch_assoc()) {
        $dados[] = $linha;
    }
}

header('Content-Type: application/json');
echo json_encode($dados);
?>