module.exports = (roles = []) => (req, res, next) => {
  const roleArr = Array.isArray(roles) ? roles : [roles];
  if (!roleArr.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  next();
};
