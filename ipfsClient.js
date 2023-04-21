const IPFS = require('ipfs-http-client');

const ipfsClient = IPFS.create({
  url: process.env.IPFS_API_ENDPOINT,
  headers: {
    authorization: `Bearer ${process.env.IPFS_API_KEY_SECRET}`,
  },
});

module.exports = ipfsClient;
