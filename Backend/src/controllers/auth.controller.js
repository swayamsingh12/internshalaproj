const { User } = require('../models');
const authService = require('../services/auth.service');

exports.signup = async (req, res) => {
  try {
    const { name, email, address, password ,role} = req.body;
    const pw = await authService.hash(password);
    const user = await User.create({ name, email, address, password: pw, role: role || 'normal' });
    return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }});
  } catch (err) { return res.status(400).json({ error: err.message }); }
};

exports.login = async (req, res) => {

  
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }});
    if(!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await authService.compare(password, user.password);
    if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = authService.signToken({ id: user.id, role: user.role });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role }});
  } catch (err){ return res.status(500).json({ error: err.message }); }
};

exports.logout = async (req, res) => {
  return res.json({ ok: true, msg: 'Logged out (client should delete token)' });
};

exports.updatePassword = async (req, res) => {
  try {
    const userEmail = req.user.email; 
    const {newPassword } = req.body;

    if (!newPassword)
      return res.status(400).json({ error: "Missing passwords" });

    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashed = await authService.hash(newPassword);
    user.password = hashed;
    await user.save();

    return res.json({ ok: true, msg: "Password updated" });
  } catch (err) {
    console.error("auth.updatePassword error", err);
    return res.status(500).json({ error: err.message });
  }
};
