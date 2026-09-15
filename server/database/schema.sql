

CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  mobile VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(180) NOT NULL UNIQUE,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'भारत',
  preferred_language VARCHAR(20) DEFAULT 'hi',
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  public_profile BOOLEAN NOT NULL DEFAULT FALSE,
  leaderboard_visible BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ram_name_entries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  count INT UNSIGNED NOT NULL,
  mode ENUM('digital','manual','offline') NOT NULL DEFAULT 'digital',
  note VARCHAR(500),
  notebook_image_url VARCHAR(500),
  entry_date DATE NOT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'approved',
  verified_by CHAR(36),
  verified_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ram_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ram_verified_by FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_ram_user_date (user_id, entry_date),
  INDEX idx_ram_status_date (status, entry_date)
);

CREATE TABLE pledges (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  sankalp_id VARCHAR(40) NOT NULL UNIQUE,
  title VARCHAR(120) NOT NULL,
  target_count INT UNSIGNED NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  daily_goal INT UNSIGNED DEFAULT 0,
  preferred_practice_time TIME,
  status ENUM('active','completed','cancelled') NOT NULL DEFAULT 'active',
  completed_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pledge_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_pledge_user_status (user_id, status)
);

CREATE TABLE events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  location VARCHAR(255),
  mode ENUM('online','offline','hybrid') DEFAULT 'online',
  description TEXT,
  banner VARCHAR(500),
  registration_limit INT UNSIGNED,
  registration_fee DECIMAL(10,2) DEFAULT 0,
  contact VARCHAR(100),
  status ENUM('draft','published','closed') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_event_date_status (event_date, status)
);

CREATE TABLE event_registrations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id BIGINT UNSIGNED NOT NULL,
  user_id CHAR(36) NOT NULL,
  registration_code VARCHAR(50) NOT NULL UNIQUE,
  status ENUM('registered','cancelled','attended') DEFAULT 'registered',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_event_reg_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_event_reg_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_event_user (event_id,user_id)
);

CREATE TABLE devotee_experiences (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36),
  name VARCHAR(120) NOT NULL,
  city VARCHAR(100),
  experience TEXT NOT NULL,
  photo_url VARCHAR(500),
  video_url VARCHAR(500),
  consent BOOLEAN DEFAULT FALSE,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_exp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE gallery (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  category ENUM('ram_naam','bhajan','kirtan','events','seva','temple_ashram','community') DEFAULT 'community',
  image_url VARCHAR(500) NOT NULL,
  description TEXT,
  status ENUM('draft','published') DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news_posts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(240) NOT NULL UNIQUE,
  excerpt VARCHAR(500),
  content LONGTEXT NOT NULL,
  category VARCHAR(100),
  meta_title VARCHAR(255),
  meta_description VARCHAR(320),
  keywords VARCHAR(500),
  featured_image VARCHAR(500),
  author VARCHAR(120),
  status ENUM('draft','published') DEFAULT 'draft',
  published_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE daily_sadhana (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  content_date DATE NOT NULL UNIQUE,
  title VARCHAR(180) NOT NULL,
  message TEXT,
  ram_mantra TEXT,
  hanuman_chalisa_url VARCHAR(500),
  sundarkand_url VARCHAR(500),
  bhajan_url VARCHAR(500),
  status ENUM('draft','published') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE volunteers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36),
  name VARCHAR(120) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(180),
  city VARCHAR(100),
  service_interest VARCHAR(150),
  availability VARCHAR(150),
  message TEXT,
  status ENUM('new','contacted','active','closed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_volunteer_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE certificates (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  pledge_id CHAR(36),
  certificate_number VARCHAR(60) NOT NULL UNIQUE,
  completed_ram_names INT UNSIGNED NOT NULL,
  completion_date DATE NOT NULL,
  qr_token VARCHAR(120) NOT NULL UNIQUE,
  pdf_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cert_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_cert_pledge FOREIGN KEY (pledge_id) REFERENCES pledges(id) ON DELETE SET NULL
);

CREATE TABLE contact_messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180),
  mobile VARCHAR(20),
  subject VARCHAR(180),
  message TEXT NOT NULL,
  status ENUM('new','read','replied') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id CHAR(36),
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(80),
  entity_id VARCHAR(80),
  old_value JSON,
  new_value JSON,
  ip_address VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_admin FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO events (title,event_date,event_time,location,mode,description,status)
VALUES
('सामूहिक राम नाम लेखन', DATE_ADD(CURDATE(), INTERVAL 7 DAY), '06:00:00', 'ऑनलाइन', 'online', 'सामूहिक राम नाम लेखन एवं नाम-स्मरण।', 'published'),
('सुंदरकांड पाठ', DATE_ADD(CURDATE(), INTERVAL 12 DAY), '15:00:00', 'ऑनलाइन', 'online', 'सामूहिक सुंदरकांड पाठ।', 'published');
