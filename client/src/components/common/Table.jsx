import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const Table = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">{children}</table>
      </div>
    </div>
  );
};

const TableHead = ({ children }) => (
  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">{children}</thead>
);

const TableBody = ({ children }) => (
  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
);

const TableRow = ({ children, className = "", hover = true, ...props }) => (
  <tr
    className={`${
      hover
        ? "hover:bg-gray-50 transition-colors duration-150"
        : ""
    } ${className}`}
    {...props}
  >
    {children}
  </tr>
);

const TableHeader = ({
  children,
  className = "",
  sortable = false,
  onClick,
  onSort, 
  sorted,
  sortDir,
  align = "left",
  ...props
}) => {
  const alignClass = align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
  
  return (
    <th
      className={`px-6 py-4 ${alignClass} text-xs font-semibold text-gray-600 uppercase tracking-wide ${className}`}
      {...props}
    >
      {sortable ? (
        <button
          className="inline-flex items-center gap-1 hover:text-[#00a85a] transition-colors group"
          onClick={onClick}
        >
          {children}
          <div className="flex flex-col -space-y-1.5">
            <ArrowUp
              className={`w-3 h-3 ${
                sorted && sortDir === "asc"
                  ? "text-[#00a85a]"
                  : "text-gray-300 group-hover:text-gray-400"
              }`}
            />
            <ArrowDown
              className={`w-3 h-3 ${
                sorted && sortDir === "desc"
                  ? "text-[#00a85a]"
                  : "text-gray-300 group-hover:text-gray-400"
              }`}
            />
          </div>
        </button>
      ) : (
        children
      )}
    </th>
  );
};

const TableCell = ({ children, className = "", align, ...props }) => {
  const alignClass = align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
  
  return (
    <td className={`px-6 py-4 text-sm text-gray-900 ${alignClass} ${className}`} {...props}>
      {children}
    </td>
  );
};

const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} hover={false}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

const TableEmpty = ({ children, icon: Icon }) => (
  <tr>
    <td colSpan="100" className="px-6 py-12">
      <div className="text-center">
        {Icon && (
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-gray-400" />
          </div>
        )}
        <div className="text-gray-600">{children}</div>
      </div>
    </td>
  </tr>
);

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Header = TableHeader;
Table.Cell = TableCell;
Table.Skeleton = TableSkeleton;
Table.Empty = TableEmpty;

export default Table;






