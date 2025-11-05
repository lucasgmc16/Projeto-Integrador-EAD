<?php
class Usuario {
    private $conn;
    private $table = 'usuarios';

    public $id;
    public $nome;
    public $email;
    public $senha;
    public $foto_perfil;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function criar() {
        $query = "INSERT INTO " . $this->table . " 
                  (nome, email, senha) 
                  VALUES (:nome, :email, :senha)";

        $stmt = $this->conn->prepare($query);

        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->senha = password_hash($this->senha, PASSWORD_BCRYPT);

        $stmt->bindParam(':nome', $this->nome);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':senha', $this->senha);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function login() {
        $query = "SELECT id, nome, email, senha, foto_perfil 
                  FROM " . $this->table . " 
                  WHERE email = :email 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(':email', $this->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            
            if (password_verify($this->senha, $row['senha'])) {
                $this->id = $row['id'];
                $this->nome = $row['nome'];
                $this->email = $row['email'];
                $this->foto_perfil = $row['foto_perfil'];
                return true;
            }
        }
        return false;
    }

    public function emailExiste() {
        $query = "SELECT id FROM " . $this->table . " 
                  WHERE email = :email LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(':email', $this->email);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    public function buscarPorId() {
        $query = "SELECT id, nome, email, foto_perfil, criado_em 
                  FROM " . $this->table . " 
                  WHERE id = :id LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            $this->nome = $row['nome'];
            $this->email = $row['email'];
            $this->foto_perfil = $row['foto_perfil'];
            return true;
        }
        return false;
    }

    public function atualizar() {
        $query = "UPDATE " . $this->table . " 
                  SET nome = :nome, email = :email";
        
        if (!empty($this->senha)) {
            $query .= ", senha = :senha";
        }
        
        if (!empty($this->foto_perfil)) {
            $query .= ", foto_perfil = :foto_perfil";
        }
        
        $query .= " WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->email = htmlspecialchars(strip_tags($this->email));

        $stmt->bindParam(':nome', $this->nome);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':id', $this->id);

        if (!empty($this->senha)) {
            $senha_hash = password_hash($this->senha, PASSWORD_BCRYPT);
            $stmt->bindParam(':senha', $senha_hash);
        }

        if (!empty($this->foto_perfil)) {
            $stmt->bindParam(':foto_perfil', $this->foto_perfil);
        }

        return $stmt->execute();
    }
}
?>