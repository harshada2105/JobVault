DROP DATABASE IF EXISTS jobvault;
CREATE DATABASE jobvault CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jobvault;

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE revoked_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_revoked_tokens_expires_at (expires_at)
) ENGINE=InnoDB;

CREATE TABLE companies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    website VARCHAR(255),
    location VARCHAR(120),
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_companies_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_companies_user_name (user_id, name),
    INDEX idx_companies_location (location)
) ENGINE=InnoDB;

CREATE TABLE contacts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(30),
    role_title VARCHAR(120),
    linkedin_url VARCHAR(255),
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_contacts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_contacts_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE RESTRICT,
    INDEX idx_contacts_user_name (user_id, name),
    INDEX idx_contacts_company (company_id)
) ENGINE=InnoDB;

CREATE TABLE job_applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    job_title VARCHAR(160) NOT NULL,
    job_url VARCHAR(255),
    employment_type ENUM('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'REMOTE') NOT NULL,
    location VARCHAR(120),
    salary_range VARCHAR(80),
    status ENUM('SAVED', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN') NOT NULL DEFAULT 'SAVED',
    priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    applied_date DATE,
    deadline_date DATE,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_applications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_applications_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE RESTRICT,
    INDEX idx_applications_user_status (user_id, status),
    INDEX idx_applications_user_priority (user_id, priority),
    INDEX idx_applications_company (company_id),
    INDEX idx_applications_dates (applied_date, deadline_date)
) ENGINE=InnoDB;

CREATE TABLE application_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    old_status ENUM('SAVED', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'),
    new_status ENUM('SAVED', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN') NOT NULL,
    changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note TEXT,
    CONSTRAINT fk_status_history_application FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE,
    INDEX idx_status_history_application (application_id),
    INDEX idx_status_history_changed_at (changed_at)
) ENGINE=InnoDB;

CREATE TABLE interviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    application_id BIGINT NOT NULL,
    interview_type ENUM('PHONE', 'VIDEO', 'TECHNICAL', 'HR', 'ONSITE') NOT NULL,
    scheduled_at DATETIME NOT NULL,
    interviewer_name VARCHAR(120),
    meeting_link VARCHAR(255),
    location VARCHAR(120),
    status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED') NOT NULL DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_interviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_interviews_application FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE,
    INDEX idx_interviews_user_status (user_id, status),
    INDEX idx_interviews_application (application_id),
    INDEX idx_interviews_scheduled_at (scheduled_at)
) ENGINE=InnoDB;

CREATE TABLE documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    application_id BIGINT,
    document_name VARCHAR(150) NOT NULL,
    document_type VARCHAR(60) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_documents_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_documents_application FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE SET NULL,
    INDEX idx_documents_user_created (user_id, created_at),
    INDEX idx_documents_application (application_id)
) ENGINE=InnoDB;

INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) VALUES
(1, 'Harshada Patil', 'harshada@jobvault.com', '$2a$10$73yOJz94wOfIy5GvQzzmr.0aQOHKm4PAcUgPZanVNTcz9MMzAYT2C', 'USER', '2026-07-12 09:00:00', '2026-07-20 09:30:00'),
(2, 'Aarav Sharma', 'aarav@jobvault.com', '$2a$10$73yOJz94wOfIy5GvQzzmr.0aQOHKm4PAcUgPZanVNTcz9MMzAYT2C', 'USER', '2026-07-14 10:15:00', '2026-07-19 16:45:00'),
(3, 'Neha Kulkarni', 'neha@jobvault.com', '$2a$10$73yOJz94wOfIy5GvQzzmr.0aQOHKm4PAcUgPZanVNTcz9MMzAYT2C', 'USER', '2026-07-15 11:20:00', '2026-07-20 12:10:00');

