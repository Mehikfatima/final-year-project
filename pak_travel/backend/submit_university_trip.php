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

function post_value($key, $default = "") {
    return isset($_POST[$key]) ? trim($_POST[$key]) : $default;
}

$leader_name = post_value("leader_name");
$phone = post_value("phone");
$university_name = post_value("university_name");
$department_name = post_value("department_name");
$trip_date = post_value("trip_date");
$student_count = intval(post_value("student_count", 0));
$from_city = post_value("from_city");
$trip_package = post_value("trip_package");
$destination = post_value("destination");
$duration = post_value("duration");
$stops_json = post_value("stops_json", "[]");
$vehicle = post_value("vehicle");
$vehicle_capacity = post_value("vehicle_capacity");
$stay_type = post_value("stay_type");
$per_student_price = floatval(post_value("per_student_price", 0));
$discount = floatval(post_value("discount", 0));
$total_payment = floatval(post_value("total_payment", 0));
$pickup_point = post_value("pickup_point");
$pickup_address = post_value("pickup_address");
$special_note = post_value("special_note");
$payment_type = post_value("payment_type");
$status = post_value("status", "Pending Admin Confirmation");

if ($leader_name === "" || $phone === "" || $university_name === "") {
    echo json_encode(["success" => false, "message" => "Leader name, phone and university name are required"]);
    exit;
}

if ($student_count < 10) {
    echo json_encode(["success" => false, "message" => "Minimum 10 students required"]);
    exit;
}

$payment_screenshot = "Not uploaded";

if (isset($_FILES["payment_screenshot"]) && $_FILES["payment_screenshot"]["error"] !== UPLOAD_ERR_NO_FILE) {
    if ($_FILES["payment_screenshot"]["error"] !== UPLOAD_ERR_OK) {
        echo json_encode(["success" => false, "message" => "Screenshot upload error"]);
        exit;
    }

    $upload_dir = __DIR__ . "/uploads/payments/";
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $extension = strtolower(pathinfo(basename($_FILES["payment_screenshot"]["name"]), PATHINFO_EXTENSION));
    $allowed = ["jpg", "jpeg", "png", "webp", "gif"];

    if (!in_array($extension, $allowed)) {
        echo json_encode(["success" => false, "message" => "Only image files are allowed"]);
        exit;
    }

    $new_name = "university_trip_payment_" . time() . "_" . rand(1000, 9999) . "." . $extension;
    $target_path = $upload_dir . $new_name;

    if (move_uploaded_file($_FILES["payment_screenshot"]["tmp_name"], $target_path)) {
        $payment_screenshot = "uploads/payments/" . $new_name;
    } else {
        echo json_encode(["success" => false, "message" => "Failed to save screenshot"]);
        exit;
    }
}

$sql = "INSERT INTO university_trip_bookings
(leader_name, phone, university_name, department_name, trip_date, student_count, from_city, trip_package, destination, duration, stops_json, vehicle, vehicle_capacity, stay_type, per_student_price, discount, total_payment, pickup_point, pickup_address, special_note, payment_type, payment_screenshot, status)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = mysqli_prepare($conn, $sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . mysqli_error($conn)]);
    exit;
}

mysqli_stmt_bind_param(
    $stmt,
    "sssssissssssssdddssssss",
    $leader_name,
    $phone,
    $university_name,
    $department_name,
    $trip_date,
    $student_count,
    $from_city,
    $trip_package,
    $destination,
    $duration,
    $stops_json,
    $vehicle,
    $vehicle_capacity,
    $stay_type,
    $per_student_price,
    $discount,
    $total_payment,
    $pickup_point,
    $pickup_address,
    $special_note,
    $payment_type,
    $payment_screenshot,
    $status
);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true, "message" => "University trip request saved successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Insert failed: " . mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>