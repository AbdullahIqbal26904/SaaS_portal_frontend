import { useState, useEffect } from "react";
import { setopenleftbar } from '@/redux/slices/urlslice';
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/router';

export default function Topbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { openleftbar } = useSelector(state => state.ui);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // If we have a token but no user data, fetch the profile
    const token = localStorage.getItem('accessToken');
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/home-page');
  };

  function closeleftbar() {
    dispatch(setopenleftbar(!openleftbar));
  }
  
  return (
    <div
      className={`fixed z-50 flex items-center justify-end space-x-8 h-16 bg-white border-b-2 px-4 transition-all duration-300 ease-in-out 
    ${openleftbar ? 'left-[238px] w-5/6' : 'left-16 w-[95%]'}`}
    >

      <button
        onClick={closeleftbar}
        className="absolute top-10 left-[-20px] rounded-full z-50 bg-blue-100 text-black w-10 h-10 flex items-center justify-center text-lg font-bold
               hover:bg-blue-200 hover:scale-110 transition-all duration-300 shadow-md"
      >
        {openleftbar ? "<" : ">"}
      </button>

      <input
        type="text"
        placeholder="Search..."
        className="w-[262px] h-10 bg-gray-200 rounded-lg px-4 outline-none"
      />
      <div className="flex items-center space-x-4 relative">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Upgrade</button>

        <button className="text-white text-2xl bg-gray-800 font-bold rounded-full w-8 h-8 flex items-center justify-center">?</button>
        <div
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button className="flex items-center space-x-2 px-3 py-2 border rounded-lg">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-200 rounded-full text-lg font-semibold">
              {user && user.full_name ? user.full_name.charAt(0) : 'U'}
            </div>
            <span className="font-semibold">{user ? user.full_name : 'User'}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
              <div className="p-4 border-b">
                <div className="text-lg font-semibold">{user ? user.full_name : 'User'}</div>
                <div className="text-sm text-gray-500">{user ? user.email : 'user@example.com'}</div>
              </div>
              <div className="p-4 border-b">
                <div className="text-xs text-gray-500">
                  {user && user.is_root_admin ? 'Root Administrator' : 'User'}
                </div>
                <button className="mt-2 px-3 py-1 text-sm text-white bg-blue-500 rounded">Upgrade</button>
              </div>
              <ul className="p-2 text-sm">
                <li className="p-2 hover:bg-gray-100 cursor-pointer">Profile Settings</li>
                <li className="p-2 hover:bg-gray-100 cursor-pointer">Support</li>
                <li className="p-2 hover:bg-gray-100 cursor-pointer">API Documentation</li>
                <li className="p-2 hover:bg-gray-100 cursor-pointer text-red-500" onClick={handleLogout}>Sign Out</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