INSERT INTO companies (id, user_id, name, website, location, notes, created_at, updated_at) VALUES
(1, 1, 'TechNova Solutions', 'https://technova.example.com', 'Bengaluru', 'Product engineering company with Java teams.', '2026-07-12 10:00:00', '2026-07-18 11:00:00'),
(2, 1, 'DataNest Analytics', 'https://datanest.example.com', 'Remote', 'Analytics startup with React dashboard work.', '2026-07-15 16:00:00', '2026-07-20 10:00:00'),
(3, 2, 'FinEdge Technologies', 'https://finedge.example.com', 'Mumbai', 'Fintech company hiring Java backend developers.', '2026-07-14 12:00:00', '2026-07-18 15:00:00'),
(4, 3, 'CodeSphere Labs', 'https://codesphere.example.com', 'Pune', 'Software company working on React and cloud dashboards.', '2026-07-15 13:30:00', '2026-07-20 11:40:00'),
(5, 3, 'CloudBridge Systems', 'https://cloudbridge.example.com', 'Hyderabad', 'Cloud services company hiring support interns.', '2026-07-17 10:30:00', '2026-07-19 14:20:00');

INSERT INTO contacts (id, user_id, company_id, name, email, phone, role_title, linkedin_url, notes, created_at, updated_at) VALUES
(1, 1, 1, 'Ananya Rao', 'ananya.rao@technova.example.com', '+91-9876543210', 'HR Recruiter', 'https://linkedin.com/in/ananyarao', 'Shared technical round details.', '2026-07-13 09:30:00', '2026-07-18 09:30:00'),
(2, 1, 2, 'Rahul Mehta', 'rahul.mehta@datanest.example.com', '+91-9988776655', 'Engineering Manager', 'https://linkedin.com/in/rahulmehta', 'Suggested improving dashboard project notes.', '2026-07-16 11:00:00', '2026-07-20 09:10:00'),
(3, 2, 3, 'Meera Iyer', 'meera.iyer@finedge.example.com', '+91-9876501234', 'HR Executive', 'https://linkedin.com/in/meera-iyer', 'Contacted through placement drive.', '2026-07-15 12:20:00', '2026-07-18 12:20:00'),
(4, 3, 4, 'Karan Malhotra', 'karan.malhotra@codesphere.example.com', '+91-9988771122', 'Talent Acquisition Manager', 'https://linkedin.com/in/karan-malhotra', 'Shared application status over email.', '2026-07-16 15:10:00', '2026-07-20 12:05:00');

INSERT INTO job_applications (id, user_id, company_id, job_title, job_url, employment_type, location, salary_range, status, priority, applied_date, deadline_date, notes, created_at, updated_at) VALUES
(1, 1, 1, 'Junior Java Developer', 'https://technova.example.com/careers/java-dev', 'FULL_TIME', 'Bengaluru', '6-8 LPA', 'INTERVIEW', 'HIGH', '2026-07-13', '2026-07-28', 'Completed coding assessment and waiting for technical interview.', '2026-07-13 14:00:00', '2026-07-20 08:30:00'),
(2, 1, 2, 'React Dashboard Developer', 'https://datanest.example.com/jobs/react-dashboard', 'REMOTE', 'Remote', '5-7 LPA', 'SAVED', 'LOW', NULL, '2026-07-30', 'Need to customize resume before applying.', '2026-07-18 10:30:00', '2026-07-20 10:30:00'),
(3, 2, 3, 'Java Backend Developer', 'https://finedge.example.com/careers/java-backend', 'FULL_TIME', 'Mumbai', '7-9 LPA', 'APPLIED', 'HIGH', '2026-07-17', '2026-07-29', 'Applied with updated Java Spring Boot resume.', '2026-07-17 13:15:00', '2026-07-19 16:00:00'),
(4, 2, 3, 'QA Analyst Intern', 'https://finedge.example.com/careers/qa-intern', 'INTERNSHIP', 'Mumbai', '20000/month', 'REJECTED', 'MEDIUM', '2026-07-15', '2026-07-22', 'Rejected after initial screening; keeping notes for improvement.', '2026-07-15 10:00:00', '2026-07-18 17:20:00'),
(5, 3, 4, 'React Frontend Developer', 'https://codesphere.example.com/jobs/react-intern', 'INTERNSHIP', 'Pune', '25000/month', 'SCREENING', 'MEDIUM', '2026-07-16', '2026-07-27', 'Submitted resume and portfolio link.', '2026-07-16 12:40:00', '2026-07-20 11:55:00'),
(6, 3, 5, 'Cloud Support Intern', 'https://cloudbridge.example.com/jobs/cloud-support', 'INTERNSHIP', 'Hyderabad', '22000/month', 'OFFER', 'HIGH', '2026-07-18', '2026-07-26', 'Received offer after HR round.', '2026-07-18 09:20:00', '2026-07-20 12:00:00');

