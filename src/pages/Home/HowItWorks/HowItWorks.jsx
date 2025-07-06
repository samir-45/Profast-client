// components/HowItWorks.jsx
import React from 'react';
import {
  PackageCheck,
  HandCoins,
  Warehouse,
  Building2
} from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Booking Pick & Drop',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
    icon: PackageCheck
  },
  {
    id: 2,
    title: 'Cash On Delivery',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
    icon: HandCoins
  },
  {
    id: 3,
    title: 'Delivery Hub',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
    icon: Warehouse
  },
  {
    id: 4,
    title: 'Booking SME & Corporate',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
    icon: Building2
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-10">How it Works</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition duration-300"
              >
                <div className="flex justify-center mb-4">
                  <Icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-md font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
