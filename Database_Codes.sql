CREATE DATABASE IF NOT EXISTS online_platform;
USE online_platform;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    password VARCHAR(255) NOT NULL,
    drno VARCHAR(255) DEFAULT 'required',
    street VARCHAR(255) DEFAULT 'required',
    pincode VARCHAR(10) DEFAULT 'required',
    city VARCHAR(255) DEFAULT 'required',
    state VARCHAR(255) DEFAULT 'required'
);


