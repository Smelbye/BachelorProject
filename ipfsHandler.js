const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

async function storeMedicalData(data, patientContract, account) {
    const ipfsResult = await ipfs.add(Buffer.from(JSON.stringify(data)));
    const ipfsHash = ipfsResult.path;

    await patientContract.methods.submitMedicalData(ipfsHash, data.description).send({ from: account });

    return ipfsHash;
}

async function getMedicalData(ipfsHash) {
    const ipfsData = [];
    for await (const chunk of ipfs.cat(ipfsHash)) {
        ipfsData.push(chunk);
    }

    const data = JSON.parse(Buffer.concat(ipfsData).toString());
    return data;
}

module.exports = {
    storeMedicalData,
    getMedicalData
};
