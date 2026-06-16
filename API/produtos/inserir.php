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

$nome = $dados["nome"];
$descricao = $dados["descricao"];
$preco_custo = $dados["preco_custo"];
$preco_venda = $dados["preco_venda"];
$estoque = $dados["estoque"];

$sql = "INSERT INTO produto
        (
            nome_produto,
            descricao,
            preco_custo,
            preco_venda,
            quantidade_estoque
        )
        VALUES (?, ?, ?, ?, ?)";

$stmt = $conexao->prepare($sql);

$stmt->bind_param(
    "ssddi",
    $nome,
    $descricao,
    $preco_custo,
    $preco_venda,
    $estoque
);

if($stmt->execute()){

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Produto cadastrado com sucesso!"
    ]);

}else{

    echo json_encode([
        "sucesso" => false,
        "mensagem" => $stmt->error
    ]);

}