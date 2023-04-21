import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom';
import { patientContract, serverAPI } from '../services/blockchain'
import { getDoctorHistory } from '../services/blockchain'
import './doctor-history.css'

const DoctorHistory = (props) => {
  const history = useHistory();
  const [doctorHistory, setDoctorHistory] = useState([])

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

    const redirectToDashboard = () => {
      history.push('/doctor-dashboard');
    };

  useEffect(() => {
    const fetchDoctorHistory = async () => {
      try {
        const history = await getDoctorHistory()
        setDoctorHistory(history)
      } catch (error) {
        console.error('Error fetching doctor history:', error)
      }
    }

    fetchDoctorHistory()
  }, [])

  return (
    <div className="doctor-history-container">
      <Helmet>
        <title>Decentralized Healthcare App</title>
      </Helmet>
      <div className="doctor-history-doctor-history">
        <span className="doctor-history-text">
          <span>Doctor History</span>
        </span>
        <span className="doctor-history-text02">
          <span>History</span>
        </span>
        <span className="doctor-history-text04">
          <span>Cost</span>
        </span>
        <span className="doctor-history-text06">
          <span>Patient Address</span>
        </span>
        <img
          src="/playground_assets/doctorfeedbackcontainer6665-vdfq-300h.png"
          alt="DoctorFeedbackContainer6665"
          className="doctor-history-doctor-feedback-container"
        />
        <p className="patient-address-history-doc">
          {patientAddress.address}
        </p>
        <img
          src="/playground_assets/doctorfeedbackcontainer6665-vdfq-300h.png"
          alt="DoctorFeedbackContainer6665"
          className="doctor-history-doctor-history-container"
        />
        <p className="history-doc-text">
          {patientContract.tx}
        </p>
        <img
          src="/playground_assets/rectangle28126666-u4v-300w.png"
          alt="Rectangle28126666"
          className="doctor-history-rectangle2812"
        />
        <p className="cost-history-doc">
            {patientContract.cost}
        </p>
        <div className="doctor-history-view">
          <span className="doctor-history-text08">
            <span>VIEW</span>
          </span>
        </div>
        <div className="doctor-history-doctor-history-container">
          {doctorHistory.map((entry, index) => (
            <div key={index} className="doctor-history-rectangle2810">
              <div className="horizontal-line line-h1"></div>
              <div className="horizontal-line line-h2"></div>
              <div className="horizontal-line line-h3"></div>
              <span className="doctor-history-text10">
                <span>{entry.cost} ETH</span>
              </span>
              <span className="doctor-history-text12">
                <span>{entry.timestamp}</span>
              </span>
              <span className="doctor-history-text14">
                <span>{entry.ipfsHash}</span>
              </span>
              <span className="doctor-history-text16">
                <span>Timestamp</span>
              </span>
              <span className="doctor-history-text18">
                <span>Cost</span>
              </span>
              <span className="doctor-history-text20">
                <span>IPFS HASH</span>
              </span>
              <span className="doctor-history-text22">
                <span>Patient Address</span>
              </span>
              <span className="doctor-history-text24">
                <span>{entry.patientAddress}</span>
              </span>
            </div>
          ))}
        </div>

        <button className="doctor-history-dashboard-button" onClick={redirectToDashboard}>
          <div className="doctor-history-view1">
            <span className="doctor-history-text26">
              <span>Dashboard</span>
            </span>
          </div>
        </button>
        <div className="doctor-history-group1355">
          <img
            src="/playground_assets/line16583-cmgp.svg"
            alt="Line16583"
            className="doctor-history-line1"
          />
          <div className="doctor-history-header">
            <div className="doctor-history-dropdown">
              <div className="doctor-history-profile">
                <img
                  src="/playground_assets/ellipse1i660-qjy-200h.png"
                  alt="Ellipse1I660"
                  className="doctor-history-ellipse1"
                />
                <img
                  src="/playground_assets/iconuseri660-jnb7.svg"
                  alt="IconuserI660"
                  className="doctor-history-iconuser"
                />
              </div>
            </div>
            <img
              src="/playground_assets/bell1421-ine.svg"
              alt="bell1421"
              className="doctor-history-bell"
            />
          </div>
          <span className="doctor-history-text28">
            <span>Decentralized Healthcare</span>
          </span>
        </div>
        <div className="doctor-history-group1356">
          <div className="doctor-history-exit">
            <img
              src="/playground_assets/rectangle81431-eci7-200w.png"
              alt="Rectangle81431"
              className="doctor-history-rectangle8"
            />
            <div className="doctor-history-iconexit">
              <div className="doctor-history-group1353">
                <img
                  src="/playground_assets/rectangle2699i143-tspk-200h.png"
                  alt="Rectangle2699I143"
                  className="doctor-history-rectangle2699"
                />
                <img
                  src="/playground_assets/vector721i143-e3e.svg"
                  alt="Vector721I143"
                  className="doctor-history-vector721"
                />
                <img
                  src="/playground_assets/vector722i143-tgg.svg"
                  alt="Vector722I143"
                  className="doctor-history-vector722"
                />
              </div>
            </div>
            <span className="doctor-history-text30">
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

export default DoctorHistory
