<?php
include "db.php";

if (!$conn) {
    die("DB connection failed");
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

$result = mysqli_query($conn, "SELECT COUNT(*) AS total FROM traveler_reviews");
$row = mysqli_fetch_assoc($result);

echo "<h2>Reviews DB Test</h2>";
echo "<p>Database connected ✅</p>";
echo "<p>traveler_reviews rows: <strong>" . $row["total"] . "</strong></p>";
echo "<p>Open get_reviews.php: <a href='get_reviews.php' target='_blank'>get_reviews.php</a></p>";
?>
