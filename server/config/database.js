const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('YOUR_MONGODB_DATABASE_URL', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
