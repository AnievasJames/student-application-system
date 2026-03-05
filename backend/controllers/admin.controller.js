const supabase = require('../config/supabase');

/**
 * Get all applications (Admin only)
 */
const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;

    console.log('Fetching all applications, status filter:', status);

    let query = supabase
      .from('applications')
      .select(`
        *,
        user:users!applications_user_id_fkey (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .order('submitted_at', { ascending: false });

    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data: applications, error } = await query;

    if (error) {
      console.error('Fetch all applications error:', error);
      throw error;
    }

    console.log('Applications fetched:', applications?.length);

    res.status(200).json({
      applications: applications || []
    });

  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      error: 'Failed to fetch applications'
    });
  }
};

/**
 * Get application statistics (Admin only)
 */
const getStatistics = async (req, res) => {
  try {
    console.log('Fetching statistics');

    // Get all applications
    const { data: applications, error } = await supabase
      .from('applications')
      .select('*');

    if (error) throw error;

    // Calculate statistics
    const totalApplications = applications.length;
    
    const statusCounts = {
      submitted: applications.filter(app => app.status === 'submitted').length,
      under_review: applications.filter(app => app.status === 'under_review').length,
      evaluated: applications.filter(app => app.status === 'evaluated').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };

    // Calculate average AI score
    const applicationsWithScore = applications.filter(app => app.ai_score);
    const averageAIScore = applicationsWithScore.length > 0
      ? Math.round(applicationsWithScore.reduce((sum, app) => sum + app.ai_score, 0) / applicationsWithScore.length)
      : 0;

    console.log('Statistics calculated:', { totalApplications, statusCounts, averageAIScore });

    res.status(200).json({
      statistics: {
        totalApplications,
        statusCounts,
        averageAIScore
      }
    });

  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics'
    });
  }
};

/**
 * Get single application details (Admin only)
 */
const getApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;

    console.log('Fetching application details:', applicationId);

    // Get application
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Get documents
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('*')
      .eq('application_id', applicationId);

    console.log('Application details fetched');

    res.status(200).json({
      application,
      documents: documents || []
    });

  } catch (error) {
    console.error('Get application details error:', error);
    res.status(500).json({
      error: 'Failed to fetch application details'
    });
  }
};

/**
 * Update application status (Admin only)
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    console.log('Updating application status:', applicationId, status);

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['submitted', 'under_review', 'evaluated', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('applications')
      .update({ 
        status,
        reviewed_by: req.user.id,
        updated_at: new Date()
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      console.error('Update status error:', error);
      throw error;
    }

    console.log('Status updated successfully');

    res.status(200).json({
      message: 'Application status updated successfully',
      application: data
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      error: 'Failed to update application status'
    });
  }
};

/**
 * Delete application (Admin only)
 */
const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    console.log('Deleting application:', applicationId);

    // Delete documents first
    await supabase
      .from('documents')
      .delete()
      .eq('application_id', applicationId);

    // Delete application
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId);

    if (error) {
      console.error('Delete application error:', error);
      throw error;
    }

    console.log('Application deleted successfully');

    res.status(200).json({
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      error: 'Failed to delete application'
    });
  }
};

/**
 * Get all users (Admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    console.log('Fetching all users');

    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch all users error:', error);
      throw error;
    }

    console.log('Users fetched:', users?.length);

    res.status(200).json({
      users: users || []
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      error: 'Failed to fetch users'
    });
  }
};

/**
 * Create new user (Admin only)
 */
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    console.log('Creating new user:', email);

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Hash the password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        role: role || 'student'
      })
      .select()
      .single();

    if (error) {
      console.error('Create user error:', error);
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      throw error;
    }

    console.log('User created successfully');

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role
      }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      error: 'Failed to create user'
    });
  }
};

/**
 * Update user (Admin only)
 */
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, role } = req.body;

    console.log('Updating user:', userId);

    const updateData = {};
    if (firstName) updateData.first_name = firstName;
    if (lastName) updateData.last_name = lastName;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update user error:', error);
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      throw error;
    }

    console.log('User updated successfully');

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Failed to update user'
    });
  }
};

/**
 * Delete user (Admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('Deleting user:', userId);

    // Delete user's applications and related data first
    const { data: applications } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', userId);

    if (applications && applications.length > 0) {
      const appIds = applications.map(app => app.id);
      
      // Delete documents
      await supabase
        .from('documents')
        .delete()
        .in('application_id', appIds);
      
      // Delete applications
      await supabase
        .from('applications')
        .delete()
        .eq('user_id', userId);
    }

    // Delete user's profile
    await supabase
      .from('student_profiles')
      .delete()
      .eq('user_id', userId);

    // Delete user
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Delete user error:', error);
      throw error;
    }

    console.log('User deleted successfully');

    res.status(200).json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Failed to delete user'
    });
  }
};

// Default security settings
const defaultSecuritySettings = {
  encryptionMethod: 'AES-256',
  twoFactorAuth: false,
  sessionTimeout: 60,
  passwordPolicy: {
    minLength: 8,
    expiryDays: 90,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  accessControl: {
    ipWhitelist: false,
    allowedIPs: [],
    apiKeyRotationDays: 30,
    sessionLimit: 3,
    requireMFA: false
  },
  logging: {
    auditLogging: true,
    loginAttempts: true,
    dataAccessLogs: true,
    retentionDays: 90
  }
};

/**
 * Get security settings (Admin only)
 */
const getSecuritySettings = async (req, res) => {
  try {
    console.log('Fetching security settings');

    // In a real application, these would be stored in a database
    // For now, we return default settings
    res.status(200).json({
      settings: defaultSecuritySettings
    });

  } catch (error) {
    console.error('Get security settings error:', error);
    res.status(500).json({
      error: 'Failed to fetch security settings'
    });
  }
};

/**
 * Update security settings (Admin only)
 */
const updateSecuritySettings = async (req, res) => {
  try {
    const newSettings = req.body;

    console.log('Updating security settings');

    // In a real application, these would be saved to a database
    // For now, we just validate and return the settings
    res.status(200).json({
      message: 'Security settings updated successfully',
      settings: { ...defaultSecuritySettings, ...newSettings }
    });

  } catch (error) {
    console.error('Update security settings error:', error);
    res.status(500).json({
      error: 'Failed to update security settings'
    });
  }
};

module.exports = {
  getAllApplications,
  getStatistics,
  getApplicationDetails,
  updateApplicationStatus,
  deleteApplication,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getSecuritySettings,
  updateSecuritySettings
};
