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

if (!empty($data->email) && !empty($data->password)) {
    $usuario->email = $data->email;
    $usuario->senha = $data->password;

    if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Email inválido."
        ]);
        exit();
    }

    if ($usuario->login()) {
        http_response_code(200);
        
        $token = $jwt_handler->encode($usuario->id, $usuario->email);
        
        echo json_encode([
            "success" => true,
            "message" => "Login realizado com sucesso!",
            "data" => [
                "id" => $usuario->id,
                "nome" => $usuario->nome,
                "email" => $usuario->email,
                "foto_perfil" => $usuario->foto_perfil,
                "token" => $token
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Email ou senha incorretos."
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Email e senha são obrigatórios."
    ]);
}
?>