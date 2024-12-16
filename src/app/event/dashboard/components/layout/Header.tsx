'use client';

import React from 'react';

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl text-white">Welcome to the Dashboard</h1>
      <div className="text-white">
        {/* You can add a user profile, notifications, etc. */}
        <button className="py-2 px-4 bg-gray-600 rounded-md hover:bg-gray-500">Profile</button>
      </div>
    </div>
  );
};

export default Header;
