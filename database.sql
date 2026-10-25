-- OnTeam Enterprise ERP Database Schema

CREATE DATABASE IF NOT EXISTS onteam_db;
USE onteam_db;

-- 1. Companies Table (Managed by Super-Alpha-Admin)
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    industry VARCHAR(100),
    status ENUM('Active', 'Suspended') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table (Multi-Tier Hierarchy & RBAC)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- In production, use bcrypt hashes
    role ENUM(
        'Super-Alpha-Admin', 
        'Company-Super-Admin', 
        'Department-Head', 
        'Shift-Head', 
        'Worker'
    ) NOT NULL,
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 3. Machines Table (For Machine Management)
CREATE TABLE IF NOT EXISTS machines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    machine_name VARCHAR(100) NOT NULL,
    status ENUM('Operational', 'Maintenance', 'Idle', 'Fault') DEFAULT 'Operational',
    health_score INT DEFAULT 100,
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 4. Tasks & Production Table
CREATE TABLE IF NOT EXISTS production_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    title VARCHAR(200) NOT NULL,
    assigned_worker_id INT,
    status ENUM('Assigned', 'In Progress', 'Completed', 'Dispatched') DEFAULT 'Assigned',
    target_date DATE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_worker_id) REFERENCES users(id) ON DELETE SET NULL
);
