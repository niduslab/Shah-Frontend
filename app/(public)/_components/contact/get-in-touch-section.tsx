import { Mail, Phone, MapPin } from "lucide-react";

export function GetInTouchSection() {
  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-black" />,
      title: "Email",
      description: "Have a question or need assistance? Reach out to us via email",
      value: "info@shahsports.com.bd",
    },
    {
      icon: <Phone className="h-6 w-6 text-black" />,
      title: "Phone",
      description: "Get instant help from our team—no waiting, no hassle.",
      value: "880-1615550098",
    },
    {
      icon: <MapPin className="h-6 w-6 text-black" />,
      title: "Visit Our Office",
      description: "We'd love to welcome you to our headquarters — stop by for a chat",
      value: "223/A, Tejgaon Industrial Area Gulshan Link Road, Dhaka-1208",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
          Get In Touch
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="bg-[#F3EFE9] p-8 rounded-sm h-full flex flex-col justify-between"
            >
              <div>
                <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center mb-6 shadow-sm">
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">
                  {method.title}
                </h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  {method.description}
                </p>
              </div>
              <p className="font-semibold text-black break-words">
                {method.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
