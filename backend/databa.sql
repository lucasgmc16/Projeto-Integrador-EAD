CREATE DATABASE IF NOT EXISTS teamap_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE teamap_db;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    foto_perfil VARCHAR(255) DEFAULT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE locais (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nome VARCHAR(200) NOT NULL,
    endereco TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    categoria ENUM('educacao', 'lazer', 'cultura', 'saude', 'comercio', 'outro') DEFAULT 'outro',
    imagem VARCHAR(255) DEFAULT NULL,
    descricao TEXT,
    status ENUM('ativo', 'pendente', 'inativo') DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_categoria (categoria),
    INDEX idx_status (status),
    INDEX idx_coords (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE avaliacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    local_id INT NOT NULL,
    usuario_id INT NOT NULL,
    nivel_ruido TINYINT CHECK (nivel_ruido BETWEEN 1 AND 5),
    iluminacao ENUM('suave', 'natural', 'forte') DEFAULT 'natural',
    cheiros_fortes BOOLEAN DEFAULT FALSE,
    movimento_visual ENUM('pouco', 'medio', 'intenso') DEFAULT 'medio',
    espaco_calmo BOOLEAN DEFAULT FALSE,
    banheiro_acessivel BOOLEAN DEFAULT FALSE,
    sinalizacao_visual TINYINT CHECK (sinalizacao_visual BETWEEN 1 AND 5),
    mapas_rotas BOOLEAN DEFAULT FALSE,
    controle_lotacao ENUM('tranquilo', 'moderado', 'cheio') DEFAULT 'moderado',
    filas_preferenciais BOOLEAN DEFAULT FALSE,
    horarios_tranquilos BOOLEAN DEFAULT FALSE,
    mudancas_ambiente ENUM('baixa', 'media', 'alta') DEFAULT 'media',
    agendamento_antecipado BOOLEAN DEFAULT FALSE,
    temperatura_confortavel TINYINT CHECK (temperatura_confortavel BETWEEN 1 AND 5),
    assentos_confortaveis BOOLEAN DEFAULT FALSE,
    espaco_pessoal ENUM('amplo', 'medio', 'apertado') DEFAULT 'medio',
    comentario TEXT,
    nota_geral DECIMAL(3, 2) DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (local_id) REFERENCES locais(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_local (usuario_id, local_id),
    INDEX idx_local (local_id),
    INDEX idx_nota (nota_geral)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE favoritos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    local_id INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (local_id) REFERENCES locais(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorito (usuario_id, local_id),
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE parceiros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    logo VARCHAR(255),
    descricao TEXT,
    website VARCHAR(255),
    ordem INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ordem (ordem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;