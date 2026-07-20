/**
 * Validates request payload for registration and login.
 */
export const validateRegister = (req, res, next) => {
  const { name, email, password, age, employeeId, department, jobRole, experience } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Name is required' });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  if (age === undefined || age === null || isNaN(age) || Number(age) <= 0) {
    return res.status(400).json({ message: 'A valid age is required' });
  }

  if (!department || !department.trim()) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  if (!jobRole || !jobRole.trim()) {
    return res.status(400).json({ message: 'Job role is required' });
  }

  if (experience === undefined || experience === null || isNaN(experience) || Number(experience) < 0) {
    return res.status(400).json({ message: 'Experience must be a positive number of years' });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  next();
};
