<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "db.php";

if (!$conn) {
    echo json_encode(["success" => false, "message" => "Database connection failed", "reviews" => []]);
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

$result = mysqli_query($conn, "SELECT id, name, tour, review_text, rating, status, created_at FROM traveler_reviews WHERE status='Approved' ORDER BY id DESC");

$reviews = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $reviews[] = $row;
    }
} else {
    echo json_encode(["success" => false, "message" => mysqli_error($conn), "reviews" => []]);
    exit;
}

echo json_encode([
    "success" => true,
    "reviews" => $reviews,
    "count" => count($reviews)
]);

mysqli_close($conn);
?>
