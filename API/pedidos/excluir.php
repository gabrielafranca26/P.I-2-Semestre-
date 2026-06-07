<?php
require_once("../../config/conexao.php");

$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados || !isset($dados['id'])) {
    die(json_encode(["sucesso" => false, "mensagem" => "ID da venda não informado."]));
}

$idVenda = $dados['id'];

$conexao->begin_transaction();

try {
    // Excluir pagamentos associados
    $conexao->query("DELETE FROM pagamento WHERE IDvenda = $idVenda");
    
    // Excluir itens associados
    $conexao->query("DELETE FROM itemvenda WHERE IDvenda = $idVenda");
    
    // Excluir a venda
    $conexao->query("DELETE FROM venda WHERE IDvenda = $idVenda");

    $conexao->commit();
    echo json_encode(["sucesso" => true, "mensagem" => "Pedido excluído com sucesso!"]);

} catch (Exception $e) {
    $conexao->rollback();
    echo json_encode(["sucesso" => false, "mensagem" => "Erro ao excluir pedido: " . $e->getMessage()]);
}
?>