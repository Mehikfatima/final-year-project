<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

mysqli_report(MYSQLI_REPORT_OFF);
include "db.php";

if (!$conn) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed",
        "blogs" => []
    ]);
    exit;
}

mysqli_query($conn, "CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(80) NOT NULL,
    image TEXT,
    publish_date VARCHAR(80),
    read_time VARCHAR(50),
    excerpt TEXT,
    body LONGTEXT,
    tags TEXT,
    status VARCHAR(50) DEFAULT 'Published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$result = mysqli_query($conn, "SELECT id, title, category, image, publish_date AS date, read_time, excerpt, body, tags, status, created_at FROM blog_posts WHERE status='Published' ORDER BY id DESC");

$blogs = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $row["read"] = $row["read_time"];
        $row["tags"] = $row["tags"] ? array_map("trim", explode(",", $row["tags"])) : [];
        $blogs[] = $row;
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn),
        "blogs" => []
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "blogs" => $blogs
]);

mysqli_close($conn);
?>
