"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "@/lib/api/axios";
import { useAuth } from "@/lib/context/AuthContext";

interface VisitorPopupProps {
  delay?: number; // Delay in milliseconds before showing popup
}

export function VisitorPopup({ delay = 3000 }: VisitorPopupProps) {
  const { user, loading: authLoading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShownThisSession, setHasShownThisSession] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Don't show if auth is still loading
    if (authLoading) return;

    // Don't show to logged-in users
    if (user) return;

    // Don't show if already shown in this session
    if (hasShownThisSession) return;

    // Check if user has already submitted the popup (persisted)
    const hasSubmitted = localStorage.getItem("visitor_popup_submitted");
    
    // Check if popup was dismissed in this session
    const dismissedThisSession = sessionStorage.getItem("visitor_popup_dismissed");
    
    if (!hasSubmitted && !dismissedThisSession) {
      // Show popup after delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasShownThisSession(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay, user, authLoading, hasShownThisSession]);

  const handleClose = () => {
    setIsVisible(false);
    // Mark as dismissed for this session only
    sessionStorage.setItem("visitor_popup_dismissed", "true");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await api.post("/api/visitor-popup", {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
      });

      if (response.data.success) {
        // Mark as submitted in localStorage
        localStorage.setItem("visitor_popup_submitted", "true");
        setSuccessMessage("Thank you for your interest! We'll be in touch soon.");
        
        // Close popup after 2 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          {successMessage ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900">{successMessage}</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to Our Store!
                </h2>
                <p className="text-gray-600">
                  Get exclusive deals and updates. Leave your details and we'll keep you informed!
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                    {errors.general}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Get Exclusive Deals"}
                </button>

                <p className="text-xs text-center text-gray-500">
                  By submitting, you agree to receive promotional emails. You can unsubscribe at any time.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
