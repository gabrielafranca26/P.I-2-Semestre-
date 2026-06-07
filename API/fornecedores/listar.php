<?php

/* estabelecendo conexão com o banco */
require_once("../../config/conexao.php");

/* Criando o comando SQL */
$sql = "
    SELECT
        IDfornecedor AS id,
        nome_fornecedor AS nome,
        cnpj_fornecedor AS cnpj,
        telefone_fornecedor AS telefone,
        email_fornecedor AS email
FROM fornecedor ORDER BY IDfornecedor ASC
";

/* Executando o comando SQL */
$resultado = $conexao->query($sql);

/* Guardando os dados no vetor criado */
$fornecedores = [];

while($linha = $resultado->fetch_assoc()){

    $fornecedores[] = $linha;

}

/* Trnasformando os dados em arquivo json */
header("Content-Type: application/json");

echo json_encode($fornecedores);