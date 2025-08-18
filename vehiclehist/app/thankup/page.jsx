"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center"
      >
        {/* Success Icon */}
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Request Sucsessfully Sent 🎉
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Thank you for purchasing your package.  
          Your payment link will be delivered to your email shortly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
          <Link
            href="/packages"
            className="bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            View More Packages
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
