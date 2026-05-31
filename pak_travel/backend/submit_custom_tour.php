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

$name = $_POST["name"] ?? "";
$phone = $_POST["phone"] ?? "";
$from_city = $_POST["from_city"] ?? "";
$destination = $_POST["destination"] ?? "";
$budget = $_POST["budget"] ?? "";
$travelers = $_POST["travelers"] ?? "";
$duration = $_POST["duration"] ?? "";
$vehicle = $_POST["vehicle"] ?? "";
$hotel = $_POST["hotel"] ?? "";
$food = $_POST["food"] ?? "";
$note = $_POST["note"] ?? "";

if ($name == "" || $phone == "" || $from_city == "" || $destination == "") {
    echo json_encode(["success" => false, "message" => "Required fields missing"]);
    exit;
}

$sql = "INSERT INTO custom_tour_requests 
(name, phone, from_city, destination, budget, travelers, duration, vehicle, hotel, food, note)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "sssssssssss",
    $name,
    $phone,
    $from_city,
    $destination,
    $budget,
    $travelers,
    $duration,
    $vehicle,
    $hotel,
    $food,
    $note
);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true, "message" => "Custom tour request submitted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Insert failed: " . mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
