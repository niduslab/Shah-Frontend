import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-surface py-12">
      <div className="mx-auto w-full max-w-6xl px-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Our Location</h3>
                    <p className="text-foreground/70 text-sm mt-1">
                      123 Sports Avenue, Dhaka<br />
                      Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone Number</h3>
                    <p className="text-foreground/70 text-sm mt-1">
                      +880 1615 550080<br />
                      +880 1615 550079
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Address</h3>
                    <p className="text-foreground/70 text-sm mt-1">
                      info@shahsports.com.bd<br />
                      support@shahsports.com.bd
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Working Hours</h3>
                    <p className="text-foreground/70 text-sm mt-1">
                      Sat - Thu: 10:00 AM - 8:00 PM<br />
                      Friday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <input type="text" id="name" className="w-full h-10 px-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input type="email" id="email" className="w-full h-10 px-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="your@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <input type="text" id="subject" className="w-full h-10 px-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea id="message" rows={5} className="w-full p-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" placeholder="Your message..."></textarea>
              </div>
              <button type="submit" className="w-full h-10 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
