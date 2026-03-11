'use client';

import Link from 'next/link';
import { TopBar } from "../(public)/_components/layout/top-bar";
import { NavBar } from "../(public)/_components/layout/nav-bar";
import { Footer } from "../(public)/_components/layout/footer";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <NavBar />
      <div className="flex-1 w-full flex items-center justify-center bg-gray-50 p-4 md:p-8">
        <div className="w-full max-w-[1400px] h-[800px] max-h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden lg:grid lg:grid-cols-2 ring-1 ring-gray-900/5">
          {/* Left Side - Brand/Image Area */}
          <div className="hidden lg:flex flex-col justify-center bg-[#0B3B2D] p-12 xl:p-16 text-white relative overflow-hidden">
            {/* Background Pattern/Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none" />
            
            {/* Main Text */}
            <div className="space-y-8 max-w-lg relative z-10">
                <h1 className="text-5xl xl:text-7xl font-serif leading-[1.05] tracking-tight">
                    Enter the Future <br />
                    of <span className="italic text-emerald-200">Commerce</span>, <br />
                    today
                </h1>
                <p className="text-emerald-100/90 text-lg xl:text-xl font-light leading-relaxed max-w-md">
                    Experience the next generation of online shopping with seamless transactions and premium support.
                </p>
            </div>
            
            {/* Decorative Circles */}
            <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen"></div>
          </div>

          {/* Right Side - Form Area */}
          <div className="flex flex-col justify-center items-center p-8 md:p-12 xl:p-16 bg-white h-full overflow-y-auto">
            <div className="w-full max-w-[420px] mx-auto">
                {children}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
