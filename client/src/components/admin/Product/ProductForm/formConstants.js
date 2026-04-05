// Shared constants for product form
export const CONTROL_SIZE = 'large';

export const PRIMARY_BTN_CLASS = 
  '!bg-[#37A76B] !border-[#37A76B] hover:!bg-[#2E955F] hover:!border-[#2E955F] text-white rounded-lg';

export const CARD_CLASS = 
  'shadow-none border border-[#E6E8EC] rounded-xl overflow-hidden bg-white';

export const SIZE_PRESETS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const COLOR_PRESETS = ['Đen', 'Trắng', 'Xanh', 'Đỏ', 'Hồng', 'Be'];

export const parseList = (text) =>
  String(text || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

export const appendPreset = (prevText, value) => {
  const list = parseList(prevText);
  if (list.includes(value)) return prevText;
  return list.length ? `${list.join(', ')}, ${value}` : value;
};
