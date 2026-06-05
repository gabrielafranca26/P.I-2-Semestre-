<?php

/* Criando conexão com o banco */
require_once("../../config/conexao.php");

/* Recebe dados enviados pelo JS */
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

/* Captura os dados em variáveis */
$nome = $dados["nome"];
$cnpj = $dados["cnpj"];
$tel = $dados["tel"];
$email = $dados["email"];

/* Criando comando SQL */
$sql = "INSERT INTO fornecedor (
            nome_fornecedor,
            cnpj_fornecedor,
            telefone_fornecedor,
            email_fornecedor
        )
        VALUES (?, ?, ?, ?)";

/* Preparando o comando SQL */
$stmt = $conexao->prepare($sql);

/* Blindando dados do comando SQL */
$stmt->bind_param(
    "ssss",
    $nome,
    $cnpj,
    $tel,
    $email
);

/* Executando o comando SQL */
if($stmt->execute()){

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Fornecedor cadastrado com sucesso!"
    ]);

}else{

    echo json_encode([
        "sucesso" => false,
        "mensagem" => $stmt->error
    ]);

}