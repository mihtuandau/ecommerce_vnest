import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsOptional()
  product_code?: string;
}

export class CreateShippingOrderDto {
  @IsString()
  @IsNotEmpty()
  pick_name: string; // Tên người gửi

  @IsString()
  @IsNotEmpty()
  pick_address: string; // Địa chỉ lấy hàng

  @IsString()
  @IsNotEmpty()
  pick_province: string;

  @IsString()
  @IsNotEmpty()
  pick_district: string;

  @IsString()
  @IsNotEmpty()
  pick_tel: string; // SĐT người gửi

  @IsString()
  @IsNotEmpty()
  name: string; // Tên người nhận

  @IsString()
  @IsNotEmpty()
  address: string; // Địa chỉ giao hàng

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsOptional()
  ward?: string;

  @IsString()
  @IsNotEmpty()
  tel: string; // SĐT người nhận

  @IsString()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsOptional()
  value?: number; // Giá trị đơn hàng

  @IsNumber()
  @IsOptional()
  pick_money?: number; // Thu hộ COD

  @IsString()
  @IsOptional()
  note?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
