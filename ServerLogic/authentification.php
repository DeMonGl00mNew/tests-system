<?php

// Разрешить доступ с любого источника
header("Access-Control-Allow-Origin: *");
// Разрешить определенные методы (GET, POST и т.д.)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Разрешить определенные заголовки
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Если это preflight запрос, просто завершим выполнение
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

try {
    // Создаем соединение с базой данных MySQL с помощью PDO
    $pdo = new PDO('mysql:host=localhost;dbname=quizsystem', 'merchadmin', 'qwerty123');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC); // Устанавливаем режим выборки по умолчанию
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// Получаем данные из тела запроса
$data = json_decode(file_get_contents('php://input'), true);

// Проверяем, были ли данные получены
if (isset($data['username']) && isset($data['password'])) {
    $username = $data['username'];
    $password = $data['password'];

    // Храним пароли в зашифрованном виде, например, с помощью password_hash
    // Выполняем SQL-запрос для поиска пользователя с введенными логином
    $stmt = $pdo->prepare("SELECT * FROM `Users` WHERE `username` = :username");
    $stmt->execute(['username' => $username]);
    $row = $stmt->fetch();

    // Проверяем, найден ли пользователь
    if ($row && password_verify($password, $row['password'])) { // Используем password_verify для проверки пароля
        $data = [
            'id_user' => $row['id_user'],
            'username' => $row['username'],
            'email' => $row['email'],
            'grade' => $row['grade'],
            'role' => $row['role'],
        ];

        echo json_encode($data);
    } else {
        // Если данных не существует, выводим сообщение об ошибке
        echo json_encode(['error' => 'неправильный логин или пароль']);
    }
} else {
    echo json_encode(['error' => 'Invalid input']);
}
?>