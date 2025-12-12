import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CalculateFeeDto {
  @IsString()
  @IsNotEmpty()
  pick_province: string; // Tỉnh/thành phố lấy hàng

  @IsString()
  @IsNotEmpty()
  pick_district: string; // Quận/huyện lấy hàng

  @IsString()
  @IsNotEmpty()
  province: string; // Tỉnh/thành phố giao hàng

  @IsString()
  @IsNotEmpty()
  district: string; // Quận/huyện giao hàng

  @IsString()
  @IsOptional()
  ward?: string; // Phường/xã giao hàng (optional)

  @IsNumber()
  @IsNotEmpty()
  weight: number; // Khối lượng (gram)

  @IsNumber()
  @IsOptional()
  value?: number; // Giá trị đơn hàng (để tính bảo hiểm)

  @IsString()
  @IsOptional()
  deliver_option?: string; // none hoặc xteam (giao nhanh)
}
