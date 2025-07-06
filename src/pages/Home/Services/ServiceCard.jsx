// components/ServiceCard.jsx
import React from 'react';

const ServiceCard = ({ service }) => {

    const {icon: Icon, title, description} = service;

  return (
    <div className="bg-white shadow-md hover:bg-[#CAEB66] rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 hover:shadow-lg transition duration-300">
      <Icon className="text-3xl text-blue-600" />
      <h3 className="text-xl font-semibold text-primary">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;

