const express = require('express');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.SUPABASE_URL });
const router = express.Router();

// Middleware to verify JWT (we’ll add this later)
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// Create application (student only)
router.post('/', verifyToken, async (req, res) => {
  const { first_name, last_name, email, program, essay } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO applications (student_id, first_name, last_name, email, program, essay) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, first_name, last_name, email, program, essay]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all applications (admin only)
router.get('/', verifyToken, async (req, res) => {
  // Check if user is admin (we’ll add role check later)
  try {
    const result = await pool.query('SELECT * FROM applications ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update application status (admin only)
router.patch('/:id/status', verifyToken, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE applications SET status = $1, updated_at = now() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Application not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete application (student or admin)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM applications WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Application not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
