require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./src/config/firebaseConfig");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 8070;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
