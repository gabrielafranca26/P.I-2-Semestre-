<?php

/* Conectando com o banco */
require_once("../../config/conexao.php");

/* Criando a busca - comando sql */
$sql = "SELECT * FROM cliente ORDER BY IDcliente ASC";

/* Executando a Busca */
$resultado = $conexao->query($sql);

/* criando vetor */
$clientes = [];

/* Preenchendo o vetor com o resultado */
while($linha = $resultado->fetch_assoc()){

    /* Verificando o tipo de documento para formatar a exibição */
     if(!empty($linha["cpf_cliente"])){

        $clientes[] = [
            "id" => $linha["IDcliente"],
            "tipoDoc" => "CPF",
            "nome" => $linha["nome_cliente"],
            "doc" => $linha["cpf_cliente"],
            "tel" => $linha["telefone"],
            "email" => $linha["email_cliente"],
            "rota" => $linha["endereco"]
        ];

    }else{

        $clientes[] = [
            "id" => $linha["IDcliente"],
            "tipoDoc" => "CNPJ",
            "nome" => $linha["razao_social"],
            "doc" => $linha["cnpj"],
            "tel" => $linha["telefone"],
            "email" => $linha["email_cliente"],
            "rota" => $linha["endereco"]
        ];

    }

}

/* Transformando o vetor em arquivo json */
echo json_encode($clientes);