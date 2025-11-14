const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const hash = async (password) => {
  const salt = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
  return bcrypt.hash(password, salt);
};

const compare = (password, hashPw) => bcrypt.compare(password, hashPw);

const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

module.exports = { hash, compare, signToken };
