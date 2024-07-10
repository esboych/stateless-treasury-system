require('dotenv').config();
const express = require('express');
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_JSONRPC_URL));

const treasuryAbiPath = path.resolve(__dirname, 'build', 'TreasuryABI.json');
const treasuryAbi = JSON.parse(fs.readFileSync(treasuryAbiPath));

const treasuryAddress = '0x50fb89BA455455e6dCe894fd0e5f641E75f40F02'; // Replace with actual address
const treasuryContract = new web3.eth.Contract(treasuryAbi, treasuryAddress);

// Authentication endpoint
app.post('/auth', (req, res) => {
    const { address } = req.body;
    if (!web3.utils.isAddress(address)) {
        return res.status(400).json({ success: false, error: 'Invalid Ethereum address' });
    }
    
    const token = jwt.sign({ address }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ success: true, token });
});

// Create claim endpoint without JWT check
app.post('/create-claim', async (req, res) => {
    try {
        // Bypassing JWT authentication for testing purposes
        // if (!req.headers.authorization) {
        //     return res.status(400).json({ success: false, error: 'Authorization header is missing' });
        // }

        // const token = req.headers.authorization.split(' ')[1];
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!req.body.amount) {
            return res.status(400).json({ success: false, error: 'Amount is missing in the request body' });
        }

        const { amount } = req.body;
        const fromAddress = '0x4A8FA0B06C93bf6F3C4F888e30147c4AB7125624'; // Hardcoding the address for testing

        console.log(`Creating claim from address: ${fromAddress} for amount: ${amount}`);

        const gas = await treasuryContract.methods.createClaim(amount).estimateGas({ from: fromAddress });
        const result = await treasuryContract.methods.createClaim(amount).send({ from: fromAddress, gas });

        console.log(`Claim created successfully: ${JSON.stringify(result)}`);

        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error creating claim: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
