// Vercel Serverless Function to proxy Noodoe API requests
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Get station ID from query parameter
    const { stationId } = req.query;

    if (!stationId) {
        return res.status(400).json({ error: 'Station ID is required' });
    }

    const NOODOE_TOKEN = 'aLk-KQiQ-92ow8wJ.1dBNZ4lNyA_E4H1yS-mK7JoIUewu0N_tWFVyBQ-3s0A';

    try {
        const response = await fetch(`https://ev-os-api.noodoe.com/api/1.0/stations/${stationId}`, {
            headers: {
                'Authorization': `Bearer ${NOODOE_TOKEN}`,
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'API request failed' });
        }

        const data = await response.json();

        if (data.ok === false || data.error) {
            return res.status(500).json({ error: 'API returned error' });
        }

        // Return only the data object
        return res.status(200).json(data.data);
    } catch (error) {
        console.error('Error fetching station:', error);
        return res.status(500).json({ error: error.message });
    }
}
