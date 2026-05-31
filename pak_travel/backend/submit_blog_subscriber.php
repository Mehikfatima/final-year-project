<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// PHP 8 / XAMPP me duplicate email par fatal exception aa sakti hai.
// Is line se mysqli warning mode me rahega aur hum proper JSON return karenge.
mysqli_report(MYSQLI_REPORT_OFF);

include "db.php";

if (!$conn) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

mysqli_query($conn, "CREATE TABLE IF NOT EXISTS blog_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(180) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Only POST request allowed"
    ]);
    exit;
}

$email = isset($_POST["email"]) ? trim($_POST["email"]) : "";

if ($email === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "message" => "Please enter a valid email"
    ]);
    exit;
}

// Pehle check kar lo ke email already database me hai ya nahi.
$check = mysqli_prepare($conn, "SELECT id FROM blog_subscribers WHERE email = ?");
if (!$check) {
    echo json_encode([
        "success" => false,
        "message" => "Prepare check failed: " . mysqli_error($conn)
    ]);
    exit;
}

mysqli_stmt_bind_param($check, "s", $email);
mysqli_stmt_execute($check);
$check_result = mysqli_stmt_get_result($check);

if ($check_result && mysqli_num_rows($check_result) > 0) {
    echo json_encode([
        "success" => true,
        "message" => "You are already subscribed"
    ]);
    mysqli_stmt_close($check);
    mysqli_close($conn);
    exit;
}

mysqli_stmt_close($check);

$stmt = mysqli_prepare($conn, "INSERT INTO blog_subscribers (email) VALUES (?)");

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Prepare insert failed: " . mysqli_error($conn)
    ]);
    exit;
}

mysqli_stmt_bind_param($stmt, "s", $email);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode([
        "success" => true,
        "message" => "Subscribed successfully"
    ]);
} else {
    if (mysqli_errno($conn) == 1062) {
        echo json_encode([
            "success" => true,
            "message" => "You are already subscribed"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Insert failed: " . mysqli_error($conn)
        ]);
    }
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
