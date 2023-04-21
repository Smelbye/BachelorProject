import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { serverAPI } from '../services/blockchain';
import detectEthereumProvider from '@metamask/detect-provider';
import api from '../services/api';

import './first-page.css';

const FirstPage = (props) => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

const redirectToDoctorDashboard = async () => {
  try {
    const response = await api.post('/api/doctor/login', {
      username,
      password,
    });
    
    console.log('Login response:', response);

    if (response.data) {
      history.push('/doctor-dashboard');
    } else {
      setErrorMessage('Invalid username or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    setErrorMessage('An error occurred while trying to log in');
  }
};

  

  const connectWallet = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      // Connect to MetaMask
      try {
        await provider.request({ method: 'eth_requestAccounts' });
        redirectToPatientDashboard();
      } catch (error) {
        console.error('User rejected connection:', error);
        // Show error message to the user
      }
    } else {
      console.error('MetaMask not detected');
      // Show error message to the user
    }
  };

  const redirectToPatientDashboard = () => {
    history.push('/patient-dashboard');
  };

  // Update the username and password input handlers
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };


  return (
    <div className="first-page-container">
      <Helmet>
        <title>Decentralized Healthcare App</title>
      </Helmet>
      <div className="first-page-first-page">
        <div className="first-page-login">
          <img
            src="/playground_assets/rectangle2768i684-wghe-200h.png"
            alt="Rectangle2768I684"
            className="first-page-rectangle2768"
          />
          <span className="first-page-text" onClick={connectWallet}>
            <span>Connect Wallet</span>
          </span>
        </div>
        <img
          src="/playground_assets/metamaskicon16145-xiia.svg"
          alt="metamaskicon16145"
          className="first-page-metamaskicon1"
        />
        <span className="first-page-text02">
          <span>Patient Connect</span>
        </span>
        <span className="first-page-text04">
          <span>Decentralized Healthcare</span>
        </span>
        <span className="first-page-text06">
          <span>
            Connect your MetaMask wallet to interact with the Ethereum
            Healthcare Contract
          </span>
        </span>
        <span className="first-page-text08">
          <span>
            Enter login credentials to use the Sawtooth Transaction Processor
          </span>
        </span>
        <div className="first-page-login1">
          <div className="first-page-login2">
            <img
              src="/playground_assets/rectangle2768i121-74km-200h.png"
              alt="Rectangle2768I121"
              className="first-page-rectangle27681"
            />
            <span className="first-page-text10" onClick={redirectToDoctorDashboard}>
              <span>Login</span>
          </span>

          </div>
          <div className="first-page-keepmesignedin">
          <span className="first-page-text12">
            <span>Keep me signed in on this device.</span>
          </span>
        </div>
        <div className="first-page-rectangle2775">
          <img
            src="/playground_assets/rectangle2774i121-vk56-200h.png"
            alt="Rectangle2774I121"
            className="first-page-rectangle2774"
          />
        </div>
        <span className="first-page-text14">
          <span>Doctor Login</span>
        </span>
        <div className="first-page-password">
          <input
            type="text"
            className="first-page-username-input"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="first-page-password1">
          <input
            type="password"
            className="first-page-password-input"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <span className="first-page-text20">
           {errorMessage && <div className="error-message">{errorMessage}</div>}
          <span>Forgot password?</span>
        </span>
      </div>
      <img
        src="/playground_assets/line111224-01cl.svg"
        alt="Line111224"
        className="first-page-line11"
      />
    </div>
  </div>
  );
}
export default FirstPage;