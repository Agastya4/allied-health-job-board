const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function fixDatabaseSchema() {
  // Get database URL from environment
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in .env.local');
    console.log('Please make sure your .env.local file contains DATABASE_URL');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔧 Connecting to Neon database...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to database successfully');

    // Check current schema
    console.log('\n📋 Checking current database schema...');
    const schemaResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'jobs' 
      ORDER BY ordinal_position
    `);
    
    console.log('Current jobs table columns:');
    schemaResult.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });

    // Check if required columns exist
    const existingColumns = schemaResult.rows.map(row => row.column_name);
    const requiredColumns = ['city', 'state', 'payment_status', 'stripe_payment_intent_id', 'payment_amount'];
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

    if (missingColumns.length === 0) {
      console.log('\n✅ All required columns already exist!');
      return;
    }

    console.log(`\n❌ Missing columns: ${missingColumns.join(', ')}`);
    console.log('🔧 Adding missing columns...');

    // Add missing columns
    const alterQueries = [
      "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS city VARCHAR(100);",
      "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS state VARCHAR(100);",
      "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));",
      "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255);",
      "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS payment_amount INTEGER DEFAULT 100;"
    ];

    for (const query of alterQueries) {
      console.log(`Executing: ${query}`);
      await client.query(query);
    }

    // Update existing jobs to populate city and state from location_display
    console.log('\n🔄 Updating existing jobs with city and state data...');
    const updateResult = await client.query(`
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
      WHERE city IS NULL OR state IS NULL
    `);
    
    console.log(`✅ Updated ${updateResult.rowCount} existing jobs`);

    // Create indexes
    console.log('\n🔧 Creating indexes...');
    const indexQueries = [
      "CREATE INDEX IF NOT EXISTS idx_jobs_city ON jobs(city);",
      "CREATE INDEX IF NOT EXISTS idx_jobs_state ON jobs(state);",
      "CREATE INDEX IF NOT EXISTS idx_jobs_payment_status ON jobs(payment_status);",
      "CREATE INDEX IF NOT EXISTS idx_jobs_stripe_payment_intent_id ON jobs(stripe_payment_intent_id);"
    ];

    for (const query of indexQueries) {
      await client.query(query);
    }

    // Verify the fix
    console.log('\n🔍 Verifying the fix...');
    const verifyResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'jobs' 
      ORDER BY ordinal_position
    `);

    console.log('\n✅ Updated jobs table columns:');
    verifyResult.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });

    // Check if payments table exists
    const paymentsTableResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'payments'
      );
    `);

    if (!paymentsTableResult.rows[0].exists) {
      console.log('\n🔧 Creating payments table...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS payments (
          id SERIAL PRIMARY KEY,
          job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
          amount INTEGER NOT NULL,
          currency VARCHAR(3) DEFAULT 'AUD',
          status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled', 'refunded')),
          payment_method VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✅ Payments table created');
    } else {
      console.log('✅ Payments table already exists');
    }

    // Check if admin_settings table exists
    const adminSettingsResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'admin_settings'
      );
    `);

    if (!adminSettingsResult.rows[0].exists) {
      console.log('\n🔧 Creating admin_settings table...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS admin_settings (
          id SERIAL PRIMARY KEY,
          setting_key VARCHAR(100) UNIQUE NOT NULL,
          setting_value TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // Insert default settings
      await client.query(`
        INSERT INTO admin_settings (setting_key, setting_value, description) VALUES 
        ('payment_enabled', 'true', 'Whether payment is required for job postings'),
        ('job_posting_price', '100', 'Price for job posting in cents ($1.00)'),
        ('free_job_posting_limit', '0', 'Number of free job postings per user (0 = no free limit)')
        ON CONFLICT (setting_key) DO NOTHING;
      `);
      console.log('✅ Admin settings table created with default values');
    } else {
      console.log('✅ Admin settings table already exists');
    }

    console.log('\n🎉 Database schema fix completed successfully!');
    console.log('✅ Your job posting form should now work properly');
    console.log('✅ Try posting a job again - the "city" error should be resolved');

  } catch (error) {
    console.error('❌ Error fixing database schema:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the fix
fixDatabaseSchema().catch(console.error); 