"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api/axios";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  message: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  message: "",
};

export function ContactFormSection() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message";
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

    try {
      const response = await api.post("/api/contact-messages", {
        first_name: formData.firstName,
        last_name: formData.lastName || null,
        email: formData.email,
        phone: formData.phone || null,
        address: formData.address || null,
        message: formData.message,
      });

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Thank you for reaching out! Our team will get back to you soon."
        );
        setFormData(initialFormData);
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        Object.entries(error.response.data.errors).forEach(
          ([key, value]) => {
            const fieldMap: Record<string, string> = {
              first_name: "firstName",
              last_name: "lastName",
            };
            const field = fieldMap[key] || key;
            apiErrors[field] = Array.isArray(value) ? value[0] : String(value);
          }
        );
        setErrors(apiErrors);
        toast.error("Please check the form for errors");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Form */}
          <div className="bg-[#F4F5F7] p-8 md:p-10 rounded-sm">
            <h2 className="text-2xl font-bold mb-8 text-black">Message Us</h2>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="font-medium text-sm text-black">
                    First Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className={`w-full px-4 py-3 bg-white border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm ${
                      errors.firstName ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-600">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="font-medium text-sm text-black">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="font-medium text-sm text-black">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-3 bg-white border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="font-medium text-sm text-black">
                    Contact
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="font-medium text-sm text-black">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address here"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="font-medium text-sm text-black">
                  Your Message <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="your message here"
                  className={`w-full px-4 py-3 bg-white border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none text-sm ${
                    errors.message ? "border-red-500" : "border-gray-200"
                  }`}
                ></textarea>
                {errors.message && (
                  <p className="text-xs text-red-600">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ffb81e] text-black font-semibold py-4 px-6 rounded-sm hover:bg-[#ffb81e]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    Sending...
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Text + Image */}
          <div className="flex flex-col h-full gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black leading-tight">
                Let&apos;s talk about your
                <br />
                needs
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-md">
                We&apos;re always here to answer your questions, ease your concerns, and
                help you take the next step toward.
              </p>
            </div>

            <div className="relative w-full h-[400px] md:h-[500px] mt-auto">
              <Image
                src="/images/contact-us/talk-about-needs.png"
                alt="Gym Interior"
                fill
                className="object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
