<?php
session_start();

// Unset all session variables
$_SESSION = array();

// Destroy the session
session_destroy();

// Unset authentication cookies
setcookie("session_id", "", time() - 3600, "/");
setcookie("username", "", time() - 3600, "/");
setcookie("isAdmin", "", time() - 3600, "/");
setcookie("email", "", time() - 3600, "/");

// Return response
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
echo json_encode(["success" => true, "message" => "Logged out successfully"]);
?>
