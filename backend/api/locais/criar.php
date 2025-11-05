<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';
include_once '../../config/JwtHandler.php';
include_once '../../models/Local.php';
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
$local = new Local($db);
$avaliacao = new Avaliacao($db);

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->nome) &&
    !empty($data->latitude) &&
    !empty($data->longitude)
) {
    
    $db->beginTransaction();
    
    try {
        $local->usuario_id = $usuario_id;
        $local->nome = $data->nome;
        $local->endereco = $data->endereco ?? '';
        $local->latitude = $data->latitude;
        $local->longitude = $data->longitude;
        $local->categoria = $data->categoria ?? 'outro';
        $local->imagem = $data->imagem ?? 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400';
        $local->descricao = $data->descricao ?? '';

        if ($local->criar()) {
            $local_id = $local->id;

            if (isset($data->avaliacao)) {
                $av = $data->avaliacao;
                
                $avaliacao->local_id = $local_id;
                $avaliacao->usuario_id = $usuario_id;
                $avaliacao->nivel_ruido = $av->nivel_ruido ?? 3;
                $avaliacao->iluminacao = $av->iluminacao ?? 'natural';
                $avaliacao->cheiros_fortes = $av->cheiros_fortes ?? false;
                $avaliacao->movimento_visual = $av->movimento_visual ?? 'medio';
                $avaliacao->espaco_calmo = $av->espaco_calmo ?? false;
                $avaliacao->banheiro_acessivel = $av->banheiro_acessivel ?? false;
                $avaliacao->sinalizacao_visual = $av->sinalizacao_visual ?? 3;
                $avaliacao->mapas_rotas = $av->mapas_rotas ?? false;
                $avaliacao->controle_lotacao = $av->controle_lotacao ?? 'moderado';
                $avaliacao->filas_preferenciais = $av->filas_preferenciais ?? false;
                $avaliacao->horarios_tranquilos = $av->horarios_tranquilos ?? false;
                $avaliacao->mudancas_ambiente = $av->mudancas_ambiente ?? 'media';
                $avaliacao->agendamento_antecipado = $av->agendamento_antecipado ?? false;
                $avaliacao->temperatura_confortavel = $av->temperatura_confortavel ?? 3;
                $avaliacao->assentos_confortaveis = $av->assentos_confortaveis ?? false;
                $avaliacao->espaco_pessoal = $av->espaco_pessoal ?? 'medio';
                $avaliacao->comentario = $av->comentario ?? '';

                if (!$avaliacao->criar()) {
                    throw new Exception("Erro ao criar avaliação");
                }
            }

            $db->commit();

            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Local criado com sucesso!",
                "data" => [
                    "id" => $local_id,
                    "nome" => $local->nome
                ]
            ]);
        } else {
            throw new Exception("Erro ao criar local");
        }
        
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erro ao criar local: " . $e->getMessage()
        ]);
    }
    
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Dados incompletos. Nome, latitude e longitude são obrigatórios."
    ]);
}
?>