import { Input } from 'antd';

const { TextArea } = Input;

const RichTextEditor = ({
	value,
	onChange,
	placeholder = 'Nhập nội dung...',
}) => {
	return (
		<TextArea
			value={value}
			rows={8}
			placeholder={placeholder}
			onChange={(e) => onChange?.(e.target.value)}
			className="rounded-lg"
			showCount
			maxLength={5000}
		/>
	);
};

export default RichTextEditor;






