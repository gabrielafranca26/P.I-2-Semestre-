CREATE DATABASE sistema_clientes;

USE sistema_clientes;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(30),
    email VARCHAR(150),
    cidade VARCHAR(100)
);

INSERT INTO usuarios(email, senha)
VALUES('admin@admin.com', MD5('123456'));
