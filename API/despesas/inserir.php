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

$data      = $dados["data"];
$descricao = $dados["descricao"];
$valor     = $dados["valor"];

/*
    Ajuste o IDusuario se necessário.
    Estou usando 1 como padrão temporário.
*/

$sql = "INSERT INTO despesa(
            data_despesa,
            descricao_despesa,
            valor_despesa,
            IDusuario
        )
        VALUES (?, ?, ?, 1)";

$stmt = $conexao->prepare($sql);

$stmt->bind_param(
    "ssd",
    $data,
    $descricao,
    $valor
);

if($stmt->execute()){

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Despesa cadastrada com sucesso!"
    ]);

}else{

    echo json_encode([
        "sucesso" => false,
        "mensagem" => $stmt->error
    ]);

}