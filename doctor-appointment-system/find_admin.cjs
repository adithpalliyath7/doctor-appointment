const mongoose = require('mongoose');

async function findAdmin() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/medi-connect-db');
        const db = mongoose.connection.db;
        const admin = await db.collection('users').findOne({ role: 'admin' });
        console.log(JSON.stringify(admin));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
findAdmin();
