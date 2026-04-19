/**
 * Analytics Tracking Test Script
 * 
 * Run this in the browser console to test all tracking endpoints
 * 
 * Usage:
 * 1. Open your site in browser
 * 2. Open DevTools (F12) → Console tab
 * 3. Copy and paste this entire script
 * 4. Press Enter
 * 5. Watch the results
 */

(async function testAnalytics() {
  console.log('🔍 Starting Analytics Tracking Test...\n');
  
  const API_URL = window.location.origin;
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Helper function to test an endpoint
  async function testEndpoint(name, endpoint, data) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log(`✅ ${name}: PASSED`);
        console.log(`   Response:`, result);
        results.passed++;
        results.tests.push({ name, status: 'PASSED', response: result });
      } else {
        console.log(`⚠️  ${name}: FAILED (${response.status})`);
        console.log(`   Response:`, result);
        results.failed++;
        results.tests.push({ name, status: 'FAILED', response: result, status: response.status });
      }
    } catch (error) {
      console.log(`❌ ${name}: ERROR`);
      console.log(`   Error:`, error.message);
      results.failed++;
      results.tests.push({ name, status: 'ERROR', error: error.message });
    }
    console.log('');
  }

  // Test 1: Page View
  await testEndpoint(
    'Page View Tracking',
    '/api/analytics/track/page-view',
    {
      page_type: 'home',
      page_title: 'Test Home Page'
    }
  );

  // Test 2: Product View
  await testEndpoint(
    'Product View Tracking',
    '/api/analytics/track/product-view',
    {
      product_id: 123
    }
  );

  // Test 3: Add to Cart
  await testEndpoint(
    'Add to Cart Tracking',
    '/api/analytics/track/cart-event',
    {
      event_type: 'added',
      product_id: 123,
      quantity: 2,
      price: 99.99
    }
  );

  // Test 4: Update Cart
  await testEndpoint(
    'Update Cart Tracking',
    '/api/analytics/track/cart-event',
    {
      event_type: 'updated',
      product_id: 123,
      quantity: 3,
      price: 99.99
    }
  );

  // Test 5: Remove from Cart
  await testEndpoint(
    'Remove from Cart Tracking',
    '/api/analytics/track/cart-event',
    {
      event_type: 'removed',
      product_id: 123,
      quantity: 1,
      price: 99.99
    }
  );

  // Test 6: Cart Viewed
  await testEndpoint(
    'Cart Viewed Tracking',
    '/api/analytics/track/checkout',
    {
      status: 'cart_viewed',
      cart_items: [
        { product_id: 123, name: 'Test Product', quantity: 2, price: 99.99 }
      ],
      cart_total: 199.98,
      items_count: 2
    }
  );

  // Test 7: Checkout Initiated
  await testEndpoint(
    'Checkout Initiated Tracking',
    '/api/analytics/track/checkout',
    {
      status: 'checkout_initiated',
      cart_total: 199.98,
      items_count: 2
    }
  );

  // Test 8: Shipping Info
  await testEndpoint(
    'Shipping Info Tracking',
    '/api/analytics/track/checkout',
    {
      status: 'shipping_info_entered'
    }
  );

  // Test 9: Payment Info
  await testEndpoint(
    'Payment Info Tracking',
    '/api/analytics/track/checkout',
    {
      status: 'payment_info_entered'
    }
  );

  // Test 10: Order Completed
  await testEndpoint(
    'Order Completed Tracking',
    '/api/analytics/track/checkout',
    {
      status: 'order_completed',
      order_id: 789,
      product_ids: [123, 456]
    }
  );

  // Test 11: Search
  await testEndpoint(
    'Search Tracking',
    '/api/analytics/track/search',
    {
      query: 'laptop',
      results_count: 25
    }
  );

  // Summary
  console.log('═══════════════════════════════════════');
  console.log('📊 TEST SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Passed: ${results.passed}/11`);
  console.log(`❌ Failed: ${results.failed}/11`);
  console.log('');

  if (results.passed === 11) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('Analytics tracking is working correctly.');
  } else if (results.passed > 0) {
    console.log('⚠️  SOME TESTS FAILED');
    console.log('Some tracking endpoints are not working.');
    console.log('Check the errors above for details.');
  } else {
    console.log('❌ ALL TESTS FAILED');
    console.log('Analytics tracking is not working.');
    console.log('Possible issues:');
    console.log('  1. Backend API is not running');
    console.log('  2. Routes are not registered');
    console.log('  3. CORS is blocking requests');
  }
  console.log('');
  console.log('For more help, see ANALYTICS_TROUBLESHOOTING.md');
  console.log('═══════════════════════════════════════');

  return results;
})();
