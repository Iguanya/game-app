import mongoose from 'mongoose';
import express from 'express';
import jwt from 'jsonwebtoken';

const characterSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: String,
});

const Character = mongoose.models.Character || mongoose.model('Character', characterSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: String,
  character: String,
  blockchainAddress: String,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const characters = await Character.find();
    res.status(200).json(characters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/selectCharacter', async (req, res) => {
  const { character } = req.body;
  const token = req.headers['authorization'].split(' ')[1];
  const decoded = jwt.verify(token, '12345');

  try {
    const user = await User.findOne({ username: decoded.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.character = character;
    await user.save();

    res.status(200).json({ message: `Character ${character} selected for user ${user.username}`, blockchainAddress: user.blockchainAddress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
