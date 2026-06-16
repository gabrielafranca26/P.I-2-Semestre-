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

header("Content-Type: application/json");

echo json_encode([
    "logado" => isset($_SESSION["usuario_id"])
]);
?>