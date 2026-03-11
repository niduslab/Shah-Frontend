/**
 * Maps notification action URLs to the correct frontend routes
 */
export function mapNotificationUrl(actionUrl: string, isAdmin: boolean = false): string {
  if (!actionUrl) return '';

  // Extract the path from the URL
  const urlPath = actionUrl.replace(/^https?:\/\/[^\/]+/, '');

  // Map backend URLs to frontend URLs
  if (isAdmin) {
    // Admin URL mappings
    if (urlPath.includes('/admin/orders/')) {
      // Map specific order to orders list page
      return '/admin/orders';
    }
    if (urlPath.includes('/admin/reviews/')) {
      // Map specific review to reviews list page
      return '/admin/reviews';
    }
    if (urlPath.includes('/admin/products/')) {
      // Map product URLs to inventory page for stock alerts
      return '/admin/inventory';
    }
    // Default: use the URL as-is if it's already an admin route
    if (urlPath.startsWith('/admin/')) {
      return urlPath;
    }
  } else {
    // User URL mappings
    if (urlPath.includes('/orders/')) {
      return '/dashboard/orders';
    }
    if (urlPath.includes('/reviews/')) {
      return '/dashboard/reviews';
    }
    // Default: use the URL as-is if it's already a dashboard route
    if (urlPath.startsWith('/dashboard/')) {
      return urlPath;
    }
  }

  // Return the original URL if no mapping found
  return urlPath;
}

/**
 * Plays notification sound
 */
export function playNotificationSound() {
  try {
    const audio = new Audio('/notification-ringtone/iphone_16_messege_tone.mp3');
    audio.volume = 0.5; // Set volume to 50%
    audio.play().catch(error => {
      console.warn('Failed to play notification sound:', error);
      // Browser might block autoplay, this is expected
    });
  } catch (error) {
    console.warn('Error playing notification sound:', error);
  }
}

/**
 * Gets notification type display info
 */
export function getNotificationTypeInfo(type: string) {
  const typeMap: Record<string, { icon: string; color: string; label: string }> = {
    new_order: { icon: '🛒', color: 'blue', label: 'New Order' },
    order_cancelled: { icon: '❌', color: 'red', label: 'Order Cancelled' },
    order_status_changed: { icon: '📦', color: 'blue', label: 'Order Updated' },
    order_shipped: { icon: '🚚', color: 'green', label: 'Order Shipped' },
    order_delivered: { icon: '✅', color: 'green', label: 'Order Delivered' },
    payment: { icon: '💳', color: 'green', label: 'Payment' },
    new_review: { icon: '⭐', color: 'yellow', label: 'New Review' },
    review_reminder: { icon: '⭐', color: 'yellow', label: 'Review Reminder' },
    promotion: { icon: '🎁', color: 'purple', label: 'Promotion' },
    system: { icon: '⚙️', color: 'gray', label: 'System' },
    user: { icon: '👤', color: 'indigo', label: 'User' },
    product: { icon: '🏷️', color: 'orange', label: 'Product' },
    low_stock: { icon: '⚠️', color: 'orange', label: 'Low Stock' },
    report: { icon: '📊', color: 'teal', label: 'Report' },
  };

  return typeMap[type] || { icon: '🔔', color: 'gray', label: 'Notification' };
}
