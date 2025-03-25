<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

session_start(); // Start the session

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "online_platform";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => "Connection failed: " . $conn->connect_error]));
}

if (!isset($_GET['course_id']) || empty($_GET['course_id'])) {
    echo json_encode(['success' => false, 'message' => 'Course ID is required or empty.', 'received_id' => $_GET['course_id']]);
    exit;
}
error_log("Received course_id (before conversion): " . $_GET['course_id']); // Log original value
$courseId = (int) $_GET['course_id']; // Ensure it's an integer
error_log("Received course_id (after conversion): " . $courseId); // Log converted value


$sqlCourse = "SELECT * FROM courses WHERE id = ?";
$stmtCourse = $conn->prepare($sqlCourse);
if (!$stmtCourse) {
    die(json_encode(['success' => false, 'message' => 'SQL error: ' . $conn->error]));
}
$stmtCourse->bind_param("i", $courseId);
$stmtCourse->execute();
$resultCourse = $stmtCourse->get_result();

if (!$resultCourse) {
    die(json_encode(['success' => false, 'message' => 'Query execution failed: ' . $stmtCourse->error]));
}

if ($resultCourse->num_rows > 0) {
    $course = $resultCourse->fetch_assoc();
} else {
    echo json_encode(['success' => false, 'message' => 'Course not found. Debug - Course ID: ' . $courseId]);
    exit;
}


// Fetch Videos for the Course
$sqlVideos = "SELECT id, course_id, video_title, video_url, position FROM course_videos WHERE course_id = ? ORDER BY position ASC";
$stmtVideos = $conn->prepare($sqlVideos);
$stmtVideos->bind_param("i", $courseId);
$stmtVideos->execute();
$resultVideos = $stmtVideos->get_result();

$videos = [];
while ($row = $resultVideos->fetch_assoc()) {
    $videos[] = $row;
}

$stmtCourse->close();
$stmtVideos->close();
$conn->close();

echo json_encode(['success' => true, 'course' => $course, 'videos' => $videos]);
?>
