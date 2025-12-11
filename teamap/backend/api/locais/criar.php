<?php
// locais/criar.php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../../logs/php_errors.log');

// Limpar qualquer output anterior
if (ob_get_level()) {
    ob_end_clean();
}
ob_start();

// Headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Log inicial
error_log("========== INÍCIO DA REQUISIÇÃO ==========");
error_log("Método: " . $_SERVER['REQUEST_METHOD']);
error_log("Headers: " . print_r(getallheaders(), true));

// Lidar com requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar se é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
    echo json_encode([
        'success' => false,
        'message' => 'Método não permitido. Use POST.'
    ]);
    exit();
}

try {
    error_log("Tentando incluir Database.php...");
    
    // Verificar se os arquivos existem
    $dbPath = __DIR__ . '/../../config/Database.php';
    $authPath = __DIR__ . '/../../middleware/auth.php';
    
    if (!file_exists($dbPath)) {
        throw new Exception("Arquivo Database.php não encontrado em: " . $dbPath);
    }
    
    if (!file_exists($authPath)) {
        throw new Exception("Arquivo auth.php não encontrado em: " . $authPath);
    }
    
    // Incluir dependências
    require_once $dbPath;
    require_once $authPath;
    
    error_log("Arquivos incluídos com sucesso");

    // Obter dados do corpo da requisição
    $input = file_get_contents('php://input');
    error_log("📥 Input RAW: " . $input);
    
    $data = json_decode($input, true);
    error_log("📦 Dados decodificados: " . print_r($data, true));

    // Validar JSON
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON inválido: ' . json_last_error_msg());
    }

    // Autenticar usuário
    error_log("Tentando autenticar usuário...");
    $user = authenticate();
    error_log("Usuário autenticado: " . print_r($user, true));

    if (!$user) {
        ob_end_clean();
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Não autorizado'
        ]);
        exit();
    }

    // Validar dados obrigatórios
    if (!isset($data['nome'])) {
        throw new Exception('Campo "nome" é obrigatório');
    }
    
    if (!isset($data['endereco'])) {
        throw new Exception('Campo "endereco" é obrigatório');
    }
    
    if (!isset($data['latitude'])) {
        throw new Exception('Campo "latitude" é obrigatório');
    }
    
    if (!isset($data['longitude'])) {
        throw new Exception('Campo "longitude" é obrigatório');
    }

    $nome = trim($data['nome']);
    $endereco = trim($data['endereco']);
    $latitude = floatval($data['latitude']);
    $longitude = floatval($data['longitude']);
    $categoria = isset($data['categoria']) ? trim($data['categoria']) : 'outro';
    $descricao = isset($data['descricao']) ? trim($data['descricao']) : '';
    $usuario_id = $user['id'];

    error_log("Dados validados - Nome: $nome, Endereço: $endereco");

    // Validar campos
    if (empty($nome)) {
        throw new Exception('O nome não pode estar vazio');
    }

    if (empty($endereco)) {
        throw new Exception('O endereço não pode estar vazio');
    }

    if ($latitude < -90 || $latitude > 90) {
        throw new Exception('Latitude inválida (deve estar entre -90 e 90)');
    }

    if ($longitude < -180 || $longitude > 180) {
        throw new Exception('Longitude inválida (deve estar entre -180 e 180)');
    }

    // Validar categoria
    $categorias_validas = ['educacao', 'lazer', 'cultura', 'saude', 'comercio', 'outro'];
    if (!in_array($categoria, $categorias_validas)) {
        $categoria = 'outro';
    }

    // Conectar ao banco
    error_log("Tentando conectar ao banco de dados...");
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception('Falha ao conectar ao banco de dados');
    }
    
    error_log("Conectado ao banco com sucesso");

    // Verificar se o local já existe
    $queryCheck = "SELECT id FROM locais 
                   WHERE nome = :nome 
                   AND ABS(latitude - :latitude) < 0.001 
                   AND ABS(longitude - :longitude) < 0.001
                   LIMIT 1";
    
    $stmtCheck = $db->prepare($queryCheck);
    $stmtCheck->bindParam(':nome', $nome);
    $stmtCheck->bindParam(':latitude', $latitude);
    $stmtCheck->bindParam(':longitude', $longitude);
    $stmtCheck->execute();

    if ($stmtCheck->rowCount() > 0) {
        $localExistente = $stmtCheck->fetch(PDO::FETCH_ASSOC);
        ob_end_clean();
        echo json_encode([
            'success' => true,
            'message' => 'Local já existe no banco de dados',
            'data' => [
                'id' => $localExistente['id'],
                'nome' => $nome,
                'ja_existia' => true
            ]
        ]);
        exit();
    }

    // ✅ Pegar URL da imagem se existir
    $imagem = isset($data['imagem']) ? trim($data['imagem']) : null;
    
    // Inserir local
    error_log("Preparando INSERT...");
    $query = "INSERT INTO locais (
        nome, 
        endereco, 
        latitude, 
        longitude, 
        categoria, 
        descricao, 
        usuario_id, 
        imagem,
        status,
        criado_em
    ) VALUES (
        :nome, 
        :endereco, 
        :latitude, 
        :longitude, 
        :categoria, 
        :descricao, 
        :usuario_id,
        :imagem,
        'ativo',
        NOW()
    )";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':endereco', $endereco);
    $stmt->bindParam(':latitude', $latitude);
    $stmt->bindParam(':longitude', $longitude);
    $stmt->bindParam(':categoria', $categoria);
    $stmt->bindParam(':descricao', $descricao);
    $stmt->bindParam(':usuario_id', $usuario_id);
    $stmt->bindParam(':imagem', $imagem);

    error_log("Executando INSERT...");
    
    if ($stmt->execute()) {
        $local_id = $db->lastInsertId();
        error_log("✅ Local criado com sucesso! ID: " . $local_id);

        // Limpar buffer e enviar resposta
        ob_end_clean();
        
        echo json_encode([
            'success' => true,
            'message' => 'Local criado com sucesso',
            'data' => [
                'id' => intval($local_id),
                'nome' => $nome,
                'endereco' => $endereco,
                'latitude' => floatval($latitude),
                'longitude' => floatval($longitude),
                'categoria' => $categoria,
                'descricao' => $descricao,
                'ja_existia' => false
            ]
        ]);
    } else {
        $errorInfo = $stmt->errorInfo();
        error_log("❌ Erro ao executar INSERT: " . print_r($errorInfo, true));
        throw new Exception('Erro ao executar INSERT: ' . $errorInfo[2]);
    }

} catch (PDOException $e) {
    error_log("❌ PDOException: " . $e->getMessage());
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro de banco de dados',
        'error' => $e->getMessage(),
        'code' => $e->getCode()
    ]);
} catch (Exception $e) {
    error_log("❌ Exception: " . $e->getMessage());
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}

error_log("========== FIM DA REQUISIÇÃO ==========");
?>