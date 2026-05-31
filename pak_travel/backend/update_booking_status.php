<?php
include "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: admin_dashboard.php");
    exit;
}

$id = isset($_POST["booking_id"]) ? intval($_POST["booking_id"]) : 0;
$status = isset($_POST["status"]) ? trim($_POST["status"]) : "";

$allowed = [
    "Pending Admin Confirmation",
    "Pending Payment",
    "Confirmed",
    "Cancelled",
    "Completed"
];

if ($id <= 0 || !in_array($status, $allowed)) {
    die("Invalid booking ID or status.");
}

$stmt = mysqli_prepare($conn, "UPDATE tour_bookings SET status = ? WHERE id = ?");
mysqli_stmt_bind_param($stmt, "si", $status, $id);

if (mysqli_stmt_execute($stmt)) {
    header("Location: admin_dashboard.php?updated=1");
    exit;
} else {
    die("Status update failed: " . mysqli_error($conn));
}
?>
