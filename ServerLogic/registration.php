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
if (isset($data['username']) && isset($data['password'])) {
    $username = $data['username'];
    $password = $data['password'];
    $email = $data['email'];
    $grade = $data['grade'];
    $role = $data['role'];

    // Проверка на существование пользователя с таким же username
    $checkQuery = $pdo->prepare('SELECT COUNT(*) FROM Users WHERE username = :username');
    $checkQuery->execute(['username' => $username]);
    $userExists = $checkQuery->fetchColumn();

    if ($userExists) {
        echo json_encode(["error" => "Пользователь с таким именем уже существует."]); // Сообщение об ошибке, если пользователь существует
    } else {
        // Подготовка SQL-запроса для вставки данных пользователя в таблицу 'Users'
        $query = $pdo->prepare('INSERT INTO Users(username, password, email, grade, role) VALUES(:username, :password, :email, :grade, :role)');

        // Исполнение подготовленного запроса с привязкой параметров
        $query->execute([
            'username' => $username, // Привязка логина
            'password' => password_hash($password, PASSWORD_DEFAULT),  // Привязка хешированного пароля
            'email' => $email,  // Привязка почты
            'grade' => $grade, // Привязка класса/уровня
            'role' => $role // Привязка роли
        ]);

        echo json_encode(["message" => "Пользователь успешно зарегистрирован."]); // Сообщение об успешной регистрации
    }
} else {
    echo json_encode(["error" => "Ошибка при регистрации пользователя."]); // Сообщение об ошибке, если данные не полные
}
?>