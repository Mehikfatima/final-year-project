<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

if (!$conn) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

mysqli_query($conn, "CREATE TABLE IF NOT EXISTS traveler_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tour VARCHAR(150) NOT NULL,
    review_text TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5,
    status VARCHAR(50) DEFAULT 'Approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Only POST request allowed"]);
    exit;
}

$name = isset($_POST["name"]) ? trim($_POST["name"]) : "";
$tour = isset($_POST["tour"]) ? trim($_POST["tour"]) : "";
$review_text = isset($_POST["review_text"]) ? trim($_POST["review_text"]) : "";
$rating = isset($_POST["rating"]) ? intval($_POST["rating"]) : 5;

if ($name === "" || $tour === "" || $review_text === "") {
    echo json_encode([
        "success" => false,
        "message" => "Missing fields",
        "received" => $_POST
    ]);
    exit;
}

if ($rating < 1 || $rating > 5) {
    $rating = 5;
}

$status = "Approved";

$stmt = mysqli_prepare($conn, "INSERT INTO traveler_reviews (name, tour, review_text, rating, status) VALUES (?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . mysqli_error($conn)]);
    exit;
}

mysqli_stmt_bind_param($stmt, "sssis", $name, $tour, $review_text, $rating, $status);

if (mysqli_stmt_execute($stmt)) {
    $insert_id = mysqli_insert_id($conn);

    echo json_encode([
        "success" => true,
        "message" => "Review saved successfully",
        "id" => $insert_id,
        "database_inserted" => true
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Insert failed: " . mysqli_error($conn)
    ]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
