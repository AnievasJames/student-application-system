CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') DEFAULT 'student'
);

CREATE TABLE profiles (
  user_id INT PRIMARY KEY,
  name VARCHAR(255),
  bio TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
