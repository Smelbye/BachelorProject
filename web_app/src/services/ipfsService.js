import { create } from 'ipfs-http-client';
import { serverAPI } from './blockchain';

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export async function uploadToIPFS(data) {
  const { path } = await ipfs.add(data);
  return path;
}

export async function saveIPFSHashToBackend(patientAddress, ipfsHash) {
  const response = await serverAPI.post('/ipfsHash', {
    patientAddress,
    ipfsHash,
  });

  return response.data;
}
