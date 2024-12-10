'use client';

import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <ul className="mt-6">
        <li>
          <Link href="/dashboard" className="block py-2 hover:bg-gray-700 rounded-md">Home</Link>
        </li>
        <li>
          <Link href="/dashboard/settings" className="block py-2 hover:bg-gray-700 rounded-md">Settings</Link>
        </li>
        {/* Add more links for other sections of your dashboard */}
      </ul>
    </div>
  );
};

export default Sidebar;
