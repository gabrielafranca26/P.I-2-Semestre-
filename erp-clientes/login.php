<?php
session_start();
include('conexao.php');

$email = $_POST['email'];
$senha = md5($_POST['senha']);

$sql = "SELECT * FROM usuarios WHERE email='$email' AND senha='$senha'";

$resultado = $conn->query($sql);

if($resultado->num_rows > 0){

    $_SESSION['usuario'] = $email;

    header('Location: dashboard.php');

}else{

    echo "
    <script>
    alert('Login inválido');
    window.location='index.php';
    </script>
    ";

}
?>
