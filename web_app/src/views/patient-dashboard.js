import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { serverAPI } from '../services/blockchain';

import './patient-dashboard.css';

const PatientDashboard = (props) => {
  const history = useHistory();
  const [patientInfo, setPatientInfo] = useState({
    address: '',
    balance: '',
    doctorInquiries: 0
  });

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const data = await serverAPI.getPatientInfo();
        setPatientInfo(data);
      } catch (error) {
        console.error('Error fetching patient info:', error);
      }
    };

    fetchPatientInfo();
  }, []);

  const redirectToPatientMedicalAssistance = () => {
    history.push('/patient-medical-assistance');
  };

  const redirectToPatientHistory = () => {
    history.push('/patient-history');
  };

  const redirectToPatientFunds = () => {
    history.push('/patient-funds');
  };

  return (
    <div className="patient-dashboard-container">
      <Helmet>
        <title>Decentralized Healthcare App</title>
      </Helmet>
      <div className="patient-dashboard-patient-dashboard">
        <img
          src="/playground_assets/line11274-mc0s.svg"
          alt="Line11274"
          className="patient-dashboard-line1"
        />
        <div className="patient-dashboard-group1358">
          <span className="patient-dashboard-text">
            <span>Patient Info</span>
          </span>
          <div className="patient-dashboard-exit">
            <img
              src="/playground_assets/rectangle86946-xfsm-200w.png"
              alt="Rectangle86946"
              className="patient-dashboard-rectangle8"
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
            <span className="patient-dashboard-text02">
              <span>Disconnect</span>
            </span>
          </div>
          <span className="patient-dashboard-text04">
            <span>Address</span>
          </span>
          <span className="patient-dashboard-text06">
            <span>{patientInfo.address}</span>
          </span>
          <span className="patient-dashboard-text08">{patientInfo.doctorInquiries}</span>
          <span className="patient-dashboard-text09">
            <span>{patientInfo.balance}</span>
          </span>
          <span className="patient-dashboard-text11">
            <span>Doctor Inquiries</span>
          </span>
          <span className="patient-dashboard-text13">
            <span>Balance</span>
          </span>
        </div>
        <div
          className="patient-dashboard-medical-assistance-patient"
          onClick={redirectToPatientMedicalAssistance}
        >
          <span className="patient-dashboard-text15">
            <span>Medical Assistance</span>
          </span>
          <div className="patient-dashboard-heartpulse">
            <img
              src="/playground_assets/unioni129-lkil.svg"
              alt="UnionI129"
              className="patient-dashboard-union"
            />
          </div>
        </div>
        <div
          className="patient-dashboard-view-funds-patient"
          onClick={redirectToPatientFunds}
        >
          <span className="patient-dashboard-text17">
            <span>View Funds</span>
          </span>
          <img
            src="/playground_assets/vector1290-zakp.svg"
            alt="Vector1290"
            className="patient-dashboard-vector"
          />
        </div>
        <div
          className="patient-dashboard-patient-history-button"
          onClick={redirectToPatientHistory}
        >
          <span className="patient-dashboard-text19">
            <span>Patient History</span>
          </span>
          <img
            src="/playground_assets/vector1291-lc3.svg"
            alt="Vector1291"
            className="patient-dashboard-vector1"
          />
        </div>
        <span className="patient-dashboard-text21">
          <span>Patient Dashboard</span>
        </span>
        <div className="patient-dashboard-group1359">
          <img
            src="/playground_assets/rectangle28126387-fhlj-200h.png"
            alt="Rectangle28126387"
            className="patient-dashboard-rectangle2812"
          />
          <img
            src="/playground_assets/bell1419-o3pd.svg"
            alt="bell1419"
            className="patient-dashboard-bell"
          />
          <img
            src="/playground_assets/metamaskicon26389-w9ss.svg"
            alt="metamaskicon26389"
            className="patient-dashboard-metamaskicon2"
          />
          <span className="patient-dashboard-text23">
            <span>Decentralized Healthcare</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
