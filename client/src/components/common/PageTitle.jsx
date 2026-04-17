
const PageTitle = ({
  subtitle,
  title,
  description,
  count,
  countLabel = "sản phẩm",
  className = "",
}) => {
  return (
    <div className={`text-center mb-10 mt-6 ${className}`}>
      {subtitle && (
        <span className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4 block">
          {subtitle}
        </span>
      )}
      <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
        {title}
      </h1>
      <div className="w-12 h-px bg-gray-900 mx-auto mb-4"></div>
      {description && (
        <p className="text-gray-600 font-light max-w-2xl mx-auto">
          {description}
        </p>
      )}
      {count !== undefined && (
        <p className="text-gray-600 font-light">
          {count} {countLabel}
        </p>
      )}
    </div>
  );
};

export default PageTitle;






