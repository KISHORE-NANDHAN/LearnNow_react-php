CREATE DATABASE online_platform;
USE online_platform;

-- Table to store user details
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE, -- Ensuring email is unique
    mobile VARCHAR(15) NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    password VARCHAR(255) NOT NULL,
    drno VARCHAR(255),
    street VARCHAR(255),
    pincode VARCHAR(10),
    city VARCHAR(255),
    state VARCHAR(255),
    IsAdmin TINYINT(1) NOT NULL DEFAULT 0
);

-- Table to store course details
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    instructor_name VARCHAR(255) NOT NULL,
    instructor_email VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    is_paid BOOLEAN DEFAULT FALSE,
    thumbnail_url VARCHAR(500),
    total_videos INT DEFAULT 0,
    total_duration INT DEFAULT 0, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Table to store course videos
CREATE TABLE course_videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    video_title VARCHAR(255) NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    duration INT NOT NULL, -- in minutes
    position INT NOT NULL, -- ordering of videos in course
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Table to store course progress of users
CREATE TABLE course_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    course_id INT NOT NULL,
    completed_videos INT DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    last_watched_video_id INT,
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Table to store course reviews and ratings
CREATE TABLE course_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    course_id INT NOT NULL,
    rating DECIMAL(3,2) CHECK (rating BETWEEN 0 AND 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Table to store user certifications after completing a course
CREATE TABLE user_certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    course_id INT NOT NULL,
    certificate_url VARCHAR(500) NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Insert sample courses
INSERT INTO courses (title, description, instructor_name, instructor_email, category, level, price, is_paid, thumbnail_url, total_videos, total_duration) VALUES
('Python for Beginners', 'Learn Python programming from scratch.', 'John Doe', 'johndoe@example.com', 'Programming', 'Beginner', 0.00, FALSE, 'images/python.jpg', 20, 300),
('Advanced C Programming', 'Deep dive into C programming with hands-on projects.', 'Jane Smith', 'janesmith@example.com', 'Programming', 'Advanced', 49.99, TRUE, 'images/c.jpg', 35, 450),
('Java Masterclass', 'Comprehensive Java course covering OOP, multithreading, and more.', 'Michael Brown', 'michael@example.com', 'Programming', 'Intermediate', 79.99, TRUE, 'images/java.jpg', 40, 600),
('MERN Stack Development', 'Full-stack web development using MongoDB, Express, React, and Node.js.', 'Sarah Johnson', 'sarah@example.com', 'Web Development', 'Intermediate', 99.99, TRUE, 'images/mern.jpg', 50, 720),
('MEAN Stack Guide', 'Master MongoDB, Express, Angular, and Node.js.', 'Robert Wilson', 'robert@example.com', 'Web Development', 'Intermediate', 89.99, TRUE, 'images/mean.jpg', 45, 680),
('React.js Complete Course', 'Master React with hooks, Redux, and real-world projects.', 'Emma Davis', 'emma@example.com', 'Frontend Development', 'Intermediate', 59.99, TRUE, 'images/react.jpg', 30, 500),
('Mobile App Development', 'Build Android and iOS apps using React Native and Flutter.', 'Chris Lee', 'chris@example.com', 'Mobile Development', 'Advanced', 129.99, TRUE, 'images/mobile.jpg', 60, 900),
('Data Science with Python', 'Learn data science concepts including Pandas, NumPy, and Scikit-Learn.', 'Alice Carter', 'alice@example.com', 'Data Science', 'Intermediate', 79.99, TRUE, 'images/datascience.jpg', 40, 700),
('Machine Learning A-Z', 'Comprehensive guide to ML concepts, algorithms, and real-world projects.', 'David Miller', 'david@example.com', 'Artificial Intelligence', 'Advanced', 129.99, TRUE, 'images/ml.jpg', 55, 850),
('Cloud Computing with AWS', 'Master AWS services including EC2, S3, Lambda, and CloudFormation.', 'Sophia White', 'sophia@example.com', 'Cloud Computing', 'Intermediate', 99.99, TRUE, 'images/aws.jpg', 50, 780),
('Cybersecurity Fundamentals', 'Learn about ethical hacking, penetration testing, and network security.', 'Daniel Moore', 'daniel@example.com', 'Cybersecurity', 'Beginner', 69.99, TRUE, 'images/cybersecurity.jpg', 35, 600),
('DevOps with Docker & Kubernetes', 'Master CI/CD pipelines, containerization, and orchestration.', 'Olivia Taylor', 'olivia@example.com', 'DevOps', 'Advanced', 119.99, TRUE, 'images/devops.jpg', 45, 720),
('Blockchain and Cryptocurrency', 'Understand blockchain technology and how cryptocurrencies work.', 'Liam Johnson', 'liam@example.com', 'Blockchain', 'Intermediate', 109.99, TRUE, 'images/blockchain.jpg', 40, 650),
('Full Stack Web Development', 'Master frontend and backend technologies using JavaScript.', 'William Brown', 'william@example.com', 'Web Development', 'Advanced', 149.99, TRUE, 'images/fullstack.jpg', 60, 900),
('Flutter Mobile Development', 'Build cross-platform mobile apps using Flutter and Dart.', 'Ella Wilson', 'ella@example.com', 'Mobile Development', 'Intermediate', 89.99, TRUE, 'images/flutter.jpg', 50, 750),
('Game Development with Unity', 'Create 2D and 3D games using Unity and C#.', 'Lucas Martinez', 'lucas@example.com', 'Game Development', 'Advanced', 139.99, TRUE, 'images/unity.jpg', 55, 850),
('SQL & Database Management', 'Master SQL queries, database design, and optimization.', 'Emma Robinson', 'emma@example.com', 'Database Management', 'Beginner', 49.99, TRUE, 'images/sql.jpg', 30, 500),
('AI with TensorFlow & PyTorch', 'Deep learning with TensorFlow and PyTorch.', 'James Anderson', 'james@example.com', 'Artificial Intelligence', 'Advanced', 159.99, TRUE, 'images/ai.jpg', 65, 1000),
('UI/UX Design with Figma', 'Learn UI/UX principles, prototyping, and wireframing.', 'Mia Garcia', 'mia@example.com', 'Design', 'Beginner', 39.99, TRUE, 'images/uiux.jpg', 25, 400),
('Ethical Hacking Masterclass', 'Learn penetration testing and cybersecurity techniques.', 'Ethan Thomas', 'ethan@example.com', 'Cybersecurity', 'Advanced', 149.99, TRUE, 'images/hacking.jpg', 50, 780)
;
