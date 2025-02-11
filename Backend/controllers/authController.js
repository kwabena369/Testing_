const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { email, password, supabaseId } = req.body;

  try {
    // Hash password for local database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in local database
   let done =   await User.create({
      email,
      password: hashedPassword,
      supabaseId: supabaseId,
    });

    res.status(200).json({
      message: 'Login successful',
      user: { id: done.id, email: done.email },
    });
    
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'User already exists' });
    }
    console.log(error,"8888")
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user in local database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error during login' });
  }
};

exports.googleLogin = async (req, res) => {
  const { email, supabaseId } = req.body;

  try {
    // Find or create user in local database
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { email, supabaseId },
    });

    res.status(200).json({
      message: 'Google login successful',
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error during Google login' });
  }
};
