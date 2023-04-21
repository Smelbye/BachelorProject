import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { patientContract, serverAPI } from '../services/blockchain';
import './patient-funds.css';

const PatientFunds = (props) => {
  const history = useHistory();
  const [ethBalance, setEthBalance] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState(0); 
  const [depositAmount, setDepositAmount] = useState(0); 
  
  useEffect(() => {
    fetchBalanceAndHistory();
  }, []);

  const fetchBalanceAndHistory = async () => {
    const balance = await serverAPI.getEthBalance();
    const history = await serverAPI.getTransactionHistory();
    setEthBalance(balance);
    setTransactionHistory(history);
  };

  const redirectToDashboard = () => {
    history.push('/patient-dashboard');
  };

  const handleDeposit = async (amount) => {
    await serverAPI.depositEth(amount);
    fetchBalanceAndHistory();
  };

  const handleWithdraw = async (amount) => {
    await serverAPI.withdrawEth(amount);
    fetchBalanceAndHistory();
  };

  return (
    <div className="patient-funds-container">
      <Helmet>
        <title>Decentralized Healthcare App</title>
      </Helmet>
      <div className="patient-funds-patient-funds">
        <span className="patient-funds-text">
          <span>Patient Funds</span>
        </span>
        <img
          src="/playground_assets/ethbalancepatient6827-n77l-200h.png"
          alt="EthBalancePatient6827"
          className="patient-funds-eth-balance-patient"
        />
        <p className="eth-balance-dummy">
         {ethBalance}
        </p>
        <p className="eth-deposit-dummy">
          {patientContract.balance}
        </p>
        
        <div
          className="patient-funds-withdraw"
          onClick={() => handleWithdraw(withdrawAmount)}
        >
          <span className="patient-funds-text02">
            <span>WITHDRAW</span>
          </span>
        </div>
        <input
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          className="patient-funds-withdraw-input"
        />
        <span className="patient-funds-text04">
          <span>Deposit ETH</span>
        </span>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="patient-funds-deposit-input"
        />
        <span className="patient-funds-text06">
          <span>Current ETH balance: {ethBalance} ETH</span>
        </span>
        <img
          src="/playground_assets/depositethpatient6841-czab-200h.png"
          alt="DepositETHpatient6841"
          className="patient-funds-deposit-e-hpatient"
        />
        <div
          className="patient-funds-deposit"
          onClick={() => handleDeposit(depositAmount)}
        >
          <div className="patient-funds-group1363">
            <span className="patient-funds-text08">
              <span>DEPOSIT</span>
            </span>
          </div>
        </div>
        <span className="patient-funds-text10">
          <span>Transaction History</span>
        </span>
        <div className="patient-funds-transaction-history-patient">
          <img
            src="/playground_assets/rectangle28176831-wu2x-300h.png"
            alt="Rectangle28176831"
            className="patient-funds-rectangle2817"
          />
          <div className="lines-container">
              <div className="horizontal-line line-h1"></div>
              <div className="horizontal-line line-h2"></div>
              <div className="horizontal-line line-h3"></div>
            </div>
          <img
            src="/playground_assets/line176832-pgp6.svg"
            alt="Line176832"
            className="patient-funds-line17"
          />
          <img
            src="/playground_assets/line186833-md4p.svg"
            alt="Line186833"
            className="patient-funds-line18"
          />
          <span className="patient-funds-text12">
            <span>Timestamp</span>
          </span>
          <span className="patient-funds-text14">
            <span>Cost</span>
          </span>
          <span className="patient-funds-text16">
            <span>Doctor Licence Number</span>
          </span>
          <img
            src="/playground_assets/line196837-ukrp.svg"
            alt="Line196837"
            className="patient-funds-line19"
          />
          <img
            src="/playground_assets/line206838-sxj.svg"
            alt="Line206838"
            className="patient-funds-line20"
          />
          <img
            src="/playground_assets/line216839-qaq.svg"
            alt="Line216839"
            className="patient-funds-line21"
          />
        </div>
        <button
          className="patient-funds-dashboard-button"
          onClick={redirectToDashboard}
        >
          <div className="patient-funds-view">
            <span className="patient-funds-text18">
              <span>Dashboard</span>
            </span>
          </div>
        </button>
        <img
          src="/playground_assets/line16752-dgz7.svg"
          alt="Line16752"
          className="patient-funds-line1"
        />
        <div className="patient-funds-group1359">
          <img
            src="/playground_assets/rectangle28126786-aefi-200h.png"
            alt="Rectangle28126786"
            className="patient-funds-rectangle2812"
          />
          <img
            src="/playground_assets/bell1420-2g5.svg"
            alt="bell1420"
            className="patient-funds-bell"
          />
          <img
            src="/playground_assets/metamaskicon26788-f01bq.svg"
            alt="metamaskicon26788"
            className="patient-funds-metamaskicon2"
          />
          <span className="patient-funds-text20">
            <span>Decentralized Healthcare</span>
          </span>
        </div>
        <div className="patient-funds-group1358">
          <span className="patient-funds-text22">
            <span>Patient Info</span>
          </span>
          <div className="patient-funds-exit">
            <img
              src="/playground_assets/rectangle81439-dbdf-200w.png"
              alt="Rectangle81439"
              className="patient-funds-rectangle8"
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
            <span className="patient-funds-text24">
              <span>Disconnect</span>
            </span>
          </div>
          <span className="patient-funds-text26">
            <span>Address</span>
          </span>
          <span className="patient-funds-text28">
            <span>0x267b2...c173A0</span>
          </span>
          <span className="patient-funds-text30">4</span>
          <span className="patient-funds-text31">
            <span>0.4 ETH</span>
          </span>
          <span className="patient-funds-text33">
            <span>Doctor Inquiries</span>
          </span>
          <span className="patient-funds-text35">
            <span>Balance</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default PatientFunds
