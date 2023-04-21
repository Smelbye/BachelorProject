const IPFS = require('ipfs-http-client');
const ipfs = IPFS.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

async function getDataFromIPFS(ipfsHash) {
  const data = await ipfs.cat(ipfsHash);
  return data;
}

(async () => {
  const ipfsHash = "0x..."; // Replace with an actual IPFS hash
  const medicalData = await getDataFromIPFS(ipfsHash);
  console.log("Medical data:", medicalData.toString());
})();
