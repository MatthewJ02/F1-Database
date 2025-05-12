const express = require('express'),
dbOperation = require('./dbFiles/dbOperation'),
cors = require('cors'),
asyncHandler = require('express-async-handler');

const API_PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.post('/api', asyncHandler(async(req, res) => {
    const result = await dbOperation.getDrivers(req.body.Name, req.body.Nationality, 
        req.body.champMin, req.body.champMax, 
        req.body.entryMin, req.body.entryMax, 
        req.body.startMin, req.body.startMax,
        req.body.poleMin, req.body.poleMax, 
        req.body.winMin, req.body.winMax,
        req.body.podiumMin, req.body.podiumMax, 
        req.body.fastestMin, req.body.fastestMax,
        req.body.pointMin, req.body.pointMax, 
        req.body.orderBy, req.body.desc);
    res.send(result.recordset);
}));

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
