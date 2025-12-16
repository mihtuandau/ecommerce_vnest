import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="mb-6 flex items-center space-x-2 text-sm bg-gray-100 backdrop-blur-sm  px-4 py-3">
      <Link
        to="/"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
      >
        <span>Trang chủ</span>
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <FaChevronRight className="text-gray-400 w-3 h-3" />
          {item.path ? (
            <Link
              to={item.path}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-semibold line-clamp-1">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
