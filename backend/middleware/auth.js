import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// Authentication middleware to protect routes
const auth = async (req, res, next) => {
    try {
        console.log('Auth middleware called with headers:', req.headers);
        
        // Get token from Authorization header
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('Token extracted from Authorization header:', token);
        } else if (req.headers.token) {
            token = req.headers.token;
            console.log('Token extracted from token header:', token);
        } else {
            console.log('No token found in headers');
        }

        // Check if token exists
        if (!token) {
            console.log('No token provided, returning 401');
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized, no token' 
            });
        }

        try {
            // Verify token
            console.log('Verifying token with JWT_SECRET');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);
            
            // Add user data to request object
            if (decoded.id) {
                console.log('Found ID in decoded token:', decoded.id);
                
                // Find user by ID
                console.log('Looking up user with ID:', decoded.id);
                const user = await userModel.findById(decoded.id);
                
                if (!user) {
                    console.log('User not found with ID:', decoded.id);
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }
                
                console.log('User found:', user.name, user.email);
                console.log('User cart data:', user.cartData);
                
                // Add user to request object
                req.user = user;
                console.log('User added to request object');
                next();
            } else {
                console.log('No ID found in decoded token:', decoded);
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during authentication'
        });
    }
};

export default auth;