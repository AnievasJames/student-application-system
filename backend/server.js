const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg'); // PostgreSQL client

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection (Supabase)
const pool = new Pool({
  connectionString: process.env.SUPABASE_URL,
  // For Supabase, you might need to use the `pg` client with SSL
  ssl: { rejectUnauthorized: false },
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to Supabase PostgreSQL');
});

// Routes (we’ll add these in Phase 3)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/applications', require('./routes/applications'));

app.listen(port, () => console.log(`Backend running on port ${port}`));
