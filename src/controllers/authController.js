const { User, users } = require('../models/user');
const { generateToken } = require('../utils/jwt');

function register(req, res) {
  const { username, password } = req.body;
  if (User.findUser(username)) {
    return res.status(400).send('User already exists');
  }
  const newUser = new User(username, password);
  users.push(newUser);
  res.status(201).send('User registered');
}

function login(req, res) {
  const { username, password } = req.body;
  const user = User.findUser(username);
  if (!user || !User.validatePassword(password, user.password)) {
    return res.status(401).send('Invalid credentials');
  }
  const token = generateToken(user);
  res.status(200).json({ token });
}

module.exports = { register, login };
