import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="mb-8 flex items-center space-x-2 text-sm py-4 border-b border-gray-100">
      <Link
        to="/"
        className="text-gray-600 hover:text-gray-900 transition-colors font-light"
      >
        Trang chủ
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <FaChevronRight className="text-gray-300 w-2.5 h-2.5" />
          {item.path ? (
            <Link
              to={item.path}
              className="text-gray-600 hover:text-gray-900 transition-colors font-light"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-normal truncate max-w-md">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;