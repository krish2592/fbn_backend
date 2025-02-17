import CryptoJS from 'crypto-js';
import axios from 'axios';

// Payment endpoint to handle payment creation
export const initiatePayment = async (req, res) => {
    try {
        console.log("initiatePayment", req.body)
        //const baseurl="https://infytechai.com";
        const baseurl = "http://localhost:3000";
        const uat_URL = process.env.UAT_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
        // const prod_URL = process.env.PROD_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

        const reqData = req.body; // Receiving request from Android
        const dt = new Date();
        const txnid = 'TX' + dt.getFullYear() + (dt.getMonth() + 1) + dt.getDate() + Date.now();
        // Temporary need to generate from user
        const muid = 'MUID' + Math.floor(Math.random(3) * 1000) + Date.now();
        // Payment request payload
        const data = {
            "merchantId": process.env.MERCHANT_ID || "PGTESTPAYUAT",
            "merchantTransactionId": txnid,
            "merchantUserId": muid,
            "amount": reqData.amount * 100, // Convert amount to paise
            "redirectUrl": `http://localhost:3000/status/${txnid}`,
            "redirectMode": "POST",
            "mobileNumber": reqData.number || null,
            "paymentInstrument": {
                "type": "PAY_PAGE" // To use PhonePe's pay page interface
            }
        };
       
        console.log(data);

        // Encode payload to Base64
        const payload = Buffer.from(JSON.stringify(data)).toString('base64');

        // Generate checksum using SHA256
        const saltKey = process.env.SALT_KEY || "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
        const saltIndex = 1;
        const sha256 = CryptoJS.SHA256(payload + "/pg/v1/pay" + saltKey)
        const checksum = sha256 + '###' + saltIndex;
        console.log({print:checksum})
        // Send request to PhonePe API
        const options = {
            method: 'POST',
            url: uat_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payload
            }
        };

        // Request PhonePe for payment URL
        const response = await axios(options);

        if (response.data.success) {
            res.status(200).send({
                paymentUrl: response.data.data.instrumentResponse.redirectInfo.url
            });
        } else {
            res.status(400).send({ message: "Failed to create payment" });
        }

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
};


export const getPaymentStatus = async (req, res) => {
    const merchantTransactionId = res.req.body.transactionId
    const merchantId = res.req.body.merchantId
    const saltKey = process.env.SALT_KEY || "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"
    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey;
    const sha256 = CryptoJS.SHA256(string)
    const checksum = sha256 + "###" + keyIndex;
    //const uat_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/";
    console.log({print:checksum})
    const options = {
        method: 'GET',
        url: prod_URL+`/pg/v1/` + `status/${merchantId}/${merchantTransactionId}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': `${merchantId}`
        }
    };

    const response = await axios.request(options);
    console.log(response.data);
    if(response.data.success && response.data.state === "COMPLETED") {
        const url = `${baseurl}/success`
        return res.redirect(url);
    } else {
        const url = `${baseurl}/failure`
        return res.redirect(url);
    }
}