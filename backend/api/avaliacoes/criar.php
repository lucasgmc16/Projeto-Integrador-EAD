<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';
include_once '../../config/JwtHandler.php';
include_once '../../models/Avaliacao.php';

$headers = getallheaders();
$auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : '');

if (empty($auth_header)) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Token não fornecido."]);
    exit();
}

$jwt_handler = new JwtHandler();
$token = str_replace('Bearer ', '', $auth_header);
$decoded = $jwt_handler->decode($token);

if (!$decoded) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Token inválido ou expirado."]);
    exit();
}

$usuario_id = $decoded['data']['user_id'];

$database = new Database();
$db = $database->getConnection();
$avaliacao = new Avaliacao($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->local_id)) {
    
    $avaliacao->local_id = $data->local_id;
    $avaliacao->usuario_id = $usuario_id;

    if ($avaliacao->usuarioJaAvaliou()) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Você já avaliou este local."
        ]);
        exit();
    }

    $avaliacao->nivel_ruido = $data->nivel_ruido ?? 3;
    $avaliacao->iluminacao = $data->iluminacao ?? 'natural';
    $avaliacao->cheiros_fortes = $data->cheiros_fortes ?? false;
    $avaliacao->movimento_visual = $data->movimento_visual ?? 'medio';
    $avaliacao->espaco_calmo = $data->espaco_calmo ?? false;
    $avaliacao->banheiro_acessivel = $data->banheiro_acessivel ?? false;
    $avaliacao->sinalizacao_visual = $data->sinalizacao_visual ?? 3;
    $avaliacao->mapas_rotas = $data->mapas_rotas ?? false;
    $avaliacao->controle_lotacao = $data->controle_lotacao ?? 'moderado';
    $avaliacao->filas_preferenciais = $data->filas_preferenciais ?? false;
    $avaliacao->horarios_tranquilos = $data->horarios_tranquilos ?? false;
    $avaliacao->mudancas_ambiente = $data->mudancas_ambiente ?? 'media';
    $avaliacao->agendamento_antecipado = $data->agendamento_antecipado ?? false;
    $avaliacao->temperatura_confortavel = $data->temperatura_confortavel ?? 3;
    $avaliacao->assentos_confortaveis = $data->assentos_confortaveis ?? false;
    $avaliacao->espaco_pessoal = $data->espaco_pessoal ?? 'medio';
    $avaliacao->comentario = $data->comentario ?? '';

    if ($avaliacao->criar()) {
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Avaliação criada com sucesso!",
            "data" => [
                "id" => $avaliacao->id,
                "nota_geral" => $avaliacao->nota_geral
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erro ao criar avaliação."
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "local_id é obrigatório."
    ]);
}
?>