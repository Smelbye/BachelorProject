import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { web3, patientContract } from '../services/blockchain';
import { saveIPFSHashToBackend } from '../services/ipfsService';
import { create } from 'ipfs-http-client';
import './patient-medical-assistance.css';

const ipfsClient = create('https://ipfs.infura.io:5001');

const PatientMedicalAssistance = (props) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const history = useHistory();

  const PATIENT_CONTRACT_ADDRESS = "INSERT_MIGRATED_CONTRACT_ADDRESS_FROM_GANACHE";

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDashboardClick = () => {
    history.push('/dashboard');
  };

  const handleDisconnectClick = () => {
    history.push('/');
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const patientAddress = await web3.eth.getAccounts();

        const ipfsHash = await uploadToIPFS(file);
        await saveIPFSHashToBackend(patientAddress[0], ipfsHash);

        // Prepare a description for the medical data
        const description = 'Dissy and Nauseas';

        // Prepare dummy blood pressure data (systolic, diastolic) as an array of uint256
        const bloodPressureData = [120, 80, 130, 85, 110, 75];

        // Estimate the gas needed for the transaction
        const gasEstimate = await patientContract.methods
          .submitMedicalData(ipfsHash, description, bloodPressureData)
          .estimateGas({ from: patientAddress[0] });

        // Execute the submitMedicalData function on the smart contract
        const receipt = await patientContract.methods
          .submitMedicalData(ipfsHash, description, bloodPressureData)
          .send({ from: patientAddress[0], gas: gasEstimate });

        console.log('Transaction receipt:', receipt);

        alert('File uploaded and saved to IPFS and submitted to the smart contract successfully!');
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file, please try again.');
      }
    } else {
      alert('Please select a file to upload.');
    }
  };

  const uploadToIPFS = async (file) => {
    try {
      const data = await new Promise((resolve,  reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    
      const buffer = Buffer.from(data);
      const ipfsResult = await ipfsClient.add(buffer);
    
      return ipfsResult.path;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }; 

return (
  <div className="patient-medical-assistance-container">
    <Helmet>
      <title>Decentralized Healthcare App</title>
    </Helmet>
    <div className="patient-medical-assistance-patient-medical-assistance">
      <span className="patient-medical-assistance-text">
        <span>Medical Assistance</span>
      </span>
      <span className="patient-medical-assistance-text02">
        <span>Concern</span>
      </span>
      <div
        className="patient-medical-assistance-upload"
        onClick={handleUploadClick}
      >
        <span className="patient-medical-assistance-text04">
          <span>SUBMIT</span>
        </span>
        <img
          src="/playground_assets/union1285-frso.svg"
          alt="Union1285"
          className="patient-medical-assistance-union"
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <img
        src="/playground_assets/concernmedicalassistance6270-0529-200h.png"
        alt="ConcernMedicalAssistance6270"
        className="patient-medical-assistance-concern-medical-assistance"
      />

      <span className="patient-medical-assistance-text06">
        <span>Medical Data</span>
      </span>
      <img
        src="/playground_assets/medicaldatamedicalassistance6272-vjp-300h.png"
        alt="MedicalDataMedicalAssistance6272"
        className="patient-medical-assistance-medical-data-medical-assistance"
      />
      <p className="medical-data-text">
       {patientContract.data}
      </p>
      <p className="concern-text">
        {patientContract.description}
      </p>
      <button
        className="patient-medical-assistance-dashboard-button"
        onClick={handleDashboardClick}
      >
        <div className="patient-medical-assistance-view">
          <span className="patient-medical-assistance-text08">
            <span>Dashboard</span>
          </span>
        </div>
      </button>
      <span className="patient-medical-assistance-text10">
        <span>Smart Contract Address</span>
      </span>
      <span className="patient-medical-assistance-text12">
        <span>{PATIENT_CONTRACT_ADDRESS}</span>
      </span>
        <div className="patient-medical-assistance-group1359">
        <img
          src="/playground_assets/rectangle28121286-fup-200h.png"
          alt="Rectangle28121286"
          className="patient-medical-assistance-rectangle2812"
        />
        <img
          src="/playground_assets/bell1420-w5c.svg"
          alt="bell1420"
          className="patient-medical-assistance-bell"
        />
        <img
          src="/playground_assets/metamaskicon26235-evh9.svg"
          alt="metamaskicon26235"
          className="patient-medical-assistance-metamaskicon2"
        />
        <span className="patient-medical-assistance-text14">
          <span>Decentralized Healthcare</span>
        </span>
      </div>
      <div className="patient-medical-assistance-group1358">
        <span className="patient-medical-assistance-text16">
          <span>Patient Info</span>
        </span>
        <div
          className="patient-medical-assistance-exit"
          onClick={handleDisconnectClick}
        >
          <img
            src="/playground_assets/rectangle81435-z4b5-200w.png"
            alt="Rectangle81435"
            className="patient-medical-assistance-rectangle8"
          />
          <div className="doctor-dashboard-iconexit">
            <div className="doctor-dashboard-group1353">
              <img
                src="/playground_assets/rectangle2699i141-y11-200h.png"
                alt="Rectangle2699I141"
                className="doctor-dashboard-rectangle2699"
              />
              <img
                src="/playground_assets/vector721i141-y55n.svg"
                alt="Vector721I141"
                className="doctor-dashboard-vector721"
              />
              <img
                src="/playground_assets/vector722i141-6b4.svg"
                alt="Vector722I141"
                className="doctor-dashboard-vector722"
              />
            </div>
          </div>
          <span className="patient-medical-assistance-text18">
            <span>Disconnect</span>
          </span>
        </div>
        <span className="patient-medical-assistance-text20">
          <span>Address</span>
        </span>
        <span className="patient-medical-assistance-text22">
          <span>0x267b2...c173A0</span>
        </span>
        <span className="patient-medical-assistance-text24">4</span>
        <span className="patient-medical-assistance-text25">
          <span>0.4 ETH</span>
        </span>
        <span className="patient-medical-assistance-text27">
          <span>Doctor Inquiries</span>
        </span>
        <span className="patient-medical-assistance-text29">
          <span>Balance</span>
        </span>
      </div>
    </div>
  </div>
  )
}
export default PatientMedicalAssistance