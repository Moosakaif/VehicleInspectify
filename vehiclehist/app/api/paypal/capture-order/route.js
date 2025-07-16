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
    const { orderID } = await req.json();
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const captureData = await response.json();
    return NextResponse.json(captureData);
  } catch (error) {
    console.error('Failed to capture order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
