import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, age, employeeId, department, jobRole, experience, skills } = req.body;

    if (!name || !email || !password || age === undefined || !department || !jobRole || experience === undefined) {
      res.status(400);
      throw new Error('Please include all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Parse skills from comma-separated string to array
    const skillsArray = skills
      ? skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      age: Number(age),
      employeeId: employeeId || '',
      department,
      jobRole,
      experience: Number(experience),
      skills: skillsArray,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        employeeId: user.employeeId,
        department: user.department,
        jobRole: user.jobRole,
        experience: user.experience,
        skills: user.skills,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please include email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        employeeId: user.employeeId,
        department: user.department,
        jobRole: user.jobRole,
        experience: user.experience,
        skills: user.skills,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user details
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        employeeId: user.employeeId,
        department: user.department,
        jobRole: user.jobRole,
        experience: user.experience,
        skills: user.skills,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
