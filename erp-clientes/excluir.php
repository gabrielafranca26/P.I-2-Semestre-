<?php
include('conexao.php');

$id = $_GET['id'];

$conn->query("DELETE FROM clientes WHERE id=$id");

header('Location: dashboard.php');
?>
