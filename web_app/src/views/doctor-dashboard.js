// views/doctor-dashboard.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { serverAPI } from '../services/blockchain';

import './doctor-dashboard.css';

const DoctorDashboard = (props) => {
  const history = useHistory();

  // Add state for doctor's information
  const [doctorInfo, setDoctorInfo] = useState({
    name: '',
    licenseNumber: '',
    patientCases: 0,
    balance: 0,
  });

  // Fetch doctor's information from Sawtooth backend when the component mounts
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const response = await serverAPI.get('/api/doctor/info');
        const doctorUsername = response.data.username;
  
        // Make a GET request to fetch doctor information from MongoDB
        const doctorInfoResponse = await axios.get('http://localhost:5000/doctors', {
          params: {
            username: doctorUsername,
          },
        });
        const doctorData = doctorInfoResponse.data[0];
  
        // Update state with doctor information
        setDoctorInfo({
          name: `${doctorData.first_name} ${doctorData.last_name}`,
          licenseNumber: doctorData.medical_license,
          patientCases: 1, // Replace with the actual number of patient cases
          balance: doctorData.balance
        });
      } catch (error) {
        console.error('Error fetching doctor info:', error);
        // Show error message to the user
      }
    };
  
    fetchDoctorInfo();
  }, []);
  

  const redirectToMedicalAssistance = () => {
    history.push('/medical-assistance');
  };

  const redirectToDoctorHistory = () => {
    history.push('/doctor-history');
  };

  const redirectToDoctorFunds = () => {
    history.push('/doctor-funds');
  };

  return (
    <div className="doctor-dashboard-container">
      <Helmet>
        <title>Decentralized Healthcare App</title>
      </Helmet>
      <div className="doctor-dashboard-doctor-dashboard">
        <img
          src="/playground_assets/line11255-0ce4.svg"
          alt="Line11255"
          className="doctor-dashboard-line1"
        />
        <div
          className="doctor-dashboard-medical-assistance-doctor" onClick={redirectToMedicalAssistance}
        >
          <span className="doctor-dashboard-text">
            <span>Medical Assistance</span>
          </span>
          <div className="doctor-dashboard-heartpulse">
            <img
              src="/playground_assets/union1291-pd7d.svg"
              alt="Union1291"
              className="doctor-dashboard-union"
            />
          </div>
        </div>
        <div
          className="doctor-dashboard-doctor-history-doctor"
          onClick={redirectToDoctorHistory}
        >
          <span className="doctor-dashboard-text02">
            <span>Doctor History</span>
          </span>
          <img
            src="/playground_assets/vector1290-flgs.svg"
            alt="Vector1290"
            className="doctor-dashboard-vector"
          />
        </div>
        <div
          className="doctor-dashboard-view-funds-doctor"
          onClick={redirectToDoctorFunds}
        >
          <span className="doctor-dashboard-text04">
            <span>View Funds</span>
          </span>
          <img
            src="/playground_assets/vector1289-tzw9.svg"
            alt="Vector1289"
            className="doctor-dashboard-vector1"
          />
        </div>
        <span className="doctor-dashboard-text06">
          <span>Doctor Dashboard</span>
        </span>
          <div className="doctor-dashboard-header">
            <img
              src="/playground_assets/bell1421-b77.svg"
              alt="bell1421"
              className="doctor-dashboard-bell"
            />
            <div className="doctor-dashboard-dropdown">
              
              <div className="doctor-dashboard-profile">
                <img
                  src="/playground_assets/ellipse1i125-w0uf-200h.png"
                  alt="Ellipse1I125"
                  className="doctor-dashboard-ellipse1"
                />
                <img
                  src="/play             _ground_assets/iconuseri125-vvq8.svg"
                  alt="IconuserI125"
                  className="doctor-dashboard-iconuser"
                />
              </div>
            </div>
          </div>
          <span className="doctor-dashboard-text08">
            <span>Decentralized Healthcare</span>
          </span>
          <div className="doctor-dashboard-group1356">
            <div className="doctor-dashboard-exit">
              <img
                src="/playground_assets/rectangle81418-nimd-200w.png"
                alt="Rectangle81418"
                className="doctor-dashboard-rectangle8"
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
              <span className="doctor-dashboard-text10">
                <span>Log out</span>
              </span>
            </div>
            <div className="doctor-dashboard-group13551">
              <span className="doctor-dashboard-text12">
                <span>Doctor Info</span>
              </span>
              <span className="doctor-dashboard-text14">
                <span>Name</span>
              </span>
              <span className="doctor-dashboard-text16">
                <span>{doctorInfo.name}</span>
              </span>
              <span className="doctor-dashboard-text18">
                <span>{doctorInfo.licenseNumber}</span>
              </span>
              <span className="doctor-dashboard-text20">
                <span>{doctorInfo.patientCases}</span>
              </span>
              <span className="doctor-dashboard-text22">
                <span>{doctorInfo.balance} ETH</span>
              </span>
              <span className="doctor-dashboard-text24">
                <span>Patient Cases</span>
              </span>
              <span className="doctor-dashboard-text26">
                <span>Balance</span>
              </span>
              <span className="doctor-dashboard-text28">
                <span>Licence Number</span>
              </span>
            </div>
          </div>
      </div>
    </div>
    )
  }
  
  export default DoctorDashboard
