const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/admin/applications
 * @desc    Get all applications (with optional status filter)
 * @access  Private (Admin only)
 */
router.get('/applications', authenticateToken, requireAdmin, adminController.getAllApplications);

/**
 * @route   GET /api/admin/statistics
 * @desc    Get application statistics
 * @access  Private (Admin only)
 */
router.get('/statistics', authenticateToken, requireAdmin, adminController.getStatistics);

/**
 * @route   GET /api/admin/applications/:applicationId
 * @desc    Get single application details
 * @access  Private (Admin only)
 */
router.get('/applications/:applicationId', authenticateToken, requireAdmin, adminController.getApplicationDetails);

/**
 * @route   PUT /api/admin/applications/:applicationId/status
 * @desc    Update application status
 * @access  Private (Admin only)
 */
router.put('/applications/:applicationId/status', authenticateToken, requireAdmin, adminController.updateApplicationStatus);

/**
 * @route   DELETE /api/admin/applications/:applicationId
 * @desc    Delete application
 * @access  Private (Admin only)
 */
router.delete('/applications/:applicationId', authenticateToken, requireAdmin, adminController.deleteApplication);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
router.get('/users', authenticateToken, requireAdmin, adminController.getAllUsers);

/**
 * @route   POST /api/admin/users
 * @desc    Create new user
 * @access  Private (Admin only)
 */
router.post('/users', authenticateToken, requireAdmin, adminController.createUser);

/**
 * @route   PUT /api/admin/users/:userId
 * @desc    Update user
 * @access  Private (Admin only)
 */
router.put('/users/:userId', authenticateToken, requireAdmin, adminController.updateUser);

/**
 * @route   DELETE /api/admin/users/:userId
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete('/users/:userId', authenticateToken, requireAdmin, adminController.deleteUser);

/**
 * @route   GET /api/admin/security-settings
 * @desc    Get security settings
 * @access  Private (Admin only)
 */
router.get('/security-settings', authenticateToken, requireAdmin, adminController.getSecuritySettings);

/**
 * @route   PUT /api/admin/security-settings
 * @desc    Update security settings
 * @access  Private (Admin only)
 */
router.put('/security-settings', authenticateToken, requireAdmin, adminController.updateSecuritySettings);

module.exports = router;
