import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

// Logo and icons
import Image from 'next/image';
import { RiDashboardLine, RiUserLine, RiSettings4Line, RiShieldUserLine } from 'react-icons/ri';
import { FiPackage, FiUsers } from 'react-icons/fi';
import { MdOutlineBusinessCenter } from 'react-icons/md';

function ResellerLeftbar() {
  const { openleftbar } = useSelector(state => state.ui);
  const { user } = useSelector(state => state.auth);
  const { currentReseller } = useSelector(state => state.reseller);

  return (
    <div className={`fixed left-0 top-0 h-full transition-all duration-300 ease-in-out bg-white shadow-lg z-10 ${openleftbar ? 'w-1/6' : 'w-16'}`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="py-4 flex justify-center items-center border-b">
          {openleftbar ? (
            <Link href="/" className="flex items-center">
              <Image src="/images/logo.svg" alt="Logo" width={120} height={30} />
            </Link>
          ) : (
            <Link href="/" className="flex items-center">
              <Image src="/images/favicon-128.png" alt="Logo" width={32} height={32} />
            </Link>
          )}
        </div>

        {/* Reseller Name (if available) */}
        {currentReseller && openleftbar && (
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <p className="font-medium text-sm text-blue-800">{currentReseller.name}</p>
            <p className="text-xs text-blue-600">Reseller Dashboard</p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2">
            {/* Dashboard */}
            <li>
              <Link href="/resellerAdmindashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                <RiDashboardLine className="text-xl" />
                {openleftbar && <span className="ml-2">Dashboard</span>}
              </Link>
            </li>

            {/* Customers */}
            <li>
              <Link href="/resellerAdmindashboard/customers" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                <FiUsers className="text-xl" />
                {openleftbar && <span className="ml-2">Customers</span>}
              </Link>
            </li>

            {/* Subscriptions */}
            <li>
              <Link href="/resellerAdmindashboard/subscriptions" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                <FiPackage className="text-xl" />
                {openleftbar && <span className="ml-2">Subscriptions</span>}
              </Link>
            </li>

            {/* Admins */}
            <li>
              <Link href="/resellerAdmindashboard/admins" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                <RiShieldUserLine className="text-xl" />
                {openleftbar && <span className="ml-2">Admins</span>}
              </Link>
            </li>

            {/* Profile */}
            <li>
              <Link href="/resellerAdmindashboard/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                <RiUserLine className="text-xl" />
                {openleftbar && <span className="ml-2">Profile</span>}
              </Link>
            </li>

            {/* Settings */}
            <li>
              <Link href="/resellerAdmindashboard/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                <RiSettings4Line className="text-xl" />
                {openleftbar && <span className="ml-2">Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Info at Bottom */}
        {user && openleftbar && (
          <div className="px-4 py-3 border-t">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium truncate">{user.full_name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResellerLeftbar;
