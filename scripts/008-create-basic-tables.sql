-- Create basic database schema for Allied Health Jobs
-- This script creates all necessary tables and sample data

-- Drop existing tables if they exist (for clean setup)
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
  role VARCHAR(50) DEFAULT 'job_seeker' CHECK (role IN ('job_seeker', 'employer')),
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  email_verification_token VARCHAR(255),
  email_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
  job_categories TEXT[] NOT NULL DEFAULT '{}',
  experience_level VARCHAR(100) NOT NULL,
  work_setting VARCHAR(100),
  salary_range VARCHAR(100),
  job_details TEXT NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  company_website VARCHAR(255),
  company_logo_url TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create job bookmarks table
CREATE TABLE job_bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, job_id)
);

-- Create applications table
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, job_id)
);

-- Create indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_bookmarks_user_id ON job_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_job_bookmarks_job_id ON job_bookmarks(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);

-- Insert demo users (password is 'password123' for all)
INSERT INTO users (email, name, password_hash, role) VALUES 
('employer@demo.com', 'Demo Employer', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'employer'),
('jobseeker@demo.com', 'Demo Job Seeker', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'job_seeker'),
('admin@alliedhealthjobs.com.au', 'Admin User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'employer')
ON CONFLICT (email) DO NOTHING;

-- Insert sample jobs
INSERT INTO jobs (
  user_id, practice_email, job_title, practice_location, location_display,
  location_lat, location_lng, job_type, job_categories, experience_level,
  work_setting, salary_range, job_details, company_name, contact_phone,
  contact_email, company_website, status, is_featured
) VALUES 
(1, 'careers@physioexcellence.com.au', 'Senior Physiotherapist', 'Sydney NSW 2000 Australia', 'Sydney, NSW', 
 -33.8688, 151.2093, 'full-time', ARRAY['physiotherapy'], 'senior',
 'private-practice', '90000-110000', 
 'Join PhysioExcellence, Sydney''s premier physiotherapy clinic. We are seeking an experienced Senior Physiotherapist to lead our musculoskeletal team.

Key Responsibilities:
• Conduct comprehensive physiotherapy assessments and treatments
• Develop evidence-based treatment plans for complex cases
• Mentor junior physiotherapists and students
• Maintain detailed patient records and progress notes
• Collaborate with multidisciplinary healthcare team

Requirements:
• Bachelor or Master of Physiotherapy from accredited institution
• Current AHPRA registration with physiotherapy endorsement
• Minimum 5 years clinical experience in musculoskeletal physiotherapy
• Experience in manual therapy techniques
• Strong communication and interpersonal skills

What We Offer:
• Competitive salary package $90,000 - $110,000 + superannuation
• Professional development allowance $2,000 annually
• Flexible working arrangements
• Modern clinic with latest equipment
• Supportive team environment', 
 'PhysioExcellence', '02 9876 5432', 'careers@physioexcellence.com.au', 'https://www.physioexcellence.com.au', 'active', true),

(1, 'hr@kidstherapyhub.com.au', 'Paediatric Occupational Therapist', 'Melbourne VIC 3000 Australia', 'Melbourne, VIC',
 -37.8136, 144.9631, 'full-time', ARRAY['occupational-therapy'], 'mid',
 'paediatrics', 'hourly-75-95', 
 'Kids Therapy Hub is Melbourne''s leading paediatric therapy provider. Join our passionate team making a difference in children''s lives.

About the Role:
• Provide occupational therapy services to children aged 0-18 years
• Conduct assessments and develop individualized treatment plans
• Deliver therapy in clinic, home, and school environments
• Work with children with autism, ADHD, developmental delays
• Collaborate with families, educators, and healthcare professionals

Essential Criteria:
• Bachelor or Master of Occupational Therapy
• Current AHPRA registration
• 2-5 years paediatric occupational therapy experience
• Experience with sensory integration and play-based therapy
• NDIS provider experience preferred

Benefits:
• Competitive hourly rate $75-95 per hour
• Flexible scheduling options
• NDIS training and support provided
• Professional development opportunities
• Supportive multidisciplinary team', 
 'Kids Therapy Hub', '03 8765 4321', 'hr@kidstherapyhub.com.au', 'https://www.kidstherapyhub.com.au', 'active', true),

(1, 'recruitment@speechpathways.com.au', 'Speech Pathologist', 'Brisbane QLD 4000 Australia', 'Brisbane, QLD',
 -27.4698, 153.0251, 'part-time', ARRAY['speech-pathology'], 'junior',
 'community-health', '65000-75000', 
 'Speech Pathways is seeking a dedicated Speech Pathologist to join our community health team in Brisbane.

Position Overview:
• Part-time position (24-30 hours per week)
• Provide speech pathology services across the lifespan
• Work in community health settings and client homes
• Assess and treat communication and swallowing disorders
• Develop evidence-based intervention programs

Requirements:
• Bachelor or Master of Speech Pathology
• Current Speech Pathology Australia certification
• 1-3 years clinical experience preferred
• Experience with AAC and assistive technology
• Valid driver''s license essential

Package Includes:
• Pro-rata salary $65,000-$75,000 based on experience
• Salary packaging options available
• Professional development support
• Flexible working arrangements
• Access to latest assessment tools', 
 'Speech Pathways', '07 3456 7890', 'recruitment@speechpathways.com.au', 'https://www.speechpathways.com.au', 'active', false),

(1, 'jobs@mindwellness.com.au', 'Clinical Psychologist', 'Perth WA 6000 Australia', 'Perth, WA',
 -31.9505, 115.8605, 'full-time', ARRAY['psychology'], 'senior',
 'mental-health', '100000-120000', 
 'MindWellness Psychology is expanding our team with an experienced Clinical Psychologist.

Key Responsibilities:
• Provide psychological assessment and intervention services
• Work with adults experiencing anxiety, depression, trauma
• Conduct individual and group therapy sessions
• Develop comprehensive treatment plans
• Collaborate with psychiatrists and mental health professionals

Essential Requirements:
• Master or Doctorate in Clinical Psychology
• Current AHPRA registration as a psychologist
• Minimum 5 years clinical experience
• Experience with CBT, ACT, and trauma-informed therapies
• Strong diagnostic and therapeutic skills

What We Offer:
• Competitive salary $100,000-$120,000 + superannuation
• Private practice setting with administrative support
• Flexible scheduling and work arrangements
• Professional development budget
• Clinical supervision provided', 
 'MindWellness Psychology', '08 6789 0123', 'jobs@mindwellness.com.au', 'https://www.mindwellness.com.au', 'active', true),

(1, 'careers@nutritionplus.com.au', 'Dietitian', 'Adelaide SA 5000 Australia', 'Adelaide, SA',
 -34.9285, 138.6007, 'contract', ARRAY['dietetics-nutrition'], 'mid',
 'hospital', 'hourly-60-80', 
 'NutritionPlus is seeking a qualified Dietitian for a 12-month contract position.

Position Details:
• 12-month contract with possibility of extension
• Full-time hours (38 hours per week)
• Provide clinical nutrition services to inpatients and outpatients
• Conduct nutritional assessments and develop care plans
• Educate patients and families on dietary management

Requirements:
• Bachelor of Nutrition and Dietetics or equivalent
• Current Dietitians Australia membership
• 3-5 years clinical experience in hospital setting
• Experience with enteral and parenteral nutrition
• Strong communication and documentation skills

Contract Benefits:
• Competitive hourly rate $60-80 per hour
• Immediate start available
• Hospital employee benefits access
• Professional development opportunities
• Potential for permanent conversion', 
 'NutritionPlus', '08 8234 5678', 'careers@nutritionplus.com.au', 'https://www.nutritionplus.com.au', 'active', false)
ON CONFLICT DO NOTHING;

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
