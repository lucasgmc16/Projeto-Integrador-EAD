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
  id int(11) NOT NULL AUTO_INCREMENT,
  usuario_id int(11) NOT NULL,
  nome varchar(200) NOT NULL,
  endereco text DEFAULT NULL,
  latitude decimal(10,8) NOT NULL,
  longitude decimal(11,8) NOT NULL,
  categoria enum('educacao','lazer','cultura','saude','comercio','outro') DEFAULT 'outro',
  imagem varchar(500) DEFAULT NULL,
  descricao text DEFAULT NULL,
  media_avaliacoes decimal(3,2) DEFAULT 0.00,
  total_avaliacoes int(11) DEFAULT 0,
  status enum('ativo','pendente','inativo') DEFAULT 'pendente',
  criado_em timestamp NOT NULL DEFAULT current_timestamp(),
  atualizado_em timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id),
  KEY usuario_id (usuario_id),
  KEY idx_categoria (categoria),
  KEY idx_status (status),
  KEY idx_coords (latitude,longitude),
  CONSTRAINT locais_ibfk_1 FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE avaliacoes (
  id int(11) NOT NULL AUTO_INCREMENT,
  local_id int(11) NOT NULL,
  usuario_id int(11) NOT NULL,
  nivel_ruido tinyint(4) DEFAULT NULL CHECK (nivel_ruido between 1 and 5),
  iluminacao enum('suave','natural','forte') DEFAULT 'natural',
  cheiros_fortes tinyint(1) DEFAULT 0,
  movimento_visual enum('pouco','medio','intenso') DEFAULT 'medio',
  espaco_calmo tinyint(1) DEFAULT 0,
  banheiro_acessivel tinyint(1) DEFAULT 0,
  sinalizacao_visual tinyint(4) DEFAULT NULL CHECK (sinalizacao_visual between 1 and 5),
  mapas_rotas tinyint(1) DEFAULT 0,
  controle_lotacao enum('tranquilo','moderado','cheio') DEFAULT 'moderado',
  filas_preferenciais tinyint(1) DEFAULT 0,
  horarios_tranquilos tinyint(1) DEFAULT 0,
  mudancas_ambiente enum('baixa','media','alta') DEFAULT 'media',
  agendamento_antecipado tinyint(1) DEFAULT 0,
  temperatura_confortavel tinyint(4) DEFAULT NULL CHECK (temperatura_confortavel between 1 and 5),
  assentos_confortaveis tinyint(1) DEFAULT 0,
  espaco_pessoal enum('amplo','medio','apertado') DEFAULT 'medio',
  comentario text DEFAULT NULL,
  nota_geral decimal(3,2) DEFAULT 0.00,
  criado_em timestamp NOT NULL DEFAULT current_timestamp(),
  atualizado_em timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY unique_user_local (usuario_id,local_id),
  KEY idx_local (local_id),
  KEY idx_nota (nota_geral),
  CONSTRAINT avaliacoes_ibfk_1 FOREIGN KEY (local_id) REFERENCES locais (id) ON DELETE CASCADE,
  CONSTRAINT avaliacoes_ibfk_2 FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE favoritos (
  id int(11) NOT NULL AUTO_INCREMENT,
  usuario_id int(11) NOT NULL,
  local_id int(11) NOT NULL,
  criado_em timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY unique_favorito (usuario_id,local_id),
  KEY local_id (local_id),
  KEY idx_usuario (usuario_id),
  CONSTRAINT favoritos_ibfk_1 FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
  CONSTRAINT favoritos_ibfk_2 FOREIGN KEY (local_id) REFERENCES locais (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE parceiros (
  id int(11) NOT NULL AUTO_INCREMENT,
  nome varchar(200) NOT NULL,
  logo varchar(255) DEFAULT NULL,
  descricao text DEFAULT NULL,
  website varchar(255) DEFAULT NULL,
  ordem int(11) DEFAULT 0,
  ativo tinyint(1) DEFAULT 1,
  criado_em timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  KEY idx_ordem (ordem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;