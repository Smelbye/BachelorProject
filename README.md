# Bachelor Project - Decentralized Healthcare Application

This decentralized healthcare application uses Hyperledger Sawtooth and Ethereum to create a secure and transparent system for exchanging medical data and feedback between patients and doctors.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [Usage](#usage)

## Prerequisites

Before you can run this project, make sure you have the following tools and accounts set up:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/get-npm)
- [MongoDB account](https://www.mongodb.com/cloud/atlas/signup)
- [IPFS storage account](https://infura.io/register)

Additionally, you need to generate private and public keys for Sawtooth. Replace the existing keys in the code with your generated keys.

## Setup

1. Clone the repository:

\bash
git clone https://github.com/Smelbye/BachelorProject/git
cd bachelorproject
\

2. Start the Sawtooth and Ethereum networks:

\bash
ethereum-sawtooth.yml up
\

3. Install the JavaScript dependencies:

\bash
cd client
npm install
\

4. Deploy the Ethereum smart contracts (replace `CONTRACT_ADDRESS` in the `healthcareapp` transaction processor code with the actual contract address):

\bash
cd contracts
npm install
node deploy.js
\

## Running the Application

1. Start the healthcare transaction processor:

\bash
cd bachelorproject/sawtooth
python3 healthcare.py
\

2. Start the server application:

\bash
cd server
npm start
\

The client application should now be accessible at [http://localhost:3000](http://localhost:3000).

## Usage

**For Patients using PatientContract and interacting with the patient dashboard:**

The Ethereum smart contract, PatientContract, aims to securely store and manage patients' medical data, including blood pressure data, descriptions, IPFS hashes, and doctor feedback. Patients can upload their medical data to the contract, which will emit events containing the data ID and IPFS hash. They can also authorize or revoke access to their data for specific doctors.

Some functions patients may interact with are:

'addBloodPressureData': Add blood pressure data for a specific patient.

'getBloodPressureData': Retrieve the blood pressure data associated with a particular data ID.

'authorizeDoctor': Authorize a doctor to access the patient's medical data.

'revokeDoctorAuthorization': Revoke a doctor's access to the patient's medical data.

'submitMedicalData': Submit the patient's medical data, including IPFS hash, description, and blood pressure data.

'givePermission': Grant a specific doctor permission to view the patient's medical data.

'viewDoctorFeedback': View feedback submitted by a specific doctor.

'viewAllFeedback': View feedback from all authorized doctors.


**For Doctors using the Sawtooth Transaction Handler and interacting with the doctor dashboard:**

The Sawtooth transaction handler allows doctors to interact with the healthcare system by providing a set of functions to perform various tasks such as submitting feedback, getting doctor balances, and retrieving medical data.

Some functions doctors may interact with are:

'get_medical_data': Retrieve a patient's medical data if the doctor is authorized to do so.

'submit_feedback': Submit feedback for a specific patient if the doctor is authorized to do so. This feedback will be submitted to the Ethereum smart contract.

'get_doctor_balance': Retrieve the doctor's balance from the Ethereum smart contract.

'submit_doctor_feedback_hash': Save the hash of the doctor's feedback for a specific patient to the MongoDB database.

'get_doctor_info': Retrieve the doctor's information based on their public key.

The HealthcareTransactionHandler class handles incoming transactions and calls the appropriate functions based on the payload's function name. The transaction processor listens to the Sawtooth network and processes transactions with the healthcare family name and version.

Use the client application to interact with the system and perform these actions. Please refer to the example code provided in the JavaScript application or the Python test_script in the Sawtooth directory for more information on how to submit transactions to the Sawtooth blockchain.
