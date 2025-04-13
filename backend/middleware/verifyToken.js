import jwt from 'jsonwebtoken';

const secretKey = "zxcvasdfgtrewqyhbvcxzfdsahfs";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("Decoded token payload:", decoded);
    req.roll_no = decoded.roll_no;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default verifyToken;
