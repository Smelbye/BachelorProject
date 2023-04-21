import { web3, patientContract, serverAPI } from "./blockchain";

async function main() {
  await window.ethereum.enable();

  const accounts = await web3.eth.getAccounts();
  const patientAccount = accounts[0];

  const dataHash = "QmWmyoMoctfbAaiEs2G46gpeUmhqFRDW6KWo64y5r581Vz";
  const description = "Blood pressure data";
  const bloodPressureData = [120, 80, 125, 85, 110, 70];

  try {
    const receipt = await patientContract.methods
      .submitMedicalData(dataHash, description, bloodPressureData)
      .send({ from: patientAccount });

    console.log("Data uploaded successfully. Transaction receipt:", receipt);

    // Save the transaction receipt to the backend server
    const response = await serverAPI.post('/medicalData', {
      patientAddress: patientAccount,
      transactionHash: receipt.transactionHash,
      dataHash,
      description,
    });

    console.log('Data saved to backend:', response.data);
  } catch (error) {
    console.error("Error uploading data:", error);
  }
}

main().catch(console.error);
