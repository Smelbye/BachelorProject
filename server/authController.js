const MongoClient = require('mongodb').MongoClient;
const dbName = 'YOUR_DB_NAME';
const collectionName = 'YOUT_DB_COLLECTION_NAME';

const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Received login request:', username, password);

    await client.connect();
    const db = client.db(dbName);
    const doctorsCollection = db.collection(collectionName);

    const doctor = await doctorsCollection.findOne({ username, password });

    if (doctor) {
      res.status(200).json({ message: 'Logged in successfully', doctor });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'An error occurred while trying to log in' });
  } finally {
    await client.close();
  }
};
