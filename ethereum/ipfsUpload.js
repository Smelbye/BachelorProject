const IPFS = require('ipfs-http-client');
const ipfs = IPFS.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

async function uploadToIPFS(data) {
  const { path } = await ipfs.add(data);
  return path;
}

(async () => {
  const medicalData = "Some medical data";
  const ipfsHash = await uploadToIPFS(medicalData);
  console.log("IPFS hash:", ipfsHash);
})();
