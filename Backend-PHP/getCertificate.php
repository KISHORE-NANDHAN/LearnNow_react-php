<?php

include './controllers/sessionSend.php';
include './DbConnect/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");


$email = isSessionValid();

if (!$email) {
    echo json_encode(["error" => "Unauthorized access","email" => $email]);
    exit();
}

// Prevent SQL injection by using prepared statements
$stmt = $conn->prepare("
    SELECT uc.id, u.Name, uc.course_id, uc.Course_Name, uc.Certificate_Credential, uc.issued_at 
    FROM user_certifications AS uc
    JOIN users AS u ON uc.email = u.email
    WHERE uc.email = ?
");

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $certificates = [];

    while ($row = $result->fetch_assoc()) {
        $certificates[] = $row;
    }

    echo json_encode($certificates);
} else {
    echo json_encode(["message" => "No certifications found."]);
}

// Close resources
$stmt->close();
$conn->close();
?>
