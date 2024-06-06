import mongoose from 'mongoose';
import { Character } from '../models/character.mjs';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/game-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Add characters
const characters = [
  { name: 'Character1', description: 'A brave warrior' },
  { name: 'Character2', description: 'A skilled archer' },
  { name: 'Character3', description: 'A wise mage' },
  { name: 'Character4', description: 'A stealthy rogue' },
  { name: 'Character5', description: 'A powerful sorcerer' },
  { name: 'Character6', description: 'A fearless knight' },
  { name: 'Character7', description: 'A cunning thief' },
  { name: 'Character8', description: 'A noble paladin' },
];

Character.insertMany(characters)
  .then(() => {
    console.log('Characters added');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error adding characters:', err);
    mongoose.connection.close();
  });

