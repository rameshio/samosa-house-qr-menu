import React, { useState, useEffect } from 'react';
import { fetchStatus } from '../services/statusService.js';

const ApiStatusCard = () => {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  const checkConnection = async () => {
    setStatus('loading');
    try {
      const result = await fetchStatus();
      setStatus('success');
      setMessage(result.message || 'Backend connected');
    } catch {
      setStatus('error');
      setMessage('Backend unavailable');
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const initFetch = async () => {
      setStatus('loading');
      try {
        const result = await fetchStatus();
        if (mounted) {
          setStatus('success');
          setMessage(result.message || 'Backend connected');
        }
      } catch {
        if (mounted) {
          setStatus('error');
          setMessage('Backend unavailable');
        }
      }
    };

    initFetch();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow border border-gray-100 flex flex-col items-center">
      {status === 'loading' && (
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-4 border-gray-200 border-t-brand-saffron rounded-full animate-spin" aria-label="Loading indicator"></div>
          <p className="text-gray-600 font-medium">Checking backend connection...</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2 text-brand-heritage-green font-semibold mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span>Backend connected</span>
          </div>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center space-x-2 text-brand-dark-red font-semibold mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="text-base m-0 p-0 font-semibold">Backend unavailable</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">{message}</p>
          <button 
            onClick={checkConnection}
            className="px-4 py-2 bg-brand-dark-red text-white text-sm font-medium rounded hover:bg-red-800 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default ApiStatusCard;
