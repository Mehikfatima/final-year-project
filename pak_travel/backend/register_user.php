<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Only POST request allowed"]);
    exit;
}

$name = isset($_POST["name"]) ? trim($_POST["name"]) : "";
$phone = isset($_POST["phone"]) ? trim($_POST["phone"]) : "";
$password = isset($_POST["password"]) ? trim($_POST["password"]) : "";

if ($name === "" || $phone === "" || $password === "") {
    echo json_encode(["success" => false, "message" => "Name, phone and password are required"]);
    exit;
}

$check = mysqli_prepare($conn, "SELECT id, name, phone FROM tour_users WHERE phone = ?");
mysqli_stmt_bind_param($check, "s", $phone);
mysqli_stmt_execute($check);
$result = mysqli_stmt_get_result($check);

if (mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    echo json_encode([
        "success" => true,
        "message" => "User already exists. Login successful.",
        "user" => [
            "id" => $user["id"],
            "name" => $user["name"],
            "phone" => $user["phone"]
        ]
    ]);
    exit;
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$stmt = mysqli_prepare($conn, "INSERT INTO tour_users (name, phone, password) VALUES (?, ?, ?)");
mysqli_stmt_bind_param($stmt, "sss", $name, $phone, $hashed_password);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode([
        "success" => true,
        "message" => "Registration successful",
        "user" => [
            "id" => mysqli_insert_id($conn),
            "name" => $name,
            "phone" => $phone
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Registration failed: " . mysqli_error($conn)]);
}

mysqli_close($conn);
?>
