const jwt = require('jsonwebtoken');
const User = require('../models/utilisateur');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPhone(decoded.telephone);

    if (!user) {
      res.status(200).json({ message: 'authentifier.' });
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Veuillez vous authentifier.' });
  }
};

module.exports = authMiddleware;