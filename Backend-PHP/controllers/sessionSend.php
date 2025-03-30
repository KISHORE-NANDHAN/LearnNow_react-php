<?php
session_start();

function isSessionValid() {
    // Debugging: Print session data
    error_log("Session Data: " . print_r($_SESSION, true));

    if (
        isset($_SESSION['session_id'], $_SESSION['mail']) &&
        isset($_COOKIE['session_id']) &&
        $_SESSION['session_id'] === $_COOKIE['session_id']
    ) {
        return $_SESSION['mail'];  // Ensure returning 'mail'
    }

    error_log("Session validation failed.");
    return null;
}


?>
