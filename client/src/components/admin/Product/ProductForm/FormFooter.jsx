import { Button } from 'antd';
import { Save, Plus } from 'lucide-react';
import { PRIMARY_BTN_CLASS } from './formConstants';

export const FormFooter = ({ isEdit, submitLabel, loading, onCancel, onSubmit }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-gray-600">
        {isEdit ? 'Đang chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}
      </div>
      <div className="flex gap-3">
        <Button 
          size="large" 
          onClick={onCancel} 
          disabled={loading} 
          className="min-w-[100px] rounded-lg"
        >
          Hủy
        </Button>
        <Button
          type="primary"
          size="large"
          icon={isEdit ? <Save size={18} /> : <Plus size={18} />}
          htmlType="submit"
          loading={loading}
          className={`min-w-[150px] font-semibold ${PRIMARY_BTN_CLASS}`}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};

export default FormFooter;
