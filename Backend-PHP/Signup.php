<?php

// Allow CORS requests from frontend
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow only frontend domain
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true"); // Required for cookies/auth
header("Content-Type: application/json");

// Handle preflight (OPTIONS request)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$username = "root";  
$password = "";      
$dbname = "online_platform";  

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

// Retrieve form data safely
$data = json_decode(file_get_contents("php://input"), true);

$name = $data["uname"] ?? "";
$email = $data["mail"] ?? "";
$mobile = $data["phno"] ?? "";
$dob = $data["date"] ?? "";
$gender = $data["gender"] ?? "";
$password = $data["password"] ?? "";

// Validate required fields
if (empty($name) || empty($email) || empty($mobile) || empty($dob) || empty($gender) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit();
}

// Hash password for security
$pwd = password_hash($password, PASSWORD_DEFAULT);

// Prepare SQL statement to insert into users table
$sql = "INSERT INTO users (name, email, mobile, dob, gender, password, drno, street, pincode, city, state) 
        VALUES (?, ?, ?, ?, ?, ?, 'required', 'required', 'required', 'required', 'required')";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssss", $name, $email, $mobile, $dob, $gender, $pwd);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Signup successful"]);
} else {
    echo json_encode(["status" => "error", "message" => "Signup failed: " . $stmt->error]);
}

// Close connections
$stmt->close();
$conn->close();

?>
