// src/components/common/PageHeader.jsx
import { Button } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

/**
 * Reusable page header component
 */
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
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              type="text"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {showRefresh && (
            <Button
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={refreshing}
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
