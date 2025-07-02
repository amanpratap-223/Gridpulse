// controllers/authController.js
import Attendant from '../models/attendant.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, substation: user.substation },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export const signup = async (req, res) => {
  const { name, email, password, substation } = req.body;

  console.log("Received signup request:", req.body); 

  try {
    const exists = await Attendant.findOne({ email });
    if (exists) {
      console.log("User already exists:", email); // show why 400 is triggered
      return res.status(400).json({ message: 'User already exists' });
    }

    const attendant = await Attendant.create({ name, email, password, substation });
    const token = generateToken(attendant);

    return res.status(201).json({
      token,
      attendant: { id: attendant._id, name, email, substation }
    });
  } catch (err) {
    console.error('Signup failed:', err); // ✅ catch internal issues
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const attendant = await Attendant.findOne({ email });
    if (!attendant || !(await attendant.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(attendant);
    res.json({
      token,
      attendant: { id: attendant._id, name: attendant.name, email: attendant.email, substation: attendant.substation }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
