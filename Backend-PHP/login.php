<?php
include './CORSaccess/corsAccess.php';
session_start();
header("Content-Type: application/json");

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "online_platform";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Handle POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $mail = trim($_POST['mail']);
    $pwd = trim($_POST['password']);

    if (empty($mail) || empty($pwd)) {
        echo json_encode(["success" => false, "message" => "Email and password are required"]);
        exit;
    }

    // Secure query using prepared statements
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $mail);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        // Verify the password
        if (password_verify($pwd, $row['password'])) {
            $_SESSION['session_id'] = session_id();
            $_SESSION['mail'] = $mail;
            $_SESSION['username'] = $row['name'];

            // Set cookies securely
            setcookie("session_id", $_SESSION['session_id'], time() + (86400 * 30), "/", "", false, false);
            setcookie("username", $row['name'], time() + (86400 * 30), "/", "", false, false);
            setcookie("isAdmin", $row['IsAdmin'], time() + (86400 * 30), "/", "", false, false);            

            echo json_encode([
                "success" => true,
                "message" => "Login successful",
                "session_id" => $_SESSION['session_id'],
                "username" => $row['name'],
                "email" => $mail,
                "isAdmin" => $row['IsAdmin']
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid credentials"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "User not found"]);
    }

    $stmt->close();
    $conn->close();
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}
?>
