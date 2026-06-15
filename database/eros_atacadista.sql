-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 15/06/2026 às 22:09
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `eros_atacadista`
--

DELIMITER $$
--
-- Procedimentos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_LucroPeriodo` (IN `p_data_inicial` DATE, IN `p_data_final` DATE)   BEGIN

    SELECT
    	COUNT(DISTINCT v.IDvenda) AS total_vendas,
        ROUND(
            SUM((i.preco_unitario - IFNULL(i.desconto_unitario,0.00) - p.preco_custo) * i.quantidade_vendido),
            2) AS lucro_esperado,
        ROUND(
            SUM(((i.preco_unitario - IFNULL(i.desconto_unitario,0.00) - p.preco_custo) * i.quantidade_vendido) *(pg.valor_pago/ NULLIF(pg.valor_total,0.00))),
            2 ) AS lucro_obtido

    FROM venda v
    INNER JOIN itemvenda i
    ON v.IDvenda = i.IDvenda
    INNER JOIN produto p
    ON i.IDproduto = p.IDproduto
    INNER JOIN pagamento pg
    ON pg.IDvenda = v.IDvenda
    WHERE v.data_venda BETWEEN p_data_inicial
    AND p_data_final;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_LucroPorCliente` ()   BEGIN

    SELECT
    COALESCE(c.nome_cliente, c.razao_social) AS cliente,
    COUNT(DISTINCT v.IDvenda) AS total_vendas,
    SUM(
        (i.preco_unitario
        - IFNULL(i.desconto_unitario,0.00)
        - p.preco_custo)
        * i.quantidade_vendido
    ) AS lucro_esperado,
    ROUND(
        SUM(
            (
                (i.preco_unitario
                - IFNULL(i.desconto_unitario,0)
                - p.preco_custo)
                * i.quantidade_vendido
            )
            *
            (pg.valor_pago / pg.valor_total)
        ),
        2
    ) AS lucro_obtido

    FROM cliente c
    INNER JOIN venda v
    ON c.IDcliente = v.IDcliente
    INNER JOIN itemvenda i
    ON v.IDvenda = i.IDvenda
    INNER JOIN produto p
    ON i.IDproduto = p.IDproduto
    INNER JOIN pagamento pg
    ON pg.IDvenda = v.IDvenda

    GROUP BY c.IDcliente, cliente
    ORDER BY lucro_obtido DESC;


END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_LucroPorProduto` ()   BEGIN

    SELECT
        p.nome_produto,
        SUM(i.quantidade_vendido) AS quantidade_vendida,
        SUM((i.preco_unitario- IFNULL(i.desconto_unitario,0.00) - p.preco_custo) * i.quantidade_vendido) AS lucro_total

    FROM itemvenda i
    INNER JOIN produto p
    ON i.IDproduto = p.IDproduto
    GROUP BY p.IDproduto, p.nome_produto
    ORDER BY lucro_total DESC;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_PendenciasPorCliente` (IN `p_IDcliente` INT)   BEGIN

    SELECT
        COALESCE(c.nome_cliente, c.razao_social) AS cliente,
        v.data_venda,
        p.valor_total,
        p.valor_pago,
        (p.valor_total - p.valor_pago) AS valor_pendente,
        p.status_pagamento
    FROM cliente c
    INNER JOIN venda v
        ON c.IDcliente = v.IDcliente
    INNER JOIN pagamento p
        ON v.IDvenda = p.IDvenda
    WHERE c.IDcliente = p_IDcliente
      AND p.status_pagamento <> 'PAGO';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_PendenciasPorPeriodo` (IN `p_data_inicial` DATE, IN `p_data_final` DATE)   BEGIN

    SELECT
        v.data_venda,
        COALESCE(c.nome_cliente, c.razao_social) AS cliente,
        p.valor_total,
        p.valor_pago,
        (p.valor_total - p.valor_pago) AS valor_pendente,
        p.status_pagamento
    FROM venda v
    INNER JOIN cliente c
        ON v.IDcliente = c.IDcliente
    INNER JOIN pagamento p
        ON v.IDvenda = p.IDvenda
    WHERE v.data_venda BETWEEN p_data_inicial AND p_data_final
      AND p.status_pagamento <> 'PAGO'
    ORDER BY v.data_venda;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_RelatorioEstoque` ()   BEGIN

	SELECT nome_produto, descricao, quantidade_estoque
    FROM produto;
    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_TotalClientes` ()   BEGIN

	SELECT COUNT(IDcliente) AS total_clientes
	FROM cliente;
    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_TotalProdutos` ()   BEGIN

	SELECT COUNT(IDproduto) AS total_produtos
	FROM produto;
    
