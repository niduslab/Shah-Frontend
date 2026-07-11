export function LocationMapSection() {
  return (
    <section id="location-map" className="scroll-mt-24 pb-12 md:pb-20 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-gray-100 shadow-sm">
          <iframe
            src="https://maps.google.com/maps?q=223/A,+Bir+Uttam+Mir+Shawkat+Sarak,+Dhaka+1208&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Shah Sports Location Map"
            className="grayscale hover:grayscale-0 transition-all duration-500 w-full h-full"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
