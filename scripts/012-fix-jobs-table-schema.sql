-- Fix jobs table schema to match form requirements
-- This script adds missing columns that the job posting form expects

-- Add city and state columns to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS state VARCHAR(100);

-- Add stripe_payment_intent_id column if it doesn't exist
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255);

-- Update existing jobs to have city and state based on location_display
UPDATE jobs 
SET 
  city = CASE 
    WHEN location_display LIKE '%,%' THEN 
      TRIM(SPLIT_PART(location_display, ',', 1))
    ELSE location_display
  END,
  state = CASE 
    WHEN location_display LIKE '%,%' THEN 
      TRIM(SPLIT_PART(location_display, ',', 2))
    ELSE NULL
  END
WHERE city IS NULL OR state IS NULL;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_jobs_city ON jobs(city);
CREATE INDEX IF NOT EXISTS idx_jobs_state ON jobs(state);

-- Add comments to the new columns
COMMENT ON COLUMN jobs.city IS 'Normalized city name for filtering and search';
COMMENT ON COLUMN jobs.state IS 'Normalized state name for filtering and search';
COMMENT ON COLUMN jobs.stripe_payment_intent_id IS 'Stripe payment intent ID for payment tracking';

-- Verify the schema
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'jobs' 
ORDER BY ordinal_position; 