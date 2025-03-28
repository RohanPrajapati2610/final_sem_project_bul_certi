const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use environment variable

const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id,
            email: user.email,
            role: user.role || 'user'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({
            msg: "Access denied. No token provided.",
            isSuccess: false
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send({
            msg: "Invalid token",
            isSuccess: false
        });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send({
            msg: "Access denied. Admin rights required.",
            isSuccess: false
        });
    }
};

const isOrganization = (req, res, next) => {
    if (req.user && (req.user.role === 'organization' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).send({
            msg: "Access denied. Organization rights required.",
            isSuccess: false
        });
    }
};

module.exports = {
    generateToken,
    verifyToken,
    isAdmin,
    isOrganization
}; 