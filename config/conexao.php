<?php

/* CRIANDO CONEXÃO COM O BANCO */

$host = "localhost";
$usuario = "root";
$senha = "";
$banco = "eros_atacadista";

$conexao = new mysqli(
    $host,
    $usuario,
    $senha,
    $banco
);

if($conexao->connect_error){
    die("Erro na conexão: " . $conexao->connect_error);
}