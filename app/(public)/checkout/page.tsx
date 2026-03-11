"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { useAddresses, useCreateAddress } from "@/lib/hooks/user";
import { useProcessCheckout, useGetShippingMethods } from "@/lib/hooks/user/useCheckout";
import { toast } from "sonner";
import { getPlaceholderImage } from "@/lib/utils/image";
import { 
  ChevronDown, 
  DollarSign, 
  Globe, 
  Loader2,
  ShoppingBag,
  Truck,
  Check,
  MapPin,
  Plus,
  Edit,
  Home,
  Building,
  CreditCard
} from "lucide-react";

// Types
interface GuestData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  street: string;
  city: string;
  district: string;
  zipCode: string;
  createAccount: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

interface ShippingMethod {
  code: string;
  name: string;
  description: string;
  cost: number;
  base_shipping_cost: number;
  custom_shipping_cost: number;
  delivery_time: string;
  free_shipping_min_order: number;
  is_free: boolean;
}

interface AddressFormData {
  address_line_1: string;
  address_line_2: string;
  contact_no: string;
  city: string;
  state: string;
  zip_code: string;
  address_type: 'shipping_address';
  is_default: boolean;
}
const addressTypeConfig = {
  user_address: { label: 'Home', icon: Home, color: 'text-blue-600 bg-blue-50' },
  shipping_address: { label: 'Shipping', icon: Building, color: 'text-green-600 bg-green-50' },
  billing_address: { label: 'Billing', icon: CreditCard, color: 'text-purple-600 bg-purple-50' },
};

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, getCartCount, clearCart } = useCart();
  const { data: addressesData } = useAddresses();
  const createAddressMutation = useCreateAddress();
  const processCheckout = useProcessCheckout();
  const getShippingMethods = useGetShippingMethods();
  
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "ssl">("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isClient, setIsClient] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  
  // Address management
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState<AddressFormData>({
    address_line_1: '',
    address_line_2: '',
    contact_no: '',
    city: '',
    state: '',
    zip_code: '',
    address_type: 'shipping_address',
    is_default: false,
  });
  
  // Guest user form data
  const [guestData, setGuestData] = useState<GuestData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    street: "",
    city: "",
    district: "",
    zipCode: "",
    createAccount: true,
  });

  const addresses = (addressesData as any)?.data || [];
  
  // Calculate totals
  const subTotal = items.reduce((acc, item) => {
    const price = item.variation ? parseFloat(item.variation.price) : parseFloat(item.product?.price || 0);
    return acc + (price * item.quantity);
  }, 0);
  const totalItems = getCartCount();
  const tax = subTotal * 0.05; // 5% tax
  const selectedShippingMethod = shippingMethods.find(m => m.code === selectedShipping);
  const shipping = selectedShippingMethod?.cost || 0;
  const totalPrice = subTotal + tax + shipping;
  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-select default address for authenticated users
  useEffect(() => {
    if (user && addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((addr: any) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else {
        setSelectedAddressId(addresses[0].id);
      }
    }
  }, [user, addresses, selectedAddressId]);

  // Redirect to cart if empty (but not during processing)
  useEffect(() => {
    if (!authLoading && items.length === 0 && isClient && !isProcessing) {
      toast.error('Your cart is empty');
      window.location.href = '/cart';
    }
  }, [items, authLoading, isClient, isProcessing]);

  // Fetch shipping methods
  useEffect(() => {
    if (items.length > 0 && isClient) {
      fetchShippingMethods();
    }
  }, [items, isClient, subTotal, selectedAddressId]);

  const fetchShippingMethods = async () => {
    try {
      const response = await getShippingMethods.mutateAsync({
        items: items.map(item => ({
          product_id: item.product_id,
          variation_id: item.variation_id || null,
          quantity: item.quantity,
        })),
        address_id: selectedAddressId || undefined,
        subtotal: subTotal,
      });

      if (response.success && response.data) {
        setShippingMethods(response.data);
        // Auto-select cheapest method
        if (response.data.length > 0) {
          const cheapest = response.data.reduce((min: ShippingMethod, method: ShippingMethod) => 
            method.cost < min.cost ? method : min
          );
          setSelectedShipping(cheapest.code);
        }
      }
    } catch (error) {
      console.error('Failed to fetch shipping methods:', error);
      // Set default shipping if API fails
      setShippingMethods([{
        code: 'standard',
        name: 'Standard Shipping',
        description: 'Standard delivery',
        cost: 50,
        base_shipping_cost: 50,
        custom_shipping_cost: 0,
        delivery_time: '3-5 business days',
        free_shipping_min_order: 1000,
        is_free: false,
      }]);
      setSelectedShipping('standard');
    }
  };
  // Handle input change
  const handleInputChange = (field: keyof GuestData, value: string | boolean) => {
    setGuestData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle address form change
  const handleAddressFormChange = (field: keyof AddressFormData, value: string | boolean) => {
    setAddressFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle create new address
  const handleCreateAddress = async () => {
    try {
      const response = await createAddressMutation.mutateAsync(addressFormData);
      if (response.success) {
        toast.success('Address added successfully');
        setShowAddressForm(false);
        setSelectedAddressId(response.data.id);
        // Reset form
        setAddressFormData({
          address_line_1: '',
          address_line_2: '',
          contact_no: '',
          city: '',
          state: '',
          zip_code: '',
          address_type: 'shipping_address',
          is_default: false,
        });
      }
    } catch (error) {
      console.error('Failed to create address:', error);
      toast.error('Failed to add address');
    }
  };

  // Validate email
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate phone
  const isValidPhone = (phone: string): boolean => {
    return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!user) {
      // Guest validation
      if (!guestData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      } else if (guestData.fullName.trim().length < 3) {
        newErrors.fullName = 'Name must be at least 3 characters';
      }

      if (!guestData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!isValidEmail(guestData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (!guestData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!isValidPhone(guestData.phone)) {
        newErrors.phone = 'Please enter a valid phone number (min 10 digits)';
      }

      if (guestData.createAccount) {
        if (!guestData.password) {
          newErrors.password = 'Password is required';
        } else if (guestData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(guestData.password)) {
          newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }

        if (!guestData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (guestData.password !== guestData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }

      if (!guestData.street.trim()) {
        newErrors.street = 'Street address is required';
      } else if (guestData.street.trim().length < 5) {
        newErrors.street = 'Please enter a complete address';
      }

      if (!guestData.city) {
        newErrors.city = 'City is required';
      }

      if (!guestData.district) {
        newErrors.district = 'District is required';
      }
    } else {
      // Authenticated user validation
      if (!selectedAddressId) {
        newErrors.address = 'Please select a shipping address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Handle checkout
  const handleCheckout = async () => {
    if (isProcessing) return;

    // Validate form
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsProcessing(true);

    try {
      // Validate shipping method selected
      if (!selectedShipping) {
        toast.error('Please select a shipping method');
        return;
      }

      const checkoutData: any = {
        items: items.map(item => ({
          product_id: item.product_id,
          variation_id: item.variation_id || null,
          quantity: item.quantity,
          price: item.variation 
            ? parseFloat(item.variation.price) 
            : parseFloat(item.product?.price || '0'),
        })),
        shipping_method: selectedShipping,
        payment_method: paymentMethod === 'ssl' ? 'ssl_commerz' : 'cash_on_delivery',
      };

      if (user) {
        // Authenticated user checkout
        checkoutData.shipping_address_id = selectedAddressId;
        checkoutData.billing_address_id = selectedAddressId;
      } else {
        // Guest checkout
        checkoutData.guest_name = guestData.fullName;
        checkoutData.guest_email = guestData.email;
        checkoutData.guest_phone = guestData.phone;
        checkoutData.shipping_address = {
          address_line_1: guestData.street,
          city: guestData.city,
          state: guestData.district,
          zip_code: guestData.zipCode || '',
          country: 'Bangladesh',
          phone: guestData.phone,
        };

        if (guestData.createAccount) {
          checkoutData.create_account = true;
          checkoutData.password = guestData.password;
        }
      }

      const response = await processCheckout.mutateAsync(checkoutData);

      console.log('Checkout response:', response);

      if (response.success) {
        // Show success message
        if (!user && guestData.createAccount) {
          toast.success('Order placed! Account created successfully.');
        } else {
          toast.success('Order placed successfully!');
        }

        // Handle payment redirect
        if (paymentMethod === 'ssl') {
          // Check for redirect URL in various possible locations
          const redirectUrl = response.data?.payment?.redirect_url 
            || response.data?.redirect_url 
            || response.data?.payment_url
            || response.data?.gatewayPageURL;
          
          if (redirectUrl) {
            console.log('Redirecting to SSL Commerce:', redirectUrl);
            // Don't clear cart - it will be cleared after successful payment
            // Use a small delay to ensure state is saved
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 100);
            return; // Don't continue execution
          } else {
            console.error('SSL Commerce redirect URL not found in response:', response);
            toast.error('Payment gateway URL not received. Please try again.');
            setIsProcessing(false);
            return;
          }
        } else {
          // For COD, clear cart and redirect to order confirmation
          clearCart();
          const orderNumber = response.data?.order_number || response.data?.order?.order_number;
          if (orderNumber) {
            setTimeout(() => {
              window.location.href = `/orders/${orderNumber}`;
            }, 100);
          } else {
            setTimeout(() => {
              window.location.href = '/';
            }, 100);
          }
        }
      } else {
        console.error('Checkout failed:', response);
        toast.error(response.message || 'Failed to process checkout');
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || 'Failed to process checkout. Please try again.';
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };
  // Show loading state
  if (authLoading || !isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white pb-20 pt-8">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/cart" className="hover:text-black">Cart</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">Checkout</span>
        </div>

        <h1 className="mb-8 text-3xl font-bold text-black">Checkout</h1>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            
            {/* Login Prompt for Guests */}
            {!user && (
              <div className="rounded-sm border border-blue-200 bg-blue-50 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="mb-2 font-bold text-black">Already have an account?</h3>
                    <p className="text-sm text-gray-600">
                      Login to use saved addresses and faster checkout
                    </p>
                  </div>
                  <Link href="/login?redirect=/checkout">
                    <button className="rounded-sm bg-black px-6 py-2.5 text-sm font-bold text-white hover:bg-gray-800 transition-colors">
                      Login
                    </button>
                  </Link>
                </div>
              </div>
            )}
            
            {/* Shipping & Contact Information */}
            <div className="rounded-sm border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-black">
                {user ? 'Shipping Information' : 'Contact & Shipping Information'}
              </h2>

              <div className="space-y-6">
                {/* Authenticated User - Address Selection */}
                {user && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-black">Select Shipping Address</h3>
                      <button
                        onClick={() => setShowAddressForm(!showAddressForm)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-[#00072D] bg-white border border-[#00072D] rounded-md hover:bg-[#00072D] hover:text-white transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Address
                      </button>
                    </div>

                    {/* Address Selection */}
                    {addresses.length > 0 ? (
                      <div className="space-y-3">
                        {addresses.map((address: any) => {
                          const typeConfig = addressTypeConfig[address.address_type as keyof typeof addressTypeConfig];
                          const TypeIcon = typeConfig?.icon || MapPin;
                          
                          return (
                            <label
                              key={address.id}
                              className={`flex cursor-pointer items-start p-4 border-2 rounded-lg transition-all ${
                                selectedAddressId === address.id
                                  ? 'border-[#00072D] bg-gray-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name="address"
                                value={address.id}
                                checked={selectedAddressId === address.id}
                                onChange={() => setSelectedAddressId(address.id)}
                                className="mt-1 h-4 w-4 text-[#00072D] focus:ring-[#00072D] border-gray-300"
                              />
                              <div className="ml-3 flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className={`p-1 rounded ${typeConfig?.color || 'text-gray-600 bg-gray-50'}`}>
                                    <TypeIcon className="h-4 w-4" />
                                  </div>
                                  <span className="font-medium text-black">
                                    {typeConfig?.label || 'Address'}
                                  </span>
                                  {address.is_default && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p>{address.address_line_1}</p>
                                  {address.address_line_2 && <p>{address.address_line_2}</p>}
                                  <p>{address.city}, {address.state} {address.zip_code}</p>
                                  <p className="font-medium">{address.contact_no}</p>
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
                        <p className="text-gray-500 mb-4">
                          Add your first address to continue with checkout.
                        </p>
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="inline-flex items-center px-4 py-2 bg-[#00072D] text-white text-sm font-medium rounded-md hover:bg-[#00072D]/90 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Address
                        </button>
                      </div>
                    )}

                    {errors.address && (
                      <p className="text-sm text-red-500">{errors.address}</p>
                    )}
                    {/* Add New Address Form */}
                    {showAddressForm && (
                      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h4 className="font-medium text-black mb-4">Add New Address</h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address Line 1 *
                              </label>
                              <input
                                type="text"
                                value={addressFormData.address_line_1}
                                onChange={(e) => handleAddressFormChange('address_line_1', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                                placeholder="House/Flat No, Street Name"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address Line 2
                              </label>
                              <input
                                type="text"
                                value={addressFormData.address_line_2}
                                onChange={(e) => handleAddressFormChange('address_line_2', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                                placeholder="Area, Landmark"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                City *
                              </label>
                              <input
                                type="text"
                                value={addressFormData.city}
                                onChange={(e) => handleAddressFormChange('city', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                State *
                              </label>
                              <input
                                type="text"
                                value={addressFormData.state}
                                onChange={(e) => handleAddressFormChange('state', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ZIP Code *
                              </label>
                              <input
                                type="text"
                                value={addressFormData.zip_code}
                                onChange={(e) => handleAddressFormChange('zip_code', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Contact Number *
                            </label>
                            <input
                              type="tel"
                              value={addressFormData.contact_no}
                              onChange={(e) => handleAddressFormChange('contact_no', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                              required
                            />
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="is_default"
                              checked={addressFormData.is_default}
                              onChange={(e) => handleAddressFormChange('is_default', e.target.checked)}
                              className="h-4 w-4 text-[#00072D] focus:ring-[#00072D] border-gray-300 rounded"
                            />
                            <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
                              Set as default address
                            </label>
                          </div>

                          <div className="flex items-center space-x-3 pt-4">
                            <button
                              onClick={handleCreateAddress}
                              disabled={createAddressMutation.isPending}
                              className="inline-flex items-center px-4 py-2 bg-[#00072D] text-white text-sm font-medium rounded-md hover:bg-[#00072D]/90 transition-colors disabled:opacity-50"
                            >
                              {createAddressMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4 mr-2" />
                              )}
                              Save Address
                            </button>
                            <button
                              onClick={() => setShowAddressForm(false)}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Guest User - Contact Info and Address */}
                {!user && (
                  <>
                    <div className="rounded-sm bg-gray-50 p-6">
                      <h3 className="mb-4 font-medium text-black">Contact Information</h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name" 
                            value={guestData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className={`w-full rounded-sm border ${errors.fullName ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 outline-none focus:border-black transition-colors`}
                          />
                          {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="email"
                            name="email"
                            placeholder="your.email@example.com" 
                            value={guestData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full rounded-sm border ${errors.email ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 outline-none focus:border-black transition-colors`}
                          />
                          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="tel"
                            name="phone"
                            placeholder="+880 1XXX-XXXXXX" 
                            value={guestData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={`w-full rounded-sm border ${errors.phone ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 outline-none focus:border-black transition-colors`}
                          />
                          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Account Creation Option */}
                    <div className="rounded-sm bg-gray-50 p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="createAccount"
                          checked={guestData.createAccount}
                          onChange={(e) => handleInputChange('createAccount', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                        />
                        <label htmlFor="createAccount" className="font-medium text-black cursor-pointer">
                          Create an account for faster checkout next time
                        </label>
                      </div>

                      {guestData.createAccount && (
                        <div className="space-y-4 border-t border-gray-200 pt-4">
                          <p className="text-sm text-gray-600">
                            Your account will be created after successful payment
                          </p>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                              Password <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="password"
                              name="password"
                              placeholder="Min 8 characters (uppercase, lowercase, number)" 
                              value={guestData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              className={`w-full rounded-sm border ${errors.password ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 outline-none focus:border-black transition-colors`}
                            />
                            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                              Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="password"
                              name="confirmPassword"
                              placeholder="Re-enter your password" 
                              value={guestData.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              className={`w-full rounded-sm border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 outline-none focus:border-black transition-colors`}
                            />
                            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Shipping Address for Guest */}
                    <div className="rounded-sm bg-gray-50 p-6">
                      <h3 className="mb-4 font-medium text-black">Shipping Address</h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            Street Address <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text"
                            name="street"
                            placeholder="House/Flat No, Street Name, Area" 
                            value={guestData.street}
                            onChange={(e) => handleInputChange('street', e.target.value)}
                            className={`w-full rounded-sm border ${errors.street ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 outline-none focus:border-black transition-colors`}
                          />
                          {errors.street && <p className="text-xs text-red-500">{errors.street}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                              City <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <select 
                                name="city"
                                value={guestData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                className={`w-full appearance-none rounded-sm border ${errors.city ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-black transition-colors`}
                              >
                                <option value="">Select City</option>
                                <option value="Dhaka">Dhaka</option>
                                <option value="Chittagong">Chittagong</option>
                                <option value="Sylhet">Sylhet</option>
                                <option value="Rajshahi">Rajshahi</option>
                                <option value="Khulna">Khulna</option>
                                <option value="Barisal">Barisal</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                              District <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <select 
                                name="district"
                                value={guestData.district}
                                onChange={(e) => handleInputChange('district', e.target.value)}
                                className={`w-full appearance-none rounded-sm border ${errors.district ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-black transition-colors`}
                              >
                                <option value="">Select District</option>
                                <option value="Dhaka">Dhaka</option>
                                <option value="Gazipur">Gazipur</option>
                                <option value="Narayanganj">Narayanganj</option>
                                <option value="Tangail">Tangail</option>
                                <option value="Manikganj">Manikganj</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.district && <p className="text-xs text-red-500">{errors.district}</p>}
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                              Zip Code
                            </label>
                            <input 
                              type="text"
                              name="zipCode"
                              placeholder="1200" 
                              value={guestData.zipCode}
                              onChange={(e) => handleInputChange('zipCode', e.target.value)}
                              className="w-full rounded-sm border border-gray-200 bg-white px-4 py-2.5 outline-none focus:border-black transition-colors" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Shipping Method */}
            <div className="rounded-sm border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-black">Shipping Method</h2>

              {getShippingMethods.isPending ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-gray-500">Loading shipping options...</span>
                </div>
              ) : shippingMethods.length === 0 ? (
                <div className="rounded-sm bg-gray-50 p-4 text-center text-sm text-gray-500">
                  No shipping methods available
                </div>
              ) : (
                <div className="space-y-3">
                  {shippingMethods.map((method) => (
                    <label 
                      key={method.code}
                      className={`flex cursor-pointer items-start justify-between rounded-sm border-2 p-4 transition-all ${
                        selectedShipping === method.code 
                          ? 'border-black bg-gray-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="relative flex items-center justify-center mt-1">
                          <input 
                            type="radio" 
                            name="shipping" 
                            value={method.code}
                            className="peer h-5 w-5 appearance-none rounded-full border-2 border-gray-400 checked:border-black checked:bg-black"
                            checked={selectedShipping === method.code}
                            onChange={() => setSelectedShipping(method.code)}
                          />
                          <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 font-medium text-black">
                                <Truck className="h-5 w-5" />
                                {method.name}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                <span className="font-medium">Delivery:</span> {method.delivery_time}
                              </p>
                              {method.free_shipping_min_order > 0 && !method.is_free && subTotal < method.free_shipping_min_order && (
                                <p className="text-xs text-amber-600 mt-2 bg-amber-50 px-2 py-1 rounded">
                                  Add ${(method.free_shipping_min_order - subTotal).toFixed(2)} more for free shipping
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className={`text-lg font-bold ${method.is_free ? 'text-green-600' : 'text-black'}`}>
                                {method.is_free ? 'FREE' : `$${method.cost.toFixed(2)}`}
                              </div>
                              {selectedShipping === method.code && (
                                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-black px-2 py-0.5 text-xs font-bold text-white">
                                  <Check className="h-3 w-3" />
                                  Selected
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="rounded-sm border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-black">Payment Method</h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className={`flex cursor-pointer items-start justify-between rounded-sm border-2 p-4 transition-all ${
                  paymentMethod === 'cod' 
                    ? 'border-black bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-start gap-3 flex-1">
                    <div className="relative flex items-center justify-center mt-1">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cod"
                        className="peer h-5 w-5 appearance-none rounded-full border-2 border-gray-400 checked:border-black checked:bg-black"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                      <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-medium text-black">
                        <DollarSign className="h-5 w-5" />
                        Cash on Delivery
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay with cash when your order is delivered to your doorstep
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-black px-2 py-0.5 text-xs font-bold text-white">
                      <Check className="h-3 w-3" />
                      Selected
                    </div>
                  )}
                </label>

                {/* SSL Commerce */}
                <label className={`flex cursor-pointer items-start justify-between rounded-sm border-2 p-4 transition-all ${
                  paymentMethod === 'ssl' 
                    ? 'border-black bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-start gap-3 flex-1">
                    <div className="relative flex items-center justify-center mt-1">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="ssl"
                        className="peer h-5 w-5 appearance-none rounded-full border-2 border-gray-400 checked:border-black checked:bg-black"
                        checked={paymentMethod === 'ssl'}
                        onChange={() => setPaymentMethod('ssl')}
                      />
                      <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-medium text-black">
                        <Globe className="h-5 w-5" />
                        Online Payment (SSL Commerce)
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay securely with credit/debit card, mobile banking, or internet banking
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Secure</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Instant</span>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === 'ssl' && (
                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-black px-2 py-0.5 text-xs font-bold text-white">
                      <Check className="h-3 w-3" />
                      Selected
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96">
            <div className="sticky top-8 space-y-6">
              {/* Order Summary */}
              <div className="rounded-sm border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-bold text-black">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item, index) => {
                    const price = item.variation ? parseFloat(item.variation.price) : parseFloat(item.product?.price || '0');
                    const itemTotal = price * item.quantity;

                    return (
                      <div key={`${item.product_id}-${item.variation_id || 'no-variation'}-${index}`} className="flex items-start gap-3">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm bg-gray-100">
                          <img
                            src={getPlaceholderImage(item.product?.image)}
                            alt={item.product?.name || 'Product'}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-black line-clamp-2">
                            {item.product?.name || 'Unknown Product'}
                          </h3>
                          {item.variation && (
                            <p className="text-xs text-gray-500 mt-1">
                              {item.variation.attribute_values?.map((attr: any) => 
                                `${attr.attribute_name}: ${attr.value}`
                              ).join(', ')}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">
                              ${price.toFixed(2)} × {item.quantity}
                            </span>
                            <span className="text-sm font-bold text-black">
                              ${itemTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-medium text-black">${subTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-black">
                      {selectedShippingMethod?.is_free ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-medium text-black">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold">
                    <span className="text-black">Total</span>
                    <span className="text-black">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || items.length === 0}
                  className="mt-6 w-full rounded-sm bg-black px-6 py-3 text-white font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" />
                      {paymentMethod === 'ssl' ? 'Pay Now' : 'Place Order'}
                    </>
                  )}
                </button>

                {/* Security Notice */}
                <div className="mt-4 rounded-sm bg-gray-50 p-3">
                  <p className="text-xs text-gray-600 text-center">
                    🔒 Your payment information is secure and encrypted
                  </p>
                </div>
              </div>

              {/* Return Policy */}
              <div className="rounded-sm border border-gray-100 bg-white p-4 shadow-sm">
                <h3 className="font-medium text-black mb-2">Return Policy</h3>
                <p className="text-xs text-gray-600">
                  30-day return policy. Items must be in original condition with tags attached.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}