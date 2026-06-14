<?php

header(
    "Content-Security-Policy: default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com;
    style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;
    img-src 'self' data:;
    font-src 'self' https://cdnjs.cloudflare.com;
    connect-src 'self';"
);
header("X-Frame-Options: SAMEORIGIN");

/* header 1: Resolução de Risco Médio: Content Security Policy (CSP) */
/* bloquear scripts maliciosos */

/* header 2: Resolução de Risco Médio: Missing Anti-clickjacking Header */
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
