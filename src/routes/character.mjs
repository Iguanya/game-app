import express from 'express';
import { Character } from '../controllers/character.mjs';
import { User } from '../controllers/user.mjs';  // Assuming user model is in this path

const router = express.Router();

// Route to get all characters
router.get('/', async (req, res) => {
  try {
    const characters = await Character.find();
    res.status(200).json(characters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to select a character
router.post('/selectCharacter', async (req, res) => {
  const { character } = req.body;
  const token = req.headers['authorization'].split(' ')[1];
  const decoded = jwt.verify(token, 'your_secret_key'); // replace 'your_secret_key' with your actual secret key

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
