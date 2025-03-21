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