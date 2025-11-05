<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';
include_once '../../config/JwtHandler.php';
include_once '../../models/Usuario.php';

$database = new Database();
$db = $database->getConnection();
$usuario = new Usuario($db);
$jwt_handler = new JwtHandler();

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->name) &&
    !empty($data->email) &&
    !empty($data->password)
) {
    $usuario->nome = $data->name;
    $usuario->email = $data->email;
    $usuario->senha = $data->password;

    if ($usuario->emailExiste()) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Este email já está cadastrado."
        ]);
        exit();
    }

    if (strlen($data->name) < 3) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Nome deve ter no mínimo 3 caracteres."
        ]);
        exit();
    }

    if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Email inválido."
        ]);
        exit();
    }

    if (strlen($data->password) < 6) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Senha deve ter no mínimo 6 caracteres."
        ]);
        exit();
    }

    if ($usuario->criar()) {
        http_response_code(201);
        
        $token = $jwt_handler->encode($usuario->id, $usuario->email);
        
        echo json_encode([
            "success" => true,
            "message" => "Usuário criado com sucesso!",
            "data" => [
                "id" => $usuario->id,
                "nome" => $usuario->nome,
                "email" => $usuario->email,
                "token" => $token
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erro ao criar usuário."
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Dados incompletos. Nome, email e senha são obrigatórios."
    ]);
}
?>