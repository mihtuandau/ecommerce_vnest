import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showClose = true,
  variant = "user", 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
        onClick={onClose}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      ></div>
      
      {}
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none overflow-y-auto"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <div
          className={`${variant === 'admin' ? 'admin-layout' : ''} pointer-events-auto bg-white shadow-2xl ${
            sizeClasses[size]
          } w-full max-h-[90vh] my-8 flex flex-col transform transition-all duration-300 ${
            isAnimating
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-4 opacity-0 scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {(title || showClose) && (
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              {showClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}
          {}
          {title ? (
            <div className="p-6 overflow-y-auto flex-1">
              {children}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

Modal.Header = ({ children, onClose }) => (
  <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0">
    <h3 className="text-xl font-semibold text-gray-900">{children}</h3>
    {onClose && (
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200"
      >
        <X size={20} />
      </button>
    )}
  </div>
);

Modal.Body = ({ children }) => (
  <div className="p-6 overflow-y-auto flex-1">
    {children}
  </div>
);

Modal.Footer = ({ children }) => (
  <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
    {children}
  </div>
);

export default Modal;






