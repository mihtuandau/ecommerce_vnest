
import { Button } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export const PageHeader = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  showRefresh = false,
  onRefresh,
  refreshing = false,
  actions,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              type="text"
              className="hover:bg-gray-100"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1.5">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 text-base font-medium">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {showRefresh && onRefresh && (
            <Button
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={refreshing}
              className="shadow-sm"
            >
              Làm mới
            </Button>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
};






