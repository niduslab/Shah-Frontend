'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingCart, Search, Plus, Minus, Trash2, User, Phone, Mail,
  CreditCard, Banknote, DollarSign, Receipt, X, Barcode, FileText, Paperclip, Landmark, Smartphone
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useSearchPOSProducts,
  useGetProductBySKU,
  useCalculatePOSOrder,
  useCreatePOSOrder,
  useGenerateQuotation,
} from '@/lib/hooks/admin/usePOS';
import { formatCurrency } from '@/lib/utils/currency';

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

type PaymentMethod = 'cash' | 'card' | 'manual' | 'bkash' | 'nagad' | 'bank_transfer';
type ActiveTab = 'pos' | 'quotation';

export default function POSPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pos');
  const [searchQuery, setSearchQuery] = useState('');
  const [skuQuery, setSkuQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [proof, setProof] = useState<File | undefined>(undefined);
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
  const generateQuotationMutation = useGenerateQuotation();

  useEffect(() => {
    const data = createOrderMutation.data;
    if (createOrderMutation.isSuccess && data && 'success' in data && data.success) {
      toast.success('Order created successfully', {
        description: `Order #${data.data.order_number} has been created.`
      });
      resetForm();
    }
  }, [createOrderMutation.isSuccess, createOrderMutation.data]);

  useEffect(() => {
    const data = calculateMutation.data;
    if (calculateMutation.isSuccess && data && 'success' in data && data.success) {
      setOrderSummary(data.data);
    }
  }, [calculateMutation.isSuccess, calculateMutation.data]);

  const resetForm = () => {
    setCart([]);
    setDiscount(0);
    setNotes('');
    setReferenceNumber('');
    setPaymentNote('');
    setProof(undefined);
    setCustomerInfo({ customer_name: '', customer_email: '', customer_phone: '' });
    setShowCustomerForm(false);
    setOrderSummary(null);
  };

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
    return { subtotal, discount: discountAmount, total: subtotal - discountAmount };
  };

  const handleCalculate = () => {
    if (cart.length === 0) { toast.error('Cart is empty'); return; }
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
    if (cart.length === 0) { toast.error('Cart is empty'); return; }
    if (!customerInfo.customer_name || !customerInfo.customer_phone) {
      toast.error('Please fill in customer name and phone');
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
      reference_number: paymentMethod !== 'cash' ? referenceNumber || undefined : undefined,
      payment_note: paymentMethod !== 'cash' ? paymentNote || undefined : undefined,
      proof: paymentMethod !== 'cash' ? proof : undefined,
      notes
    });
  };

  const handleGenerateQuotation = () => {
    if (cart.length === 0) { toast.error('Cart is empty'); return; }
    if (!customerInfo.customer_name) {
      toast.error('Please fill in customer name');
      setShowCustomerForm(true);
      return;
    }
    generateQuotationMutation.mutate(
      {
        customer_name: customerInfo.customer_name,
        customer_email: customerInfo.customer_email,
        customer_phone: customerInfo.customer_phone,
        items: cart.map(item => ({
          product_id: item.product_id,
          variation_id: item.variation_id,
          quantity: item.quantity
        })),
        discount,
        notes
      },
      {
        onSuccess: () => toast.success('Quotation PDF downloaded'),
        onError: () => toast.error('Failed to generate quotation'),
      }
    );
  };

  const totals = calculateTotal();
  const isQuotation = activeTab === 'quotation';

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header + Tab Switcher */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isQuotation ? 'Quotation' : 'Point of Sale'}
            </h1>
            <p className="text-gray-600">
              {isQuotation ? 'Generate a PDF quotation for the customer' : 'Create in-store orders'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('pos')}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
                activeTab === 'pos'
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Receipt className="h-4 w-4" />
              POS
            </button>
            <button
              onClick={() => setActiveTab('quotation')}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
                activeTab === 'quotation'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              Quotation
            </button>
          </div>
        </div>

        {/* Mode Banner */}
        {isQuotation && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <strong>Quotation Mode:</strong> No order will be created. A PDF quotation will be downloaded for the customer.
          </div>
        )}

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
                      const products = Array.isArray(searchResults.data) ? searchResults.data : searchResults.data?.data || [];
                      if (products.length === 0) {
                        return <div className="p-4 text-center text-gray-500">No products found</div>;
                      }
                      return products.map((product: any) => {
                        const price = parseFloat(product.price);
                        const stock = product.quantity || 0;
                        const primaryImage = product.images?.find((img: any) => img.is_primary)?.full_url || product.images?.[0]?.full_url;
                        return (
                          <button
                            key={product.id}
                            onClick={() => addToCart({
                              id: product.id, name: product.name, sku: product.sku,
                              price, image: primaryImage, stock, variation_id: null, variation_name: null
                            })}
                            className="w-full p-3 hover:bg-gray-50 border-b last:border-b-0 text-left flex items-center gap-3"
                          >
                            {primaryImage ? (
                              <img
                                src={primaryImage.startsWith('http') ? primaryImage : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${primaryImage}`}
                                alt={product.name}
                                className="w-12 h-12 shrink-0 object-cover rounded"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.png'; }}
                              />
                            ) : (
                              <div className="w-12 h-12 shrink-0 bg-gray-200 rounded flex items-center justify-center">
                                <ShoppingCart className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{product.name}</p>
                              <p className="text-sm text-gray-500 truncate">SKU: {product.sku}</p>
                              {product.brand && <p className="text-xs text-gray-400 truncate">{product.brand.name}</p>}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-semibold text-orange-600">{formatCurrency(price)}</p>
                              <p className={`text-xs ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>Stock: {stock}</p>
                            </div>
                          </button>
                        );
                      });
                    })()}
                  </div>
                )}

                {searchQuery && isSearching && (
                  <div className="p-4 text-center text-gray-500">Searching...</div>
                )}
                {searchQuery && searchError && (
                  <div className="p-4 text-center text-red-500">Error searching products</div>
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
                  <button onClick={() => setCart([])} className="text-sm text-red-600 hover:text-red-700">
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
                    <div key={index} className="flex flex-wrap items-center gap-3 p-3 border border-gray-200 rounded-lg sm:flex-nowrap">
                      {item.image ? (
                        <img
                          src={item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${item.image}`}
                          alt={item.name}
                          className="w-16 h-16 shrink-0 object-cover rounded"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.png'; }}
                        />
                      ) : (
                        <div className="w-16 h-16 shrink-0 bg-gray-200 rounded flex items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-[140px]">
                        <p className="font-medium text-gray-900 break-words">{item.name}</p>
                        {item.variation_name && <p className="text-sm text-gray-500">{item.variation_name}</p>}
                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        <p className="text-sm font-semibold text-orange-600">{formatCurrency(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(index, item.quantity - 1)} className="p-1 rounded hover:bg-gray-100">
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
                        <button onClick={() => updateQuantity(index, item.quantity + 1)} className="p-1 rounded hover:bg-gray-100">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                        <button onClick={() => removeFromCart(index)} className="text-red-600 hover:text-red-700 mt-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
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
                      Phone {!isQuotation && '*'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                      {customerInfo.customer_phone && <p className="text-sm text-gray-600">{customerInfo.customer_phone}</p>}
                      {customerInfo.customer_email && <p className="text-sm text-gray-600">{customerInfo.customer_email}</p>}
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">No customer information</p>
                  )}
                </div>
              )}
            </div>

            {/* Payment Method — POS only */}
            {!isQuotation && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                <div className="grid grid-cols-3 gap-2">
                  {(['cash', 'card', 'bkash', 'nagad', 'bank_transfer', 'manual'] as PaymentMethod[]).map((method) => {
                    const icons = {
                      cash: <Banknote className="h-6 w-6" />,
                      card: <CreditCard className="h-6 w-6" />,
                      bkash: <Smartphone className="h-6 w-6" />,
                      nagad: <Smartphone className="h-6 w-6" />,
                      bank_transfer: <Landmark className="h-6 w-6" />,
                      manual: <DollarSign className="h-6 w-6" />
                    };
                    const labels = { cash: 'Cash', card: 'Card', bkash: 'bKash', nagad: 'Nagad', bank_transfer: 'Bank Transfer', manual: 'Manual' };
                    return (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${
                          paymentMethod === method ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icons[method]}
                        <span className="text-sm font-medium text-center">{labels[method]}</span>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod !== 'cash' && (
                  <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                      <input
                        type="text"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        placeholder="Transaction ID, bank slip no., etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proof Document <span className="font-normal text-gray-400">(optional)</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2.5 text-sm text-gray-600 hover:border-orange-400 hover:bg-orange-50/50">
                        <Paperclip className="h-4 w-4 shrink-0" />
                        <span className="truncate">{proof ? proof.name : 'Attach receipt or screenshot'}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,application/pdf"
                          className="hidden"
                          onChange={(e) => setProof(e.target.files?.[0])}
                        />
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Note</label>
                      <input
                        type="text"
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        placeholder="Optional note about this payment"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Order Summary */}
            <div className={`bg-white rounded-lg shadow-sm p-6 ${isQuotation ? 'border-2 border-blue-200' : ''}`}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {isQuotation ? 'Quotation Summary' : 'Order Summary'}
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
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
                    <span>-{formatCurrency(totals.discount)}</span>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(totals.total)}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder={isQuotation ? 'Quotation notes for customer...' : 'Order notes...'}
                />
              </div>

              {isQuotation ? (
                <button
                  onClick={handleGenerateQuotation}
                  disabled={cart.length === 0 || generateQuotationMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  {generateQuotationMutation.isPending ? 'Generating PDF...' : 'Download Quotation PDF'}
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || createOrderMutation.isPending}
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Receipt className="h-5 w-5" />
                  {createOrderMutation.isPending ? 'Processing...' : 'Complete Order'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
