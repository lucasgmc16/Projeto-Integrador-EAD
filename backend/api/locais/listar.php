<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../../config/Database.php';
include_once '../../models/Local.php';

$database = new Database();
$db = $database->getConnection();
$local = new Local($db);

$categoria = isset($_GET['categoria']) ? $_GET['categoria'] : null;
$busca = isset($_GET['busca']) ? $_GET['busca'] : null;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

$filtros_tea = [];
if (isset($_GET['baixoRuido'])) {
    $filtros_tea['baixoRuido'] = filter_var($_GET['baixoRuido'], FILTER_VALIDATE_BOOLEAN);
}
if (isset($_GET['iluminacaoSuave'])) {
    $filtros_tea['iluminacaoSuave'] = filter_var($_GET['iluminacaoSuave'], FILTER_VALIDATE_BOOLEAN);
}
if (isset($_GET['espacoCalmo'])) {
    $filtros_tea['espacoCalmo'] = filter_var($_GET['espacoCalmo'], FILTER_VALIDATE_BOOLEAN);
}
if ($categoria) {
    $filtros_tea['categoria'] = $categoria;
}

if (!empty($filtros_tea)) {
    $stmt = $local->listarComFiltrosTEA($filtros_tea);
} else {
    $stmt = $local->listar($categoria, $busca, $limit, $offset);
}

$num = $stmt->rowCount();

if ($num > 0) {
    $locais_arr = array();
    $locais_arr["data"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $local_item = array(
            "id" => $id,
            "nome" => $nome,
            "endereco" => $endereco,
            "position" => array(
                "lat" => floatval($latitude),
                "lng" => floatval($longitude)
            ),
            "categoria" => $categoria,
            "imagem" => $imagem,
            "descricao" => $descricao,
            "rating" => round(floatval($media_nota ?? 0), 2),
            "reviews" => intval($total_avaliacoes ?? 0),
            "total_favoritos" => intval($total_favoritos ?? 0),
            "isFavorite" => false,
            "teaRatings" => array(
                "ruido" => isset($media_ruido) ? round(floatval($media_ruido), 1) : 0,
                "sinalizacao" => isset($media_sinalizacao) ? round(floatval($media_sinalizacao), 1) : 0
            )
        );

        array_push($locais_arr["data"], $local_item);
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "total" => $num,
        "data" => $locais_arr["data"]
    ]);
} else {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "total" => 0,
        "message" => "Nenhum local encontrado.",
        "data" => []
    ]);
}
?>