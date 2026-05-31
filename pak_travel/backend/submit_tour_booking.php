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

$tour_name = post_value("tour_name");
$customer_name = post_value("customer_name");
$phone = post_value("phone");
$cnic = post_value("cnic");
$travel_date = post_value("travel_date");
$guests = intval(post_value("guests", 1));
$room_count = intval(post_value("room_count", 1));
$from_city = post_value("from_city");
$to_destination = post_value("to_destination");
$route_text = post_value("route_text");
$hotel_package = post_value("hotel_package");
$hotel_name = post_value("hotel_name");
$vehicle = post_value("vehicle");
$pickup_point = post_value("pickup_point");
$pickup_address = post_value("pickup_address");
$per_person_price = floatval(post_value("per_person_price", 0));
$hotel_price = floatval(post_value("hotel_price", 0));
$base_payment = floatval(post_value("base_payment", 0));
$hotel_payment = floatval(post_value("hotel_payment", 0));
$total_payment = floatval(post_value("total_payment", 0));
$travelers_json = post_value("travelers_json", "[]");
$booking_note = post_value("booking_note");
$payment_type = post_value("payment_type");
$status = "Pending Admin Confirmation";

if ($tour_name == "" || $customer_name == "" || $phone == "") {
    echo json_encode(["success" => false, "message" => "Tour name, customer name and phone are required"]);
    exit;
}

$payment_screenshot = "Not uploaded";

if (isset($_FILES["payment_screenshot"]) && $_FILES["payment_screenshot"]["error"] === UPLOAD_ERR_OK) {
    $upload_dir = __DIR__ . "/uploads/payments/";
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $original_name = basename($_FILES["payment_screenshot"]["name"]);
    $extension = strtolower(pathinfo($original_name, PATHINFO_EXTENSION));
    $allowed = ["jpg", "jpeg", "png", "webp", "gif"];

    if (!in_array($extension, $allowed)) {
        echo json_encode(["success" => false, "message" => "Only image files are allowed for payment screenshot"]);
        exit;
    }

    $new_name = "payment_" . time() . "_" . rand(1000, 9999) . "." . $extension;
    $target_path = $upload_dir . $new_name;

    if (move_uploaded_file($_FILES["payment_screenshot"]["tmp_name"], $target_path)) {
        $payment_screenshot = "uploads/payments/" . $new_name;
    }
}

$sql = "INSERT INTO tour_bookings
(tour_name, customer_name, phone, cnic, travel_date, guests, room_count, from_city, to_destination, route_text, hotel_package, hotel_name, vehicle, pickup_point, pickup_address, per_person_price, hotel_price, base_payment, hotel_payment, total_payment, travelers_json, booking_note, payment_type, payment_screenshot, status)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "sssssiissssssssdddddsssss",
    $tour_name,
    $customer_name,
    $phone,
    $cnic,
    $travel_date,
    $guests,
    $room_count,
    $from_city,
    $to_destination,
    $route_text,
    $hotel_package,
    $hotel_name,
    $vehicle,
    $pickup_point,
    $pickup_address,
    $per_person_price,
    $hotel_price,
    $base_payment,
    $hotel_payment,
    $total_payment,
    $travelers_json,
    $booking_note,
    $payment_type,
    $payment_screenshot,
    $status
);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true, "message" => "Tour booking saved successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Insert failed: " . mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
