<?php
class Avaliacao {
    private $conn;
    private $table = 'avaliacoes';

    public $id;
    public $local_id;
    public $usuario_id;
    public $nivel_ruido;
    public $iluminacao;
    public $cheiros_fortes;
    public $movimento_visual;
    public $espaco_calmo;
    public $banheiro_acessivel;
    public $sinalizacao_visual;
    public $mapas_rotas;
    public $controle_lotacao;
    public $filas_preferenciais;
    public $horarios_tranquilos;
    public $mudancas_ambiente;
    public $agendamento_antecipado;
    public $temperatura_confortavel;
    public $assentos_confortaveis;
    public $espaco_pessoal;
    public $comentario;
    public $nota_geral;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function criar() {
        $this->calcularNotaGeral();

        $query = "INSERT INTO " . $this->table . " 
                  (local_id, usuario_id, nivel_ruido, iluminacao, cheiros_fortes, 
                   movimento_visual, espaco_calmo, banheiro_acessivel, sinalizacao_visual,
                   mapas_rotas, controle_lotacao, filas_preferenciais, horarios_tranquilos,
                   mudancas_ambiente, agendamento_antecipado, temperatura_confortavel,
                   assentos_confortaveis, espaco_pessoal, comentario, nota_geral) 
                  VALUES 
                  (:local_id, :usuario_id, :nivel_ruido, :iluminacao, :cheiros_fortes,
                   :movimento_visual, :espaco_calmo, :banheiro_acessivel, :sinalizacao_visual,
                   :mapas_rotas, :controle_lotacao, :filas_preferenciais, :horarios_tranquilos,
                   :mudancas_ambiente, :agendamento_antecipado, :temperatura_confortavel,
                   :assentos_confortaveis, :espaco_pessoal, :comentario, :nota_geral)";

        $stmt = $this->conn->prepare($query);

        $this->comentario = htmlspecialchars(strip_tags($this->comentario));

        $stmt->bindParam(':local_id', $this->local_id);
        $stmt->bindParam(':usuario_id', $this->usuario_id);
        $stmt->bindParam(':nivel_ruido', $this->nivel_ruido);
        $stmt->bindParam(':iluminacao', $this->iluminacao);
        $stmt->bindParam(':cheiros_fortes', $this->cheiros_fortes, PDO::PARAM_BOOL);
        $stmt->bindParam(':movimento_visual', $this->movimento_visual);
        $stmt->bindParam(':espaco_calmo', $this->espaco_calmo, PDO::PARAM_BOOL);
        $stmt->bindParam(':banheiro_acessivel', $this->banheiro_acessivel, PDO::PARAM_BOOL);
        $stmt->bindParam(':sinalizacao_visual', $this->sinalizacao_visual);
        $stmt->bindParam(':mapas_rotas', $this->mapas_rotas, PDO::PARAM_BOOL);
        $stmt->bindParam(':controle_lotacao', $this->controle_lotacao);
        $stmt->bindParam(':filas_preferenciais', $this->filas_preferenciais, PDO::PARAM_BOOL);
        $stmt->bindParam(':horarios_tranquilos', $this->horarios_tranquilos, PDO::PARAM_BOOL);
        $stmt->bindParam(':mudancas_ambiente', $this->mudancas_ambiente);
        $stmt->bindParam(':agendamento_antecipado', $this->agendamento_antecipado, PDO::PARAM_BOOL);
        $stmt->bindParam(':temperatura_confortavel', $this->temperatura_confortavel);
        $stmt->bindParam(':assentos_confortaveis', $this->assentos_confortaveis, PDO::PARAM_BOOL);
        $stmt->bindParam(':espaco_pessoal', $this->espaco_pessoal);
        $stmt->bindParam(':comentario', $this->comentario);
        $stmt->bindParam(':nota_geral', $this->nota_geral);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    private function calcularNotaGeral() {
        $pontos = 0;
        $max_pontos = 0;

        $pontos += (6 - $this->nivel_ruido);
        $max_pontos += 5;

        $ilum_pontos = ['suave' => 5, 'natural' => 4, 'forte' => 2];
        $pontos += $ilum_pontos[$this->iluminacao] ?? 3;
        $max_pontos += 5;

        $pontos += $this->cheiros_fortes ? 1 : 5;
        $max_pontos += 5;

        $mov_pontos = ['pouco' => 5, 'medio' => 3, 'intenso' => 1];
        $pontos += $mov_pontos[$this->movimento_visual] ?? 3;
        $max_pontos += 5;

        $pontos += $this->espaco_calmo ? 5 : 1;
        $max_pontos += 5;

        $pontos += $this->sinalizacao_visual;
        $max_pontos += 5;

        $lot_pontos = ['tranquilo' => 5, 'moderado' => 3, 'cheio' => 1];
        $pontos += $lot_pontos[$this->controle_lotacao] ?? 3;
        $max_pontos += 5;

        $mud_pontos = ['baixa' => 5, 'media' => 3, 'alta' => 1];
        $pontos += $mud_pontos[$this->mudancas_ambiente] ?? 3;
        $max_pontos += 5;

        $pontos += $this->temperatura_confortavel;
        $max_pontos += 5;

        $esp_pontos = ['amplo' => 5, 'medio' => 3, 'apertado' => 1];
        $pontos += $esp_pontos[$this->espaco_pessoal] ?? 3;
        $max_pontos += 5;

        $booleanos = [
            $this->banheiro_acessivel,
            $this->mapas_rotas,
            $this->filas_preferenciais,
            $this->horarios_tranquilos,
            $this->agendamento_antecipado,
            $this->assentos_confortaveis
        ];

        foreach ($booleanos as $bool) {
            $pontos += $bool ? 5 : 2;
            $max_pontos += 5;
        }

        $this->nota_geral = round(($pontos / $max_pontos) * 5, 2);
    }

    public function listarPorLocal($local_id, $limit = 50) {
        $query = "SELECT a.*, u.nome as usuario_nome, u.foto_perfil
                  FROM " . $this->table . " a
                  LEFT JOIN usuarios u ON a.usuario_id = u.id
                  WHERE a.local_id = :local_id
                  ORDER BY a.criado_em DESC
                  LIMIT :limit";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':local_id', $local_id);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt;
    }

    public function usuarioJaAvaliou() {
        $query = "SELECT id FROM " . $this->table . " 
                  WHERE usuario_id = :usuario_id AND local_id = :local_id 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':usuario_id', $this->usuario_id);
        $stmt->bindParam(':local_id', $this->local_id);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }
}
?>