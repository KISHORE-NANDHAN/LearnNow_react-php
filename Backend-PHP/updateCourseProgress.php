<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "online_platform";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => "Connection failed: " . $conn->connect_error]));
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!isset($data['user_email'], $data['course_id'], $data['video_id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required data.']);
    $conn->close();
    exit;
}

$userEmail = $data['user_email'];
$courseId = $data['course_id'];
$videoId = $data['video_id'];

// Check if a record exists for the user and course
$sqlCheck = "SELECT * FROM course_progress WHERE user_email = ? AND course_id = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("si", $userEmail, $courseId);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();

if ($resultCheck->num_rows > 0) {
    $row = $resultCheck->fetch_assoc();
    $completedVideos = !empty($row['completed_videos']) ? json_decode($row['completed_videos'], true) : [];

    if (!in_array($videoId, $completedVideos)) {
        $completedVideos[] = $videoId;
        $completedVideosJson = json_encode($completedVideos);

        // Get total videos
        $sqlTotalVideos = "SELECT COUNT(*) AS total FROM course_videos WHERE course_id = ?";
        $stmtTotalVideos = $conn->prepare($sqlTotalVideos);
        $stmtTotalVideos->bind_param("i", $courseId);
        $stmtTotalVideos->execute();
        $resultTotalVideos = $stmtTotalVideos->get_result();
        $totalVideos = $resultTotalVideos->fetch_assoc()['total'];
        $stmtTotalVideos->close();

        $progressPercentage = round((count($completedVideos) / $totalVideos) * 100, 2);

        $sqlUpdate = "UPDATE course_progress SET completed_videos = ?, progress_percentage = ?, last_watched_video_id = ? WHERE user_email = ? AND course_id = ?";
        $stmtUpdate = $conn->prepare($sqlUpdate);
        $stmtUpdate->bind_param("siiis", $completedVideosJson, $progressPercentage, $videoId, $userEmail, $courseId);

        if ($stmtUpdate->execute()) {
            echo json_encode(['success' => true, 'message' => 'Course progress updated successfully.', 'progress' => $progressPercentage]);

            // If progress reaches 100%, issue a certificate
            if ($progressPercentage >= 99.9) {
                error_log("Progress reached 100%. Issuing certificate...");
                issueCertificate($conn, $userEmail, $courseId);
            }            
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update course progress: ' . $stmtUpdate->error]);
        }
        $stmtUpdate->close();
    } else {
        echo json_encode(['success' => true, 'message' => 'Video already marked as complete.']);
    }
} else {
    $completedVideos = [$videoId];
    $completedVideosJson = json_encode($completedVideos);

    $sqlTotalVideos = "SELECT COUNT(*) AS total FROM course_videos WHERE course_id = ?";
    $stmtTotalVideos = $conn->prepare($sqlTotalVideos);
    $stmtTotalVideos->bind_param("i", $courseId);
    $stmtTotalVideos->execute();
    $resultTotalVideos = $stmtTotalVideos->get_result();
    $totalVideos = $resultTotalVideos->fetch_assoc()['total'];
    $stmtTotalVideos->close();

    $progressPercentage = round((count($completedVideos) / $totalVideos) * 100, 2);
    
    // Corrected INSERT Statement
    $sqlInsert = "INSERT INTO course_progress (user_email, course_id, completed_videos, progress_percentage, last_watched_video_id) 
                  VALUES (?, ?, ?, ?, ?)";
    $stmtInsert = $conn->prepare($sqlInsert);
    $stmtInsert->bind_param("sisii", $userEmail, $courseId, $completedVideosJson, $progressPercentage, $videoId);

    if ($stmtInsert->execute()) {
        echo json_encode(['success' => true, 'message' => 'Course progress created successfully.', 'progress' => $progressPercentage]);

        // If progress reaches 100%, issue a certificate
        if ($progressPercentage == 100) {
            issueCertificate($conn, $userEmail, $courseId);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create course progress: ' . $stmtInsert->error]);
    }
    $stmtInsert->close();
}

$stmtCheck->close();
$conn->close();

function issueCertificate($conn, $email, $courseId) {
    error_log("Entering issueCertificate function for $email - Course ID: $courseId");

    // Check if a certificate already exists
    $sqlCheckCert = "SELECT * FROM user_certifications WHERE email = ? AND course_id = ?";
    $stmtCheckCert = $conn->prepare($sqlCheckCert);
    $stmtCheckCert->bind_param("si", $email, $courseId);
    $stmtCheckCert->execute();
    $resultCheckCert = $stmtCheckCert->get_result();

    if ($resultCheckCert->num_rows > 0) {
        error_log("Certificate already exists for $email - Course ID: $courseId");
        echo json_encode(['success' => true, 'message' => 'Certificate already issued.']);
        $stmtCheckCert->close();
        return;
    }
    $stmtCheckCert->close();

    // Fetch Course Name
    $sqlCourse = "SELECT title FROM courses WHERE id = ?";
    $stmtCourse = $conn->prepare($sqlCourse);
    $stmtCourse->bind_param("i", $courseId);
    $stmtCourse->execute();
    $resultCourse = $stmtCourse->get_result();
    
    if ($resultCourse->num_rows === 0) {
        error_log("Course ID: $courseId not found in courses table.");
        echo json_encode(['success' => false, 'message' => 'Course not found.']);
        return;
    }

    $courseName = $resultCourse->fetch_assoc()['title'];
    $stmtCourse->close();

    // Generate a unique certificate credential
    $certificateCredential = hash('sha256', $email . $courseId . time());
    $issuedAt = date('Y-m-d H:i:s');

    // Insert certificate details into database
    $sqlCert = "INSERT INTO user_certifications (email, course_id, Course_Name, Certificate_Credential, issued_at) 
                VALUES (?, ?, ?, ?, ?)";
    $stmtCert = $conn->prepare($sqlCert);
    $stmtCert->bind_param("sisss", $email, $courseId, $courseName, $certificateCredential, $issuedAt);

    if ($stmtCert->execute()) {
        error_log("Certificate issued successfully for $email - Course ID: $courseId");
        echo json_encode(['success' => true, 'message' => 'Certificate issued successfully.', 'credential' => $certificateCredential]);
    } else {
        error_log("Failed to issue certificate for $email - Course ID: $courseId. Error: " . $stmtCert->error);
        echo json_encode(['success' => false, 'message' => 'Failed to issue certificate: ' . $stmtCert->error]);
    }
    $stmtCert->close();
}
?>
