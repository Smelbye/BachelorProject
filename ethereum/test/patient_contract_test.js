const PatientContract = artifacts.require("PatientContract");
const IPFS = artifacts.require("IPFS");

function generateRandomBloodPressureData() {
    const systolicMin = 90;
    const systolicMax = 140;
    const diastolicMin = 60;
    const diastolicMax = 90;

    const data = [];
    for (let i = 0; i < 6; i++) {
        if (i % 2 === 0) {
            data.push(Math.floor(Math.random() * (systolicMax - systolicMin + 1)) + systolicMin);
        } else {
            data.push(Math.floor(Math.random() * (diastolicMax - diastolicMin + 1)) + diastolicMin);
        }
    }

    return data;
}

function generateRandomIPFSHash() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '0x';

    for (let i = 0; i < 15; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

contract("PatientContract", (accounts) => {
    let patientContract;
    let ipfs;
    const owner = accounts[0];
    const patient = accounts[1];
    const doctor = accounts[2];
    const description = "Sample medical data description";

    before(async () => {
        ipfs = await IPFS.deployed();
    });

    beforeEach(async () => {
        patientContract = await PatientContract.new(ipfs.address);
    });

    it("should deploy the contract", async () => {
        assert(patientContract.address !== "");
    });

    it("should submit medical data and retrieve blood pressure data", async () => {
        const bloodPressureData = generateRandomBloodPressureData(); // Generate realistic random blood pressure values
    
        const ipfsHash = generateRandomIPFSHash(); // Generate random IPFS hash for testing purposes
        const receipt = await patientContract.submitMedicalData(ipfsHash, "Sample medical data description", bloodPressureData);
        
        // Log the NewMedicalData event
        const submitEvent = receipt.logs.find(log => log.event === 'NewMedicalData');
        console.log("submitMedicalData event: ", submitEvent.args);
        
        const dataId = submitEvent.args.dataId;
        const result = await patientContract.getBloodPressureData(dataId);
        
        // Convert the result from BigNumber format to regular numbers
        const resultAsNumbers = result.map(value => value.toNumber());
    
        assert.deepEqual(resultAsNumbers, bloodPressureData);
    });

    it("should add blood pressure data for the patient", async () => {
        const bloodPressureData = generateRandomBloodPressureData();
        const ipfsHash = generateRandomIPFSHash();
        
        // Deploy the contract and submit medical data
        const receipt = await patientContract.submitMedicalData(ipfsHash, description, bloodPressureData, { from: patient });

        // Log the NewMedicalData event
        const submitEvent = receipt.logs.find(log => log.event === 'NewMedicalData');
        console.log("submitMedicalData event: ", submitEvent.args);

        const dataId = submitEvent.args.dataId;

        // Get the stored blood pressure data
        const storedBloodPressureData = await patientContract.getBloodPressureData(dataId, { from: patient });

                // Convert the stored data to an array of numbers
                const storedBloodPressureDataAsNumbers = storedBloodPressureData.map(value => value.toNumber());

                // Compare the original data and the stored data
                assert.deepEqual(bloodPressureData, storedBloodPressureDataAsNumbers, "Stored blood pressure data should match the original data");
            });
});
        