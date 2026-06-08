<?php

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
