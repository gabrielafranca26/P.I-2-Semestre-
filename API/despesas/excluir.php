<?php

require_once("../../config/conexao.php");
require_once "../../config/protect_api.php";


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

$id = $dados["id"];

$sql = "DELETE FROM despesa
        WHERE IDdespesa = ?";

$stmt = $conexao->prepare($sql);

$stmt->bind_param(
    "i",
    $id
);

if($stmt->execute()){

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Despesa excluída com sucesso!"
    ]);

}else{

    echo json_encode([
        "sucesso" => false,
        "mensagem" => $stmt->error
    ]);

}