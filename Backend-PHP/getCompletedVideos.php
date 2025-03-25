<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "online_platform";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => "Connection failed: " . $conn->connect_error]));
}

$userEmail = $_GET['user_email'];
$courseId = $_GET['course_id'];

$sql = "SELECT completed_videos FROM course_progress WHERE user_email = ? AND course_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $userEmail, $courseId);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();

echo json_encode(['success' => true, 'completedVideos' => json_decode($data['completed_videos'] ?? '[]')]);

$conn->close();
?>
