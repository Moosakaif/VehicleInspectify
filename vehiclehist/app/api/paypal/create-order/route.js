import { NextResponse } from 'next/server';

const PAYPAL_API_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken() {
  try {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`).toString('base64');
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to get PayPal access token:', error);
    throw new Error('Failed to get PayPal access token.');
  }
}

export async function POST(req) {
  try {
    const { amount } = await req.json();
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount,
            },
          },
        ],
      }),
    });

    const orderData = await response.json();
    return NextResponse.json(orderData);
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
