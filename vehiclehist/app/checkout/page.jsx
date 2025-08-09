'use client';
import { useState } from 'react';
import Image from 'next/image';
import visa from '../../public/visa.svg'; // Copy SVGs to public folder

export default function CheckoutPage() {
  const [cardType, setCardType] = useState('Visa');
  const [cardImage, setCardImage] = useState('/visa.svg');

  const handleCardSelect = (type) => {
    setCardType(type);
    if (type === 'Visa') setCardImage('/visa.svg');
    if (type === 'Master Card') setCardImage('/mastercard.svg');
    if (type === 'American Express') setCardImage('/logo-american-express-cards-bank-insurance-png-favpng-dTeZFB0nXTzxrPHN9aVZaUns8-fotor-bg-remover-2025080820522.png');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl flex flex-col md:flex-row">
        {/* Order Summary */}
        <div className="w-full md:w-1/2 p-6 border-r">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="border-t mb-4" />
          <div className="flex items-center mb-4">
            <img src="/services-5.png" alt="Service" className="w-14 h-10 object-cover mr-4" />
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
          <input className="w-full border p-2 mb-4 rounded" placeholder="e.g. John Doe" />

          <label className="block mb-2 font-medium">Card Number</label>
          <input className="w-full border p-2 mb-4 rounded" placeholder="1234 1234 1234 1234" />

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-2 font-medium">Expiration Date</label>
              <input className="w-full border p-2 rounded" placeholder="MM/YY" />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-medium">Security Code (CVV)</label>
              <input className="w-full border p-2 rounded" placeholder="123" />
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded mb-4">Checkout</button>

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
            This product is offered by a verified seller. All product details, images, and descriptions are provided directly by them.
            The transaction is secure and powered by PayPal.
          </p>
        </div>
      </div>
    </div>
  );
}
