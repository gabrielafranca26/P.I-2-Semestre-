<?php
include('conexao.php');

$id = $_POST['id'];
$nome = $_POST['nome'];
$telefone = $_POST['telefone'];
$email = $_POST['email'];
$cidade = $_POST['cidade'];

$sql = "UPDATE clientes SET
nome='$nome',
telefone='$telefone',
email='$email',
cidade='$cidade'
WHERE id=$id";

$conn->query($sql);

header('Location: dashboard.php');
?>
