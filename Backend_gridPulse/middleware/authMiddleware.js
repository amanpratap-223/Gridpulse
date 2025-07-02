import jwt from 'jsonwebtoken';
import Attendant from '../models/attendant.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const attendant = await Attendant.findById(decoded.id)
      .select('-password')
      .populate('substation');

    if (!attendant) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.attendant = attendant; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};
