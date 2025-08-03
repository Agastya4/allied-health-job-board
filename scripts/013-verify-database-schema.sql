-- Verify database schema matches form requirements
-- This script checks if all required columns exist in the jobs table

-- Check current jobs table schema
SELECT 
  'Current jobs table schema:' as info,
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'jobs' 
ORDER BY ordinal_position;

-- Check if required columns exist
SELECT 
  'Missing columns check:' as info,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'city') 
    THEN 'city column is missing'
    ELSE 'city column exists'
  END as city_status,
  
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'state') 
    THEN 'state column is missing'
    ELSE 'state column exists'
  END as state_status,
  
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'payment_status') 
    THEN 'payment_status column is missing'
    ELSE 'payment_status column exists'
  END as payment_status_status,
  
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'stripe_payment_intent_id') 
    THEN 'stripe_payment_intent_id column is missing'
    ELSE 'stripe_payment_intent_id column exists'
  END as stripe_payment_intent_id_status,
  
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'payment_amount') 
    THEN 'payment_amount column is missing'
    ELSE 'payment_amount column exists'
  END as payment_amount_status;

-- Check if payments table exists
SELECT 
  'Payments table check:' as info,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') 
    THEN 'payments table exists'
    ELSE 'payments table is missing'
  END as payments_table_status;

-- Check if admin_settings table exists
SELECT 
  'Admin settings table check:' as info,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_settings') 
    THEN 'admin_settings table exists'
    ELSE 'admin_settings table is missing'
  END as admin_settings_table_status;

-- Show sample job data to verify structure
SELECT 
  'Sample job data:' as info,
  id,
  job_title,
  city,
  state,
  payment_status,
  stripe_payment_intent_id,
  payment_amount
FROM jobs 
LIMIT 3; 