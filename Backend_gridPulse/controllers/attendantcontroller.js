import User from '../models/attendant.js';
import jwt from 'jsonwebtoken';
import { Substation } from "../models/powerData.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, substation: user.substation, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// ✅ Signup
export const signup = async (req, res) => {
  const { name, email, password, substation } = req.body;
  console.log("📥 Signup request:", req.body);

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "attendant",
      substation: substation || null
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, substation: user.substation },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name, email, role: user.role, substation: user.substation }
    });
  } catch (err) {
    console.error("❌ Signup failed:", err.message);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};


// ✅ Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, substation: user.substation }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// ✅ Get All Attendants (Managers only later)
export const getAllAttendants = async (req, res) => {
  try {
    const attendants = await User.find({ role: "attendant" })
      .populate("substation", "name location")
      .select("name email substation role");

    res.status(200).json(attendants);
  } catch (error) {
    console.error("Error fetching attendants:", error.message);
    res.status(500).json({ error: "Failed to fetch attendants" });
  }
};
