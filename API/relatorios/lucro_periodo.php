<?php
require_once("../../config/conexao.php");
require_once "../../config/protect_api.php";

$dados_req = json_decode(file_get_contents("php://input"), true);
$data_ini = $dados_req['data_inicial'] ?? date('Y-m-01');
$data_fim = $dados_req['data_final'] ?? date('Y-m-d');

$stmt = $conexao->prepare("CALL sp_LucroPeriodo(?, ?)");
$stmt->bind_param("ss", $data_ini, $data_fim);
$stmt->execute();
$resultado = $stmt->get_result();
$dados = $resultado->fetch_assoc();

header('Content-Type: application/json');
echo json_encode($dados);
?>