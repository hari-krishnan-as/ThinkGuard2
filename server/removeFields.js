const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("Connected to MongoDB. Running cleanup array update...");
    const db = mongoose.connection.db;

    const result = await db.collection('dependencyscores').updateMany(
        {},
        {
            $unset: {
                totalMessages: "",
                averageCharsPerMessage: ""
            }
        }
    );

    console.log(`Matched ${result.matchedCount} documents and modified ${result.modifiedCount} documents.`);
    process.exit(0);
}).catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
});
