-- Comprehensive Database Schema Fix Script
-- This script ensures all required columns exist and handles missing data

-- Check if tables exist, if not create them
DO $$
BEGIN
    -- Create users table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'job_seeker',
            avatar_url TEXT,
            is_verified BOOLEAN DEFAULT false,
            email_verification_token VARCHAR(255),
            email_verified_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- Create jobs table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'jobs') THEN
        CREATE TABLE jobs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            practice_email VARCHAR(255) NOT NULL,
            job_title VARCHAR(255) NOT NULL,
            practice_location TEXT NOT NULL,
            location_display VARCHAR(255),
            location_lat DECIMAL(10, 8),
            location_lng DECIMAL(11, 8),
            city VARCHAR(100),
            state VARCHAR(100),
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
            payment_status VARCHAR(50) DEFAULT 'pending',
            stripe_payment_intent_id VARCHAR(255),
            payment_amount INTEGER DEFAULT 100,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- Create job_bookmarks table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'job_bookmarks') THEN
        CREATE TABLE job_bookmarks (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, job_id)
        );
    END IF;

    -- Create applications table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'applications') THEN
        CREATE TABLE applications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
            status VARCHAR(50) DEFAULT 'pending',
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, job_id)
        );
    END IF;

    -- Create employer_practice_details table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employer_practice_details') THEN
        CREATE TABLE employer_practice_details (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            practice_name VARCHAR(255),
            street_address TEXT,
            suburb VARCHAR(255),
            postcode VARCHAR(10),
            state VARCHAR(100),
            phone_number VARCHAR(50),
            website VARCHAR(255),
            logo_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Add missing columns to existing tables
DO $$
BEGIN
    -- Add missing columns to jobs table
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'city') THEN
        ALTER TABLE jobs ADD COLUMN city VARCHAR(100);
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'state') THEN
        ALTER TABLE jobs ADD COLUMN state VARCHAR(100);
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'payment_status') THEN
        ALTER TABLE jobs ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'stripe_payment_intent_id') THEN
        ALTER TABLE jobs ADD COLUMN stripe_payment_intent_id VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'payment_amount') THEN
        ALTER TABLE jobs ADD COLUMN payment_amount INTEGER DEFAULT 100;
    END IF;

    -- Add missing columns to users table
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_verification_token') THEN
        ALTER TABLE users ADD COLUMN email_verification_token VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_verified_at') THEN
        ALTER TABLE users ADD COLUMN email_verified_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Add missing columns to applications table
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'applied_at') THEN
        ALTER TABLE applications ADD COLUMN applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Update existing jobs with missing city/state data
UPDATE jobs 
SET 
    city = CASE 
        WHEN city IS NULL OR city = '' THEN 
            CASE 
                WHEN location_display LIKE '%,%' THEN 
                    SPLIT_PART(location_display, ',', 1)
                ELSE location_display
            END
        ELSE city
    END,
    state = CASE 
        WHEN state IS NULL OR state = '' THEN 
            CASE 
                WHEN location_display LIKE '%,%' THEN 
                    TRIM(SPLIT_PART(location_display, ',', 2))
                ELSE 'unknown'
            END
        ELSE state
    END
WHERE city IS NULL OR city = '' OR state IS NULL OR state = '';

-- Normalize state abbreviations
UPDATE jobs 
SET state = CASE 
    WHEN LOWER(state) IN ('new south wales', 'nsw') THEN 'nsw'
    WHEN LOWER(state) IN ('victoria', 'vic') THEN 'vic'
    WHEN LOWER(state) IN ('queensland', 'qld') THEN 'qld'
    WHEN LOWER(state) IN ('south australia', 'sa') THEN 'sa'
    WHEN LOWER(state) IN ('western australia', 'wa') THEN 'wa'
    WHEN LOWER(state) IN ('tasmania', 'tas') THEN 'tas'
    WHEN LOWER(state) IN ('australian capital territory', 'act') THEN 'act'
    WHEN LOWER(state) IN ('northern territory', 'nt') THEN 'nt'
    ELSE LOWER(state)
END
WHERE state IS NOT NULL;

-- Normalize city names (remove extra spaces, convert to lowercase)
UPDATE jobs 
SET city = LOWER(TRIM(REGEXP_REPLACE(city, '\s+', ' ', 'g')))
WHERE city IS NOT NULL;

-- Ensure all jobs have payment_status
UPDATE jobs 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;

-- Ensure all jobs have payment_amount
UPDATE jobs 
SET payment_amount = 100 
WHERE payment_amount IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_payment_status ON jobs(payment_status);
CREATE INDEX IF NOT EXISTS idx_jobs_city ON jobs(city);
CREATE INDEX IF NOT EXISTS idx_jobs_state ON jobs(state);
CREATE INDEX IF NOT EXISTS idx_jobs_job_categories ON jobs USING GIN(job_categories);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);

CREATE INDEX IF NOT EXISTS idx_job_bookmarks_user_id ON job_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_job_bookmarks_job_id ON job_bookmarks(job_id);

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_jobs_updated_at') THEN
        CREATE TRIGGER update_jobs_updated_at 
            BEFORE UPDATE ON jobs 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at 
            BEFORE UPDATE ON users 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_employer_practice_details_updated_at') THEN
        CREATE TRIGGER update_employer_practice_details_updated_at 
            BEFORE UPDATE ON employer_practice_details 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Verify schema
SELECT 
    'Schema verification complete' as status,
    (SELECT COUNT(*) FROM jobs) as total_jobs,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM job_bookmarks) as total_bookmarks,
    (SELECT COUNT(*) FROM applications) as total_applications;

-- Show any jobs with missing critical data
SELECT 
    'Jobs with missing data:' as info,
    COUNT(*) as count
FROM jobs 
WHERE city IS NULL OR city = '' OR state IS NULL OR state = '';

-- Show sample of normalized data
SELECT 
    'Sample normalized data:' as info,
    id,
    job_title,
    city,
    state,
    payment_status,
    created_at
FROM jobs 
ORDER BY created_at DESC 
LIMIT 5; 