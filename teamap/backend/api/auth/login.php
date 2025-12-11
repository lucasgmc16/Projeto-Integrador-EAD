<?php
// auth/login.php
error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
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
    if (empty($data['email']) || empty($data['password'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Email e senha são obrigatórios'
        ]);
        exit();
    }

    $email = trim($data['email']);
    $password = trim($data['password']);

    // Conectar ao banco
    $database = new Database();
    $db = $database->getConnection();

    // Buscar usuário pelo email
    $query = "SELECT id, nome, email, senha FROM usuarios WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Email ou senha incorretos'
        ]);
        exit();
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verificar senha
    if (!password_verify($password, $user['senha'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Email ou senha incorretos'
        ]);
        exit();
    }

    // Gerar token único
    $token = bin2hex(random_bytes(32)) . '_' . $user['id'] . '_' . time();

    // Salvar token no banco
    $updateQuery = "UPDATE usuarios SET token = :token WHERE id = :user_id";
    $updateStmt = $db->prepare($updateQuery);
    $updateStmt->bindParam(':token', $token);
    $updateStmt->bindParam(':user_id', $user['id']);
    $updateStmt->execute();

    // Retornar sucesso com token
    echo json_encode([
        'success' => true,
        'message' => 'Login realizado com sucesso',
        'data' => [
            'id' => (int)$user['id'],
            'nome' => $user['nome'],
            'email' => $user['email'],
            'token' => $token
        ]
    ]);

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