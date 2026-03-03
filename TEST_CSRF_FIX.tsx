// TEST COMPONENT - Use this to verify CSRF fix
// Place this in any page to test the CSRF token handling

'use client';

import { useState } from 'react';
import api from '@/lib/api/axios';

export default function TestCSRFComponent() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testCSRF = async () => {
    setLoading(true);
    setResult('Testing...');

    try {
      // Step 1: Check if XSRF-TOKEN cookie exists
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const csrfToken = getCookie('XSRF-TOKEN');
      
      if (!csrfToken) {
        setResult('❌ No XSRF-TOKEN cookie found. Fetching...');
        
        // Fetch CSRF cookie
        await api.get('/sanctum/csrf-cookie');
        
        const newToken = getCookie('XSRF-TOKEN');
        if (newToken) {
          setResult('✅ CSRF token fetched successfully!\n' + 
                   `Token: ${newToken.substring(0, 20)}...`);
        } else {
          setResult('❌ Failed to fetch CSRF token');
        }
      } else {
        setResult('✅ CSRF token already exists!\n' + 
                 `Token: ${csrfToken.substring(0, 20)}...`);
      }

      // Step 2: Test API call
      setResult(prev => prev + '\n\n🔄 Testing API call...');
      
      const response = await api.get('/api/auth/user');
      
      setResult(prev => prev + '\n✅ API call successful!\n' + 
               `User: ${response.data.data?.name || 'Not logged in'}`);
               
    } catch (error: any) {
      if (error.response?.status === 401) {
        setResult(prev => prev + '\n⚠️ Not authenticated (expected if not logged in)');
      } else if (error.response?.status === 419) {
        setResult(prev => prev + '\n❌ CSRF token mismatch! Check Laravel config.');
      } else {
        setResult(prev => prev + `\n❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkCookies = () => {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const csrfCookie = cookies.find(c => c.startsWith('XSRF-TOKEN='));
    const sessionCookie = cookies.find(c => c.includes('session'));
    
    setResult(
      '🍪 Current Cookies:\n\n' +
      `XSRF-TOKEN: ${csrfCookie ? '✅ Present' : '❌ Missing'}\n` +
      `Session: ${sessionCookie ? '✅ Present' : '❌ Missing'}\n\n` +
      'All cookies:\n' + cookies.join('\n')
    );
  };

  const clearCookies = () => {
    document.cookie.split(';').forEach(c => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    setResult('✅ Cookies cleared! Refresh the page.');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">CSRF Token Test</h2>
        
        <div className="space-y-2">
          <button
            onClick={testCSRF}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test CSRF Token'}
          </button>
          
          <button
            onClick={checkCookies}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Check Cookies
          </button>
          
          <button
            onClick={clearCookies}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Cookies
          </button>
        </div>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {result}
            </pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded text-sm">
          <h3 className="font-bold mb-2">How to use:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Test CSRF Token" to verify token handling</li>
            <li>Click "Check Cookies" to see current cookies</li>
            <li>Click "Clear Cookies" if you need to reset</li>
            <li>Check browser console for detailed logs</li>
            <li>Check Network tab for request/response details</li>
          </ol>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded text-sm">
          <h3 className="font-bold mb-2">Expected Results:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>✅ XSRF-TOKEN cookie should be present</li>
            <li>✅ API calls should work without 419 errors</li>
            <li>⚠️ 401 error is OK if not logged in</li>
            <li>❌ 419 error means CSRF config issue</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// HOW TO USE THIS COMPONENT:
// 1. Import it in any page: import TestCSRFComponent from '@/TEST_CSRF_FIX';
// 2. Add it to your page: <TestCSRFComponent />
// 3. Visit the page and click "Test CSRF Token"
// 4. Check the results
