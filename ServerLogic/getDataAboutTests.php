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

// Подготовка SQL-запроса для получения результатов
$query = $pdo->prepare('SELECT Tests.id_test, Tests.title, Tests.image FROM Tests');
$query->execute();

// Получение всех результатов в виде ассоциативного массива
$tests = $query->fetchAll(PDO::FETCH_ASSOC);

// Отправка результатов в формате JSON
echo json_encode($tests);

?>