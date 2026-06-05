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

$id    = $dados["id"];
$nome  = $dados["nome"];
$cnpj  = $dados["cnpj"];
$tel   = $dados["tel"];
$email = $dados["email"];

$sql = "UPDATE fornecedor
        SET nome_fornecedor = ?,
            cnpj_fornecedor = ?,
            telefone_fornecedor = ?,
            email_fornecedor = ?
        WHERE IDfornecedor = ?";

$stmt = $conexao->prepare($sql);

$stmt->bind_param(
    "ssssi",
    $nome,
    $cnpj,
    $tel,
    $email,
    $id
);

if($stmt->execute()){

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Fornecedor atualizado com sucesso!"
    ]);

}else{

    echo json_encode([
        "sucesso" => false,
        "mensagem" => $stmt->error
    ]);

}