const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Generate key pair (use the keys generated from keygenerator.js)
const myKey = ec.keyFromPrivate('your-private-key-here');
const myWalletAddress = myKey.getPublic('hex');

// Create a new blockchain instance
let daoCoin = new Blockchain();

// Create a new transaction and sign it with your key
const tx1 = new Transaction(myWalletAddress, 'public-key-of-recipient', 10);
tx1.signTransaction(myKey);
daoCoin.addTransaction(tx1);

console.log('\n Starting the miner...');
daoCoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of my wallet is', daoCoin.getBalanceOfAddress(myWalletAddress));

console.log('\n Starting the miner again...');
daoCoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of my wallet is', daoCoin.getBalanceOfAddress(myWalletAddress));
