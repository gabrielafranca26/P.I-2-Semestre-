<?php

/* Conectando ao banco */
require_once("../../config/conexao.php");

require_once "../../config/protect_api.php";

/* Recebendo dados */
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

$id      = $dados["id"];
$tipoDoc = $dados["tipoDoc"];
$nome    = $dados["nome"];
$doc     = $dados["doc"];
$tel     = $dados["tel"];
$email   = $dados["email"];
$rota    = $dados["rota"];

/* Preparando, blindando e executando o comando SQL conforme o tipo de documento */
if($tipoDoc == "CPF"){

    $sql = "UPDATE cliente
            SET endereco = ?,
                telefone = ?,
                nome_cliente = ?,
                cpf_cliente = ?,
                email_cliente = ?,
                razao_social = NULL,
                cnpj = NULL
            WHERE IDcliente = ?";

    $stmt = $conexao->prepare($sql);

    $stmt->bind_param(
        "sssssi",
        $rota,
        $tel,
        $nome,
        $doc,
        $email,
        $id
    );

}else{

    $sql = "UPDATE cliente
            SET endereco = ?,
                telefone = ?,
                razao_social = ?,
                cnpj = ?,
                email_cliente = ?,
                nome_cliente = NULL,
                cpf_cliente = NULL
            WHERE IDcliente = ?";

    $stmt = $conexao->prepare($sql);

    $stmt->bind_param(
        "sssssi",
        $rota,
        $tel,
        $nome,
        $doc,
        $email,
        $id
    );

}

if($stmt->execute()){

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Cliente atualizado com sucesso!"
    ]);

}else{

    echo json_encode([
        "sucesso" => false,
        "mensagem" => $stmt->error
    ]);

}