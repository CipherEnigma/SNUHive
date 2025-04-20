import React from 'react';
import HomeCarousel from '../components/layout/HomeCarousel';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f9eae1]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <HomeCarousel />

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-[#432818] p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold text-white mb-4">For Students</h2>
              <p className="text-white">Manage your hostel experience, file complaints, and track requests</p>
            </div>
            <div className="bg-[#432818] p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold text-white mb-4">For Wardens</h2>
              <p className="text-white">Oversee hostel operations and manage student requests</p>
            </div>
            <div className="bg-[#432818] p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold text-white mb-4">For Support Staff</h2>
              <p className="text-white">Handle maintenance requests and keep the facility running smoothly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;