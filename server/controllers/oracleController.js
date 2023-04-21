const exec = require('child_process').exec;

// Function to execute the oracle.py script
const callOracleScript = async (req, res) => {
  try {
    const { patientAddress, medicalConcern } = req.body;
    const script = `python3 oracle.py ${patientAddress} "${medicalConcern}"`;

    exec(script, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        res.status(500).json({ message: 'Error executing the oracle script', error });
      } else {
        res.status(200).json({ message: 'Oracle script executed successfully', data: stdout });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  callOracleScript
};
