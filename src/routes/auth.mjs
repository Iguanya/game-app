import express from 'express';
import { User } from '../controllers/user.mjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = express.Router();
const secret = '12345';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/game-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (await User.findUser(username)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findUser(username);
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!User.validatePassword(password, user.password)) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username: user.username }, secret, { expiresIn: '1h' });
    res.status(200).json({ token, blockchainAddress: user.blockchainAddress });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
