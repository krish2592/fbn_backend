import axios from 'axios';

export const authorizePeClient = (req, res) => {

    // Set your client details
    const clientId = "<your_client_id>";
    const clientSecret = "<your_client_secret>";
    const clientVersion = 1; // for UAT environment
    const grantType = "client_credentials";

    // Data to send in the request body
    const data = qs.stringify({
        client_id: clientId,
        client_version: clientVersion,
        client_secret: clientSecret,
        grant_type: grantType
    });

    // Make the POST request
    axios.post('https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token', data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => {
            console.error('Error:', error.response ? error.response.data : error.message);
        });

}