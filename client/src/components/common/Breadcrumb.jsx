import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="text-sm text-gray-500 py-3">
      <Link to="/" className="hover:text-gray-700">
        Trang chủ
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="mx-2">/</span>
          {item.path ? (
            <Link to={item.path} className="hover:text-gray-700">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 uppercase">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;