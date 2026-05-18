import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  pickupAddress: string;

  @IsNumber()
  pickupLat: number;

  @IsNumber()
  pickupLng: number;

  @IsString()
  dropoffAddress: string;

  @IsNumber()
  dropoffLat: number;

  @IsNumber()
  dropoffLng: number;

  @IsIn(['CASH', 'CARD', 'WALLET', 'PAYMOB', 'FAWRY'])
  paymentMethod: string;

  @IsString()
  itemDescription: string;

  @IsString()
  itemCategory: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  receiverName?: string;

  @IsOptional()
  @IsString()
  receiverPhone?: string;

  @IsOptional()
  @IsString()
  packageType?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}