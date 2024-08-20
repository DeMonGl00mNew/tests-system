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
if (isset($data['id_test'])) {
    $id_test = $data['id_test'];

    // Подготовка SQL-запроса для получения результатов
    $query = $pdo->prepare('SELECT Tests.title, Tests.content 
                             FROM Tests 
                             WHERE Tests.id_test = :id_test');

    // Привязка параметров
    $query->bindParam(':id_test', $id_test, PDO::PARAM_INT);

    // Исполнение подготовленного запроса
    $query->execute();

    // Получение результатов
    $results = $query->fetchAll(PDO::FETCH_ASSOC);

    if ($results) {
        // Получаем content из результатов
        $content = $results[0]['content'];

        // Декодируем content, который также является JSON
        $contentData = json_decode($content, true);

        // Проверяем, успешно ли декодировался content
        if (json_last_error() === JSON_ERROR_NONE) {
            // Теперь $contentData содержит массив с вопросами
            echo json_encode(['title' => $results[0]['title'], 'questions' => $contentData['questions']]);
        } else {
            echo json_encode(['error' => 'Ошибка декодирования content: ' . json_last_error_msg()]);
        }
    } else {
        echo json_encode(["message" => "Нет результатов для данного теста."]);
    }
} else {
    echo json_encode(["error" => "Ошибка: не все необходимые данные были предоставлены."]); // Сообщение об ошибке, если данные не полные
}
?>