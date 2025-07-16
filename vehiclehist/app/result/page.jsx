"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import emailjs from "@emailjs/browser"; // Add EmailJS

const InnerPage = () => {
  const searchParams = useSearchParams();
  const formRef = useRef(null);

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false); // loading state
  const [currentStep, setCurrentStep] = useState(1); // 1 for Precheck, 2 for Payment

  useEffect(() => {
    const regNumber = searchParams.get("reg");
    if (regNumber) {
      setRegistrationNumber(regNumber);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log('currentStep (result page):', currentStep); // Debugging line for result page
    console.log('window.paypal (result page):', window.paypal); // Debugging line for result page
    if (currentStep === 2 && window.paypal) {
      window.paypal.Buttons({
        createOrder: async (data, actions) => {
          try {
            const response = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                amount: "39.99", // Basic package price
              }),
            });
            const order = await response.json();
            if (order.id) {
              return order.id;
            } else {
              throw new Error('Failed to create PayPal order');
            }
          } catch (error) {
            console.error('Error creating order:', error);
            alert('Could not set up PayPal order. Please try again.');
            return null; // Return null to indicate an error
          }
        },
        onApprove: async (data, actions) => {
          try {
            const response = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderID: data.orderID,
              }),
            });
            const capture = await response.json();
            if (capture.status === 'COMPLETED') {
              alert('Payment successful!');
              sendReportEmail(); // Call a new function to send email
            } else {
              throw new Error('Payment not completed');
            }
          } catch (error) {
            console.error('Error capturing payment:', error);
            alert('Payment failed. Please try again.');
          }
        },
        onError: (err) => {
          console.error('PayPal button error:', err);
          alert('An error occurred with PayPal. Please try again.');
        },
      }).render('#paypal-button-container');
    }
  }, [currentStep]);

  const sendReportEmail = async () => {
    setIsLoading(true);
    try {
      const templateParams = {
        name: fullName,
        email: email,
        phone: phone,
        message: registrationNumber,
      };

      await emailjs.send(
        "service_p4bj99r",
        "template_8mlscwo",
        templateParams,
        "Ycg9FipJ6K6sM895-"
      );

      console.log("Email sent successfully!");
      // Optionally redirect or show success message after email sent
    } catch (error) {
      console.error("Email sending error:", error);
      alert("Something went wrong while sending email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrecheckSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName || !email || !phone || !registrationNumber) {
      alert("Please fill in all fields before proceeding.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    console.log('Setting currentStep to 2 (result page)'); // Debugging line for result page
    setCurrentStep(2); // Move to payment step
  };

  const [emailError, setEmailError] = useState("");

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Progress Steps */}
      <div className="flex items-center px-4 py-2 bg-white border-b">
        <div className="flex items-center">
          <div className={`rounded-full w-6 h-6 flex items-center justify-center text-xs ${currentStep === 1 ? 'bg-black text-white' : 'bg-white border border-gray-300 text-gray-500'}`}>
            1
          </div>
          <span className={`ml-2 text-sm font-medium ${currentStep === 1 ? 'text-black' : 'text-gray-500'}`}>Precheck</span>
        </div>
        <div className="h-px bg-gray-300 w-8 mx-2"></div>
        <div className="flex items-center">
          <div className={`rounded-full w-6 h-6 flex items-center justify-center text-xs ${currentStep === 2 ? 'bg-black text-white' : 'bg-white border border-gray-300 text-gray-500'}`}>
            2
          </div>
          <span className={`ml-2 text-sm font-medium ${currentStep === 2 ? 'text-black' : 'text-gray-500'}`}>Payment</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Section (Precheck Form) */}
          <div className="flex-1" style={{ display: currentStep === 1 ? 'block' : 'none' }}>
            <div className="mb-6">
              <h2 className="text-xl font-bold">
                Success! We've detected this vehicle and its previous data
                records.
              </h2>
              <div className="mt-4">
                <span className="bg-black text-white text-sm px-3 py-1 inline-block">
                  VIN/REG: {registrationNumber}
                </span>
              </div>
            </div>

            <div className="bg-gray-400 p-6 rounded">
              <h3 className="text-lg font-bold mb-4">Let's Get Started</h3>

              <form onSubmit={handlePrecheckSubmit}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-3 bg-white rounded"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full p-3 bg-white rounded"
                    value={email}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEmail(val);

                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(val)) {
                        setEmailError("Please enter a valid email address.");
                      } else {
                        setEmailError("");
                      }
                    }}
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                  )}
                  <input
                    type="tel"
                    placeholder="Phone (No spaces)"
                    className="w-full p-3 bg-white rounded"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="VIN/REG"
                    className="w-full p-3 bg-white rounded"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                  />
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-3 rounded-md font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Get My Report"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Section (Payment Details) */}
          <div className="md:w-2/5">
            <div className="bg-white p-6 border rounded">
              <h3 className="text-lg mb-4">
                With Vehicle Inspectify you may get:
              </h3>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  "Mileage Check",
                  "Road Tax History",
                  "Technical Specs",
                  "NCT/CRW/MOT History",
                  "Stolen Vehicle Check",
                  "Previous Usage Check",
                  "Vehicle Valuation",
                  "Owner History",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center text-sm">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
              <div id="paypal-button-container" className="mt-4" style={{ display: currentStep === 2 ? 'block' : 'none' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerPage />
    </Suspense>
  );
};

export default Page;
