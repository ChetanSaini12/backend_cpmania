const crypto = require('crypto');
const fs = require('fs');

// Generate a new RSA key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 4096, // key size
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  }
});

// Save the keys to files
fs.writeFileSync('private.key', privateKey);
fs.writeFileSync('public.key', publicKey);

console.log('Private and public keys generated and saved.');
