'use client';

import {
  Smartphone,
  Zap,
  Tv,
  Droplet,
  Flame,
  ShieldCheck,
  Plane,
  Bus,
  TrainFront,
  Hotel,
  Car,
  LucideIcon,
} from 'lucide-react';

export default function ServicesAndUtilities() {
  
  return (
    <section className="py-6 font-sans select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Card Container */}
        <div className="relative bg-white rounded-xl border border-gray-200 p-8 shadow-sm overflow-hidden">
          
          {/* Coming Soon Floating Badge */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="bg-primary text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full shadow-2xl transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm sm:text-base md:text-lg font-bold tracking-wide whitespace-nowrap">Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-0">
            
            {/* Section 1: Bills & Recharge */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Text */}
              <div className="w-full md:w-1/3 pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-[22px] font-bold text-gray-900">Bills & Recharge</h2>
                </div>
                <p className="text-gray-500 text-[14px] mb-4 leading-relaxed">
                  Pay your bills & recharge instantly with Justdial
                </p>
                <span className="text-[#0076D7] text-[14px] font-medium cursor-pointer hover:underline">
                  Explore More
                </span>
              </div>

              {/* Right Icons Grid */}
              <div className="flex-1 flex flex-wrap gap-4 md:gap-8 justify-start">
                <ServiceIcon label="Mobile" icon={Smartphone} />
                <ServiceIcon label="Electricity" icon={Zap} />
                <ServiceIcon label="DTH" icon={Tv} />
                <ServiceIcon label="Water" icon={Droplet} />
                <ServiceIcon label="Gas" icon={Flame} />
                <ServiceIcon label="Insurance" icon={ShieldCheck} />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 my-8 w-full" />

            {/* Section 2: Travel Bookings */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Text */}
              <div className="w-full md:w-1/3 pt-2">
                <h2 className="text-[22px] font-bold text-gray-900 mb-2">Travel Bookings</h2>
                <p className="text-gray-500 text-[14px] mb-4 leading-relaxed">
                  Instant ticket bookings for your best travel experience
                </p>
                <span className="text-[#0076D7] text-[14px] font-medium cursor-pointer hover:underline">
                  Explore More
                </span>
              </div>

              {/* Right Icons Grid */}
              <div className="flex-1 flex flex-wrap gap-4 md:gap-8 justify-start">
                <ServiceIcon label="Flight" icon={Plane} />
                <ServiceIcon label="Bus" icon={Bus} />
                <ServiceIcon label="Train" icon={TrainFront} />
                <ServiceIcon label="Hotel" icon={Hotel} />
                <ServiceIcon label="Car Rentals" icon={Car} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// Reusable Icon Component
function ServiceIcon({ 
  label,
  icon: Icon,
}: { 
  label: string; 
  icon: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center w-[85px]">
      <div className="w-[70px] h-[70px] rounded-[18px] border border-gray-200 flex items-center justify-center bg-white hover:border-primary transition-colors shadow-sm mb-3">
        <Icon className="w-7 h-7 text-primary" strokeWidth={1.75} />
      </div>
      <span className="text-[15px] text-gray-800 font-medium text-center leading-tight">
        {label}
      </span>
    </div>
  );
}