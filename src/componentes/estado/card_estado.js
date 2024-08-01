
import React from 'react';

const StatsCard = ({ title, value, description, icon: Icon, color, textcolor }) => {
  return (
    
    <div className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="text-xl text-white" />
      </div>
      <div className="ml-4">
        <h4 className="text-gray-500">{title}</h4>
        <h2 className={`${textcolor}`}>{value}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default StatsCard;
