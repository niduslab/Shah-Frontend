import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function ContactFormSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Form */}
          <div className="bg-[#F4F5F7] p-8 md:p-10 rounded-sm">
            <h2 className="text-2xl font-bold mb-8 text-black">Message Us</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="font-medium text-sm text-black">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="Enter your first name"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="font-medium text-sm text-black">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Enter your last name"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="font-medium text-sm text-black">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact" className="font-medium text-sm text-black">
                    Contact
                  </label>
                  <input
                    type="tel"
                    id="contact"
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
                  placeholder="Enter your address here"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="font-medium text-sm text-black">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="your message here"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ffb81e] text-black font-semibold py-4 px-6 rounded-sm hover:bg-[#ffb81e]/90 transition-colors flex items-center justify-center gap-2"
              >
                Send Message
                <ArrowRight className="h-5 w-5" />
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