END$$

--
-- Funções
--
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_TotalDespesa` () RETURNS DECIMAL(10,2) DETERMINISTIC BEGIN

    DECLARE total_despesa DECIMAL(10,2);
    
    SELECT IFNULL(SUM(valor_despesa), 0.00) INTO total_despesa
    FROM despesa;
    
    RETURN total_despesa;

END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_TotalDespesaMensal` () RETURNS DECIMAL(10,2) DETERMINISTIC BEGIN

    DECLARE despesa_mensal DECIMAL(10,2);
    
    SELECT IFNULL(SUM(valor_despesa), 0.00) INTO despesa_mensal
    FROM despesa
    WHERE YEAR(data_despesa) = YEAR(CURRENT_DATE())
    AND MONTH(data_despesa) = MONTH(CURRENT_DATE());
    
    RETURN despesa_mensal;

END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_TotalFaturamentoBruto` () RETURNS DECIMAL(10,2) DETERMINISTIC BEGIN

	DECLARE faturamento_bruto DECIMAL(10,2);
    
    SELECT IFNULL(SUM(valor_total), 0.00) INTO faturamento_bruto
    FROM pagamento;
        
    RETURN faturamento_bruto;

END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_TotalFaturamentoBrutoMensal` () RETURNS DECIMAL(10,2) DETERMINISTIC BEGIN

	DECLARE faturamentob_mensal DECIMAL(10,2);
    
    SELECT IFNULL(SUM(p.valor_total), 0.00) INTO faturamentob_mensal
    FROM pagamento p
    INNER JOIN venda v
    ON v.IDvenda = p.IDvenda
    WHERE MONTH(v.data_venda) = MONTH(CURRENT_DATE())
    AND YEAR(v.data_venda) = YEAR(CURRENT_DATE());
        
    RETURN faturamentob_mensal;

END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_TotalFaturamentoPago` () RETURNS DECIMAL(10,2) DETERMINISTIC BEGIN

	DECLARE faturamento_pago DECIMAL(10,2);
    
    SELECT IFNULL(SUM(valor_pago), 0.00) INTO faturamento_pago
    FROM pagamento;
        
    RETURN faturamento_pago;

END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_TotalFaturamentoPagoMensal` () RETURNS DECIMAL(10,2) DETERMINISTIC BEGIN

	DECLARE faturamentop_mensal DECIMAL(10,2);
    
    SELECT IFNULL(SUM(p.valor_pago), 0.00) INTO faturamentop_mensal
    FROM pagamento p
    INNER JOIN venda v
    ON p.IDvenda = v.IDvenda
    WHERE YEAR(v.data_venda) = YEAR(CURRENT_DATE())
    AND MONTH(v.data_venda) = MONTH(CURRENT_DATE());
        
    RETURN faturamentop_mensal;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `cliente`
--

