const supabase = require('../config/supabase');

/**
 * Get student profile
 * GET /api/profile/:userId
 */
const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.id;
    const userRole = req.user.role;

    // Authorization check: students can only view their own profile, admins can view any
    if (userRole === 'student' && userId !== requestingUserId) {
      return res.status(403).json({ 
        error: 'You can only view your own profile.' 
      });
    }

    // Fetch user basic info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role, created_at')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ 
        error: 'User not found.' 
      });
    }

    // Fetch student profile if exists
    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Return combined data
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        createdAt: user.created_at
      },
      profile: profile || null
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching profile.' 
    });
  }
};

/**
 * Update student profile
 * PUT /api/profile/:userId
 */
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.id;
    const userRole = req.user.role;

    // Authorization check: students can only update their own profile
    if (userRole === 'student' && userId !== requestingUserId) {
      return res.status(403).json({ 
        error: 'You can only update your own profile.' 
      });
    }

    const { 
      email,
      firstName, 
      lastName,
      phone,
      address,
      dateOfBirth,
      gender,
      nationality,
      profilePictureUrl
    } = req.body;

    // Update user basic info if provided
    if (email || firstName || lastName) {
      const userUpdates = {};
      if (email) userUpdates.email = email.toLowerCase();
      if (firstName) userUpdates.first_name = firstName;
      if (lastName) userUpdates.last_name = lastName;

      // Check if email already exists (if changing email)
      if (email) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', email.toLowerCase())
          .neq('id', userId)
          .single();

        if (existingUser) {
          return res.status(409).json({ 
            error: 'Email already in use by another account.' 
          });
        }
      }

      const { error: userUpdateError } = await supabase
        .from('users')
        .update(userUpdates)
        .eq('id', userId);

      if (userUpdateError) {
        console.error('User update error:', userUpdateError);
        return res.status(500).json({ 
          error: 'Failed to update user information.' 
        });
      }
    }

    // Update or create student profile
    const profileUpdates = {};
    if (phone !== undefined) profileUpdates.phone = phone;
    if (address !== undefined) profileUpdates.address = address;
    if (dateOfBirth !== undefined) profileUpdates.date_of_birth = dateOfBirth;
    if (gender !== undefined) profileUpdates.gender = gender;
    if (nationality !== undefined) profileUpdates.nationality = nationality;
    if (profilePictureUrl !== undefined) profileUpdates.profile_picture_url = profilePictureUrl;

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    let profileError;

    if (existingProfile) {
      // Update existing profile
      const { error } = await supabase
        .from('student_profiles')
        .update(profileUpdates)
        .eq('user_id', userId);
      profileError = error;
    } else {
      // Create new profile
      const { error } = await supabase
        .from('student_profiles')
        .insert([{ user_id: userId, ...profileUpdates }]);
      profileError = error;
    }

    if (profileError) {
      console.error('Profile update error:', profileError);
      return res.status(500).json({ 
        error: 'Failed to update profile information.' 
      });
    }

    // Fetch updated data
    const { data: updatedUser } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role')
      .eq('id', userId)
      .single();

    const { data: updatedProfile } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    res.status(200).json({
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        role: updatedUser.role
      },
      profile: updatedProfile
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'An error occurred while updating profile.' 
    });
  }
};

/**
 * Delete student profile (soft delete - for future implementation)
 * DELETE /api/profile/:userId
 */
const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.id;
    const userRole = req.user.role;

    // Only admins or the user themselves can delete profile
    if (userRole !== 'admin' && userId !== requestingUserId) {
      return res.status(403).json({ 
        error: 'You do not have permission to delete this profile.' 
      });
    }

    // Delete profile (cascade will handle related records)
    const { error } = await supabase
      .from('student_profiles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Delete profile error:', error);
      return res.status(500).json({ 
        error: 'Failed to delete profile.' 
      });
    }

    res.status(200).json({ 
      message: 'Profile deleted successfully.' 
    });

  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ 
      error: 'An error occurred while deleting profile.' 
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile
};
