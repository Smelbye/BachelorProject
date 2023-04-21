import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {
  serverAPI,
  getSawtoothTransactions,
  getDoctorHistory,
  patientContract,
  web3,
  getMedicalData,
  submitSawtoothTransaction,
  submitMedicalDataToIPFS,
  submitDoctorFeedback,
  getDoctorFeedback,
} from '../services/blockchain';
import './medical-assistance.css';

const MedicalAssistance = (props) => {
  const history = useHistory();
  const [patientRequests, setPatientRequests] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState({
    name: '',
    licenseNumber: '',
    patientCases: 0,
    balance: 0,
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [feedback, setFeedback] = useState('');

  const redirectToDashboard = () => {
    history.push('/dashboard');
  }
  

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };
  


  const submitFeedback = async () => {
    if (selectedRequest && feedback) {
      try {
        // Submit feedback to IPFS and get the IPFS hash
        const ipfsHash = await submitMedicalDataToIPFS(feedback);
  
        // Ethereum smart contract update
        const accounts = await web3.eth.getAccounts();
        const fromAddress = accounts[0]; // Assuming the doctor's address is the first account
        const patientAddress = selectedRequest.patientAddress;
  
        // Add doctor's feedback to the patient's record in the smart contract
        await patientContract.methods
          .addDoctorFeedback(patientAddress, feedback, ipfsHash)
          .send({ from: fromAddress });
  
        // Sawtooth transaction update
        const payload = {
          action: 'submit_feedback',
          doctor_address: fromAddress,
          patient_address: patientAddress,
          feedback: feedback,
          ipfs_hash: ipfsHash,
        };
        await submitSawtoothTransaction(payload);
  
        alert('Feedback submitted successfully');
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Error submitting feedback. Please try again.');
      }
    }
  };
  
  const handleViewClick = async () => {
    if (selectedRequest) {
      try {
        const medicalData = await getMedicalData(selectedRequest.patientAddress);
        alert(`Patient Medical Data: ${medicalData}`);
      } catch (error) {
        console.error('Error fetching medical data:', error);
        alert('Error fetching medical data. Please try again.');
      }
    } else {
      alert('No patient selected');
    }
  };

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const response = await serverAPI.get('/api/doctor/info');
        const doctorUsername = response.data.username;
    
        // Fetch doctor information from MongoDB
        const doctorData = await fetchDoctorDataFromMongoDB(doctorUsername);
    
        // Update state with doctor information
        setDoctorInfo({
          name: `${doctorData.first_name} ${doctorData.last_name}`,
          licenseNumber: doctorData.medical_license,
          patientCases: 1, // Replace with the actual number of patient cases
          balance: doctorData.balance
        });
      } catch (error) {
        console.error('Error fetching doctor information:', error);
        alert('Error fetching doctor information. Please try again.');
        history.push('/');
      }
          
        };
        const fetchPatientRequests = async () => {
          try {
            // Get all the patient requests for this doctor
            const transactions = await getSawtoothTransactions('submit_request');
        
            // Filter only the requests for this doctor
            const doctorRequests = transactions.filter(
              (transaction) => transaction.payload.doctor_address === doctorInfo.address
            );
        
            // Get the patient information for each request
            const patientRequests = await Promise.all(
              doctorRequests.map(async (request) => {
                const patientAddress = request.payload.patient_address;
                const medicalData = await getMedicalData(patientAddress);
                const doctorFeedback = await getDoctorFeedback(patientAddress);
                const patientInfoResponse = await axios.get('http://localhost:5000/patients', {
                  params: {
                    address: patientAddress,
                  },
                });
                const patientInfo = patientInfoResponse.data[0];
                return {
                  patientAddress,
                  name: `${patientInfo.first_name} ${patientInfo.last_name}`,
                  age: patientInfo.age,
                  gender: patientInfo.gender,
                  medicalData,
                  doctorFeedback,
                };
              })
            );
        
            // Update state with the patient requests
            setPatientRequests(patientRequests);
          } catch (error) {
            console.error('Error fetching patient requests:', error);
            alert('Error fetching patient requests. Please try again.');
          }
        };
        
        fetchDoctorInfo();
        fetchPatientRequests();
      }, []);

      const fetchDoctorDataFromMongoDB = async (username) => {
        try {
          const response = await axios.get('http://localhost:5000/doctors', {
            params: {
              username: username,
            },
          });
          if (response.data.length === 0) {
            throw new Error('No doctor data found for the given username');
          }
          return response.data[0];
        } catch (error) {
          console.error('Error fetching doctor data from MongoDB:', error);
          throw error;
        }
      };
      
  
  return (
    <div className="medical-assistance-container">
      <Helmet>
        <title>Decentralized Healthcare App</title>
      </Helmet>
      <div className="medical-assistance-medical-assistance">
        <img
          src="/playground_assets/patientaddressdoctor1294-7unwa-200h.png"
          alt="PatientAddressDoctor1294"
          className="medical-assistance-patient-address-doctor"
        />
         {patientRequests.map((request, index) => (
      <div
        className="medical-assistance-patient-address-concern-doctor"
        onClick={() => handleTransactionClick(request)}
        key={index}
        style={{
          backgroundColor: selectedRequest === request ? "blue" : "",
          color: selectedRequest === request ? "white" : "",
        }}
      >
        <div className="medical-assistance-address-container">
          <span className="medical-assistance-text05">
            <span>{request.patientAddress}</span>
          </span>
        </div>
        <div className="medical-assistance-vertical-divider"></div>
        <div className="medical-assistance-concern-container">
          <span className="medical-assistance-text">
            <span>{request.patientConcern}</span>
          </span>
        </div>
        {index < patientRequests.length - 1 && (
          <div className="medical-assistance-horizontal-line"></div>
        )}
      </div>
        ))}
      <span className="medical-assistance-text10">
          <span>Medical Assistance</span>
        </span>
        <span className="medical-assistance-text12">
          <span>Patient Address</span>
        <p className="patient-address-dummy">{selectedRequest?.patientAddress || 'No patient selected'}</p>
        </span>
        <img
          src="/playground_assets/patientconcerndoctor1295-ryxa-200h.png"
          alt="PatientConcernDoctor1295"
          className="medical-assistance-patient-concern-doctor"
        />
        <span className="medical-assistance-text14">
          <span>Patient Concern</span>
        </span>
        <img
          src="/playground_assets/patientmedicaldatadoctor1295-aqte-300h.png"
          alt="PatientMedicalDataDoctor1295"
          className="medical-assistance-patient-medical-data-doctor"
        />
      <p className="patient-medical-data-doc">{selectedRequest?.medicalData || 'No patient selected'}</p>
      <p className="concern-text-doc">{selectedRequest?.patientConcern || 'No patient selected'}</p>
        <span className="medical-assistance-text16">
          <span>Patient Medical Data</span>
        </span>
        <div className="medical-assistance-view" onClick={handleViewClick}>
          <span className="medical-assistance-text18">
          <div className="patient-address-rectangle">
            <span className="patient-address-title">Patient Address</span>
            <hr className="patient-address-divider" />
            <div className="patient-address-container">
              {patientRequests.map((request, index) => (
                <p key={index}>{request.patientAddress}</p>
              ))}
            </div>
          </div>
            <span>VIEW</span>
          </span>
        </div>
        <button className="medical-assistance-dashboard-button" onClick={redirectToDashboard}>
          <div className="medical-assistance-view1">
            <span className="medical-assistance-text20">
              <span>Dashboard</span>
            </span>
          </div>
        </button>
        <img
          src="/playground_assets/doctorfeedbackdoctor6265-tpx-400h.png"
          alt="DoctorFeedbackDoctor6265"
          className="medical-assistance-doctor-feedback-doctor"
        />
        <p className="medical-feedback-doc">{selectedRequest?.doctorFeedback || 'No Feedback Written'}</p>
        <span className="medical-assistance-text22">
          <span>Doctor Feedback</span>
        </span>
        <textarea className="medical-assistance-feedback-textarea" value={feedback} onChange={handleFeedbackChange}></textarea>
        <div className="medical-assistance-providefeedback" onClick={submitFeedback}></div>
        <img
          src="/playground_assets/union6269-jdam.svg"
          alt="Union6269"
          className="medical-assistance-union"
        />
        <span className="medical-assistance-text24">
          <span>PROVIDE FEEDBACK</span>
        </span>
        <img
          src="/playground_assets/line11279-36cn.svg"
          alt="Line11279"
          className="medical-assistance-line1"
        />
        <div className="medical-assistance-group1355">
          <div className="medical-assistance-header">
            <div className="medical-assistance-dropdown">
              
              <div className="medical-assistance-profile">
                <img
                  src="/playground_assets/ellipse1i628-5kun-200h.png"
                  alt="Ellipse1I628"
                  className="medical-assistance-ellipse1"
                />
                <img
                  src="/playground_assets/iconuseri628-rkl.svg"
                  alt="IconuserI628"
                  className="medical-assistance-iconuser"
                />
              </div>
            </div>
            <img
              src="/playground_assets/bell1421-zu1.svg"
              alt="bell1421"
              className="medical-assistance-bell"
            />
          </div>
          <span className="medical-assistance-text26">
            <span>Decentralized Healthcare</span>
          </span>
        </div>
        <div className="medical-assistance-group1356">
          <div className="medical-assistance-exit">
            <img
              src="/playground_assets/rectangle86367-a26q-200w.png"
              alt="Rectangle86367"
              className="medical-assistance-rectangle8"
            />
            <div className="medical-assistance-iconexit">
              <div className="medical-assistance-group1353">
                <img
                  src="/playground_assets/rectangle2699i636-dcc-200h.png"
                  alt="Rectangle2699I636"
                  className="medical-assistance-rectangle2699"
                />
                <img
                  src="/playground_assets/vector721i636-c88y.svg"
                  alt="Vector721I636"
                  className="medical-assistance-vector721"
                />
                <img
                  src="/playground_assets/vector722i636-qs87.svg"
                  alt="Vector722I636"
                  className="medical-assistance-vector722"
                />
              </div>
            </div>
            <span className="medical-assistance-text28">
              <span>Log out</span>
            </span>
          </div>
          <div className="medical-assistance-group13551">
            <span className="medical-assistance-text30">
              <span>Doctor Info</span>
            </span>
            <span className="medical-assistance-text32">
              <span>Name</span>
            </span>
            <span className="medical-assistance-text34">
              <span>{doctorInfo.name}</span>
            </span>
            <span className="medical-assistance-text36">
              <span>{doctorInfo.licenceNumber}</span>
            </span>
            <span className="medical-assistance-text38">
              <span>{doctorInfo.patientCases}</span>
            </span>
            <span className="medical-assistance-text40">
              <span>{doctorInfo.balance} ETH</span>
            </span>
            <span className="medical-assistance-text42">
              <span>Patient Cases</span>
            </span>
            <span className="medical-assistance-text44">
              <span>Balance</span>
            </span>
            <span className="medical-assistance-text46">
              <span>Licence Number</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicalAssistance
