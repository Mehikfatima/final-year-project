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

$phone = isset($_POST["phone"]) ? trim($_POST["phone"]) : "";
$password = isset($_POST["password"]) ? trim($_POST["password"]) : "";

if ($phone === "" || $password === "") {
    echo json_encode(["success" => false, "message" => "Phone and password are required"]);
    exit;
}

$stmt = mysqli_prepare($conn, "SELECT id, name, phone, password FROM tour_users WHERE phone = ?");
mysqli_stmt_bind_param($stmt, "s", $phone);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) === 0) {
    echo json_encode(["success" => false, "message" => "User not found. Please register first."]);
    exit;
}

$user = mysqli_fetch_assoc($result);

if (!password_verify($password, $user["password"])) {
    echo json_encode(["success" => false, "message" => "Wrong password."]);
    exit;
}

echo json_encode([
    "success" => true,
    "message" => "Login successful",
    "user" => [
        "id" => $user["id"],
        "name" => $user["name"],
        "phone" => $user["phone"]
    ]
]);

mysqli_close($conn);
?>
