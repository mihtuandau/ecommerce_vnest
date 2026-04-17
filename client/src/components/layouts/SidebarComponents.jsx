import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

export const NavItem = ({ to, icon: Icon, label, badge, isOpen, pathname }) => {
  const active = pathname === to;
  const activeStyle = { backgroundColor: '#1d4ed8', color: '#eff6ff', fontWeight: 600 };
  const inactiveStyle = { color: '#cbd5e1' };

  return (
    <Link
      to={to}
      className="relative mx-2 flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-slate-800"
      style={active ? activeStyle : inactiveStyle}
      title={!isOpen ? label : undefined}
    >
      <Icon size={18} style={{ color: 'inherit', flexShrink: 0 }} />
      {isOpen && (
        <>
          <span className="text-[13.5px] truncate flex-1" style={{ fontWeight: active ? 600 : 500 }}>
            {label}
          </span>
          {badge > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </>
      )}
      {!isOpen && badge > 0 && (
        <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  );
};

export const SubNavItem = ({ to, icon: Icon, label, badge, pathname }) => {
  const active = pathname === to || pathname.startsWith(to + '/');
  const activeStyle = { color: '#bfdbfe', backgroundColor: '#1e3a8a', fontWeight: 600 };
  const inactiveStyle = { color: '#94a3b8' };

  return (
    <Link
      to={to}
      className="mx-2 flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-150 hover:bg-slate-800"
      style={active ? activeStyle : inactiveStyle}
    >
      <Icon size={15} style={{ color: 'inherit', flexShrink: 0 }} />
      <span className="text-[13px] truncate flex-1" style={{ fontWeight: active ? 600 : 400 }}>
        {label}
      </span>
      {badge > 0 && (
        <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
};

export const NavGroup = ({ groupKey, icon: Icon, label, children, isOpen, expanded, onToggle, pathname, paths = [] }) => {
  const active = paths.some(p => pathname.startsWith(p));
  const btnStyle = { color: active ? '#bfdbfe' : '#cbd5e1', fontWeight: active ? 600 : 500 };

  return (
    <div>
      <button
        onClick={() => onToggle(groupKey)}
        className="mx-2 flex w-[calc(100%-16px)] items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-slate-800 outline-none"
        style={btnStyle}
        title={!isOpen ? label : undefined}
      >
        <Icon size={18} style={{ color: 'inherit', flexShrink: 0 }} />
        {isOpen && (
          <>
            <span className="text-[13.5px] truncate flex-1 text-left">{label}</span>
            {expanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
          </>
        )}
      </button>
      {isOpen && expanded && <div className="mt-0.5 ml-4">{children}</div>}
    </div>
  );
};

export const SectionLabel = ({ label, isOpen }) =>
  isOpen ? (
    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 px-4 pt-4 pb-1.5 font-inter">
      {label}
    </p>
  ) : null;
