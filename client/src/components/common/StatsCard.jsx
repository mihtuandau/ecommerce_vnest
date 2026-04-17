import React, { memo } from 'react';

const StatsCard = memo(({ title, value, icon: Icon, borderColor, iconColor, bgColor }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${borderColor || 'border-gray-500'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg ${bgColor || 'bg-gray-100'} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${iconColor || 'text-gray-600'}`} />
          </div>
        )}
      </div>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;






