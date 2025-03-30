CREATE DATABASE online_platform;
USE online_platform;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pfp LONGBLOB,
    email VARCHAR(255) NOT NULL UNIQUE, 
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

-- Courses Table
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    instructor_name VARCHAR(255) NOT NULL,
    instructor_email VARCHAR(255) NOT NULL, 
    category VARCHAR(100),
    level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    is_paid TINYINT(1) DEFAULT 0,
    thumbnail_url VARCHAR(500),
    total_videos INT DEFAULT 0,
    total_duration INT DEFAULT 0, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course Videos Table
CREATE TABLE course_videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    video_title VARCHAR(255) NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    duration INT NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Course Progress Table
CREATE TABLE course_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    course_id INT NOT NULL,
    completed_videos JSON DEFAULT '[]',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    last_watched_video_id INT,
    completed TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Course Reviews Table
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

-- User Certifications Table
CREATE TABLE user_certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    course_id INT NOT NULL,
    Course_Name VARCHAR(255) NOT NULL,
    Certificate_Credential VARCHAR(500) NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);


-- Insert sample courses
INSERT INTO courses (title, description, instructor_name, instructor_email, category, level, price, is_paid, thumbnail_url, total_videos, total_duration) VALUES
('Python for Beginners', 'Learn Python programming from scratch.', 'John Doe', 'johndoe@example.com', 'Programming', 'Beginner', 0.00, FALSE, 'https://webandcrafts.com/_next/image?url=https%3A%2F%2Fadmin.wac.co%2Fuploads%2FFeatures_Of_Python_1_f4ccd6d9f7.jpg&w=4500&q=90', 20, 300),
('Advanced C Programming', 'Deep dive into C programming with hands-on projects.', 'Jane Smith', 'janesmith@example.com', 'Programming', 'Advanced', 49.99, TRUE, 'https://media.licdn.com/dms/image/v2/D4D12AQGvWHFDSOhMCg/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1679804058550?e=2147483647&v=beta&t=tacQqfGAOEZUhq-duep5_i1sRR_wgmq3W-QEbkY2qDI', 35, 450),
('Java Masterclass', 'Comprehensive Java course covering OOP, multithreading, and more.', 'Michael Brown', 'michael@example.com', 'Programming', 'Intermediate', 79.99, TRUE, 'https://miro.medium.com/v2/resize:fit:600/1*fOdb_ET1sOd4uZStK4E8HA.jpeg', 40, 600),
('MERN Stack Development', 'Full-stack web development using MongoDB, Express, React, and Node.js.', 'Sarah Johnson', 'sarah@example.com', 'Web Development', 'Intermediate', 99.99, TRUE, 'https://jaro-website.s3.ap-south-1.amazonaws.com/2024/03/Features-of-Mern-stack-development-services-You-Should-Know-768x397-1.png', 50, 720),
('MEAN Stack Guide', 'Master MongoDB, Express, Angular, and Node.js.', 'Robert Wilson', 'robert@example.com', 'Web Development', 'Intermediate', 89.99, TRUE, 'https://www.mindinventory.com/blog/wp-content/uploads/2023/02/advantages-of-choosing-MEAN-stack-for-web-development-project.webp', 45, 680),
('React.js Complete Course', 'Master React with hooks, Redux, and real-world projects.', 'Emma Davis', 'emma@example.com', 'Frontend Development', 'Intermediate', 59.99, TRUE, 'https://www.curotec.com/wp-content/uploads/2024/10/top-uses-for-react-e1729004277386.jpg?w=1024', 30, 500),
('Mobile App Development', 'Build Android and iOS apps using React Native and Flutter.', 'Chris Lee', 'chris@example.com', 'Mobile Development', 'Advanced', 129.99, TRUE, 'https://miro.medium.com/v2/resize:fit:1400/0*LpYMQ2UKZOvUB-JO', 60, 900),
('Data Science with Python', 'Learn data science concepts including Pandas, NumPy, and Scikit-Learn.', 'Alice Carter', 'alice@example.com', 'Data Science', 'Intermediate', 79.99, TRUE, 'https://i0.wp.com/krct.ac.in/blog/wp-content/uploads/2024/03/Data-Science.jpg?fit=1721%2C1076&ssl=1', 40, 700),
('Machine Learning A-Z', 'Comprehensive guide to ML concepts, algorithms, and real-world projects.', 'David Miller', 'david@example.com', 'Artificial Intelligence', 'Advanced', 129.99, TRUE, 'https://static.vecteezy.com/system/resources/thumbnails/007/136/275/small_2x/machine-learning-modern-computer-technologies-concept-artificial-intelligence-ai-photo.jpg', 55, 850),
('Cloud Computing with AWS', 'Master AWS services including EC2, S3, Lambda, and CloudFormation.', 'Sophia White', 'sophia@example.com', 'Cloud Computing', 'Intermediate', 99.99, TRUE, 'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_aws.jpg', 50, 780),
('Cybersecurity Fundamentals', 'Learn about ethical hacking, penetration testing, and network security.', 'Daniel Moore', 'daniel@example.com', 'Cybersecurity', 'Beginner', 69.99, TRUE, 'https://www.shutterstock.com/image-photo/glowing-digital-lock-surrounded-by-600nw-2517566697.jpg', 35, 600),
('DevOps with Docker & Kubernetes', 'Master CI/CD pipelines, containerization, and orchestration.', 'Olivia Taylor', 'olivia@example.com', 'DevOps', 'Advanced', 119.99, TRUE, 'https://devopedia.org/images/article/54/7602.1513404277.png', 45, 720),
('Blockchain and Cryptocurrency', 'Understand blockchain technology and how cryptocurrencies work.', 'Liam Johnson', 'liam@example.com', 'Blockchain', 'Intermediate', 109.99, TRUE, 'https://static-bestcolleges.tosshub.com/2025/News/Fw6PE2uoAw6KjxXrJ8UZvKVVpgzBFcfxL28WroKR.jpg', 40, 650),
('Full Stack Web Development', 'Master frontend and backend technologies using JavaScript.', 'William Brown', 'william@example.com', 'Web Development', 'Advanced', 149.99, TRUE, 'https://d2ms8rpfqc4h24.cloudfront.net/Guide_to_Full_Stack_Development_000eb0b2d0.jpg', 60, 900),
('Flutter Mobile Development', 'Build cross-platform mobile apps using Flutter and Dart.', 'Ella Wilson', 'ella@example.com', 'Mobile Development', 'Intermediate', 89.99, TRUE, 'https://www.daily.co/blog/content/images/2023/07/Flutter-feature.png', 50, 750),
('Game Development with Unity', 'Create 2D and 3D games using Unity and C#.', 'Lucas Martinez', 'lucas@example.com', 'Game Development', 'Advanced', 139.99, TRUE, 'https://varteq.com/wp-content/uploads/2019/05/unity-3-680x360.jpg', 55, 850),
('SQL & Database Management', 'Master SQL queries, database design, and optimization.', 'Emma Robinson', 'emma@example.com', 'Database Management', 'Beginner', 49.99, TRUE, 'https://www.seedinfotech.com/wp-content/uploads/2022/11/SQL.jpg', 30, 500),
('AI with TensorFlow & PyTorch', 'Deep learning with TensorFlow and PyTorch.', 'James Anderson', 'james@example.com', 'Artificial Intelligence', 'Advanced', 159.99, TRUE, 'https://assets.aboutamazon.com/dims4/default/e73bc85/2147483647/strip/true/crop/4093x2304+7+0/resize/1240x698!/quality/90/?url=https%3A%2F%2Famazon-blogs-brightspot.s3.amazonaws.com%2F36%2F59%2Feba4adcc4f88a972b5639ed1dde0%2Fadobestock-712831308.jpeg', 65, 1000),
('UI/UX Design with Figma', 'Learn UI/UX principles, prototyping, and wireframing.', 'Mia Garcia', 'mia@example.com', 'Design', 'Beginner', 39.99, TRUE, 'https://cloud.z.com/vn/wp-content/uploads/2024/07/figma.png', 25, 400),
('Ethical Hacking Masterclass', 'Learn penetration testing and cybersecurity techniques.', 'Ethan Thomas', 'ethan@example.com', 'Cybersecurity', 'Advanced', 149.99, TRUE, 'https://www.shutterstock.com/image-illustration/man-hacker-cyber-criminal-shadow-260nw-2488932779.jpg', 50, 780)
;

