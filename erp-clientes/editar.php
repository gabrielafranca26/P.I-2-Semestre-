<?php
include('conexao.php');

$id = $_GET['id'];

$cliente = $conn->query("SELECT * FROM clientes WHERE id=$id");

$dados = $cliente->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Editar Cliente</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

</head>
<body>

<div class="container mt-5">

<div class="card shadow">

<div class="card-header bg-primary text-white">
Editar Cliente
</div>

<div class="card-body">

<form action="update_cliente.php" method="POST">

<input type="hidden" name="id" value="<?php echo $dados['id']; ?>">

<div class="mb-3">
<label>Nome</label>

<input
type="text"
name="nome"
class="form-control"
value="<?php echo $dados['nome']; ?>"
>
</div>

<div class="mb-3">
<label>Telefone</label>

<input
type="text"
name="telefone"
class="form-control"
value="<?php echo $dados['telefone']; ?>"
>
</div>

<div class="mb-3">
<label>Email</label>

<input
type="email"
name="email"
class="form-control"
value="<?php echo $dados['email']; ?>"
>
</div>

<div class="mb-3">
<label>Cidade</label>

<input
type="text"
name="cidade"
class="form-control"
value="<?php echo $dados['cidade']; ?>"
>
</div>

<button class="btn btn-success">
Atualizar Cliente
</button>

</form>

</div>

</div>

</div>

</body>
</html>
