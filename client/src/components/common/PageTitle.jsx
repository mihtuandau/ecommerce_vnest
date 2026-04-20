
const PageTitle = ({
  subtitle,
  title,
  description,
  count,
  countLabel = "sản phẩm",
  className = "",
}) => {
  return (
    <div className={`text-center mb-12 mt-8 px-6 ${className}`}>
      {subtitle && (
        <span 
          style={{ fontFamily: 'Inter, sans-serif' }}
          className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] font-black text-blue-600 mb-3 block"
        >
          {subtitle}
        </span>
      )}
      <h1 
        style={{ fontFamily: 'Inter, sans-serif' }}
        className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5 uppercase tracking-tight"
      >
        {title}
      </h1>
      <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
      {description && (
        <p className="text-sm sm:text-base text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {count !== undefined && (
        <p className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">
          {count} {countLabel}
        </p>
      )}
    </div>
  );
};

export default PageTitle;






