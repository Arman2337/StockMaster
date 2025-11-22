const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();


async function auth(req, res, next) {
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ error: 'Missing auth header' });
const token = authHeader.split(' ')[1];
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findByPk(payload.id);
if (!user) return res.status(401).json({ error: 'Invalid token' });
req.user = user;
next();
} catch (err) {
return res.status(401).json({ error: 'Invalid token' });
}
}


module.exports = auth;