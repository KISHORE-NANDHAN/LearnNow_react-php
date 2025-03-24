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
        return $_SESSION['mail']; 
    }
    return null;
}
?>
<?php
session_start();
header('Content-Type: application/json');

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "online_platform";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => "Connection failed: " . $conn->connect_error]));
}

$userEmail = isSessionValid();



// Query to fetch courses the user is enrolled in
$sql = "
    SELECT c.id, c.title, c.description, c.instructor_name, c.category, c.level, 
           c.price, c.is_paid, c.thumbnail_url, c.total_videos, c.total_duration, 
           cp.completed_videos, cp.progress_percentage, cp.completed
    FROM course_progress cp
    JOIN courses c ON cp.course_id = c.id
    WHERE cp.user_email = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $userEmail);
$stmt->execute();
$result = $stmt->get_result();

$courses = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $courses[] = $row;
    }
}

echo json_encode(['success' => true, 'courses' => $courses]);

$stmt->close();
$conn->close();
?>
