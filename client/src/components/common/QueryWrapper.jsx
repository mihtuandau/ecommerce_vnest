// src/components/common/QueryWrapper.jsx
import { Spin, Result, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

/**
 * Wrapper component for TanStack Query states
 * Handles loading, error, and empty states consistently
 */
export const QueryWrapper = ({ 
  isLoading, 
  error, 
  data, 
  isEmpty,
  children,
  loadingMessage = 'Đang tải...',
  emptyMessage = 'Không có dữ liệu',
  errorTitle = 'Có lỗi xảy ra',
  onRetry,
  minHeight = 'min-h-[400px]'
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${minHeight}`}>
        <Spin size="large" tip={loadingMessage} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`flex items-center justify-center ${minHeight}`}>
        <Result
          status="error"
          title={errorTitle}
          subTitle={error?.message || 'Không thể tải dữ liệu'}
          extra={
            onRetry && (
              <Button 
                type="primary" 
                icon={<ReloadOutlined />}
                onClick={onRetry}
              >
                Thử lại
              </Button>
            )
          }
        />
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <div className={`flex items-center justify-center ${minHeight}`}>
        <Result
          status="404"
          title="Không có dữ liệu"
          subTitle={emptyMessage}
        />
      </div>
    );
  }

  // Success - render children
  return <>{children}</>;
};

/**
 * Wrapper for list queries
 */
export const QueryListWrapper = ({ 
  isLoading, 
  error, 
  data = [], 
  children,
  onRetry,
  emptyMessage = 'Danh sách trống'
}) => {
  return (
    <QueryWrapper
      isLoading={isLoading}
      error={error}
      data={data}
      isEmpty={!isLoading && !error && data.length === 0}
      emptyMessage={emptyMessage}
      onRetry={onRetry}
    >
      {children}
    </QueryWrapper>
  );
};

/**
 * Wrapper for detail queries
 */
export const QueryDetailWrapper = ({ 
  isLoading, 
  error, 
  data, 
  children,
  onRetry,
  emptyMessage = 'Không tìm thấy dữ liệu'
}) => {
  return (
    <QueryWrapper
      isLoading={isLoading}
      error={error}
      data={data}
      isEmpty={!isLoading && !error && !data}
      emptyMessage={emptyMessage}
      onRetry={onRetry}
    >
      {children}
    </QueryWrapper>
  );
};
