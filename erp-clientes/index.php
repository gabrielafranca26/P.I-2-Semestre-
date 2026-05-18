<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login ERP</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
body{
    background:#f1f5f9;
}

.login-box{
    background:white;
    padding:40px;
    border-radius:20px;
    box-shadow:0 0 20px rgba(0,0,0,0.1);
}
</style>

</head>
<body>

<div class="container">

<div class="row vh-100 justify-content-center align-items-center">

<div class="col-md-4">

<div class="login-box">

<h2 class="text-center text-primary mb-4">
ERP Clientes
</h2>

<form action="login.php" method="POST">

<div class="mb-3">
<label>E-mail</label>

<input
type="email"
name="email"
class="form-control"
required
>
</div>

<div class="mb-4">
<label>Senha</label>

<input
type="password"
name="senha"
class="form-control"
required
>
</div>

<button class="btn btn-primary w-100">
Entrar
</button>

</form>

</div>

</div>

</div>

</div>

</body>
</html>
