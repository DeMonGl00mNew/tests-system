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
if (isset($data['content']) && isset($data['title']) && isset($data['id_creator']) && isset($data['duration']) && isset($data['image'])) {
    $title = $data['title'];
    $id_creator = $data['id_creator'];
    $duration = $data['duration'];
    $image = $data['image'];
    $content = $data['content'];

    // Подготовка SQL-запроса
    $query = $pdo->prepare('INSERT INTO Tests(title, id_creator, duration, image, content) VALUES(:title, :id_creator, :duration, :image, :content)');

    // Исполнение подготовленного запроса с привязкой параметров
    $query->execute([
        'title' => $title, 
        'id_creator' => $id_creator,  
        'duration' => $duration,  
        'image' => $image, 
        'content' => $content 
    ]);

    echo json_encode(["message" => "Тест успешно добавлен на сайт."]);
} else {
    echo json_encode(["error" => "Не все необходимые данные были предоставлены."]);
}
?>