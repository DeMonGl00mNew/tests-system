<?php

// Разрешить доступ с любого источника
header("Access-Control-Allow-Origin: *");
// Разрешить определенные методы (GET, POST и т.д.)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Разрешить определенные заголовки
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Если это preflight запрос, просто завершите выполнение
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

try {
    // Создаем соединение с базой данных MySQL с помощью PDO
    $pdo = new PDO('mysql:host=localhost;dbname=quizsystem', 'merchadmin', 'qwerty123');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// Получаем данные из тела запроса
$data = json_decode(file_get_contents('php://input'), true);

// Проверяем, были ли данные получены
if (isset($data['id_user']) && isset($data['id_test'])) {
    $id_user = $data['id_user'];
    $id_test = $data['id_test'];

    // Подготовка SQL-запроса для получения результатов
    $query = $pdo->prepare('SELECT 
        Tests.title,
        Results.score,
        Results.completed_at
    FROM 
        Results
    JOIN 
        Users ON Results.id_user = Users.id_user
    JOIN 
        Tests ON Results.id_test = Tests.id_test
    WHERE 
        Results.id_user = :id_user AND Results.id_test = :id_test');

    // Привязка параметров
    $query->bindParam(':id_user', $id_user, PDO::PARAM_INT);
    $query->bindParam(':id_test', $id_test, PDO::PARAM_INT);

    // Исполнение подготовленного запроса
    $query->execute();

    // Получение результатов
    $results = $query->fetchAll(PDO::FETCH_ASSOC);

    if ($results) {
        echo json_encode($results); // Возвращаем результаты в формате JSON
    } else {
        echo json_encode(["message" => "Нет результатов для данного пользователя и теста."]);
    }
} else {
    echo json_encode(["error" => "Ошибка: не все необходимые данные были предоставлены."]); // Сообщение об ошибке, если данные не полные
}
?>