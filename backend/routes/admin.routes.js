const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/admin/applications
 * @desc    Get all applications
 * @access  Private (Admin only)
 */
router.get('/applications', authenticateToken, requireAdmin, adminController.getAllApplications);

/**
 * @route   GET /api/admin/applications/:id
 * @desc    Get application details
 * @access  Private (Admin only)
 */
router.get('/applications/:id', authenticateToken, requireAdmin, adminController.getApplicationDetails);

/**
 * @route   PUT /api/admin/applications/:id/status
 * @desc    Update application status
 * @access  Private (Admin only)
 */
router.put('/applications/:id/status', authenticateToken, requireAdmin, adminController.updateApplicationStatus);

/**
 * @route   PUT /api/admin/applications/:id/ai-evaluation
 * @desc    Update AI evaluation
 * @access  Private (Admin only)
 */
router.put('/applications/:id/ai-evaluation', authenticateToken, requireAdmin, adminController.updateAIEvaluation);

/**
 * @route   DELETE /api/admin/applications/:id
 * @desc    Delete application
 * @access  Private (Admin only)
 */
router.delete('/applications/:id', authenticateToken, requireAdmin, adminController.deleteApplication);

/**
 * @route   GET /api/admin/statistics
 * @desc    Get application statistics
 * @access  Private (Admin only)
 */
router.get('/statistics', authenticateToken, requireAdmin, adminController.getStatistics);

/**
 * @route   GET /api/admin/logs
 * @desc    Get admin action logs
 * @access  Private (Admin only)
 */
router.get('/logs', authenticateToken, requireAdmin, adminController.getAdminLogs);

module.exports = router;
