// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./IPFS.sol";

contract PatientContract {
    address public owner;
    mapping (address => bool) public trustedDoctors;
    mapping (bytes32 => MedicalData) public medicalData;
    uint256 public withdrawalAmount;
    mapping(address => uint256[]) private bloodPressureData;

    IPFS  ipfs;

    struct MedicalData {
        string ipfsHash;
        address patient;
        string description;
        uint256[] bloodPressureData;
        mapping(address => DoctorPermissions) doctors;
        bytes32[] authorizedDoctors;
        mapping(address => DoctorFeedback) feedback;
    }

    struct DoctorPermissions {
        bool permission;
        bool hasPermission;
    }

    struct DoctorFeedback {
        address doctor;
        uint256 timestamp;
        string feedback;
        string ipfsHash;
    }

    event PatientDataUploaded(address indexed patientAddress);
    event NewMedicalData(bytes32 indexed dataId, string ipfsHash, address indexed patient);
    event MedicalDataSubmitted(uint256 indexed dataId, address indexed patient, string description, uint256 timestamp);

    constructor(IPFS _ipfs) {
        owner = msg.sender;
        ipfs = _ipfs;
    }

    function addBloodPressureData(uint256[] memory newData, address patient) public {
        require(msg.sender == owner, "Only the owner can add blood pressure data.");
        for (uint256 i = 0; i < newData.length; i++) {
            bloodPressureData[patient].push(newData[i]);
        }
    }

    function getBloodPressureData(bytes32 dataId) public view returns (uint256[] memory) {
        require(msg.sender == owner || msg.sender == medicalData[dataId].patient, "Only the owner or the patient can view the blood pressure data.");
        return medicalData[dataId].bloodPressureData;
    }

    function authorizeDoctor(address doctor) public onlyOwner {
        trustedDoctors[doctor] = true;
    }

    function revokeDoctorAuthorization(address doctor) public onlyOwner {
        trustedDoctors[doctor] = false;
    }

    function setWithdrawalAmount(uint256 amount) public onlyOwner {
        withdrawalAmount = amount;
    }

    function withdraw() public onlyTrustedDoctor {
        require(withdrawalAmount > 0, "No funds available for withdrawal");
        uint256 amount = withdrawalAmount;
        withdrawalAmount = 0;
        payable(msg.sender).transfer(amount);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyTrustedDoctor() {
        require(trustedDoctors[msg.sender], "Only a trusted doctor can perform this action");
        _;
    }

    modifier onlyDoctorWithPermission(bytes32 dataId) {
        require(trustedDoctors[msg.sender] && isDoctorAuthorized(dataId, msg.sender), "Only a doctor with permission can perform this action");
        _;
    }

    function setDoctorPermission(bytes32 dataId, address doctor, bool permission) public {
        require(medicalData[dataId].doctors[doctor].hasPermission, "This doctor does not have permission for this data");
        medicalData[dataId].doctors[doctor].permission = permission;
    }

    function isDoctorAuthorized(bytes32 dataId, address doctor) public view returns (bool) {
        uint256 numDoctors = medicalData[dataId].authorizedDoctors.length;
        uint256 authorizedDoctors = 0;
        for (uint256 i = 0; i < numDoctors; i++) {
            address authorizedDoctor = address(bytes20(medicalData[dataId].authorizedDoctors[i]));
            if (authorizedDoctor == doctor && medicalData[dataId].doctors[doctor].permission && medicalData[dataId].doctors[doctor].hasPermission) {
                authorizedDoctors++;
            }
        }
        return authorizedDoctors > 0;
    }

    function submitMedicalData(string memory ipfsHash, string memory description, uint256[] memory _bloodPressureData) public returns (bytes32 dataId) {
        dataId = keccak256(bytes(ipfsHash));
        require(bytes(medicalData[dataId].ipfsHash).length == 0, "Medical data already exists");

        MedicalData storage newData = medicalData[dataId];
        newData.ipfsHash = ipfsHash;
        newData.patient = msg.sender;
        newData.description = description;
        newData.bloodPressureData = _bloodPressureData;
        newData.doctors[msg.sender] = DoctorPermissions(true, true);

        emit PatientDataUploaded(msg.sender);
        emit NewMedicalData(dataId, ipfsHash, msg.sender);

        return dataId;
    }

    function givePermission(bytes32 dataId, address doctor, bool permission) public {
        require(medicalData[dataId].doctors[doctor].hasPermission, "This doctor is not authorized to view the data");
        medicalData[dataId].doctors[doctor].permission = permission;
    }

    function viewDoctorFeedback(bytes32 dataId, address doctor) public view returns (string memory) {
        require(medicalData[dataId].patient == msg.sender || doctor == msg.sender || medicalData[dataId].doctors[msg.sender].permission,
            "You are not authorized to view this feedback");
        return medicalData[dataId].feedback[doctor].ipfsHash;
    }

    function viewAllFeedback(bytes32 dataId) public view returns (DoctorFeedback[] memory) {
        require(medicalData[dataId].patient == msg.sender || medicalData[dataId].doctors[msg.sender].permission, "You are not authorized to view this feedback");
        uint256 numDoctors = medicalData[dataId].authorizedDoctors.length;
        DoctorFeedback[] memory feedbackArray = new DoctorFeedback[](numDoctors);
        for (uint256 i = 0; i < numDoctors; i++) {
            address doctor = address(bytes20(medicalData[dataId].authorizedDoctors[i]));
            feedbackArray[i] = medicalData[dataId].feedback[doctor];
        }
        return feedbackArray;
    }

    function submitDoctorFeedback(bytes32 dataId, string memory feedback, string memory feedbackHash) public onlyDoctorWithPermission(dataId) {
        medicalData[dataId].feedback[msg.sender] = DoctorFeedback(msg.sender, block.timestamp, feedback, feedbackHash);
    }

    function payDoctor(bytes32 dataId, address doctor) public payable {
        require(isDoctorAuthorized(dataId, doctor), "Only an authorized doctor can receive payment");
        require(msg.value > 0, "Payment must be greater than 0");
        payable(doctor).transfer(msg.value);
    }
}

