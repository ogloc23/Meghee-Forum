import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  // Get token from Authorization header (Format: 'Bearer <token>')
  const token = req.headers.authorization?.split(' ')[1];

  // If no token is found, just continue with the request without attaching user
  if (!token) {
    req.user = null; // Ensure that `user` is null if no token is provided
    return next();
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vybz_kartel_2003');
    req.user = decoded; // Attach user information to the request object (decoded token)
    return next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Invalid or expired token', err);
     // Set user to null in case of invalid token
    return next(); // Proceed even if token is invalid, but set user as null
  }
};

export default authMiddleware;
