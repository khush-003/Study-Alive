CREATE DATABASE IF NOT EXISTS skill2career
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE skill2career;

-- Accounts provide the owner identity referenced by saved work and activity.
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  stream VARCHAR(120) NOT NULL DEFAULT 'Registered Student',
  role ENUM('student', 'mentor', 'admin') NOT NULL DEFAULT 'student',
  avatar_url VARCHAR(1000) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  INDEX idx_users_role_created (role, created_at)
) ENGINE=InnoDB;

-- Career profiles keep the main display fields; detailed lists live in child tables.
CREATE TABLE IF NOT EXISTS careers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(80) NOT NULL,
  category VARCHAR(120) NOT NULL,
  name VARCHAR(160) NOT NULL,
  tagline VARCHAR(255) NOT NULL,
  about TEXT NOT NULL,
  icon VARCHAR(100) NOT NULL,
  scope VARCHAR(255) NOT NULL,
  salary_range VARCHAR(100) NOT NULL,
  job_opportunities VARCHAR(255) NOT NULL,
  future_growth VARCHAR(160) NOT NULL,
  required_skills VARCHAR(255) NOT NULL,
  global_opportunities VARCHAR(255) NOT NULL,
  best_for VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_careers_slug (slug),
  INDEX idx_careers_category_name (category, name)
) ENGINE=InnoDB;

-- One career may have several ordered education pathways.
CREATE TABLE IF NOT EXISTS career_degrees (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  career_id BIGINT UNSIGNED NOT NULL,
  degree_path VARCHAR(500) NOT NULL,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_career_degree_order (career_id, sort_order),
  CONSTRAINT fk_career_degrees_career
    FOREIGN KEY (career_id) REFERENCES careers (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Advantages and risks share a table and are distinguished by item_type.
CREATE TABLE IF NOT EXISTS career_pros_cons (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  career_id BIGINT UNSIGNED NOT NULL,
  item_type ENUM('pro', 'risk') NOT NULL,
  description VARCHAR(500) NOT NULL,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_career_pro_con_order (career_id, item_type, sort_order),
  CONSTRAINT fk_career_pros_cons_career
    FOREIGN KEY (career_id) REFERENCES careers (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Job profiles store role-specific skills and salary ranges for a career.
CREATE TABLE IF NOT EXISTS career_jobs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  career_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(160) NOT NULL,
  stack VARCHAR(500) NOT NULL,
  salary_range VARCHAR(100) NOT NULL,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_career_job_order (career_id, sort_order),
  INDEX idx_career_jobs_title (title),
  CONSTRAINT fk_career_jobs_career
    FOREIGN KEY (career_id) REFERENCES careers (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- The composite key prevents a student from saving the same career twice.
CREATE TABLE IF NOT EXISTS saved_careers (
  user_id BIGINT UNSIGNED NOT NULL,
  career_id BIGINT UNSIGNED NOT NULL,
  saved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, career_id),
  INDEX idx_saved_careers_career (career_id),
  CONSTRAINT fk_saved_careers_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_saved_careers_career
    FOREIGN KEY (career_id) REFERENCES careers (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Study resources can be downloaded, watched, or requested by subject and type.
CREATE TABLE IF NOT EXISTS study_materials (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  subject VARCHAR(100) NOT NULL,
  type ENUM('notes', 'videos', 'practice', 'books') NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  file_url VARCHAR(1000) NULL,
  size_mb DECIMAL(8, 2) NULL,
  duration VARCHAR(40) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_materials_subject_type (subject, type),
  INDEX idx_materials_title (title)
) ENGINE=InnoDB;

-- Each download event is retained so student activity can be counted over time.
CREATE TABLE IF NOT EXISTS material_downloads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  material_id BIGINT UNSIGNED NOT NULL,
  downloaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_downloads_user_date (user_id, downloaded_at),
  INDEX idx_downloads_material (material_id),
  CONSTRAINT fk_material_downloads_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_material_downloads_material
    FOREIGN KEY (material_id) REFERENCES study_materials (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- A view event lets Profile count distinct materials opened as video lessons.
CREATE TABLE IF NOT EXISTS material_views (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  material_id BIGINT UNSIGNED NOT NULL,
  viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_views_user_date (user_id, viewed_at),
  INDEX idx_views_material (material_id),
  CONSTRAINT fk_material_views_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_material_views_material
    FOREIGN KEY (material_id) REFERENCES study_materials (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Students can request missing materials and staff can track request status.
CREATE TABLE IF NOT EXISTS resource_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  subject VARCHAR(160) NOT NULL,
  format VARCHAR(80) NOT NULL,
  status ENUM('pending', 'fulfilled', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_resource_requests_user_date (user_id, created_at),
  INDEX idx_resource_requests_status_date (status, created_at),
  CONSTRAINT fk_resource_requests_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Offers connect a mentor's teaching skill to the skill they want to learn.
CREATE TABLE IF NOT EXISTS skill_offers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  teach_skill VARCHAR(255) NOT NULL,
  learn_skill VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_skill_offer_user_skills (user_id, teach_skill, learn_skill),
  INDEX idx_skill_offers_user_date (user_id, created_at),
  INDEX idx_skill_offers_created (created_at),
  CONSTRAINT fk_skill_offers_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Connection requests belong to two users; duplicate directed pairs are blocked.
CREATE TABLE IF NOT EXISTS connections (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  requester_id BIGINT UNSIGNED NOT NULL,
  receiver_id BIGINT UNSIGNED NOT NULL,
  status ENUM('pending', 'connected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_connections_pair (requester_id, receiver_id),
  INDEX idx_connections_receiver_status (receiver_id, status),
  INDEX idx_connections_requester_status (requester_id, status),
  
  CONSTRAINT fk_connections_requester
    FOREIGN KEY (requester_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_connections_receiver
    FOREIGN KEY (receiver_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Live learning events are reservable by users through session_reservations.
CREATE TABLE IF NOT EXISTS live_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  speaker VARCHAR(255) NOT NULL,
  starts_at DATETIME NOT NULL,
  badge VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_live_sessions_starts_at (starts_at)
) ENGINE=InnoDB;

-- The composite key prevents duplicate reservations for one user and session.
CREATE TABLE IF NOT EXISTS session_reservations (
  user_id BIGINT UNSIGNED NOT NULL,
  session_id BIGINT UNSIGNED NOT NULL,
  reserved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, session_id),
  INDEX idx_session_reservations_session (session_id),
  CONSTRAINT fk_session_reservations_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_session_reservations_session
    FOREIGN KEY (session_id) REFERENCES live_sessions (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Platform announcements can be filtered by category and sorted by publication.
CREATE TABLE IF NOT EXISTS `updates` (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category ENUM('exams', 'admissions', 'scholarships', 'events', 'reports') NOT NULL,
  title VARCHAR(200) NOT NULL,
  summary VARCHAR(500) NOT NULL,
  details TEXT NOT NULL,
  published_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_updates_category_published (category, published_at),
  INDEX idx_updates_published (published_at)
) ENGINE=InnoDB;

-- AI request timestamps support per-user and per-feature usage limits.
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  feature ENUM('counselor', 'compare', 'study_kit') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_ai_usage_user_feature_time (user_id, feature, created_at),
  INDEX idx_ai_usage_created (created_at),
  CONSTRAINT fk_ai_usage_logs_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
