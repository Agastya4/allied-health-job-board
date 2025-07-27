-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS job_bookmarks CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'job_seeker',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create jobs table
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  practice_email VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  practice_location TEXT NOT NULL,
  location_display VARCHAR(255) NOT NULL,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  job_type VARCHAR(100) NOT NULL,
  job_categories TEXT[] NOT NULL,
  experience_level VARCHAR(100) NOT NULL,
  work_setting VARCHAR(100),
  salary_range VARCHAR(100),
  job_details TEXT NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  company_website VARCHAR(255),
  company_logo_url TEXT,
  status VARCHAR(50) DEFAULT 'active',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create job bookmarks table
CREATE TABLE job_bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, job_id)
);

-- Create applications table
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, job_id)
);

-- Create indexes for better performance
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_job_bookmarks_user_id ON job_bookmarks(user_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);

-- Insert some sample data for testing
INSERT INTO users (email, name, password_hash, role) VALUES 
('employer@test.com', 'Test Employer', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'employer'),
('jobseeker@test.com', 'Test Job Seeker', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'job_seeker');

-- Insert sample jobs
INSERT INTO jobs (
  user_id, practice_email, job_title, practice_location, location_display,
  location_lat, location_lng, job_type, job_categories, experience_level,
  work_setting, salary_range, job_details, company_name, contact_phone,
  contact_email, company_website, status, is_featured
) VALUES 
(1, 'hr@rehabaustralia.com', 'Senior Physiotherapist', 'Sydney NSW Australia', 'Sydney, NSW', 
 -33.8688, 151.2093, 'full-time', ARRAY['physiotherapy'], 'senior',
 'private-practice', '90000-110000', 'We are seeking a dedicated and experienced Senior Physiotherapist to join our dynamic team at Rehab Australia. This is an excellent opportunity for a healthcare professional looking to make a meaningful impact in the Sydney area.

Key Responsibilities:
• Conduct comprehensive physiotherapy assessments
• Develop and implement treatment plans
• Mentor junior staff members
• Maintain accurate patient records
• Collaborate with multidisciplinary team

Requirements:
• Bachelor or Master of Physiotherapy
• Current AHPRA registration
• 5+ years of clinical experience
• Strong communication skills', 
 'Rehab Australia', '02 9876 5432', 'careers@rehabaustralia.com', 'https://www.rehabaustralia.com', 'active', true),

(1, 'jobs@kidstherapy.com', 'Occupational Therapist - Paediatrics', 'Melbourne VIC Australia', 'Melbourne, VIC',
 -37.8136, 144.9631, 'full-time', ARRAY['occupational-therapy'], 'mid',
 'paediatrics', 'hourly-70-90', 'Join our specialized paediatric team at Kids Therapy Hub. We provide comprehensive occupational therapy services to children and families across Melbourne.

What we offer:
• Competitive hourly rates
• Flexible scheduling options
• Professional development opportunities
• Supportive team environment
• NDIS experience preferred

Requirements:
• Bachelor or Master of Occupational Therapy
• Current AHPRA registration
• Experience with children and families
• NDIS knowledge preferred', 
 'Kids Therapy Hub', '03 8765 4321', 'recruitment@kidstherapy.com', 'https://www.kidstherapy.com', 'active', true);