INSERT INTO application_status_history (application_id, old_status, new_status, changed_at, note) VALUES
(1, NULL, 'APPLIED', '2026-07-13 14:00:00', 'Application submitted.'),
(1, 'APPLIED', 'SCREENING', '2026-07-16 17:30:00', 'Resume shortlisted.'),
(1, 'SCREENING', 'INTERVIEW', '2026-07-20 08:30:00', 'Technical round scheduled.'),
(2, NULL, 'SAVED', '2026-07-18 10:30:00', 'Saved for later.'),
(3, NULL, 'APPLIED', '2026-07-17 13:15:00', 'Application submitted.'),
(4, NULL, 'APPLIED', '2026-07-15 10:00:00', 'Application submitted.'),
(4, 'APPLIED', 'REJECTED', '2026-07-18 17:20:00', 'Rejected after screening.'),
(5, NULL, 'APPLIED', '2026-07-16 12:40:00', 'Application submitted.'),
(5, 'APPLIED', 'SCREENING', '2026-07-20 11:55:00', 'Portfolio shortlisted.'),
(6, NULL, 'APPLIED', '2026-07-18 09:20:00', 'Application submitted.'),
(6, 'APPLIED', 'INTERVIEW', '2026-07-19 15:30:00', 'HR round scheduled.'),
(6, 'INTERVIEW', 'OFFER', '2026-07-20 12:00:00', 'Offer received.');

INSERT INTO interviews (id, user_id, application_id, interview_type, scheduled_at, interviewer_name, meeting_link, location, status, notes, created_at, updated_at) VALUES
(1, 1, 1, 'TECHNICAL', '2026-07-22 11:00:00', 'Vikram Singh', 'https://meet.example.com/technova-java', NULL, 'SCHEDULED', 'Prepare Spring Boot, REST APIs, SQL joins, and OOP concepts.', '2026-07-20 08:35:00', '2026-07-20 08:35:00'),
(2, 2, 3, 'TECHNICAL', '2026-07-24 11:00:00', 'Rohan Desai', 'https://meet.example.com/finedge-java', NULL, 'SCHEDULED', 'Prepare Java, Spring Boot, REST APIs, and MySQL.', '2026-07-19 16:10:00', '2026-07-19 16:10:00'),
(3, 3, 5, 'VIDEO', '2026-07-25 15:30:00', 'Sneha Kapoor', 'https://meet.example.com/codesphere-react', NULL, 'SCHEDULED', 'Prepare React hooks, routing, forms, Bootstrap, and API integration.', '2026-07-20 12:00:00', '2026-07-20 12:00:00'),
(4, 3, 6, 'HR', '2026-07-19 14:00:00', 'Priya Shah', 'https://meet.example.com/cloudbridge-hr', NULL, 'COMPLETED', 'Discussed internship availability and offer details.', '2026-07-18 13:00:00', '2026-07-19 15:20:00');

INSERT INTO documents (id, user_id, application_id, document_name, document_type, file_url, created_at) VALUES
(1, 1, 1, 'Harshada Java Resume', 'Resume', 'https://drive.example.com/jobvault/harshada-java-resume.pdf', '2026-07-13 13:30:00'),
(2, 1, 2, 'Harshada Portfolio', 'Portfolio', 'https://harshada-portfolio.example.com', '2026-07-18 18:00:00'),
(3, 2, 3, 'Aarav Java Resume', 'Resume', 'https://drive.example.com/jobvault/aarav-java-resume.pdf', '2026-07-17 12:45:00'),
(4, 2, NULL, 'Aarav Portfolio', 'Portfolio', 'https://aarav-portfolio.example.com', '2026-07-19 10:00:00'),
(5, 3, 5, 'Neha Frontend Resume', 'Resume', 'https://drive.example.com/jobvault/neha-frontend-resume.pdf', '2026-07-16 12:10:00'),
(6, 3, 5, 'Neha Cover Letter', 'Cover Letter', 'https://drive.example.com/jobvault/neha-cover-letter.pdf', '2026-07-20 11:45:00');
