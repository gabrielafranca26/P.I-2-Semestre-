<?php
require_once("../../config/conexao.php");
require_once "../../config/protect_api.php";

$id_cliente = $_GET['id_cliente'] ?? 0;

$stmt = $conexao->prepare("CALL sp_PendenciasPorCliente(?)");
$stmt->bind_param("i", $id_cliente);
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