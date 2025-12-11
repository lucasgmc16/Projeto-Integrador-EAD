<?php
// Autenticação simples usando apenas MySQL

/**
 * Função para autenticar o usuário via token
 * Retorna os dados do usuário se autenticado, ou false se não autenticado
 */
function authenticate() {
    try {
        // Obter headers
        $headers = getallheaders();
        
        // Log para debug
        error_log("🔐 Tentando autenticar usuário");
        error_log("Headers: " . print_r($headers, true));
        
        // Verificar se o header Authorization existe
        if (!isset($headers['Authorization'])) {
            error_log("❌ Header Authorization não encontrado");
            return false;
        }

        $authHeader = $headers['Authorization'];
        error_log("Authorization header: " . $authHeader);

        // Extrair o token (formato: "Bearer TOKEN")
        $token = str_replace('Bearer ', '', $authHeader);
        $token = trim($token);
        
        if (empty($token)) {
            error_log("❌ Token vazio");
            return false;
        }

        error_log("Token extraído: " . substr($token, 0, 20) . "...");

        // Conectar ao banco de dados
        require_once __DIR__ . '/../config/Database.php';
        
        $database = new Database();
        $db = $database->getConnection();

        if (!$db) {
            error_log("❌ Falha ao conectar ao banco de dados");
            return false;
        }

        // Buscar usuário pelo token
        $query = "SELECT id, nome, email FROM usuarios WHERE token = :token LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':token', $token, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            error_log("✅ Usuário autenticado: " . $user['nome'] . " (ID: " . $user['id'] . ")");
            
            return [
                'id' => (int)$user['id'],
                'nome' => $user['nome'],
                'email' => $user['email']
            ];
        } else {
            error_log("❌ Token inválido ou usuário não encontrado");
            return false;
        }

    } catch (PDOException $e) {
        error_log("❌ Erro de banco de dados na autenticação: " . $e->getMessage());
        return false;
    } catch (Exception $e) {
        error_log("❌ Erro ao autenticar: " . $e->getMessage());
        return false;
    }
}

/**
 * Função para gerar um token simples
 * Use esta função ao fazer login do usuário
 */
function generateToken($userId) {
    // Gerar um token único baseado no ID do usuário + timestamp + hash aleatório
    return bin2hex(random_bytes(32)) . '_' . $userId . '_' . time();
}

/**
 * Função para salvar o token do usuário no banco
 * Chame esta função após o login bem-sucedido
 */
function saveUserToken($userId, $token, $db) {
    try {
        $query = "UPDATE usuarios SET token = :token WHERE id = :user_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':user_id', $userId);
        return $stmt->execute();
    } catch (PDOException $e) {
        error_log("Erro ao salvar token: " . $e->getMessage());
        return false;
    }
}

/**
 * Função para fazer logout (limpar token)
 */
function logoutUser($userId, $db) {
    try {
        $query = "UPDATE usuarios SET token = NULL WHERE id = :user_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        return $stmt->execute();
    } catch (PDOException $e) {
        error_log("Erro ao fazer logout: " . $e->getMessage());
        return false;
    }
}
?>