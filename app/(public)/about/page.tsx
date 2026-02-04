import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-surface py-12">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">About Shah Sports</h1>
          <p className="text-lg text-foreground/70">
            Empowering athletes and fitness enthusiasts with premium gear since 2010.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted">
            {/* Placeholder for About Image */}
            <div className="absolute inset-0 flex items-center justify-center text-foreground/20 font-medium">
              About Us Image
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p className="text-foreground/80 leading-relaxed">
              Founded with a passion for sports and fitness, Shah Sports began as a small local shop dedicated to providing high-quality cricket gear. Over the years, we have grown into a comprehensive sports destination, offering everything from gym equipment to apparel for various disciplines.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Our mission is simple: to inspire active lifestyles by making top-tier sports equipment accessible to everyone. We believe that the right gear can make all the difference in your performance journey.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              Q
            </div>
            <h3 className="text-lg font-bold mb-2">Quality First</h3>
            <p className="text-sm text-foreground/70">
              We never compromise on quality. Every product in our inventory is selected for its durability and performance.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              C
            </div>
            <h3 className="text-lg font-bold mb-2">Customer Focus</h3>
            <p className="text-sm text-foreground/70">
              Your satisfaction is our priority. Our team is dedicated to helping you find exactly what you need.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              I
            </div>
            <h3 className="text-lg font-bold mb-2">Integrity</h3>
            <p className="text-sm text-foreground/70">
              We believe in honest pricing and transparent business practices. What you see is what you get.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-secondary text-secondary-foreground rounded-2xl p-12 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-black text-primary mb-2">10+</div>
              <div className="text-sm opacity-80">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-black text-primary mb-2">5k+</div>
              <div className="text-sm opacity-80">Products Available</div>
            </div>
            <div>
              <div className="text-3xl font-black text-primary mb-2">20k+</div>
              <div className="text-sm opacity-80">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-black text-primary mb-2">24/7</div>
              <div className="text-sm opacity-80">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
