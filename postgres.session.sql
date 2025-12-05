
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    mail_id VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
    department_id INT DEFAULT 1 REFERENCES departments(department_id)
);

CREATE TABLE admin_departments (
    admin_id INT REFERENCES users(user_id),
    department_id INT REFERENCES departments(department_id),
    PRIMARY KEY(admin_id, department_id)
);

INSERT INTO users (mail_id, password, role, department_id)
VALUES ('udhayakala@twave.co.jp', 'Udhaya@12', 'admin', 2);  -- HR (example)

INSERT INTO departments (department_name) VALUES ('General');     -- id = 1
INSERT INTO departments (department_name) VALUES ('HR');          -- id = 2
INSERT INTO departments (department_name) VALUES ('IT');          -- id = 3
INSERT INTO departments (department_name) VALUES ('Operations');  -- id = 4
DROP TABLE admin_departments;
DROP TABLE users;
 Drop TABLE departments;

CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO departments (department_name) VALUES ('General');     -- id = 1
INSERT INTO departments (department_name) VALUES ('HR');          -- id = 2
INSERT INTO departments (department_name) VALUES ('IT');          -- id = 3
INSERT INTO departments (department_name) VALUES ('Operations');  -- id = 4

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email_id VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
    department_id INT NOT NULL DEFAULT 1 REFERENCES departments(department_id)
);

CREATE TABLE admin_departments (
    admin_dep_id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES departments(department_id),
    UNIQUE (admin_id, department_id)
);

INSERT INTO users (email_id, password, role, department_id)
VALUES ('udhayakala@twave.co.jp', 'Udhaya@12', 'admin', 2);

INSERT INTO users (email_id, password, role)
VALUES ('shalini@twave.co.jp', 'shalini03', 'user');
INSERT INTO users (email_id, password, role, department_id)
VALUES ('yuva@twave.co.jp', 'yuva123', 'user', 3);

DROP TABLE admin_departments;
DROP TABLE users;
DROP TABLE departments;


-- First, create the department table
-- Create the department table
CREATE TABLE department (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the user table (using 'users' instead of 'user' since 'user' is a reserved keyword)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email_id VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email_id);

-- Create a junction table for the many-to-many relationship
CREATE TABLE user_department (
    user_department_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    department_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE CASCADE,
    CONSTRAINT unique_user_department UNIQUE (user_id, department_id)
);

-- Create indexes for performance
CREATE INDEX idx_user_department_user ON user_department(user_id);
CREATE INDEX idx_user_department_dept ON user_department(department_id);

-- Insert initial departments (including 'General' department)
INSERT INTO department (department_name) VALUES
('General'),
('IT'),
('HR'),
('Finance'),
('Marketing'),
('Operations'),
('Sales')
RETURNING department_id, department_name;

-- Insert users
-- Note: Use proper password hashing in production (bcrypt, etc.)
INSERT INTO users (email_id, password, role) VALUES ('udhayakala@twave.co.jp', 'Udhaya@12', 'admin');


-- -------- USERS (15) --------
INSERT INTO users (email_id, password, role) VALUES ('shalini@twave.co.jp', 'shalini03', 'user');
INSERT INTO users (email_id, password, role) VALUES ('jackulin@twave.co.jp','Jack@28/10', 'user');
INSERT INTO users (email_id, password, role) VALUES ('yuvashree@twave.co.jp', 'yuva@123', 'user');
INSERT INTO users (email_id, password, role) VALUES ('jayapratha@twave.co.jp', 'Jayapratha@2004', 'user');
RETURNING user_id, email_id, role;

-- Assign General department to all users (primary for all)
-- First, get the General department ID
WITH general_dept AS (
    SELECT department_id FROM department WHERE department_name = 'General'
)
INSERT INTO user_department (user_id, department_id, is_primary)
SELECT u.user_id, g.department_id, TRUE
FROM users u
CROSS JOIN general_dept g
RETURNING user_department_id, user_id, department_id;

-- Assign additional departments to admins (multiple departments)
-- Admin1 gets IT and HR departments
INSERT INTO user_department (user_id, department_id, is_primary)
SELECT u.user_id, d.department_id, FALSE
FROM users u
CROSS JOIN department d
WHERE u.email_id = 'udhayakala@twave.co.jp' 
AND d.department_name IN ('IT', 'HR')
ON CONFLICT (user_id, department_id) DO NOTHING
RETURNING user_department_id, user_id, department_id;
