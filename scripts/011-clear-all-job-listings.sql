-- Clear all job listings from the database
-- This script will remove all job records while preserving the table structure

-- First, let's see how many jobs we have
SELECT COUNT(*) as total_jobs FROM jobs;

-- Delete all job records
DELETE FROM jobs;

-- Verify the deletion
SELECT COUNT(*) as remaining_jobs FROM jobs;

-- Note: This will also automatically clear related records in the payments table
-- due to foreign key constraints, but let's verify
SELECT COUNT(*) as total_payments FROM payments; 