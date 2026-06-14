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

session_unset();

session_destroy();

echo json_encode([
    "sucesso" => true
]);
?>