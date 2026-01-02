// src/components/common/MutationButton.jsx
import { Button } from 'antd';
import { CheckOutlined, LoadingOutlined } from '@ant-design/icons';

/**
 * Button component với mutation states
 * Tự động hiện loading và success states
 */
export const MutationButton = ({
  mutation,
  children,
  successText,
  icon,
  showSuccessIcon = true,
  successDuration = 2000,
  ...buttonProps
}) => {
  const { isPending, isSuccess } = mutation;

  const handleClick = async (e) => {
    if (buttonProps.onClick) {
      await buttonProps.onClick(e);
    }
  };

  return (
    <Button
      {...buttonProps}
      onClick={handleClick}
      loading={isPending}
      icon={
        isPending ? <LoadingOutlined /> :
        (isSuccess && showSuccessIcon) ? <CheckOutlined /> :
        icon
      }
      disabled={isPending || buttonProps.disabled}
    >
      {isSuccess && successText ? successText : children}
    </Button>
  );
};

/**
 * Delete button với confirmation
 */
export const DeleteButton = ({
  onConfirm,
  confirmMessage = 'Bạn có chắc muốn xóa?',
  children = 'Xóa',
  ...buttonProps
}) => {
  const handleClick = () => {
    if (window.confirm(confirmMessage)) {
      onConfirm();
    }
  };

  return (
    <Button
      danger
      {...buttonProps}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};
