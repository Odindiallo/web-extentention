import React from 'react';
import Head from 'next/head';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Shopping Assistant</title>
        <meta name="description" content="Your personal shopping assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Shopping Assistant
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Price Comparison Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Price Comparison</h2>
            <p className="text-gray-600">
              Compare prices across multiple stores to find the best deals.
            </p>
          </div>

          {/* Coupon Finder Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Coupon Finder</h2>
            <p className="text-gray-600">
              Automatically find and apply the best coupons at checkout.
            </p>
          </div>

          {/* Shared Cart Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Shared Cart</h2>
            <p className="text-gray-600">
              Shop together with friends and family in real-time.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
