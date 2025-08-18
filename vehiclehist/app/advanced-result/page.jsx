"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";

const InnerPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const regNumber = searchParams.get("reg");
    if (regNumber) {
      setRegistrationNumber(regNumber);
    }
  }, [searchParams]);

  const handleGetReport = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName || !email || !phone || !registrationNumber || !address || !zip || !country) {
      alert("Please fill in all fields before proceeding.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const templateParams = {
        name: fullName,
        email: email,
        phone: phone,
        message: registrationNumber,
        address: address,
        zip: zip,
        country: country,
      };

      await emailjs.send(
        "service_jcng5l7", // ✅ Replace with your EmailJS Service ID
        "template_g91tmx9", // ✅ Replace with your EmailJS Template ID
        templateParams,
        "wwJLHd82Fk84-F0sK" // ✅ Replace with your Public Key
      );

      alert("Redirecting to payment page...");
      router.push("/checkout2");
    } catch (error) {
      console.error("Email sending error:", error);
      alert("Something went wrong while sending email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Progress Steps */}
      <div className="flex items-center px-4 py-2 bg-white border-b">
        <div className="flex items-center">
          <div className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</div>
          <span className="ml-2 text-sm font-medium">Precheck</span>
        </div>
        <div className="h-px bg-gray-300 w-8 mx-2"></div>
        <div className="flex items-center text-gray-500">
          <div className="bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-xs">2</div>
          <span className="ml-2 text-sm font-medium">Payment</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Section */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-bold">Success! We've detected this vehicle and its previous data records.</h2>
              <div className="mt-4">
                <span className="bg-black text-white text-sm px-3 py-1 inline-block">
                  VIN/REG: {registrationNumber}
                </span>
              </div>
            </div>

            <div className="bg-gray-400 p-6 rounded">
              <h3 className="text-lg font-bold mb-4">Let's Get Started</h3>

              <form>
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
                  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}

                  <input
                    type="tel"
                    placeholder="Phone (No spaces)"
                    className="w-full p-3 bg-white rounded"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full p-3 bg-white rounded"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="ZIP Code"
                    className="w-full p-3 bg-white rounded"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />

                  <select
                    className="w-full p-3 bg-white rounded"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="">Select Country</option>
                    {[
                      "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia",
                      "Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium",
                      "Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria",
                      "Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad",
                      "Chile","China","Colombia","Comoros","Congo (Congo-Brazzaville)","Costa Rica","Croatia","Cuba","Cyprus",
                      "Czech Republic","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic",
                      "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji",
                      "Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea",
                      "Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland",
                      "Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait",
                      "Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania",
                      "Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania",
                      "Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique",
                      "Myanmar (Burma)","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria",
                      "North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine State","Panama",
                      "Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda",
                      "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino",
                      "Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore",
                      "Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain",
                      "Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand",
                      "Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda",
                      "Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu",
                      "Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="VIN/REG"
                    className="w-full p-3 bg-white rounded"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Right Section */}
          <div className="md:w-2/5">
            <div className="bg-white p-6 border rounded">
              <h3 className="text-lg mb-4">With Vehicle Inspectify you may get:</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  "Mileage Check","Road Tax History","Technical Specs","NCT/CRW/MOT History",
                  "Stolen Vehicle Check","Previous Usage Check","Vehicle Valuation",
                  "UK / NI Data Included If applicable","Identity Check","Colour Changes",
                  "Recall Check","Insurance Write-Off Check","Finance Check","Owner History",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="text-green-600 mr-1">✓</span>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 border p-4 rounded">
                <div className="flex items-center mb-4">
                  <input type="checkbox" id="checkReport" className="mr-2 h-5 w-5" />
                  <label htmlFor="checkReport" className="font-medium">Check Report</label>
                </div>

                <div className="mb-2">
                  <span className="text-2xl font-bold">$59.99</span>
                  <span className="text-sm"> report</span>
                </div>

                <div className="text-sm mb-2">
                  You pay $59.99 <span className="line-through">$70.00</span>
                </div>

                <div className="bg-red-300 text-red-700 w-16 text-center py-1 mb-4 rounded">
                  -31.77%
                </div>

                <div className="border-t pt-4 flex items-center text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-800">✓</span>
                    You'll get report
                  </div>
                  <div className="ml-auto bg-gray-200 rounded-full h-5 w-5 flex items-center justify-center text-gray-400">
                    i
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={handleGetReport}
                disabled={isLoading || emailError}
                className={`bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded font-medium ${isLoading || emailError ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Sending..." : "Get Report"}
              </button>
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
