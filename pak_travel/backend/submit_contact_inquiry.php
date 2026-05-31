<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
include "db.php";
if ($_SERVER["REQUEST_METHOD"] !== "POST") { echo json_encode(["success"=>false,"message"=>"Only POST request allowed"]); exit; }
function post_value($key,$default=""){ return isset($_POST[$key]) ? trim($_POST[$key]) : $default; }
$name=post_value("name"); $phone=post_value("phone"); $email=post_value("email"); $city=post_value("city");
$service=post_value("service"); $destination=post_value("destination"); $travel_date=post_value("travel_date");
$travelers=post_value("travelers"); $budget_range=post_value("budget_range"); $hotel_type=post_value("hotel_type");
$message=post_value("message"); $status=post_value("status","New Inquiry"); $source=post_value("source","Contact Page");
if($name==="" || $phone===""){ echo json_encode(["success"=>false,"message"=>"Name and phone are required"]); exit; }
$sql="INSERT INTO contact_inquiries (name,phone,email,city,service,destination,travel_date,travelers,budget_range,hotel_type,message,status,source) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
$stmt=mysqli_prepare($conn,$sql);
if(!$stmt){ echo json_encode(["success"=>false,"message"=>"Prepare failed: ".mysqli_error($conn)]); exit; }
mysqli_stmt_bind_param($stmt,"sssssssssssss",$name,$phone,$email,$city,$service,$destination,$travel_date,$travelers,$budget_range,$hotel_type,$message,$status,$source);
if(mysqli_stmt_execute($stmt)){ echo json_encode(["success"=>true,"message"=>"Contact inquiry saved successfully"]); }
else{ echo json_encode(["success"=>false,"message"=>"Insert failed: ".mysqli_error($conn)]); }
mysqli_stmt_close($stmt); mysqli_close($conn);
?>
