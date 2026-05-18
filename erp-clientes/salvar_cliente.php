<?php
include('conexao.php');

$nome = $_POST['nome'];
$telefone = $_POST['telefone'];
$email = $_POST['email'];
$cidade = $_POST['cidade'];

$sql = "INSERT INTO clientes(nome, telefone, email, cidade)
VALUES('$nome', '$telefone', '$email', '$cidade')";

$conn->query($sql);

header('Location: dashboard.php');
?>