CREATE TABLE `cliente` (
  `IDcliente` int(11) NOT NULL,
  `endereco` varchar(100) DEFAULT NULL,
  `telefone` varchar(11) DEFAULT NULL,
  `razao_social` varchar(100) DEFAULT NULL,
  `cnpj` char(14) DEFAULT NULL,
  `nome_cliente` varchar(100) DEFAULT NULL,
  `cpf_cliente` char(11) DEFAULT NULL,
  `email_cliente` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cliente`
--

INSERT INTO `cliente` (`IDcliente`, `endereco`, `telefone`, `razao_social`, `cnpj`, `nome_cliente`, `cpf_cliente`, `email_cliente`) VALUES
(1, 'Rua das Laranjeiras, 450, Parque das Flores. Cidade-SP.', '19999887766', 'Jão Sanches', '11222333000144', 'João Pedro da Silva', '11122233344', 'joaosilva@email.com'),
(3, 'Av. Beira-Mar, 785, Centro. Cidade-UF.', '19987665544', NULL, NULL, 'Maria Elizangela dos Santos', '44411177700', 'mariasantos@email.com'),
(8, 'Rua das amoreiras, 86, Jardim das Petunias. Cristalina-SP', '1998756321', 'Mama Pizzaria', '55213687000144', NULL, NULL, 'mama.pizzaria@email.com'),
(10, 'Avenida Brasil, 513, Centro. Cidade-UF', '19985662233', 'Skinao Lanches ME', '23555666000122', NULL, NULL, 'skinaolanches@email.com'),
(11, 'Rua 7 de Setembro, 206, Centro. Cidade-SP', '19999445223', 'Pão de Açúcar Bakery', '33456987000122', NULL, NULL, 'pa_bakery@email.com'),
(12, 'Rua Marechal Theodoro, 1166, Parque São Pedro. Cidade-SP', '19986552123', 'Marcio Salgados ME', '21336958000111', NULL, NULL, 'marcio_salgados@email.com');

-- --------------------------------------------------------

--
-- Estrutura para tabela `despesa`
--

CREATE TABLE `despesa` (
  `IDdespesa` int(11) NOT NULL,
  `data_despesa` date DEFAULT NULL,
  `descricao_despesa` varchar(250) DEFAULT NULL,
  `valor_despesa` decimal(10,2) NOT NULL,
  `IDusuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `despesa`
--

INSERT INTO `despesa` (`IDdespesa`, `data_despesa`, `descricao_despesa`, `valor_despesa`, `IDusuario`) VALUES
(1, '2026-05-04', 'Insumos para o mês de Maio.', 514.68, NULL),
(3, '2026-06-05', 'Combustível', 274.89, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `fornecedor`
--

CREATE TABLE `fornecedor` (
  `IDfornecedor` int(11) NOT NULL,
  `nome_fornecedor` varchar(100) DEFAULT NULL,
  `cnpj_fornecedor` char(14) DEFAULT NULL,
  `telefone_fornecedor` varchar(11) DEFAULT NULL,
  `email_fornecedor` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `fornecedor`
--

INSERT INTO `fornecedor` (`IDfornecedor`, `nome_fornecedor`, `cnpj_fornecedor`, `telefone_fornecedor`, `email_fornecedor`) VALUES
(1, 'Laticínios Araras', '55222233330001', '19987776666', 'contato@email.com'),
(5, 'Fazenda São José LTD', '11777888000144', '16974563322', 'saojosefazenda@email.com'),
(6, 'Distribuidora Alvora', '66321987000114', '13987755632', 'alvorada_distribuidora@email.com');

-- --------------------------------------------------------

--
-- Estrutura para tabela `itemfornecido`
--

CREATE TABLE `itemfornecido` (
  `IDitemfornecido` int(11) NOT NULL,
  `data_entrega` date DEFAULT NULL,
  `IDfornecedor` int(11) DEFAULT NULL,
  `IDproduto` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `itemvenda`
--

CREATE TABLE `itemvenda` (
  `IDitemvenda` int(11) NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `quantidade_vendido` int(11) DEFAULT NULL,
  `desconto_unitario` decimal(10,2) DEFAULT NULL,
  `IDvenda` int(11) DEFAULT NULL,
  `IDproduto` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `itemvenda`
--

INSERT INTO `itemvenda` (`IDitemvenda`, `preco_unitario`, `quantidade_vendido`, `desconto_unitario`, `IDvenda`, `IDproduto`) VALUES
(8, 44.90, 1, 0.00, 4, 4),
(9, 17.99, 2, 0.00, 4, 6),
(12, 10.00, 1, 0.00, 4, 1),
(13, 44.90, 2, 0.00, 5, 4),
(14, 35.90, 2, 0.00, 5, 8),
(15, 18.99, 5, 2.99, 6, 1),
(16, 6.00, 3, 0.00, 7, 7),
(17, 44.90, 1, 4.90, 7, 4),
(18, 7.99, 15, 0.49, 8, 9),
(19, 250.00, 1, 0.00, 8, 10),
(20, 35.90, 1, 0.00, 9, 8),
(21, 17.99, 1, 0.00, 9, 6),
(22, 44.90, 1, 0.00, 10, 4),
(23, 6.00, 2, 0.00, 10, 7),
(24, 29.90, 5, 0.90, 10, 11),
(25, 22.99, 1, 0.00, 11, 13),
(26, 44.90, 1, 0.00, 11, 4),
(27, 35.90, 1, 0.00, 11, 8);

--
-- Acionadores `itemvenda`
--
DELIMITER $$
CREATE TRIGGER `tr_BaixaEstoqueVenda` AFTER INSERT ON `itemvenda` FOR EACH ROW BEGIN

    UPDATE produto 
    SET quantidade_estoque = quantidade_estoque - NEW.quantidade_vendido
    WHERE IDproduto = NEW.IDproduto;
    
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_EstornoEstoqueExclusao` AFTER DELETE ON `itemvenda` FOR EACH ROW BEGIN

    UPDATE produto 
    SET quantidade_estoque = quantidade_estoque + OLD.quantidade_vendido
    WHERE IDproduto = OLD.IDproduto;
    
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `pagamento`
--

CREATE TABLE `pagamento` (
  `IDpagamento` int(11) NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `valor_pago` decimal(10,2) DEFAULT 0.00,
  `data_quitacao` date DEFAULT NULL,
  `status_pagamento` enum('PENDENTE','PAGO','PARCIAL') DEFAULT NULL,
  `IDvenda` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pagamento`
--

INSERT INTO `pagamento` (`IDpagamento`, `valor_total`, `valor_pago`, `data_quitacao`, `status_pagamento`, `IDvenda`) VALUES
(4, 80.88, 0.00, NULL, 'PENDENTE', 4),
(5, 160.00, 160.00, '2026-06-07', 'PAGO', 5),
(6, 80.00, 80.00, '2026-06-14', 'PAGO', 6),
(7, 58.00, 58.00, '2026-06-07', 'PAGO', 7),
(8, 360.00, 180.00, NULL, 'PARCIAL', 8),
(9, 53.00, 28.00, NULL, 'PARCIAL', 9),
(10, 201.90, 0.00, NULL, 'PENDENTE', 10),
(11, 103.79, 50.00, NULL, 'PARCIAL', 11);

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto`
--

CREATE TABLE `produto` (
  `IDproduto` int(11) NOT NULL,
  `nome_produto` varchar(100) DEFAULT NULL,
  `preco_custo` decimal(10,2) NOT NULL,
  `descricao` varchar(250) DEFAULT NULL,
  `preco_venda` decimal(10,2) NOT NULL,
  `quantidade_estoque` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produto`
--

INSERT INTO `produto` (`IDproduto`, `nome_produto`, `preco_custo`, `descricao`, `preco_venda`, `quantidade_estoque`) VALUES
(1, 'Pão Hamburguer - 8 u', 11.99, 'Pacote de pão do tipo hamburguer com 8 unidades.', 18.99, 14),
(4, 'Muçarela - 1kg', 29.90, 'Peça de queijo muçarela de um quilo.', 44.90, 15),
(5, 'Hamburguer - 48 u', 37.92, 'Caixa com 48 unidades de hamburguer bovino.', 51.19, 10),
(6, 'Salsicha - 1 kg', 12.99, 'Pacote fechado de salsinha de um quilo.', 17.99, 14),
(7, 'Milho lata - 500 g', 4.50, 'Lata de milho em conserva de 500 gramas.', 6.00, 5),
(8, 'Presunto - 1 kg', 23.90, 'Peça de presunto defumado de um quilo', 35.90, 16),
(9, 'Cone Trufado', 5.50, 'Cone Trufado de diversos sabores.', 7.99, 65),
(10, 'Nutella - 1kg', 190.00, 'Balde de Nutella de 1 Kg', 250.00, 6),
(11, 'Molho de Tomate - 4,1 kg', 19.90, 'Pacote de molho de tomate de quatro quilos e cem gramas.', 29.90, 10),
(12, 'Ketchup - 2kg', 23.97, 'Pacote de ketchup de dois quilos.', 29.99, 15),
(13, 'Mortadela - 1 kg', 17.99, 'Peça de mortadela defumada de um quilo.', 22.99, 19);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `IDusuario` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`IDusuario`, `nome`, `email`, `senha`) VALUES
(1, 'Tester', 'teste@email.com', '1234'),
(2, 'Admin', 'admin@eros.com', '$2y$10$yCJhnhbqDHPWWuT/mIoCSeEEMd.bX8NDHLmGaWvs.Fri/9gMJ685i');

-- --------------------------------------------------------

--
-- Estrutura para tabela `venda`
--

CREATE TABLE `venda` (
  `IDvenda` int(11) NOT NULL,
  `desconto_venda` decimal(10,2) DEFAULT 0.00,
  `data_venda` date DEFAULT NULL,
  `IDcliente` int(11) DEFAULT NULL,
  `IDusuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `venda`
--

INSERT INTO `venda` (`IDvenda`, `desconto_venda`, `data_venda`, `IDcliente`, `IDusuario`) VALUES
(4, 0.00, '2026-05-15', 1, 1),
(5, 1.60, '2026-05-28', 3, 1),
(6, 0.00, '2026-06-01', 10, 1),
(7, 0.00, '2026-05-25', 8, 1),
(8, 2.50, '2026-06-07', 11, 1),
(9, 0.89, '2026-05-29', 1, 1),
(10, 0.00, '2026-06-05', 8, 1),
(11, 0.00, '2026-06-14', 12, 1);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`IDcliente`);

--
-- Índices de tabela `despesa`
--
ALTER TABLE `despesa`
  ADD PRIMARY KEY (`IDdespesa`),
  ADD KEY `IDusuario` (`IDusuario`);

--
-- Índices de tabela `fornecedor`
--
ALTER TABLE `fornecedor`
  ADD PRIMARY KEY (`IDfornecedor`),
  ADD UNIQUE KEY `cnpj_fornecedor` (`cnpj_fornecedor`);

--
-- Índices de tabela `itemfornecido`
--
ALTER TABLE `itemfornecido`
  ADD PRIMARY KEY (`IDitemfornecido`),
  ADD KEY `IDfornecedor` (`IDfornecedor`),
  ADD KEY `IDproduto` (`IDproduto`);

--
-- Índices de tabela `itemvenda`
--
ALTER TABLE `itemvenda`
  ADD PRIMARY KEY (`IDitemvenda`),
  ADD KEY `IDvenda` (`IDvenda`),
  ADD KEY `IDproduto` (`IDproduto`);

--
-- Índices de tabela `pagamento`
--
ALTER TABLE `pagamento`
  ADD PRIMARY KEY (`IDpagamento`),
  ADD KEY `IDvenda` (`IDvenda`);

--
-- Índices de tabela `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`IDproduto`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`IDusuario`),
  ADD UNIQUE KEY `login` (`email`);

--
-- Índices de tabela `venda`
--
ALTER TABLE `venda`
  ADD PRIMARY KEY (`IDvenda`),
  ADD KEY `IDcliente` (`IDcliente`),
  ADD KEY `IDusuario` (`IDusuario`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `cliente`
--
ALTER TABLE `cliente`
  MODIFY `IDcliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de tabela `despesa`
--
ALTER TABLE `despesa`
  MODIFY `IDdespesa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `fornecedor`
--
ALTER TABLE `fornecedor`
  MODIFY `IDfornecedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `itemfornecido`
--
ALTER TABLE `itemfornecido`
  MODIFY `IDitemfornecido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `itemvenda`
--
ALTER TABLE `itemvenda`
  MODIFY `IDitemvenda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de tabela `pagamento`
--
ALTER TABLE `pagamento`
  MODIFY `IDpagamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de tabela `produto`
--
ALTER TABLE `produto`
  MODIFY `IDproduto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `IDusuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `venda`
--
ALTER TABLE `venda`
  MODIFY `IDvenda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `despesa`
--
ALTER TABLE `despesa`
  ADD CONSTRAINT `despesa_ibfk_1` FOREIGN KEY (`IDusuario`) REFERENCES `usuario` (`IDusuario`);

--
-- Restrições para tabelas `itemfornecido`
--
ALTER TABLE `itemfornecido`
  ADD CONSTRAINT `itemfornecido_ibfk_1` FOREIGN KEY (`IDfornecedor`) REFERENCES `fornecedor` (`IDfornecedor`),
  ADD CONSTRAINT `itemfornecido_ibfk_2` FOREIGN KEY (`IDproduto`) REFERENCES `produto` (`IDproduto`);

--
-- Restrições para tabelas `itemvenda`
--
ALTER TABLE `itemvenda`
  ADD CONSTRAINT `itemvenda_ibfk_1` FOREIGN KEY (`IDvenda`) REFERENCES `venda` (`IDvenda`),
  ADD CONSTRAINT `itemvenda_ibfk_2` FOREIGN KEY (`IDproduto`) REFERENCES `produto` (`IDproduto`);

--
-- Restrições para tabelas `pagamento`
--
ALTER TABLE `pagamento`
  ADD CONSTRAINT `pagamento_ibfk_1` FOREIGN KEY (`IDvenda`) REFERENCES `venda` (`IDvenda`);

--
-- Restrições para tabelas `venda`
--
ALTER TABLE `venda`
  ADD CONSTRAINT `venda_ibfk_1` FOREIGN KEY (`IDcliente`) REFERENCES `cliente` (`IDcliente`),
  ADD CONSTRAINT `venda_ibfk_2` FOREIGN KEY (`IDusuario`) REFERENCES `usuario` (`IDusuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
