<?php

require_once("../../config/conexao.php");

$sql = "SELECT
            IDdespesa,
            data_despesa,
            descricao_despesa,
            valor_despesa
        FROM despesa";

$resultado = $conexao->query($sql);

$despesas = [];

while($linha = $resultado->fetch_assoc()){

    $despesas[] = [
        "id" => $linha["IDdespesa"],
        "data" => $linha["data_despesa"],
        "descricao" => $linha["descricao_despesa"],
        "valor" => $linha["valor_despesa"]
    ];

}

echo json_encode($despesas);