INSERT INTO course_videos (course_id, video_title, video_url, position)
VALUES 
(1, 'Python Introduction', 'https://www.youtube.com/watch?v=GmdGv5ndX54', 1),
(1, 'Python Setup and Installation', 'https://www.youtube.com/watch?v=HFKKyr9yrGE', 2),
(1, 'Python Basics - Variables and Data Types', 'https://www.youtube.com/watch?v=ubpKGsHWSR8', 3),
(1, 'Python Control Flow - If Else Statements', 'https://www.youtube.com/watch?v=k_GXj1T3KSA', 4),
(1, 'Python Loops - For and While', 'https://www.youtube.com/watch?v=FLoNn_3nNjA', 5),
(1, 'Python Functions and Scope', 'https://www.youtube.com/watch?v=14QZlmRXQDo', 6),
(1, 'Python Lists and Tuples', 'https://www.youtube.com/watch?v=kUTj94Vfndg', 7),
(1, 'Python Dictionaries and Sets', 'https://www.youtube.com/watch?v=TH6a9q9YziA', 8),
(1, 'Python Object-Oriented Programming', 'https://www.youtube.com/watch?v=-AXV5uSpHlQ', 9),
(1, 'Python File Handling', 'https://www.youtube.com/watch?v=Nwh-DQKqKZg', 10),
(1, 'Python Error Handling and Debugging', 'https://www.youtube.com/watch?v=fHKPQEVCX-s', 11);