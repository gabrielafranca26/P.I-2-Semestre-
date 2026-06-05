<?php

require_once("../../config/conexao.php");

$sql = "SELECT
            IDproduto,
            nome_produto,
            descricao,
            preco_custo,
            preco_venda,
            quantidade_estoque
        FROM produto";

$resultado = $conexao->query($sql);

$produtos = [];

while($linha = $resultado->fetch_assoc()){

    $produtos[] = [
        "id" => $linha["IDproduto"],
        "nome" => $linha["nome_produto"],
        "descricao" => $linha["descricao"],
        "preco_custo" => $linha["preco_custo"],
        "preco_venda" => $linha["preco_venda"],
        "estoque" => $linha["quantidade_estoque"]
    ];

}

header("Content-Type: application/json");

echo json_encode($produtos);