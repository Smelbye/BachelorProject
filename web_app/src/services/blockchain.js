import Web3 from "web3";
import axios from "axios";
import PatientContractData from "../contracts/PatientContract.json";

const SAWTOOTH_REST_API = "http://localhost:8008";
const ETH_RPC_URL = "http://localhost:7545";
const SERVER_API = "http://localhost:3000";
const PATIENT_CONTRACT_ADDRESS = "INSERT_MIGRATED_CONTRACT_ADDRESS_FROM_GANACHE";

export const web3 = new Web3(new Web3.providers.HttpProvider(ETH_RPC_URL));
const patientContractABI = PatientContractData.abi;
export const patientContract = new web3.eth.Contract(patientContractABI, PATIENT_CONTRACT_ADDRESS);
export const serverAPI = axios.create({ baseURL: SERVER_API });

// Add the submitMedicalDataToIPFS function
export async function submitMedicalDataToIPFS(data) {
  try {
    const response = await serverAPI.post('/ipfsData', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting medical data to IPFS:', error);
    throw error;
  }
}

async function submitDoctorFeedback(patientAddress, feedback, ipfsHash) {
  // Ethereum smart contract update
  const accounts = await web3.eth.getAccounts();
  const fromAddress = accounts[0]; // Assuming the doctor's address is the first account

  const payload = {
    action: 'submit_feedback',
    doctor_address: fromAddress,
    patient_address: patientAddress,
    feedback: feedback,
    ipfs_hash: ipfsHash,
  };
  await submitSawtoothTransaction(payload);

  // Add doctor's feedback to the patient's record in the smart contract
  await patientContract.methods
    .addDoctorFeedback(patientAddress, feedback, ipfsHash)
    .send({ from: fromAddress });
}



// Add the submitSawtoothTransaction function
export async function submitSawtoothTransaction(transactionData) {
  try {
    const response = await serverAPI.post('/submitTransaction', transactionData);
    return response.data;
  } catch (error) {
    console.error('Error submitting Sawtooth transaction:', error);
    throw error;
  }
}

// Fetch medical data hashes for a given patient
export async function getMedicalDataHashes(patientAddress) {
  const response = await serverAPI.get(`/medicalData/${patientAddress}`);
  return response.data;
}

// Fetch IPFS hash for a given medical data hash
export async function getIPFSHash(medicalDataHash) {
  const response = await serverAPI.get(`/ipfsHash/${medicalDataHash}`);
  return response.data;
}

// Fetch Sawtooth transactions for a given patient
export async function getSawtoothTransactions(patientAddress) {
  const response = await serverAPI.get(`/sawtoothTransactions/${patientAddress}`);
  return response.data;
}

// Fetch Sawtooth Doctor TX history
export async function getDoctorHistory() {
  try {
    const response = await axios.get(`${SAWTOOTH_REST_API}/doctor_history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor history:', error);
    throw error;
  }
}

// Fetch doctor feedback for a given patient
export async function getDoctorFeedback(doctorAddress, patientAddress) {
  try {
    const doctorFeedback = await patientContract.methods
      .getDoctorFeedback(doctorAddress, patientAddress)
      .call();
    return doctorFeedback;
  } catch (error) {
    console.error('Error getting doctor feedback:', error);
    throw error;
  }
}


export async function registerSawtoothEventHandler(callback) {
  try {
    const response = await listenToSawtoothEvents();
    callback(response);
  } catch (error) {
    console.error('Error registering Sawtooth event handler:', error);
  }
}


export const getMedicalData = async (patientAddress) => {
  try {
    const medicalData = await patientContract.methods
      .getPatientMedicalData(patientAddress)
      .call();
    return medicalData;
  } catch (error) {
    console.error('Error getting medical data:', error);
    throw error;
  }
};


export async function listenToSawtoothEvents(data) {
  try {
    const response = await serverAPI.post('/listenSawtoothEvents', data);
    return response.data;
  } catch (error) {
    console.error('Error listening to Sawtooth events:', error);
    throw error;
  }
}
