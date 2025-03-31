<?php
include './CORSaccess/corsAccess.php';
include './DbConnect/db.php';
include './controllers/sessionSend.php';

header("Content-Type: application/json");

$email = isSessionValid();
if (!$email) {
    echo json_encode(["success" => false, "message" => "User not authenticated.", "debug" => $_SESSION]);
    exit;
}

// Check if profile picture is uploaded
$profilePicData = null;
if (!empty($_FILES['pfp']['tmp_name'])) {
    $profilePicData = file_get_contents($_FILES['pfp']['tmp_name']);
}

// Get input data from request
$name = $_POST['name'] ?? null;
$mobile = $_POST['mobile'] ?? null;
$dob = $_POST['dob'] ?? null;
$gender = $_POST['gender'] ?? null;
$drno = $_POST['drno'] ?? null;
$street = $_POST['street'] ?? null;
$pincode = $_POST['pincode'] ?? null;
$city = $_POST['city'] ?? null;
$state = $_POST['state'] ?? null;

if ($profilePicData) {
    $sql = "UPDATE users SET name=?, mobile=?, dob=?, gender=?, drno=?, street=?, pincode=?, city=?, state=?, pfp=? WHERE email=?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "SQL Prepare Error: " . $conn->error]);
        exit;
    }

    // Ensure correct number of parameters
    $stmt->bind_param("sssssssssss", $name, $mobile, $dob, $gender, $drno, $street, $pincode, $city, $state, $profilePicData, $email);
} else {
    $sql = "UPDATE users SET name=?, mobile=?, dob=?, gender=?, drno=?, street=?, pincode=?, city=?, state=? WHERE email=?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "SQL Prepare Error: " . $conn->error]);
        exit;
    }

    // Ensure correct number of parameters
    $stmt->bind_param("ssssssssss", $name, $mobile, $dob, $gender, $drno, $street, $pincode, $city, $state, $email);
}

// Execute the query
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Profile updated successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating profile: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
