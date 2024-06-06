import bcrypt from 'bcryptjs';
import pkg from 'elliptic';
import mongoose from 'mongoose';

const { ec: EC } = pkg;
const ec = new EC('secp256k1');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  character: String,
  blockchainAddress: String,
});

userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  if (!this.blockchainAddress) {
    const keyPair = ec.genKeyPair();
    this.blockchainAddress = keyPair.getPublic('hex');
  }
  next();
});

userSchema.statics.findUser = function(username) {
  return this.findOne({ username });
};

userSchema.statics.validatePassword = function(inputPassword, userPassword) {
  return bcrypt.compareSync(inputPassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export { User };
