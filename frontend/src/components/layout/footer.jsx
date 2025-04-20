import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#432818] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">About SNU Hive</h3>
            <p className="text-gray-300">
              A comprehensive hostel management system for Shiv Nadar University,
              designed to streamline student accommodation and support services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/login/student" className="text-gray-300 hover:text-white">Student Login</Link>
              </li>
              <li>
                <Link to="/login/warden" className="text-gray-300 hover:text-white">Warden Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <address className="text-gray-300 not-italic">
              <p>Shiv Nadar University</p>
              <p>NH-91, Tehsil Dadri</p>
              <p>Gautam Buddha Nagar, UP 201314</p>
              <p className="mt-2">Email: support@snuhive.com</p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} SNU Hive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;