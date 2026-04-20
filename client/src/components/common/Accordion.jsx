import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const Accordion = ({ title, children, defaultOpen = true, className = '' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        <FaChevronDown
          size={14}
          className={`text-gray-600 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;






