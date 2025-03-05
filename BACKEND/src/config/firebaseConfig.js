require('dotenv').config();
const admin = require("firebase-admin");
const serviceAccount = require("./cookease-a0609-firebase-adminsdk-fbsvc-9b1ae077ce.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL,
});

const db = admin.firestore();

async function testConnection() {
    try {
        await db.collection("test").doc("connection").set({ status: "connected" });
        console.log("✅ Firebase connected successfully!");
    } catch (error) {
        console.error("❌ Firebase connection failed:", error.message);
    }
}

testConnection();

module.exports = db;
