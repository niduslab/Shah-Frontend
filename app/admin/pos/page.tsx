'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, User, Phone, Mail, CreditCard, Banknote, DollarSign, Receipt, X, Barcode } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useSearchPOSProducts,
  useGetProductBySKU,
  useCalculatePOSOrder,
  useCreatePOSOrder
} from '@/lib/hooks/admin/usePOS';

interface CartItem {
  product_id: number;
  variation_id?: number | null;
  quantity: number;
  name: string;
  sku: string;
  price: number;
  image?: string;
  stock: number;
  variation_name?: string;
}

interface CustomerInfo {
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
}

type PaymentMethod = 'cash' | 'card' | 'manual';

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [skuQuery, setSkuQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    customer_name: '',
    customer_email: '',
    customer_phone: ''
  });
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [orderSummary, setOrderSummary] = useState<any>(null);

  const { data: searchResults, isLoading: isSearching, error: searchError } = useSearchPOSProducts(searchQuery);
  
  const { data: skuProduct } = useGetProductBySKU(skuQuery);

  useEffect(() => {
    if (skuProduct && 'success' in skuProduct && skuProduct.success && 'data' in skuProduct && skuProduct.data) {
      // Handle paginated response - get first product from data array
      const products = Array.isArray(skuProduct.data) ? skuProduct.data : skuProduct.data.data;
      if (products && products.length > 0) {
        const product = products[0];
        const primaryImage = product.images?.find((img: any) => img.is_primary)?.full_url || product.images?.[0]?.full_url;
        addToCart({
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: parseFloat(product.price),
          image: primaryImage,
          stock: product.quantity || 0,
          variation_id: null,
          variation_name: null
        });
      }
      setSkuQuery('');
    }
  }, [skuProduct]);

  const calculateMutation = useCalculatePOSOrder();
  const createOrderMutation = useCreatePOSOrder();

  useEffect(() => {
    const data = createOrderMutation.data;
    if (createOrderMutation.isSuccess && data && 'success' in data && data.success) {
      toast.success('Order created successfully', {
        description: `Order #${data.data.order_number} has been created.`
      });
      // Reset form
      setCart([]);
      setDiscount(0);
      setNotes('');
      setCustomerInfo({
        customer_name: '',
        customer_email: '',
        customer_phone: ''
      });
      setShowCustomerForm(false);
      setOrderSummary(null);
    }
  }, [createOrderMutation.isSuccess, createOrderMutation.data]);

  useEffect(() => {
    const data = calculateMutation.data;
    if (calculateMutation.isSuccess && data && 'success' in data && data.success) {
      setOrderSummary(data.data);
    }
  }, [calculateMutation.isSuccess, calculateMutation.data]);

  const addToCart = (product: any) => {
    const existingItem = cart.find(
      item => item.product_id === product.id && item.variation_id === product.variation_id
    );

    if (existingItem) {
      if (existingItem.quantity + 1 > existingItem.stock) {
        toast.error('Insufficient stock');
        return;
      }
      setCart(cart.map(item =>
        item.product_id === product.id && item.variation_id === product.variation_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      toast.success(`Added ${product.name} to cart`);
    } else {
      if (product.stock < 1) {
        toast.error('Product out of stock');
        return;
      }
      setCart([...cart, {
        product_id: product.id,
        variation_id: product.variation_id || null,
        quantity: 1,
        name: product.name,
        sku: product.sku,
        price: product.price,
        image: product.image,
        stock: product.stock,
        variation_name: product.variation_name
      }]);
      toast.success(`Added ${product.name} to cart`);
    }
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    const item = cart[index];
    if (newQuantity > item.stock) {
      toast.error('Insufficient stock');
      return;
    }
    if (newQuantity < 1) {
      removeFromCart(index);
      return;
    }
    setCart(cart.map((item, i) => i === index ? { ...item, quantity: newQuantity } : item));
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    return {
      subtotal,
      discount: discountAmount,
      total: subtotal - discountAmount
    };
  };

  const handleCalculate = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    calculateMutation.mutate({
      items: cart.map(item => ({
        product_id: item.product_id,
        variation_id: item.variation_id,
        quantity: item.quantity
      })),
      discount
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    if (!customerInfo.customer_name || !customerInfo.customer_phone) {
      toast.error('Please fill in customer information');
      setShowCustomerForm(true);
      return;
    }
    createOrderMutation.mutate({
      customer_name: customerInfo.customer_name,
      customer_email: customerInfo.customer_email,
      customer_phone: customerInfo.customer_phone,
      items: cart.map(item => ({
        product_id: item.product_id,
        variation_id: item.variation_id,
        quantity: item.quantity
      })),
      discount,
      payment_method: paymentMethod,
      notes
    });
  };

  const totals = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-gray-600">Create in-store orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Product Search & Cart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {/* SKU Scanner */}
                <div className="relative">
                  <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Scan or enter SKU..."
                    value={skuQuery}
                    onChange={(e) => setSkuQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Product Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Search Results */}
                {searchQuery && searchResults && 'success' in searchResults && searchResults.success && (
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                    {(() => {
                      // Handle paginated response
                      const products = Array.isArray(searchResults.data) ? searchResults.data : searchResults.data?.data || [];
                      
                      if (products.length === 0) {
                        return (
                          <div className="p-4 text-center text-gray-500">
                            No products found
                          </div>
                        );
                      }
                      
                      return products.map((product: any) => {
                        const price = parseFloat(product.price);
                        const stock = product.quantity || 0;
                        const primaryImage = product.images?.find((img: any) => img.is_primary)?.full_url || product.images?.[0]?.full_url;
                        
                        return (
                          <button
                            key={product.id}
                            onClick={() => addToCart({
                              id: product.id,
                              name: product.name,
                              sku: product.sku,
                              price: price,
                              image: primaryImage,
                              stock: stock,
                              variation_id: null,
                              variation_name: null
                            })}
                            className="w-full p-3 hover:bg-gray-50 border-b last:border-b-0 text-left flex items-center gap-3"
                          >
                            {primaryImage ? (
                              <img 
                                src={primaryImage.startsWith('http') ? primaryImage : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${primaryImage}`} 
                                alt={product.name} 
                                className="w-12 h-12 object-cover rounded" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder-product.png';
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <ShoppingCart className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                              {product.brand && (
                                <p className="text-xs text-gray-400">{product.brand.name}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-orange-600">${price.toFixed(2)}</p>
                              <p className={`text-xs ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                Stock: {stock}
                              </p>
                            </div>
                          </button>
                        );
                      });
                    })()}
                  </div>
                )}
                
                {searchQuery && isSearching && (
                  <div className="p-4 text-center text-gray-500">
                    Searching...
                  </div>
                )}
                
                {searchQuery && searchError && (
                  <div className="p-4 text-center text-red-500">
                    Error searching products
                  </div>
                )}
              </div>
            </div>

            {/* Cart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart ({cart.length})
                </h2>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      {item.image ? (
                        <img 
                          src={item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${item.image}`} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-product.png';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.variation_name && (
                          <p className="text-sm text-gray-500">{item.variation_name}</p>
                        )}
                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        <p className="text-sm font-semibold text-orange-600">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                          className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                          min="1"
                          max={item.stock}
                        />
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-600 hover:text-red-700 mt-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Checkout */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer
                </h2>
                <button
                  onClick={() => setShowCustomerForm(!showCustomerForm)}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  {showCustomerForm ? 'Hide' : 'Edit'}
                </button>
              </div>

              {showCustomerForm ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.customer_name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, customer_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.customer_phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, customer_phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={customerInfo.customer_email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, customer_email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Email address"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {customerInfo.customer_name ? (
                    <>
                      <p className="text-gray-900">{customerInfo.customer_name}</p>
                      <p className="text-sm text-gray-600">{customerInfo.customer_phone}</p>
                      {customerInfo.customer_email && (
                        <p className="text-sm text-gray-600">{customerInfo.customer_email}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">No customer information</p>
                  )}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${
                    paymentMethod === 'cash'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Banknote className="h-6 w-6" />
                  <span className="text-sm font-medium">Cash</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${
                    paymentMethod === 'card'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="h-6 w-6" />
                  <span className="text-sm font-medium">Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('manual')}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${
                    paymentMethod === 'manual'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <DollarSign className="h-6 w-6" />
                  <span className="text-sm font-medium">Manual</span>
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-${totals.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder="Order notes..."
                />
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || createOrderMutation.isPending}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Receipt className="h-5 w-5" />
                {createOrderMutation.isPending ? 'Processing...' : 'Complete Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
