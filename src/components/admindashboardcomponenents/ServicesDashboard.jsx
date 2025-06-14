import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServicePackages } from '@/redux/slices/serviceSlice';
import { openModal, closeModal } from '@/redux/slices/urlslice';
import { FaPlus, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

export default function ServicesDashboard() {
  const dispatch = useDispatch();
  const { servicePackages, loading, error } = useSelector(state => state.service);
  const { modalOpen, modalContent } = useSelector(state => state.ui);

  useEffect(() => {
    dispatch(fetchServicePackages());
  }, [dispatch]);

  const handleOpenCreateModal = () => {
    dispatch(openModal({ type: 'createServicePackage', data: {} }));
  };

  const renderFeatureValue = (value) => {
    if (typeof value === 'boolean') {
      return value ? 
        <FaCheck className="text-green-500" /> : 
        <FaTimes className="text-red-500" />;
    } else if (typeof value === 'number') {
      return value;
    } else {
      return value || 'N/A';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Service Packages</h1>
        <button 
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add Service Package
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Error loading service packages: {error.detail || 'Unknown error'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicePackages.length > 0 ? (
            servicePackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold">{pkg.name}</h3>
                  <div className="text-3xl font-bold mt-2">
                    ${parseFloat(pkg.price).toFixed(2)}
                    <span className="text-sm text-gray-500 font-normal">/{pkg.billing_cycle}</span>
                  </div>
                </div>
                
                <div className="px-6 py-4">
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  <h4 className="font-medium mb-2">Features:</h4>
                  <ul className="space-y-2">
                    {pkg.features && Object.entries(pkg.features).map(([key, value]) => (
                      <li key={key} className="flex items-center">
                        <div className="w-6 flex justify-center">
                          {renderFeatureValue(value)}
                        </div>
                        <span className="ml-2">{key.replace(/_/g, ' ')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between">
                    <button className="text-blue-600 hover:text-blue-800">
                      Details
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <FaEdit />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">No service packages found.</p>
              <button 
                onClick={handleOpenCreateModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Create your first package
              </button>
            </div>
          )}
        </div>
      )}

      {/* This is where we'd put modals for creating/editing service packages */}
    </div>
  );
}
