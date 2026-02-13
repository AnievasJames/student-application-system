const supabase = require('../config/supabase');

/**
 * Get all applications (admin only)
 * GET /api/admin/applications
 */
const getAllApplications = async (req, res) => {
  try {
    const { status, sortBy = 'submitted_at', order = 'desc' } = req.query;

    let query = supabase
      .from('applications')
      .select(`
        *,
        users (
          id,
          email,
          first_name,
          last_name
        )
      `);

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: order === 'asc' });

    const { data: applications, error } = await query;

    if (error) {
      console.error('Fetch all applications error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch applications.' 
      });
    }

    // Get document counts for each application
    const applicationsWithCounts = await Promise.all(
      applications.map(async (app) => {
        const { count } = await supabase
          .from('documents')
          .select('id', { count: 'exact', head: true })
          .eq('application_id', app.id);

        return {
          ...app,
          documentCount: count || 0
        };
      })
    );

    res.status(200).json({
      applications: applicationsWithCounts,
      totalCount: applicationsWithCounts.length
    });

  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching applications.' 
    });
  }
};

/**
 * Get application details by ID (admin only)
 * GET /api/admin/applications/:id
 */
const getApplicationDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch application with user details
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        *,
        users (
          id,
          email,
          first_name,
          last_name,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (appError || !application) {
      return res.status(404).json({ 
        error: 'Application not found.' 
      });
    }

    // Fetch documents
    const { data: documents } = await supabase
      .from('documents')
      .select('*')
      .eq('application_id', id)
      .order('uploaded_at', { ascending: false });

    // Fetch student profile
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', application.user_id)
      .single();

    res.status(200).json({
      application,
      documents: documents || [],
      profile: profile || null
    });

  } catch (error) {
    console.error('Get application details error:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching application details.' 
    });
  }
};

/**
 * Update application status (admin only)
 * PUT /api/admin/applications/:id/status
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.user.id;

    // Validation
    const validStatuses = ['submitted', 'under_review', 'evaluated', 'accepted', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // Check if application exists
    const { data: existingApp } = await supabase
      .from('applications')
      .select('id, status')
      .eq('id', id)
      .single();

    if (!existingApp) {
      return res.status(404).json({ 
        error: 'Application not found.' 
      });
    }

    // Update application status
    const { data: updatedApplication, error: updateError } = await supabase
      .from('applications')
      .update({
        status,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Status update error:', updateError);
      return res.status(500).json({ 
        error: 'Failed to update application status.' 
      });
    }

    // Log admin action
    await supabase
      .from('admin_actions')
      .insert([
        {
          admin_id: adminId,
          action_type: 'status_update',
          target_type: 'application',
          target_id: id,
          details: {
            old_status: existingApp.status,
            new_status: status
          }
        }
      ]);

    res.status(200).json({
      message: 'Application status updated successfully.',
      application: updatedApplication
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ 
      error: 'An error occurred while updating application status.' 
    });
  }
};

/**
 * Update AI evaluation for an application (admin only)
 * PUT /api/admin/applications/:id/ai-evaluation
 */
const updateAIEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const { aiScore, aiRanking } = req.body;
    const adminId = req.user.id;

    // Validation
    if (aiScore === undefined || aiRanking === undefined) {
      return res.status(400).json({ 
        error: 'AI score and ranking are required.' 
      });
    }

    if (aiScore < 0 || aiScore > 100) {
      return res.status(400).json({ 
        error: 'AI score must be between 0 and 100.' 
      });
    }

    // Check if application exists
    const { data: existingApp } = await supabase
      .from('applications')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingApp) {
      return res.status(404).json({ 
        error: 'Application not found.' 
      });
    }

    // Update AI evaluation
    const { data: updatedApplication, error: updateError } = await supabase
      .from('applications')
      .update({
        ai_score: aiScore,
        ai_ranking: aiRanking,
        ai_evaluation_date: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('AI evaluation update error:', updateError);
      return res.status(500).json({ 
        error: 'Failed to update AI evaluation.' 
      });
    }

    // Log admin action
    await supabase
      .from('admin_actions')
      .insert([
        {
          admin_id: adminId,
          action_type: 'ai_evaluation',
          target_type: 'application',
          target_id: id,
          details: {
            ai_score: aiScore,
            ai_ranking: aiRanking
          }
        }
      ]);

    res.status(200).json({
      message: 'AI evaluation updated successfully.',
      application: updatedApplication
    });

  } catch (error) {
    console.error('Update AI evaluation error:', error);
    res.status(500).json({ 
      error: 'An error occurred while updating AI evaluation.' 
    });
  }
};

/**
 * Get application statistics (admin only)
 * GET /api/admin/statistics
 */
const getStatistics = async (req, res) => {
  try {
    // Get total applications count
    const { count: totalApplications } = await supabase
      .from('applications')
      .select('id', { count: 'exact', head: true });

    // Get counts by status
    const statusCounts = {};
    const statuses = ['submitted', 'under_review', 'evaluated', 'accepted', 'rejected'];
    
    for (const status of statuses) {
      const { count } = await supabase
        .from('applications')
        .select('id', { count: 'exact', head: true })
        .eq('status', status);
      statusCounts[status] = count || 0;
    }

    // Get average AI score
    const { data: aiScores } = await supabase
      .from('applications')
      .select('ai_score')
      .not('ai_score', 'is', null);

    const averageAIScore = aiScores && aiScores.length > 0
      ? aiScores.reduce((sum, app) => sum + parseFloat(app.ai_score), 0) / aiScores.length
      : 0;

    // Get recent applications (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: recentApplications } = await supabase
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .gte('submitted_at', sevenDaysAgo.toISOString());

    res.status(200).json({
      statistics: {
        totalApplications: totalApplications || 0,
        statusCounts,
        averageAIScore: averageAIScore.toFixed(2),
        recentApplications: recentApplications || 0
      }
    });

  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching statistics.' 
    });
  }
};

/**
 * Get admin action logs (admin only)
 * GET /api/admin/logs
 */
const getAdminLogs = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const { data: logs, error } = await supabase
      .from('admin_actions')
      .select(`
        *,
        users (
          email,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      console.error('Fetch admin logs error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch admin logs.' 
      });
    }

    res.status(200).json({
      logs: logs || []
    });

  } catch (error) {
    console.error('Get admin logs error:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching admin logs.' 
    });
  }
};

/**
 * Delete application (admin only)
 * DELETE /api/admin/applications/:id
 */
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    // Check if application exists
    const { data: application } = await supabase
      .from('applications')
      .select('id, full_name')
      .eq('id', id)
      .single();

    if (!application) {
      return res.status(404).json({ 
        error: 'Application not found.' 
      });
    }

    // Log the action before deletion
    await supabase
      .from('admin_actions')
      .insert([
        {
          admin_id: adminId,
          action_type: 'delete_application',
          target_type: 'application',
          target_id: id,
          details: {
            application_name: application.full_name
          }
        }
      ]);

    // Delete application (cascade will handle documents)
    const { error: deleteError } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Application deletion error:', deleteError);
      return res.status(500).json({ 
        error: 'Failed to delete application.' 
      });
    }

    res.status(200).json({ 
      message: 'Application deleted successfully.' 
    });

  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ 
      error: 'An error occurred while deleting the application.' 
    });
  }
};

module.exports = {
  getAllApplications,
  getApplicationDetails,
  updateApplicationStatus,
  updateAIEvaluation,
  getStatistics,
  getAdminLogs,
  deleteApplication
};
