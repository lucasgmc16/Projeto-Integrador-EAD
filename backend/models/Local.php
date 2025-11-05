<?php
class Local {
    private $conn;
    private $table = 'locais';

    public $id;
    public $usuario_id;
    public $nome;
    public $endereco;
    public $latitude;
    public $longitude;
    public $categoria;
    public $imagem;
    public $descricao;
    public $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function criar() {
        $query = "INSERT INTO " . $this->table . " 
                  (usuario_id, nome, endereco, latitude, longitude, categoria, imagem, descricao, status) 
                  VALUES (:usuario_id, :nome, :endereco, :latitude, :longitude, :categoria, :imagem, :descricao, :status)";

        $stmt = $this->conn->prepare($query);

        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->endereco = htmlspecialchars(strip_tags($this->endereco));
        $this->descricao = htmlspecialchars(strip_tags($this->descricao));
        $this->status = 'ativo';

        $stmt->bindParam(':usuario_id', $this->usuario_id);
        $stmt->bindParam(':nome', $this->nome);
        $stmt->bindParam(':endereco', $this->endereco);
        $stmt->bindParam(':latitude', $this->latitude);
        $stmt->bindParam(':longitude', $this->longitude);
        $stmt->bindParam(':categoria', $this->categoria);
        $stmt->bindParam(':imagem', $this->imagem);
        $stmt->bindParam(':descricao', $this->descricao);
        $stmt->bindParam(':status', $this->status);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function listar($categoria = null, $busca = null, $limit = 100, $offset = 0) {
        $query = "SELECT l.*, 
                  COUNT(DISTINCT a.id) as total_avaliacoes,
                  AVG(a.nota_geral) as media_nota,
                  COUNT(DISTINCT f.id) as total_favoritos
                  FROM " . $this->table . " l
                  LEFT JOIN avaliacoes a ON l.id = a.local_id
                  LEFT JOIN favoritos f ON l.id = f.local_id
                  WHERE l.status = 'ativo'";

        if ($categoria && $categoria !== 'todas') {
            $query .= " AND l.categoria = :categoria";
        }

        if ($busca) {
            $query .= " AND (l.nome LIKE :busca OR l.endereco LIKE :busca OR l.descricao LIKE :busca)";
        }

        $query .= " GROUP BY l.id ORDER BY media_nota DESC, total_avaliacoes DESC LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($query);

        if ($categoria && $categoria !== 'todas') {
            $stmt->bindParam(':categoria', $categoria);
        }

        if ($busca) {
            $busca_param = "%{$busca}%";
            $stmt->bindParam(':busca', $busca_param);
        }

        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);

        $stmt->execute();
        return $stmt;
    }

    public function listarComFiltrosTEA($filtros) {
        $query = "SELECT DISTINCT l.*, 
                  COUNT(DISTINCT a.id) as total_avaliacoes,
                  AVG(a.nota_geral) as media_nota,
                  AVG(a.nivel_ruido) as media_ruido,
                  AVG(a.sinalizacao_visual) as media_sinalizacao,
                  COUNT(DISTINCT f.id) as total_favoritos
                  FROM " . $this->table . " l
                  LEFT JOIN avaliacoes a ON l.id = a.local_id
                  LEFT JOIN favoritos f ON l.id = f.local_id
                  WHERE l.status = 'ativo'";

        $conditions = [];
        
        if (isset($filtros['categoria']) && $filtros['categoria'] !== 'todas') {
            $conditions[] = "l.categoria = :categoria";
        }

        if (isset($filtros['baixoRuido']) && $filtros['baixoRuido']) {
            $query .= " AND l.id IN (
                SELECT local_id FROM avaliacoes 
                WHERE nivel_ruido >= 4 
                GROUP BY local_id
            )";
        }

        if (isset($filtros['iluminacaoSuave']) && $filtros['iluminacaoSuave']) {
            $query .= " AND l.id IN (
                SELECT local_id FROM avaliacoes 
                WHERE iluminacao IN ('suave', 'natural')
                GROUP BY local_id
            )";
        }

        if (isset($filtros['espacoCalmo']) && $filtros['espacoCalmo']) {
            $query .= " AND l.id IN (
                SELECT local_id FROM avaliacoes 
                WHERE espaco_calmo = TRUE
                GROUP BY local_id
            )";
        }

        $query .= " GROUP BY l.id ORDER BY media_nota DESC";

        $stmt = $this->conn->prepare($query);

        if (isset($filtros['categoria']) && $filtros['categoria'] !== 'todas') {
            $stmt->bindParam(':categoria', $filtros['categoria']);
        }

        $stmt->execute();
        return $stmt;
    }

    public function buscarPorId() {
        $query = "SELECT l.*, 
                  u.nome as usuario_nome,
                  COUNT(DISTINCT a.id) as total_avaliacoes,
                  AVG(a.nota_geral) as media_nota,
                  COUNT(DISTINCT f.id) as total_favoritos
                  FROM " . $this->table . " l
                  LEFT JOIN usuarios u ON l.usuario_id = u.id
                  LEFT JOIN avaliacoes a ON l.id = a.local_id
                  LEFT JOIN favoritos f ON l.id = f.local_id
                  WHERE l.id = :id AND l.status = 'ativo'
                  GROUP BY l.id
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return $stmt->fetch();
        }
        return false;
    }

    public function atualizar() {
        $query = "UPDATE " . $this->table . " 
                  SET nome = :nome, 
                      endereco = :endereco,
                      latitude = :latitude,
                      longitude = :longitude,
                      categoria = :categoria,
                      descricao = :descricao";
        
        if (!empty($this->imagem)) {
            $query .= ", imagem = :imagem";
        }
        
        $query .= " WHERE id = :id AND usuario_id = :usuario_id";

        $stmt = $this->conn->prepare($query);

        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->endereco = htmlspecialchars(strip_tags($this->endereco));
        $this->descricao = htmlspecialchars(strip_tags($this->descricao));

        $stmt->bindParam(':nome', $this->nome);
        $stmt->bindParam(':endereco', $this->endereco);
        $stmt->bindParam(':latitude', $this->latitude);
        $stmt->bindParam(':longitude', $this->longitude);
        $stmt->bindParam(':categoria', $this->categoria);
        $stmt->bindParam(':descricao', $this->descricao);
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':usuario_id', $this->usuario_id);

        if (!empty($this->imagem)) {
            $stmt->bindParam(':imagem', $this->imagem);
        }

        return $stmt->execute();
    }

    public function deletar() {
        $query = "DELETE FROM " . $this->table . " 
                  WHERE id = :id AND usuario_id = :usuario_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':usuario_id', $this->usuario_id);

        return $stmt->execute();
    }
}
?>