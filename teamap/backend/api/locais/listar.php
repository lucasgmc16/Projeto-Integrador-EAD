<?php
// locais/listar.php
error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Lidar com requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Montar query com filtros opcionais e médias TEA
    $query = "SELECT 
                l.id,
                l.nome,
                l.endereco,
                l.latitude,
                l.longitude,
                l.categoria,
                l.descricao,
                l.imagem,
                l.media_avaliacoes,
                l.total_avaliacoes,
                l.criado_em,
                AVG(a.nivel_ruido) as media_ruido,
                AVG(a.sinalizacao_visual) as media_sinalizacao,
                AVG(a.temperatura_confortavel) as media_temperatura,
                SUM(CASE WHEN a.espaco_calmo = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(a.id) as percent_espaco_calmo
              FROM locais l
              LEFT JOIN avaliacoes a ON l.id = a.local_id
              WHERE l.status = 'ativo'";

    $params = [];

    // Filtro por categoria
    if (isset($_GET['categoria']) && !empty($_GET['categoria'])) {
        $query .= " AND l.categoria = :categoria";
        $params[':categoria'] = $_GET['categoria'];
    }

    // Filtro por busca de texto
    if (isset($_GET['busca']) && !empty($_GET['busca'])) {
        $query .= " AND (l.nome LIKE :busca OR l.endereco LIKE :busca OR l.descricao LIKE :busca)";
        $params[':busca'] = '%' . $_GET['busca'] . '%';
    }

    // Ordenação
    $query .= " GROUP BY l.id ORDER BY l.criado_em DESC";

    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    $stmt->execute();
    
    $locais = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Formatar dados para garantir tipos corretos
    $locaisFormatados = array_map(function($local) {
        // Calcular rating TEA
        // Ruído baixo: inverter (1=barulhento, 5=silencioso) → converter para (1=ruim, 5=bom)
        $ruidoBaixo = $local['media_ruido'] ? (6 - floatval($local['media_ruido'])) : 3;
        
        return [
            'id' => (int)$local['id'],
            'nome' => $local['nome'],
            'endereco' => $local['endereco'],
            'latitude' => (float)$local['latitude'],
            'longitude' => (float)$local['longitude'],
            'categoria' => $local['categoria'],
            'descricao' => $local['descricao'],
            'imagem' => $local['imagem'],
            'media_avaliacoes' => $local['media_avaliacoes'] ? (float)$local['media_avaliacoes'] : 0,
            'total_avaliacoes' => (int)$local['total_avaliacoes'],
            'criado_em' => $local['criado_em'],
            // ✅ Critérios TEA calculados
            'tea_ratings' => [
                'ruido_baixo' => round($ruidoBaixo, 1),
                'iluminacao' => $local['media_sinalizacao'] ? (float)$local['media_sinalizacao'] : 3,
                'espaco_calmo' => $local['percent_espaco_calmo'] ? round((float)$local['percent_espaco_calmo'] / 20, 1) : 3, // Converter % para escala 1-5
                'acolhimento' => $local['media_avaliacoes'] ? (float)$local['media_avaliacoes'] : 3
            ]
        ];
    }, $locais);

    echo json_encode([
        'success' => true,
        'data' => $locaisFormatados,
        'total' => count($locaisFormatados)
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro no servidor: ' . $e->getMessage()
    ]);
}
?>