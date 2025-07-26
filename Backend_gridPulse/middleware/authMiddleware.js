import jwt from 'jsonwebtoken';
import User from '../models/attendant.js'; // ✅ Replace Attendant import

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user (attendant or manager)
    const user = await User.findById(decoded.id)
      .select('-password')
      .populate('substation', 'name location');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // ✅ Attach to req.user instead of req.attendant
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};
