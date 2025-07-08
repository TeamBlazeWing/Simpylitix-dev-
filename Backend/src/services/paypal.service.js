const axios = require('axios');

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Change to live URL for production

// Get OAuth token
async function getAccessToken() {
  const response = await axios({
    url: `${PAYPAL_API}/v1/oauth2/token`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_SECRET
    },
    data: 'grant_type=client_credentials'
  });

  return response.data.access_token;
}

// Create PayPal Payment
exports.createPayment = async ({ amount }) => {
  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders`,
    {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toFixed(2)
        }
      }],
      application_context: {
        return_url: 'https://yourapp.com/paypal/success',
        cancel_url: 'https://yourapp.com/paypal/cancel'
      }
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const approvalLink = response.data.links.find(link => link.rel === 'approve')?.href;
  return approvalLink;
};
