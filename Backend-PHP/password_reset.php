<?php
session_start(); // Start PHP session

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

// Database connection
$servername = "localhost";
$username = "root";  // Change if you have a different MySQL user
$password = "";      // Change if you have a password
$dbname = "online_platform";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'];

if ($action === "send_otp") {
    $email = $data['email'];
    $otp = rand(100000, 999999); // Generate 6-digit OTP
    $expiresAt = time() + (3 * 60); // OTP expires in 3 minutes

    // Store OTP in session instead of database
    $_SESSION['otp'] = $otp;
    $_SESSION['otp_expires'] = $expiresAt;
    $_SESSION['otp_email'] = $email;

    sendOTPEmail($email, $otp);
    echo json_encode(["success" => true, "message" => "OTP sent successfully"]);
}

if ($action === "verify_otp") {
    $email = $data['email'];
    $otp = $data['otp'];

    // Check if OTP matches and is not expired
    if (isset($_SESSION['otp']) && isset($_SESSION['otp_expires']) && $_SESSION['otp_email'] === $email) {
        if (time() <= $_SESSION['otp_expires'] && $_SESSION['otp'] == $otp) {
            echo json_encode(["success" => true, "message" => "OTP verified"]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid or expired OTP"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "OTP not found"]);
    }
}

if ($action === "reset_password") {
    $email = $data['email'];
    $newPassword = password_hash($data['newPassword'], PASSWORD_DEFAULT);

    // Ensure OTP was verified before allowing reset
    if (!isset($_SESSION['otp']) || $_SESSION['otp_email'] !== $email) {
        echo json_encode(["success" => false, "message" => "OTP verification required"]);
        exit;
    }

    $conn = getDBConnection();
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
    $stmt->bind_param("ss", $newPassword, $email);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        // Clear OTP from session after successful reset
        unset($_SESSION['otp']);
        unset($_SESSION['otp_expires']);
        unset($_SESSION['otp_email']);

        echo json_encode(["success" => true, "message" => "Password reset successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to reset password"]);
    }
}

function sendOTPEmail($email, $otp) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Your SMTP server
        $mail->SMTPAuth = true;
        $mail->Username = 'ash.naruto.uzumaki@gmail.com'; // Your email
        $mail->Password = 'ynuu bcnc olid ydan'; // Your email password
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('ash.naruto.uzumaki@gmail.com', 'LearnNow Support');
        $mail->addAddress($email);

        $mail->Subject = 'Your OTP Code';
        $mail->Body = "Your OTP code is: $otp. It will expire in 3 minutes.";

        $mail->send();
    } catch (Exception $e) {
        error_log("Email error: " . $mail->ErrorInfo);
    }
}
?>
