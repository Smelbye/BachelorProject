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

This decentralized healthcare application allows you to perform the following actions:

- Submit a doctor feedback hash
- Get doctor information
- Get medical data for a patient (if the doctor is authorized)
- Submit feedback for a patient (if the doctor is authorized)
- Get the balance for a doctor

Use the client application to interact with the system and perform these actions. Please refer to the example code provided in the JavaScript application for more information on how to submit transactions to the Sawtooth blockchain.
