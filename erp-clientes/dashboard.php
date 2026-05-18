<?php
session_start();
include('conexao.php');

if(!isset($_SESSION['usuario'])){
    header('Location: index.php');
}

$clientes = $conn->query("SELECT * FROM clientes ORDER BY id DESC");

$total = $conn->query("SELECT COUNT(*) as total FROM clientes");
$totalClientes = $total->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>ERP Clientes</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<style>

body{
    background:#f4f6f9;
}

.sidebar{
    width:260px;
    height:100vh;
    background:#111827;
    position:fixed;
    left:0;
    top:0;
    padding:20px;
}

.sidebar h3{
    color:white;
    margin-bottom:30px;
}

.sidebar a{
    display:block;
    color:#d1d5db;
    text-decoration:none;
    padding:12px;
    border-radius:10px;
    margin-bottom:10px;
    transition:0.3s;
}

.sidebar a:hover{
    background:#2563eb;
    color:white;
}

.content{
    margin-left:280px;
    padding:30px;
}

.card-dashboard{
    border:none;
    border-radius:20px;
    box-shadow:0 5px 20px rgba(0,0,0,0.08);
}

@media(max-width:768px){

.sidebar{
    width:100%;
    height:auto;
    position:relative;
}

.content{
    margin-left:0;
}

}

</style>

</head>
<body>

<div class="sidebar">

<h3>ERP Clientes</h3>

<a href="#">
<i class="bi bi-speedometer2"></i>
Dashboard
</a>

<a href="#clientes">
<i class="bi bi-people"></i>
Clientes
</a>

<a href="logout.php">
<i class="bi bi-box-arrow-right"></i>
Sair
</a>

</div>

<div class="content">

<div class="row mb-4">

<div class="col-md-4 mb-3">

<div class="card card-dashboard p-4">

<h5>Total de Clientes</h5>

<h1>
<?php echo $totalClientes['total']; ?>
</h1>

</div>

</div>

</div>

<div class="card card-dashboard mb-4">

<div class="card-header bg-primary text-white">
Cadastro de Clientes
</div>

<div class="card-body">

<form action="salvar_cliente.php" method="POST">

<div class="row">

<div class="col-md-3 mb-3">
<input
type="text"
name="nome"
class="form-control"
placeholder="Nome"
required
>
</div>

<div class="col-md-3 mb-3">
<input
type="text"
name="telefone"
class="form-control"
placeholder="Telefone"
>
</div>

<div class="col-md-3 mb-3">
<input
type="email"
name="email"
class="form-control"
placeholder="E-mail"
>
</div>

<div class="col-md-3 mb-3">
<input
type="text"
name="cidade"
class="form-control"
placeholder="Cidade"
>
</div>

</div>

<button class="btn btn-success">
Salvar Cliente
</button>

</form>

</div>

</div>

<div class="card card-dashboard" id="clientes">

<div class="card-header bg-dark text-white">
Lista de Clientes
</div>

<div class="card-body table-responsive">

<table class="table table-hover align-middle">

<thead>
<tr>
<th>ID</th>
<th>Nome</th>
<th>Telefone</th>
<th>Email</th>
<th>Cidade</th>
<th>Ações</th>
</tr>
</thead>

<tbody>

<?php while($cliente = $clientes->fetch_assoc()){ ?>

<tr>

<td><?php echo $cliente['id']; ?></td>
<td><?php echo $cliente['nome']; ?></td>
<td><?php echo $cliente['telefone']; ?></td>
<td><?php echo $cliente['email']; ?></td>
<td><?php echo $cliente['cidade']; ?></td>

<td>

<a
href="editar.php?id=<?php echo $cliente['id']; ?>"
class="btn btn-primary btn-sm"
>
Editar
</a>

<a
href="excluir.php?id=<?php echo $cliente['id']; ?>"
class="btn btn-danger btn-sm"
>
Excluir
</a>

</td>

</tr>

<?php } ?>

</tbody>

</table>

</div>

</div>

</div>

</body>
</html>
