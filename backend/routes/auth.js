const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.SUPABASE_URL });

const router = express.Router();

// Register Student
router.post('/register/student', async (req, res) => {
  const { email, password, full_name } = req.body;
  try {
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    // Insert into students table
    const result = await pool.query(
      'INSERT INTO students (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email',
      [email, password_hash, full_name]
    );
    const user = result.rows[0];
    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login (for both students and admins—we’ll add admin logic later)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists in students or admins
    const studentResult = await pool.query('SELECT * FROM students WHERE email = $1', [email]);
    const adminResult = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    const user = studentResult.rows[0] || adminResult.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
