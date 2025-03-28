<?php
function isSessionValid() {
    if (isset($_SESSION['session_id']) && isset($_COOKIE['session_id']) && $_SESSION['session_id'] === $_COOKIE['session_id']) {
        return $_SESSION['mail']; 
    }
    return null;
}

?>