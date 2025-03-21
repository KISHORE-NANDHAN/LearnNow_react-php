<?php
include './CORSaccess/corsAccess.php';

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
