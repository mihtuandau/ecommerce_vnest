import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      <Link
        to="/"
        className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
      >
        <FaHome className="mr-1" />
        <span>Trang chủ</span>
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <FaChevronRight className="text-gray-400" size={12} />
          {item.path ? (
            <Link
              to={item.path}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
