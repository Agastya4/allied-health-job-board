-- Create employer_practice_details table
CREATE TABLE IF NOT EXISTS employer_practice_details (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    practice_name VARCHAR(255),
    street_address TEXT,
    suburb VARCHAR(100),
    postcode VARCHAR(10),
    state VARCHAR(50),
    phone_number VARCHAR(20),
    website VARCHAR(255),
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_employer_practice_details_user_id ON employer_practice_details(user_id);

-- Add comment to table
COMMENT ON TABLE employer_practice_details IS 'Stores practice details for employers to auto-fill job posting forms'; 