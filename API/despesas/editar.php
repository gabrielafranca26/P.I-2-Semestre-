<?php

require_once("../../config/conexao.php");

$dados = json_decode(
    file_get_contents("php://input"),
    true
);

if(!$dados){

    die(json_encode([
        "sucesso" => false,
        "mensagem" => "Nenhum dado recebido."
    ]));

}

$id        = $dados["id"];
$data      = $dados["data"];
$descricao = $dados["descricao"];
$valor     = $dados["valor"];

$sql = "UPDATE despesa
        SET data_despesa = ?,
            descricao_despesa = ?,
            valor_despesa = ?
        WHERE IDdespesa = ?";

$stmt = $conexao->prepare($sql);

$stmt->bind_param(
    "ssdi",
    $data,
    $descricao,
    $valor,
    $id
);

if($stmt->execute()){

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Despesa atualizada com sucesso!"
    ]);

}else{

    echo json_encode([
        "sucesso" => false,
        "mensagem" => $stmt->error
    ]);

}