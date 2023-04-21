const PatientContract = artifacts.require("PatientContract");
const IPFS = artifacts.require("IPFS");

module.exports = function (deployer) {
  deployer.deploy(IPFS).then(function () {
    return deployer.deploy(PatientContract, IPFS.address);
  });
};
