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
if (isset($data['id_user']) && isset($data['id_test']) && isset($data['score'])) {
    $id_user = $data['id_user'];
    $id_test = $data['id_test'];
    $score = $data['score'];

    // Подготовка SQL-запроса для вставки данных пользователя в таблицу 'Result'
    $query = $pdo->prepare('INSERT INTO Results (id_user, id_test, score) VALUES (:id_user, :id_test, :score)');

    // Исполнение подготовленного запроса с привязкой параметров
    $query->execute([
        'id_user' => $id_user, 
        'id_test' => $id_test, 
        'score' => $score,  
    ]);

    echo json_encode(["message" => "Результат успешно сохранен."]); // Сообщение об успешном сохранении результата
} else {
    echo json_encode(["error" => "Ошибка: не все необходимые данные были предоставлены."]); // Сообщение об ошибке, если данные не полные
}
?>