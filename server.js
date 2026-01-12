const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Your Noodoe API token
const NOODOE_TOKEN = 'aLk-KQiQ-92ow8wJ.1dBNZ4lNyA_E4H1yS-mK7JoIUewu0N_tWFVyBQ-3s0A';

// Enable CORS for all origins
app.use(cors());

// Simulate station statuses (for demo until API is fixed)
function getSimulatedStatus() {
    const statuses = ['Available', 'Charging', 'Available', 'Available', 'Occupied'];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

// Proxy endpoint to fetch station status
app.get('/api/station/:stationId', async (req, res) => {
    const { stationId } = req.params;

    try {
        console.log(`Fetching station ${stationId}...`);

        const response = await fetch(`https://ev-os-api.noodoe.com/api/1.0/stations/nev${stationId}:0`, {
            headers: {
                'Authorization': `Bearer ${NOODOE_TOKEN}`,
                'accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();

            // Check if API returned error
            if (data.ok === false || data.error) {
                console.log(`API error for station ${stationId}, using simulated data`);
                // Return simulated data
                const simulatedData = {
                    stationId: `nev${stationId}:0`,
                    status: getSimulatedStatus(),
                    connectorStatus: getSimulatedStatus(),
                    power: '7.2',
                    voltage: '240',
                    maxPower: '7.2'
                };
                return res.json(simulatedData);
            }

            console.log(`Station ${stationId}: ${data.status || 'unknown'}`);
            res.json(data);
        } else {
            console.log(`API error ${response.status} for station ${stationId}, using simulated data`);
            // Return simulated data on error
            const simulatedData = {
                stationId: `nev${stationId}:0`,
                status: getSimulatedStatus(),
                connectorStatus: getSimulatedStatus(),
                power: '7.2',
                voltage: '240',
                maxPower: '7.2'
            };
            res.json(simulatedData);
        }
    } catch (error) {
        console.log(`Fetch error for station ${stationId}, using simulated data:`, error.message);
        // Return simulated data on error
        const simulatedData = {
            stationId: `nev${stationId}:0`,
            status: getSimulatedStatus(),
            connectorStatus: getSimulatedStatus(),
            power: '7.2',
            voltage: '240',
            maxPower: '7.2'
        };
        res.json(simulatedData);
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 EV Charging Proxy Server running on http://localhost:${PORT}`);
    console.log(`📡 Proxying requests to Noodoe API`);
    console.log(`✅ CORS enabled for all origins`);
});
