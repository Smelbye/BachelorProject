const express = require('express');
const {PythonShell} = require('python-shell');
const app = express();
const port = 5000;

app.use(express.json());

app.post('/updateSawtooth', async (req, res) => {
  const data = req.body;
  const options = {
    scriptPath: './oracle',
    args: [
      '--function', 'update_sawtooth_blockchain',
      '--data', JSON.stringify(data),
    ],
  };

  PythonShell.run('oracle.py', options, (err, results) => {
    if (err) {
      console.error('Error updating Sawtooth blockchain:', err);
      res.status(500).send(err);
    } else {
      res.send(results[0]);
    }
  });
});

app.post('/listenSawtoothEvents', async (req, res) => {
  const data = req.body;
  const options = {
    scriptPath: './oracle',
    args: [
      '--function', 'listen_to_sawtooth_events',
      '--data', JSON.stringify(data),
    ],
  };

  PythonShell.run('oracle.py', options, (err, results) => {
    if (err) {
      console.error('Error listening to Sawtooth events:', err);
      res.status(500).send(err);
    } else {
      res.send(results[0]);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  // Start the oracle event loop
  PythonShell.run('./oracle/oracle.py', {scriptPath: './'}, (err, results) => {
    if (err) console.error('Error starting oracle event loop:', err);
    else console.log('Oracle event loop started');
  });
});
