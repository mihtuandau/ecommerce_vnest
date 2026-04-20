import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="text-sm text-gray-500 py-3">
      <Link to="/" className="hover:text-slate-800 font-semibold text-slate-800">
        Trang chủ
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="mx-2 text-gray-300">/</span>
          {item.path ? (
            <Link to={item.path} style={{ fontFamily: 'Inter, sans-serif' }} className="hover:text-slate-800 text-slate-800 font-semibold">
              {item.label}
            </Link> 
          ) : (
            <span style={{ fontFamily: 'Inter, sans-serif' }} className="text-slate-800 font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;





