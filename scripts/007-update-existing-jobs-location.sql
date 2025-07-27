-- Update existing jobs to ensure they have proper city and state fields
-- This script normalizes existing job data for location filtering

-- First, let's see what we're working with
SELECT 
  id, 
  job_title, 
  practice_location, 
  location_display,
  city,
  state,
  job_categories
FROM jobs 
WHERE status = 'active' 
LIMIT 10;

-- Update jobs that have location_display but missing city/state
-- Extract city and state from location_display if possible
UPDATE jobs 
SET 
  city = CASE 
    WHEN city IS NULL OR city = '' THEN
      CASE 
        WHEN location_display LIKE '%,%' THEN 
          LOWER(TRIM(SPLIT_PART(location_display, ',', 1)))
        ELSE NULL
      END
    ELSE city
  END,
  state = CASE 
    WHEN state IS NULL OR state = '' THEN
      CASE 
        WHEN location_display LIKE '%,%' THEN 
          UPPER(TRIM(SPLIT_PART(location_display, ',', 2)))
        ELSE NULL
      END
    ELSE state
  END
WHERE (city IS NULL OR city = '' OR state IS NULL OR state = '')
  AND location_display IS NOT NULL 
  AND location_display != '';

-- Normalize existing city and state values to match the filtering format
UPDATE jobs 
SET 
  city = LOWER(REPLACE(TRIM(city), ' ', '-')),
  state = LOWER(REPLACE(TRIM(state), ' ', '-'))
WHERE city IS NOT NULL 
  AND city != '' 
  AND state IS NOT NULL 
  AND state != '';

-- Set default values for jobs that still don't have city/state
-- You may want to manually review these jobs
UPDATE jobs 
SET 
  city = 'unknown',
  state = 'unknown'
WHERE (city IS NULL OR city = '') 
  OR (state IS NULL OR state = '');

-- Show the results after updates
SELECT 
  id, 
  job_title, 
  city,
  state,
  job_categories
FROM jobs 
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 20; 