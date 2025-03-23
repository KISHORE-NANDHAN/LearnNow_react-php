<?php
include '../CORSaccess/corsAccess.php';
session_start();
header("Content-Type: application/json");

// Check if session is set
if (isset($_SESSION['session_id']) && isset($_COOKIE['session_id']) && $_SESSION['session_id'] === $_COOKIE['session_id']) {
    echo json_encode([
        "success" => true,
        "session_id" => $_SESSION['session_id'],
        "username" => $_SESSION['username'],
        "email" => $_SESSION['mail'],
        "isAdmin" => $_COOKIE['isAdmin']
    ]);
} else {
    // Destroy invalid session
    session_destroy();
    setcookie("session_id", "", time() - 3600, "/", "", false, true);
    setcookie("username", "", time() - 3600, "/", "", false, true);
    setcookie("isAdmin", "", time() - 3600, "/", "", false, true);

    echo json_encode(["success" => false, "message" => "Session expired. Please log in again."]);
}
?>
