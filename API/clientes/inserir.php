<?php

/* Conecta ao banco */
require_once("../../config/conexao.php");

/* Recebe os dados enviados pelo JavaScript */
$dados = json_decode(file_get_contents("php://input"), true);

if(!$dados){
    die(json_encode([
        "sucesso" => false,
        "mensagem" => "Nenhum dado recebido."
    ]));
}

/* Captura os valores recebidos */
$tipoDoc = $dados["tipoDoc"];
$nome    = $dados["nome"];
$doc     = $dados["doc"];
$tel     = $dados["tel"];
$email   = $dados["email"];
$rota    = $dados["rota"];

/* Se for CPF */
if($tipoDoc == "CPF"){

    $sql = "INSERT INTO cliente (
                endereco,
                telefone,
                nome_cliente,
                cpf_cliente,
                email_cliente
            )
            VALUES (?, ?, ?, ?, ?)";

    $stmt = $conexao->prepare($sql);

    $stmt->bind_param(
        "sssss",
        $rota,
        $tel,
        $nome,
        $doc,
        $email
    );
}

/* Se for CNPJ */
else{

    $sql = "INSERT INTO cliente (
                endereco,
                telefone,
                razao_social,
                cnpj,
                email_cliente
            )
            VALUES (?, ?, ?, ?, ?)";

    $stmt = $conexao->prepare($sql);

    $stmt->bind_param(
        "sssss",
        $rota,
        $tel,
        $nome,
        $doc,
        $email
    );
}

/* Executa o INSERT */
if($stmt->execute()){

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Cliente cadastrado com sucesso!"
    ]);

}else{

    echo json_encode([
        "sucesso" => false,
        "mensagem" => $stmt->error
    ]);
}