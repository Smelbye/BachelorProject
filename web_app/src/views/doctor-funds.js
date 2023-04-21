import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { patientContract, serverAPI } from '../services/blockchain';

import { Helmet } from 'react-helmet';

import './doctor-funds.css';
import PatientFunds from './patient-funds';

const DoctorFunds = (props) => {
  const history = useHistory();
  const [balance, setBalance] = useState(0);
    
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

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await serverAPI.get('/api/doctor/balance');
        setBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching doctor balance:', error);
        // Show error message to the user
      }
    };

    fetchBalance();
  }, []);

  const redirectToDashboard = () => {
    history.push('/doctor-dashboard');
  };

  return (
    <div className="doctor-funds-container">
      <Helmet>
        <title>Decentralized Healthcare App</title>
      </Helmet>
      <div className="doctor-funds-doctor-funds">
        <img
          src="/playground_assets/line16671-b3pa.svg"
          alt="Line16671"
          className="doctor-funds-line1"
        />
        <span className="doctor-funds-text">
          <span>Doctor Funds</span>
        </span>
        <span className="doctor-funds-text02">
          <span>Current ETH Balance</span>
        </span>
        <img
          src="/playground_assets/rectangle28146737-eotk-200h.png"
          alt="Rectangle28146737"
          className="doctor-funds-rectangle2814"
        />
        <p className="current-balance-dummy">
          0.5 ETH
        </p>
        <img
          src="/playground_assets/rectangle28136689-2b-200h.png"
          alt="Rectangle28136689"
          className="doctor-funds-rectangle2813"
        />
        <span className="doctor-funds-text04">
          <span>WITHDRAW</span>
        </span>
        <span className="doctor-funds-text06">
          <span>Transaction History</span>
        </span>
        <div className="doctor-funds-doctor--xhistory">
          <img
            src="/playground_assets/rectangle28106740-62k-300h.png"
            alt="Rectangle28106740"
            className="doctor-funds-rectangle2810"
          />
          <p className="patient-address-dummy">
            {doctorInfo.address}
          </p>
          <p className="timestamp-dummy">
              {patientContract.timestamp}
          </p>
          <p className="cost-dummy">
              {patientContract.cost}
          </p>
          <div className="lines-container">
              <div className="horizontal-line line-h1"></div>
              <div className="horizontal-line line-h2"></div>
              <div className="horizontal-line line-h3"></div>
            </div>
          <img
            src="/playground_assets/line126741-8b5q.svg"
            alt="Line126741"
            className="doctor-funds-line12"
          />
          <img
            src="/playground_assets/line136742-oo2.svg"
            alt="Line136742"
            className="doctor-funds-line13"
          />
          <span className="doctor-funds-text08">
            <span>Timestamp</span>
          </span>
          <span className="doctor-funds-text10">
            <span>Cost</span>
          </span>
          <span className="doctor-funds-text12">
            <span>Patient Address</span>
          </span>
          <img
            src="/playground_assets/line146747-l8r.svg"
            alt="Line146747"
            className="doctor-funds-line14"
          />
          <img
            src="/playground_assets/line156748-2ppa.svg"
            alt="Line156748"
            className="doctor-funds-line15"
          />
          <img
            src="/playground_assets/line166749-gmom.svg"
            alt="Line166749"
            className="doctor-funds-line16"
          />
        </div>
        <button className="doctor-funds-dashboard-button" onClick={redirectToDashboard}>
          <div className="doctor-funds-view">
            <span className="doctor-funds-text14">
              <span>Dashboard</span>
            </span>
          </div>
        </button>
        <div className="doctor-funds-group1355">
          <div className="doctor-funds-header">
            <div className="doctor-funds-dropdown">
              <div className="doctor-funds-profile">
                <img
                  src="/playground_assets/ellipse1i669-j6qb-200h.png"
                  alt="Ellipse1I669"
                  className="doctor-funds-ellipse1"
                />
                <img
                  src="/playground_assets/iconuseri669-hu9n.svg"
                  alt="IconuserI669"
                  className="doctor-funds-iconuser"
                />
              </div>
            </div>
            <img
              src="/playground_assets/bell1421-tz1.svg"
              alt="bell1421"
              className="doctor-funds-bell"
            />
          </div>
          <span className="doctor-funds-text16">
            <span>Decentralized Healthcare</span>
          </span>
        </div>
        <div className="doctor-funds-group1356">
          <div className="doctor-funds-exit">
            <img
              src="/playground_assets/rectangle81433-gfkd-200w.png"
              alt="Rectangle81433"
              className="doctor-funds-rectangle8"
            />
            <div className="doctor-funds-iconexit">
              <div className="doctor-funds-group1353">
                <img
                  src="/playground_assets/rectangle2699i143-3bne-200h.png"
                  alt="Rectangle2699I143"
                  className="doctor-funds-rectangle2699"
                />
                <img
                  src="/playground_assets/vector721i143-8was.svg"
                  alt="Vector721I143"
                  className="doctor-funds-vector721"
                />
                <img
                  src="/playground_assets/vector722i143-tetm.svg"
                  alt="Vector722I143"
                  className="doctor-funds-vector722"
                />
              </div>
            </div>
            <span className="doctor-funds-text18">
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

export default DoctorFunds
