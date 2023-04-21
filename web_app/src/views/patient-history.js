import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { serverAPI, getMedicalDataHashes, getIPFSHash, serverEvents, patientContract, getDoctorFeedback } from '../services/blockchain';
import './patient-history.css';
import DoctorHistory from './doctor-history';

const PatientHistory = (props) => {
  const [medicalData, setMedicalData] = useState([]);
  const [patientAddress, setPatientAddress] = useState('0x362d837f..2374');
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const dataHashes = await getMedicalDataHashes(patientAddress);
      const fetchedData = await Promise.all(
        dataHashes.map(async (hash) => {
          const ipfsHash = await getIPFSHash(hash);
          return {
            medicalDataHash: hash,
            ipfsHash,
          };
        }),
      );
      setMedicalData(fetchedData);
    }
    fetchData();


    return () => {
      serverAPI.removeAllListeners("feedback_submitted");
      serverAPI.removeAllListeners("medical_data_requested");
    };
  }, [patientAddress]);

  return (
    <div className="patient-history-container">
      <Helmet>
        <title>Decentralized Healthcare App</title>
      </Helmet>
      <div className="patient-history-patient-history">
        <span className="patient-history-text">
          <span>
            Patient History
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
        </span>
        <span className="patient-history-text02">
          <span>History</span>
        </span>
        <span className="patient-history-text04">
          <span>Patient Data</span>
        </span>
        <span className="patient-history-text06">
          <span>Doctor Feedback</span>
        </span>
        <img
          src="/playground_assets/doctorfeedbackpatient6432-gejt-300h.png"
          alt="DoctorFeedbackPatient6432"
          className="patient-history-doctor-feedback-patient"
        />
        <p className="feedback-patient-history">
         {getDoctorFeedback}
        </p>
        <img
          src="/playground_assets/patientdatapatient6492-odd-300w.png"
          alt="PatientDataPatient6492"
          className="patient-history-patient-data-patient"
        />
        <p className="cost-patient-history">
         {patientContract.data}
        </p>
        <div className="patient-history-patient-history-patient">
          <img
            src="/playground_assets/rectangle28076430-uzsp-300h.png"
            alt="Rectangle28076430"
            className="patient-history-rectangle2807"
          />
          <p className="doctor-id">
            {doctorInfo.name}
          </p>
          <p className="ipfs-hash">
            {ipfsHash}
          </p>
          <p className="timestamp-patient-his">
              {patientContract.timestamp}
          </p>
          <p className="cost-patient-his">
              {patientContract.cost}
          </p>
          <div className="lines-container">
              <div className="horizontal-line line-h1"></div>
              <div className="horizontal-line line-h2"></div>
              <div className="horizontal-line line-h3"></div>
            </div>
          <img
            src="/playground_assets/line116503-59y.svg"
            alt="Line116503"
            className="patient-history-line11"
          />
          <img
            src="/playground_assets/line106502-hvbp.svg"
            alt="Line106502"
            className="patient-history-line10"
          />
          <span className="patient-history-text08">
            <span>Timestamp</span>
          </span>
          <span className="patient-history-text10">
            <span>Cost</span>
          </span>
          <span className="patient-history-text12">
            <span>IPFS HASH</span>
          </span>
          <span className="patient-history-text14">
            <span>Doctor ID</span>
          </span>
          <img
            src="/playground_assets/line46494-ze3u.svg"
            alt="Line46494"
            className="patient-history-line4"
          />
          <img
            src="/playground_assets/line36493-1st3.svg"
            alt="Line36493"
            className="patient-history-line3"
          />
          <img
            src="/playground_assets/line26489-maoa.svg"
            alt="Line26489"
            className="patient-history-line2"
          />
          <img
            src="/playground_assets/line96501-nant.svg"
            alt="Line96501"
            className="patient-history-line9"
          />
        </div>
        <div className="medical-data-container">
          {medicalData.map((data, index) => (
            <div key={index} className="medical-data-item">
              <p>Medical Data Hash: {data.medicalDataHash}</p>
              <p>IPFS Hash: {data.ipfsHash}</p>
            </div>
          ))}
        </div>
        <div className="patient-history-view">
          <span className="patient-history-text16">
            <span>VIEW</span>
          </span>
        </div>
        <button className="patient-history-dashboard-button">
          <div className="patient-history-view1">
            <span className="patient-history-text18">
              <span>Dashboard</span>
            </span>
          </div>
        </button>
        <div className="patient-history-group1359">
          <img
            src="/playground_assets/rectangle28126447-dzae-200h.png"
            alt="Rectangle28126447"
            className="patient-history-rectangle2812"
          />
          <img
            src="/playground_assets/bell1420-n3eo.svg"
            alt="bell1420"
            className="patient-history-bell"
          />
          <img
            src="/playground_assets/metamaskicon26449-skvm.svg"
            alt="metamaskicon26449"
            className="patient-history-metamaskicon2"
          />
          <span className="patient-history-text20">
            <span>Decentralized Healthcare</span>
          </span>
        </div>
        <div className="patient-history-group1358">
          <span className="patient-history-text22">
            <span>Patient Info</span>
          </span>
          <div className="patient-history-exit">
            <img
              src="/playground_assets/rectangle81437-chm7-200w.png"
              alt="Rectangle81437"
              className="patient-history-rectangle8"
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
            <span className="patient-history-text24">
              <span>Disconnect</span>
            </span>
          </div>
          <span className="patient-history-text26">
            <span>Address</span>
          </span>
          <span className="patient-history-text28">
            <span>{patientContract.patientAddress}</span>
          </span>
          <span className="patient-history-text30">4</span>
          <span className="patient-history-text31">
            <span>{patientContract.balance}</span>
          </span>
          <span className="patient-history-text33">
            <span>Doctor Inquiries</span>
          </span>
          <span className="patient-history-text35">
            <span>Balance</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default PatientHistory
