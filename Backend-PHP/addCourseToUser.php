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
?>
<?php
function isSessionValid() {
    if (isset($_SESSION['session_id']) && isset($_COOKIE['session_id']) && $_SESSION['session_id'] === $_COOKIE['session_id']) {
        return $_SESSION['mail']; // Return user email
    }
    return null;
}
?>
<?php

session_start();
header("Content-Type: application/json");


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "online_platform";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Get user email from session validation
$user_email = isSessionValid();

if (!$user_email) {
    echo json_encode(["success" => false, "message" => "User not authenticated."]);
    exit;
}

// Get request data
$input = json_decode(file_get_contents('php://input'), true);
$course_id = $input['course_id'] ?? null;

if (!$course_id) {
    echo json_encode(["success" => false, "message" => "Missing course ID."]);
    exit;
}

// Check if the user is already enrolled
$checkSql = "SELECT * FROM course_progress WHERE user_email = ? AND course_id = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("si", $user_email, $course_id);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "You are already enrolled in this course."]);
    exit;
}

// Insert into course_progress
$insertSql = "INSERT INTO course_progress (user_email, course_id, completed_videos, progress_percentage, last_watched_video_id, completed) VALUES (?, ?, 0, 0.00, NULL, 0)";
$insertStmt = $conn->prepare($insertSql);
$insertStmt->bind_param("si", $user_email, $course_id);

if ($insertStmt->execute()) {
    echo json_encode(["success" => true, "message" => "Course added to progress successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to add course: " . $conn->error]);
}

$conn->close();
?>
