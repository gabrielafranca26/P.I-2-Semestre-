<?php
require_once("../../config/conexao.php");
require_once "../../config/protect_api.php";

$sql = "CALL sp_LucroPorCliente()";
$resultado = $conexao->query($sql);
$dados = [];

if ($resultado) {
    while ($linha = $resultado->fetch_assoc()) {
        $dados[] = $linha;
    }
}

header('Content-Type: application/json');
echo json_encode($dados);
?>