<?php

/* Resolução de Risco Médio: Cookie Without Secure Flag / HttpOnly / SameSite*/
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'secure'   => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Strict'
]);


session_start();

require_once "conexao.php";

header("Content-Type: application/json");

try {

    $dados = json_decode(
        file_get_contents("php://input"),
        true
    );

    $email = trim($dados["email"] ?? "");
    $senha = trim($dados["senha"] ?? "");

    if(empty($email) || empty($senha)){

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Preencha todos os campos."
        ]);

        exit();
    }

    $sql = "
        SELECT
            IDusuario,
            nome,
            email,
            senha
        FROM usuario
        WHERE email = ?
        LIMIT 1
    ";

    $stmt = $conexao->prepare($sql);

    $stmt->bind_param(
        "s",
        $email
    );

    $stmt->execute();

    $resultado = $stmt->get_result();

    if($resultado->num_rows === 0){

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Usuário não encontrado."
        ]);

        exit();
    }

    $usuario = $resultado->fetch_assoc();

    if(!password_verify(
        $senha,
        $usuario["senha"]
    )){
        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Senha inválida."
        ]);

        exit();
    }

    $_SESSION["usuario_id"] = $usuario["IDusuario"];
    $_SESSION["usuario_nome"] = $usuario["nome"];
    $_SESSION["usuario_email"] = $usuario["email"];

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Login realizado com sucesso."
    ]);

} catch(Exception $e){

    echo json_encode([
        "sucesso" => false,
        "mensagem" => $e->getMessage()
    ]);

}