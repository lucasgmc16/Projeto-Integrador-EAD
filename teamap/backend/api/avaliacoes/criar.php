<?php
// avaliacoes/listar.php
error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Lidar com requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/Database.php';
require_once '../../middleware/auth.php';

// Verificar se é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Método não permitido'
    ]);
    exit();
}

// Autenticar usuário
$user = authenticate();

if (!$user) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Não autorizado'
    ]);
    exit();
}

// Obter dados do corpo da requisição
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validar dados obrigatórios
if (!isset($data['local_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'local_id é obrigatório'
    ]);
    exit();
}

$local_id = intval($data['local_id']);
$usuario_id = $user['id'];

// Extrair e validar campos opcionais
$nivel_ruido = isset($data['nivel_ruido']) ? intval($data['nivel_ruido']) : null;
$iluminacao = isset($data['iluminacao']) ? $data['iluminacao'] : 'natural';
$cheiros_fortes = isset($data['cheiros_fortes']) ? intval($data['cheiros_fortes']) : 0;
$movimento_visual = isset($data['movimento_visual']) ? $data['movimento_visual'] : 'medio';
$espaco_calmo = isset($data['espaco_calmo']) ? intval($data['espaco_calmo']) : 0;
$banheiro_acessivel = isset($data['banheiro_acessivel']) ? intval($data['banheiro_acessivel']) : 0;
$sinalizacao_visual = isset($data['sinalizacao_visual']) ? intval($data['sinalizacao_visual']) : null;
$mapas_rotas = isset($data['mapas_rotas']) ? intval($data['mapas_rotas']) : 0;
$controle_lotacao = isset($data['controle_lotacao']) ? $data['controle_lotacao'] : 'moderado';
$filas_preferenciais = isset($data['filas_preferenciais']) ? intval($data['filas_preferenciais']) : 0;
$horarios_tranquilos = isset($data['horarios_tranquilos']) ? intval($data['horarios_tranquilos']) : 0;
$mudancas_ambiente = isset($data['mudancas_ambiente']) ? $data['mudancas_ambiente'] : 'media';
$agendamento_antecipado = isset($data['agendamento_antecipado']) ? intval($data['agendamento_antecipado']) : 0;
$temperatura_confortavel = isset($data['temperatura_confortavel']) ? intval($data['temperatura_confortavel']) : null;
$assentos_confortaveis = isset($data['assentos_confortaveis']) ? intval($data['assentos_confortaveis']) : 0;
$espaco_pessoal = isset($data['espaco_pessoal']) ? $data['espaco_pessoal'] : 'medio';
$comentario = isset($data['comentario']) ? trim($data['comentario']) : null;
$nota_geral = isset($data['nota_geral']) ? floatval($data['nota_geral']) : 0;

// Validar enums
$iluminacao_validos = ['suave', 'natural', 'forte'];
$movimento_validos = ['pouco', 'medio', 'intenso'];
$lotacao_validos = ['tranquilo', 'moderado', 'cheio'];
$mudancas_validos = ['baixa', 'media', 'alta'];
$espaco_validos = ['amplo', 'medio', 'apertado'];

if (!in_array($iluminacao, $iluminacao_validos)) $iluminacao = 'natural';
if (!in_array($movimento_visual, $movimento_validos)) $movimento_visual = 'medio';
if (!in_array($controle_lotacao, $lotacao_validos)) $controle_lotacao = 'moderado';
if (!in_array($mudancas_ambiente, $mudancas_validos)) $mudancas_ambiente = 'media';
if (!in_array($espaco_pessoal, $espaco_validos)) $espaco_pessoal = 'medio';

// Validar níveis (1-5)
if ($nivel_ruido !== null && ($nivel_ruido < 1 || $nivel_ruido > 5)) {
    echo json_encode([
        'success' => false,
        'message' => 'nivel_ruido deve estar entre 1 e 5'
    ]);
    exit();
}

if ($sinalizacao_visual !== null && ($sinalizacao_visual < 1 || $sinalizacao_visual > 5)) {
    echo json_encode([
        'success' => false,
        'message' => 'sinalizacao_visual deve estar entre 1 e 5'
    ]);
    exit();
}

