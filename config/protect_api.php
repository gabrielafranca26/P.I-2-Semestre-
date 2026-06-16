<?php

header("X-Frame-Options: SAMEORIGIN");
/* Resolução de Risco Médio: Missing Anti-clickjacking Header */
/* Impede que o sistema seja carregado fora do domínio */


/* Resolução de Risco Médio: Cookie Without Secure Flag / HttpOnly / SameSite*/
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'secure'   => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Strict'
]);

session_start();

if(!isset($_SESSION["usuario_id"])){

    http_response_code(401);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Acesso negado."
    ]);

    exit();

}
?>
