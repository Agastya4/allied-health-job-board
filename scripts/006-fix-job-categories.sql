-- Fix any malformed job_categories data
-- This script ensures all job_categories are properly formatted as JSON arrays

-- First, let's see what we have
-- SELECT id, job_categories FROM jobs LIMIT 5;

-- Update any NULL job_categories to empty arrays
UPDATE jobs 
SET job_categories = '{}' 
WHERE job_categories IS NULL;

-- Update any string job_categories to proper arrays
UPDATE jobs 
SET job_categories = ARRAY[job_categories::text]
WHERE job_categories::text NOT LIKE '{%}' 
AND job_categories IS NOT NULL;

-- Ensure all job_categories are valid arrays
UPDATE jobs 
SET job_categories = '{"general"}'
WHERE job_categories = '{}' OR job_categories IS NULL;

-- Add some sample data if the table is empty
INSERT INTO jobs (
  user_id, practice_email, job_title, practice_location, location_display,
  job_type, job_categories, experience_level, job_details, company_name,
  contact_phone, contact_email, status, is_featured
) 
SELECT 
  1, 'demo@example.com', 'Sample Physiotherapist Position', 
  'Sydney NSW Australia', 'Sydney, NSW',
  'full-time', ARRAY['physiotherapy'], 'mid',
  'This is a sample job posting to test the application functionality.',
  'Demo Health Clinic', '02 1234 5678', 'jobs@demo.com', 'active', false
WHERE NOT EXISTS (SELECT 1 FROM jobs LIMIT 1);

-- Verify the data
-- SELECT id, job_title, job_categories FROM jobs LIMIT 3;
