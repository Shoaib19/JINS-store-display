import express from 'express';
import cors from 'cors';
import { callingMangement as callingData } from './data/callMangement.js';
import { reception } from './data/reception.js';
const app = express();
app.use(cors());
const port = 9000;

// Define routes to return JSON data
app.get('/callManagmentData', (req, res) => {
    res.json(callingData);
});

app.get('/receptionData', (req, res) => {
    const storeId = req.query.storeCode;
    console.log("storeCode: ",req.query.storeCode)
    console.log("receptionNumber: ",req.query.receptionNumber)
    // const receptionNumber = req.query.receptionNumber;

    if (!storeId) {
        return res.status(400).json({ error: "storeId query parameter is required" });
    }
    const filteredData = reception.receptionInfos.filter(reception => {
        console.log({"receptionInfos: ": reception.storeId})
        console.log({"query param: ": storeId})
        return reception.storeId === storeId
    });
    console.log({"receptionInfos": filteredData})
    res.json({"receptionInfos": filteredData});
});

// Default route
app.get('/', (req, res) => {
    res.send("Welcome to the mini JSON API!");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