if ($temperatura_confortavel !== null && ($temperatura_confortavel < 1 || $temperatura_confortavel > 5)) {
    echo json_encode([
        'success' => false,
        'message' => 'temperatura_confortavel deve estar entre 1 e 5'
    ]);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Verificar se o local existe
    $queryLocal = "SELECT id FROM locais WHERE id = :local_id";
    $stmtLocal = $db->prepare($queryLocal);
    $stmtLocal->bindParam(':local_id', $local_id);
    $stmtLocal->execute();

    if ($stmtLocal->rowCount() === 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Local não encontrado'
        ]);
        exit();
    }

    // Verificar se o usuário já avaliou este local
    $queryCheck = "SELECT id FROM avaliacoes WHERE local_id = :local_id AND usuario_id = :usuario_id";
    $stmtCheck = $db->prepare($queryCheck);
    $stmtCheck->bindParam(':local_id', $local_id);
    $stmtCheck->bindParam(':usuario_id', $usuario_id);
    $stmtCheck->execute();

    if ($stmtCheck->rowCount() > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Você já avaliou este local'
        ]);
        exit();
    }

    // Inserir avaliação
    $query = "INSERT INTO avaliacoes (
        local_id, usuario_id, nivel_ruido, iluminacao, cheiros_fortes,
        movimento_visual, espaco_calmo, banheiro_acessivel, sinalizacao_visual,
        mapas_rotas, controle_lotacao, filas_preferenciais, horarios_tranquilos,
        mudancas_ambiente, agendamento_antecipado, temperatura_confortavel,
        assentos_confortaveis, espaco_pessoal, comentario, nota_geral
    ) VALUES (
        :local_id, :usuario_id, :nivel_ruido, :iluminacao, :cheiros_fortes,
        :movimento_visual, :espaco_calmo, :banheiro_acessivel, :sinalizacao_visual,
        :mapas_rotas, :controle_lotacao, :filas_preferenciais, :horarios_tranquilos,
        :mudancas_ambiente, :agendamento_antecipado, :temperatura_confortavel,
        :assentos_confortaveis, :espaco_pessoal, :comentario, :nota_geral
    )";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':local_id', $local_id);
    $stmt->bindParam(':usuario_id', $usuario_id);
    $stmt->bindParam(':nivel_ruido', $nivel_ruido);
    $stmt->bindParam(':iluminacao', $iluminacao);
    $stmt->bindParam(':cheiros_fortes', $cheiros_fortes);
    $stmt->bindParam(':movimento_visual', $movimento_visual);
    $stmt->bindParam(':espaco_calmo', $espaco_calmo);
    $stmt->bindParam(':banheiro_acessivel', $banheiro_acessivel);
    $stmt->bindParam(':sinalizacao_visual', $sinalizacao_visual);
    $stmt->bindParam(':mapas_rotas', $mapas_rotas);
    $stmt->bindParam(':controle_lotacao', $controle_lotacao);
    $stmt->bindParam(':filas_preferenciais', $filas_preferenciais);
    $stmt->bindParam(':horarios_tranquilos', $horarios_tranquilos);
    $stmt->bindParam(':mudancas_ambiente', $mudancas_ambiente);
    $stmt->bindParam(':agendamento_antecipado', $agendamento_antecipado);
    $stmt->bindParam(':temperatura_confortavel', $temperatura_confortavel);
    $stmt->bindParam(':assentos_confortaveis', $assentos_confortaveis);
    $stmt->bindParam(':espaco_pessoal', $espaco_pessoal);
    $stmt->bindParam(':comentario', $comentario);
    $stmt->bindParam(':nota_geral', $nota_geral);

    if ($stmt->execute()) {
        $avaliacao_id = $db->lastInsertId();

        // Atualizar a média de avaliações do local (se a tabela locais tiver esse campo)
        $queryMedia = "UPDATE locais 
               SET media_avaliacoes = (
                   SELECT COALESCE(AVG(nota_geral), 0) FROM avaliacoes WHERE local_id = :local_id
               ),
               total_avaliacoes = (
                   SELECT COUNT(*) FROM avaliacoes WHERE local_id = :local_id
               )
               WHERE id = :local_id2";
        
        $stmtMedia = $db->prepare($queryMedia);
        $stmtMedia->bindParam(':local_id', $local_id);
        $stmtMedia->bindParam(':local_id2', $local_id);
        $stmtMedia->execute();

        echo json_encode([
            'success' => true,
            'message' => 'Avaliação criada com sucesso',
            'data' => [
                'id' => $avaliacao_id,
                'local_id' => $local_id,
                'nota_geral' => $nota_geral
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao criar avaliação'
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro no servidor: ' . $e->getMessage()
    ]);
}
?>