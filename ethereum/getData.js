// getData.js

const PatientContract = artifacts.require("PatientContract");

module.exports = async function (callback) {
    try {
        const patientContract = await PatientContract.deployed();
        const accounts = await web3.eth.getAccounts();
        const dataId = web3.utils.keccak256(accounts[0] + "0"); // Replace with a valid dataId
        const result = await patientContract.getBloodPressureData(dataId);
        console.log(result);
        callback();
    } catch (error) {
        console.error(error);
        callback(error);
    }
};
