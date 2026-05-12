import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, bio, skills, experience } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;
    if (experience) user.experience = experience;

    // Handle profile picture upload
    if (req.file) {
      user.profilePicture = req.file.path;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Resume Upload Attempt:', { 
      userId: req.user.userId, 
      filePath: req.file.path 
    });

    user.resume = req.file.path;
    await user.save();

    console.log('Resume Saved Successfully for user:', user._id);

    res.status(200).json({
      message: 'Resume uploaded successfully',
      resume: req.file.path,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadCoverLetter = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Cover letter file required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.coverLetter = req.file.path;
    await user.save();

    res.status(200).json({
      message: 'Cover letter uploaded successfully',
      coverLetter: req.file.path,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
