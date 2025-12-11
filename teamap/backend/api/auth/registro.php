<?php
// auth/registro.php
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin:http://localhost:5173");
header('Access-Control-Allow-Methods: POST, OPTIONS');
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=UTF-8');

// Lidar com requisições OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar se é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Método não permitido'
    ]);
    exit();
}

require_once '../../config/Database.php';

try {
    // Obter dados da requisição
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON inválido');
    }

    // Validar campos obrigatórios
    if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Nome, email e senha são obrigatórios'
        ]);
        exit();
    }

    $nome = trim($data['name']);
    $email = trim($data['email']);
    $password = trim($data['password']);

    // Validar email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'message' => 'Email inválido'
        ]);
        exit();
    }

    // Validar senha (mínimo 6 caracteres)
    if (strlen($password) < 6) {
        echo json_encode([
            'success' => false,
            'message' => 'A senha deve ter no mínimo 6 caracteres'
        ]);
        exit();
    }

    // Conectar ao banco
    $database = new Database();
    $db = $database->getConnection();

    // Verificar se o email já existe
    $checkQuery = "SELECT id FROM usuarios WHERE email = :email LIMIT 1";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Este email já está cadastrado'
        ]);
        exit();
    }

    // Hash da senha
    $senhaHash = password_hash($password, PASSWORD_DEFAULT);

    // Gerar token para login automático
    $token = bin2hex(random_bytes(32)) . '_' . time();

    // Inserir usuário
    $insertQuery = "INSERT INTO usuarios (nome, email, senha, token, criado_em) 
                    VALUES (:nome, :email, :senha, :token, NOW())";
    
    $insertStmt = $db->prepare($insertQuery);
    $insertStmt->bindParam(':nome', $nome);
    $insertStmt->bindParam(':email', $email);
    $insertStmt->bindParam(':senha', $senhaHash);
    $insertStmt->bindParam(':token', $token);

    if ($insertStmt->execute()) {
        $userId = $db->lastInsertId();

        // Retornar sucesso com dados do usuário e token
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Usuário cadastrado com sucesso',
            'data' => [
                'id' => (int)$userId,
                'nome' => $nome,
                'email' => $email,
                'token' => $token
            ]
        ]);
    } else {
        throw new Exception('Erro ao criar usuário');
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro no banco de dados: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro no servidor: ' . $e->getMessage()
    ]);
}
?>