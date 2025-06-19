import React from 'react';
import { useSelector } from 'react-redux';

// Base components
import ResellerLeftbar from './ResellerLeftbar';
import ResellerTopbar from './ResellerTopbar';
import ResellerContent from './ResellerContent';

function ResellerDashboard() {
  const { openleftbar } = useSelector(state => state.ui);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ResellerLeftbar />
      <div className={`flex-1 flex flex-col ${openleftbar ? 'ml-[16.666667%]' : 'ml-16'}`}>
        <ResellerTopbar />
        <div className="flex-1 overflow-y-auto pt-16">
          <ResellerContent />
        </div>
      </div>
    </div>
  );
}

export default ResellerDashboard;
