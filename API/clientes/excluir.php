<?php

/* conectando com o banco */
require_once("../../config/conexao.php");

/* Recebando dados */
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

/* Recebendo o ID */
$id = $dados["id"];

/* Criando o comando SQL */
$sql = "DELETE FROM cliente
        WHERE IDcliente = ?";

/* Preparação, blindagem e execução do comando SQL */
$stmt = $conexao->prepare($sql);

$stmt->bind_param(
    "i",
    $id
);

if($stmt->execute()){

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Cliente excluído com sucesso!"
    ]);

}else{

    echo json_encode([
        "sucesso" => false,
        "mensagem" => $stmt->error
    ]);

}