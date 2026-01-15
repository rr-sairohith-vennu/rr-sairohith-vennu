// Netlify Serverless Function to proxy Noodoe API requests
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    // Handle OPTIONS preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Get station ID from query parameter
    const stationId = event.queryStringParameters?.stationId;

    if (!stationId) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Station ID is required' })
        };
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
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ error: 'API request failed' })
            };
        }

        const data = await response.json();

        if (data.ok === false || data.error) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'API returned error' })
            };
        }

        // Return only the data object
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data.data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
